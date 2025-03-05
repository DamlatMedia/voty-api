
import express from "express";
import {
  postNotification,
  postNotificationToAllUsers,
  getNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
  markNotificationsAsRead
} from "../controllers/notificationControllers.js";
// import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/notification", postNotification); // Post notification to a specific user
router.post("/notification/all", postNotificationToAllUsers); // Post notification to ALL users
router.get("/notifications",  getNotifications); // Get all notifications for all users
router.get("/notification/:username",  getNotification); // Get notifications for a specific user
router.put("/notification/:username/:notificationId", updateNotification); // Update a notification
router.delete("/notification/:username/:notificationId", deleteNotification); // Delete a notification
router.put("/notification/:username/mark-read",  markNotificationsAsRead);


export default router;

