import { Router, type Request, type Response } from "express";
import { getSupabase } from "../lib/supabase";

export const sensorRouter = Router();

interface SensorUpdateRequest {
  binId: string;
  fillLevel: number;
  location?: string;
  binName?: string;
}

// POST /api/sensor/update - Terima data dari sensor
sensorRouter.post(
  "/update",
  async (req: Request<{}, {}, SensorUpdateRequest>, res: Response) => {
    try {
      const { binId, fillLevel, location, binName } = req.body;

      // Validation
      if (!binId || fillLevel === undefined) {
        return res.status(400).json({
          error: "Missing required fields: binId, fillLevel",
        });
      }

      if (fillLevel < 0 || fillLevel > 100) {
        return res.status(400).json({
          error: "fillLevel must be between 0 and 100",
        });
      }

      const supabase = getSupabase();

      // Determine status based on fill level
      let status = "normal";
      if (fillLevel >= 80) {
        status = "full";
      } else if (fillLevel >= 60) {
        status = "warning";
      }

      // Update trash_bins table
      const { data: binData, error: binError } = await supabase
        .from("trash_bins")
        .upsert(
          {
            id: binId,
            name: binName || `Bin ${binId.slice(0, 8)}`,
            location: location || "Unknown",
            fill_level: fillLevel,
            status,
            last_updated: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
        .select();

      if (binError) {
        console.error("Error updating trash_bins:", binError);
        return res.status(500).json({
          error: "Failed to update trash bin data",
          details: binError.message,
        });
      }

      // Create notification if fill level >= 80%
      if (fillLevel >= 80) {
        const { error: notifError } = await supabase
          .from("notifications")
          .insert({
            bin_id: binId,
            message: `Trash bin "${binName || binId}" is full (${fillLevel}%)`,
            type: "critical",
            read: false,
          });

        if (notifError) {
          console.error("Error creating notification:", notifError);
          // Don't fail the request if notification fails
        }
      }

      return res.status(200).json({
        success: true,
        message: "Sensor data updated successfully",
        data: binData,
      });
    } catch (error) {
      console.error("Sensor update error:", error);
      return res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// GET /api/sensor/bins - Get all trash bins
sensorRouter.get("/bins", async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("trash_bins")
      .select("*")
      .order("last_updated", { ascending: false });

    if (error) {
      console.error("Error fetching trash bins:", error);
      return res.status(500).json({
        error: "Failed to fetch trash bins",
        details: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Fetch bins error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/sensor/bin/:id - Get specific trash bin
sensorRouter.get("/bin/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("trash_bins")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          error: "Trash bin not found",
        });
      }
      console.error("Error fetching trash bin:", error);
      return res.status(500).json({
        error: "Failed to fetch trash bin",
        details: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Fetch bin error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default sensorRouter;
