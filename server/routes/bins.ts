import { Router, type Request, type Response } from "express";
import { getSupabase } from "../lib/supabase";
import { authenticateToken } from "../utils/auth";

export const binsRouter = Router();

interface BinFilters {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

interface NearbyParams {
  latitude: number;
  longitude: number;
  radius: number;
}

// Calculate distance between two coordinates using Haversine formula (in km)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/bins - List all trash bins with optional filters
binsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { search, status, limit = 50, offset = 0 } = req.query as Record<
      string,
      any
    >;

    const supabase = getSupabase();

    let query = supabase
      .from("trash_bins")
      .select(
        "id, name, location, latitude, longitude, fill_level, status, sensor_id, battery_level, capacity, notes, last_collection, next_collection, field_officer_id, created_at, updated_at"
      )
      .order("last_updated", { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Apply status filter
    if (status) {
      query = query.eq("status", status);
    }

    const { data: bins, error: binsError, count } = await query;

    if (binsError) {
      console.error("Error fetching bins:", binsError);
      return res.status(500).json({
        error: "Failed to fetch trash bins",
        details: binsError.message,
      });
    }

    // Apply search filter (client-side since Supabase full-text search requires additional setup)
    let filteredBins = bins || [];
    if (search) {
      const searchLower = search.toLowerCase();
      filteredBins = filteredBins.filter(
        (bin: any) =>
          bin.name.toLowerCase().includes(searchLower) ||
          bin.location.toLowerCase().includes(searchLower) ||
          bin.notes?.toLowerCase().includes(searchLower)
      );
    }

    return res.status(200).json({
      bins: filteredBins,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (err) {
    console.error("Get bins error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

// GET /api/bins/:id - Get single bin details
binsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const supabase = getSupabase();

    // Get bin details
    const { data: bin, error: binError } = await supabase
      .from("trash_bins")
      .select(
        "id, name, location, latitude, longitude, fill_level, status, sensor_id, battery_level, capacity, images, notes, last_collection, next_collection, field_officer_id, created_at, updated_at"
      )
      .eq("id", id)
      .single();

    if (binError) {
      console.error("Error fetching bin:", binError);
      return res.status(404).json({
        error: "Trash bin not found",
      });
    }

    // Fetch field officer details if available
    let fieldOfficer = null;
    if (bin.field_officer_id) {
      const { data: officer } = await supabase
        .from("users")
        .select("id, name, email, phone, avatar_url")
        .eq("id", bin.field_officer_id)
        .single();
      fieldOfficer = officer;
    }

    // Fetch recent notifications for this bin
    const { data: notifications } = await supabase
      .from("notifications")
      .select("id, message, type, read, created_at")
      .eq("bin_id", id)
      .order("created_at", { ascending: false })
      .limit(5);

    return res.status(200).json({
      bin: {
        ...bin,
        fieldOfficer,
        recentNotifications: notifications || [],
      },
    });
  } catch (err) {
    console.error("Get bin details error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

// GET /api/bins/nearby - Find bins near a location
binsRouter.get("/search/nearby", async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    // Validation
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        error: "Missing required parameters: latitude, longitude",
      });
    }

    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);
    const radiusKm = parseFloat((radius as string) || "5");

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        error: "Invalid latitude or longitude values",
      });
    }

    const supabase = getSupabase();

    // Get all bins (we'll filter by distance client-side)
    const { data: bins, error: binsError } = await supabase
      .from("trash_bins")
      .select(
        "id, name, location, latitude, longitude, fill_level, status, sensor_id, battery_level"
      )
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("last_updated", { ascending: false });

    if (binsError) {
      console.error("Error fetching bins:", binsError);
      return res.status(500).json({
        error: "Failed to fetch trash bins",
        details: binsError.message,
      });
    }

    // Filter bins by distance
    const nearbyBins = (bins || [])
      .map((bin: any) => ({
        ...bin,
        distance: calculateDistance(lat, lng, bin.latitude, bin.longitude),
      }))
      .filter((bin: any) => bin.distance <= radiusKm)
      .sort((a: any, b: any) => a.distance - b.distance);

    return res.status(200).json({
      center: {
        latitude: lat,
        longitude: lng,
      },
      radiusKm,
      bins: nearbyBins,
      count: nearbyBins.length,
    });
  } catch (err) {
    console.error("Get nearby bins error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

// POST /api/bins - Create new trash bin (requires auth, officer/admin only)
binsRouter.post(
  "/",
  authenticateToken,
  async (req: any, res: Response) => {
    try {
      const user = req.user;

      // Check authorization - only officer and admin can create bins
      if (!user || (user.role !== "officer" && user.role !== "admin")) {
        return res.status(403).json({
          error: "Only officers and admins can create bins",
        });
      }

      const {
        name,
        location,
        latitude,
        longitude,
        capacity,
        sensor_id,
        notes,
      } = req.body;

      // Validation
      if (!name || !location) {
        return res.status(400).json({
          error: "Missing required fields: name, location",
        });
      }

      const supabase = getSupabase();

      // Create bin
      const { data: newBin, error: createError } = await supabase
        .from("trash_bins")
        .insert({
          name,
          location,
          latitude: latitude || null,
          longitude: longitude || null,
          capacity: capacity || 120,
          sensor_id: sensor_id || null,
          notes: notes || null,
          status: "normal",
          fill_level: 0,
          field_officer_id: user.role === "officer" ? user.id : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating bin:", createError);
        return res.status(500).json({
          error: "Failed to create trash bin",
          details: createError.message,
        });
      }

      return res.status(201).json({
        message: "Trash bin created successfully",
        bin: newBin,
      });
    } catch (err) {
      console.error("Create bin error:", err);
      return res.status(500).json({
        error: "Internal server error",
        details: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }
);

// PUT /api/bins/:id - Update trash bin (requires auth, officer/admin only)
binsRouter.put(
  "/:id",
  authenticateToken,
  async (req: any, res: Response) => {
    try {
      const user = req.user;
      const { id } = req.params;

      // Check authorization
      if (!user || (user.role !== "officer" && user.role !== "admin")) {
        return res.status(403).json({
          error: "Only officers and admins can update bins",
        });
      }

      const supabase = getSupabase();

      // Check if bin exists
      const { data: existingBin, error: checkError } = await supabase
        .from("trash_bins")
        .select("id")
        .eq("id", id)
        .single();

      if (checkError || !existingBin) {
        return res.status(404).json({
          error: "Trash bin not found",
        });
      }

      // Update bin
      const { data: updatedBin, error: updateError } = await supabase
        .from("trash_bins")
        .update({
          ...req.body,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating bin:", updateError);
        return res.status(500).json({
          error: "Failed to update trash bin",
          details: updateError.message,
        });
      }

      return res.status(200).json({
        message: "Trash bin updated successfully",
        bin: updatedBin,
      });
    } catch (err) {
      console.error("Update bin error:", err);
      return res.status(500).json({
        error: "Internal server error",
        details: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }
);
