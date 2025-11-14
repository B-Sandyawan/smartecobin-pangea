import { Router, type Request, type Response } from "express";
import { getSupabase } from "../lib/supabase";

export const notificationsRouter = Router();

interface NotificationMarkRequest {
  id: string;
}

// GET /api/notifications - Get all notifications
notificationsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase();
    const { limit = 50, read = null } = req.query;

    let query = supabase
      .from("notifications")
      .select("*, trash_bins(id, name, location)")
      .order("created_at", { ascending: false })
      .limit(Math.min(Number(limit) || 50, 100));

    // Filter by read status if provided
    if (read !== null) {
      query = query.eq("read", read === "true");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({
        error: "Failed to fetch notifications",
        details: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/notifications/unread - Get unread notifications count
notificationsRouter.get("/unread/count", async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase();

    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("read", false);

    if (error) {
      console.error("Error fetching unread count:", error);
      return res.status(500).json({
        error: "Failed to fetch unread count",
        details: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      unreadCount: count || 0,
    });
  } catch (error) {
    console.error("Fetch unread count error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/notifications/:id/mark-read - Mark notification as read
notificationsRouter.post(
  "/:id/mark-read",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id)
        .select();

      if (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({
          error: "Failed to mark notification as read",
          details: error.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data,
      });
    } catch (error) {
      console.error("Mark read error:", error);
      return res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// POST /api/notifications/mark-all-read - Mark all notifications as read
notificationsRouter.post(
  "/mark-all-read",
  async (req: Request, res: Response) => {
    try {
      const supabase = getSupabase();

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("read", false);

      if (error) {
        console.error("Error marking all as read:", error);
        return res.status(500).json({
          error: "Failed to mark all notifications as read",
          details: error.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Mark all read error:", error);
      return res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// DELETE /api/notifications/:id - Delete notification
notificationsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting notification:", error);
      return res.status(500).json({
        error: "Failed to delete notification",
        details: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default notificationsRouter;
