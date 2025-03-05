import Student from "../models/studentModel.js";

// Post a new notification for a user
const postNotification = async (req, res) => {
  try {
    const { username, update, title, description } = req.body;
    const user = await Student.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Add notification to the array
    // const newNotification = { update, title, description };
    const newNotification = { 
      update, 
      title, 
      description, 
      read: false   // Ensure it's unread when created
    };
    
    user.notificationInvestments.push(newNotification);

    await user.save();
    res.status(201).json({
      message: "Notification added successfully",
      notification: newNotification,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Post notification to ALL users
const postNotificationToAllUsers = async (req, res) => {
  try {
    const { update, title, description } = req.body;

    const users = await Student.find({});

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // const newNotification = { update, title, description };
    const newNotification = { 
      update, 
      title, 
      description, 
      read: false   // Ensure it's unread when created
    };
    

    // Loop through all users and push notification
    await Promise.all(
      users.map(async (user) => {
        user.notificationInvestments.push(newNotification);
        await user.save();
      })
    );

    res.status(201).json({
      message: "Notification sent to all users successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all notifications for a user
const getNotification = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await Student.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ notifications: user.notificationInvestments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get all users notifications
const getNotifications = async (req, res) => {
  try {
    const users = await Student.find({}, "username notificationInvestments");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Extract notifications for each user
    const allNotifications = users.map((user) => ({
      username: user.username,
      notifications: user.notificationInvestments,
    }));

    res.status(200).json({ allNotifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a specific notification
const updateNotification = async (req, res) => {
  try {
    const { username, notificationId } = req.params;
    const { update, title, description } = req.body;

    const user = await Student.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    const notification = user.notificationInvestments.find(
      (item) => item._id.toString() === notificationId
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Update fields only if provided
    if (update) notification.update = update;
    if (title) notification.title = title;
    if (description) notification.description = description;

    await user.save();
    res
      .status(200)
      .json({ message: "Notification updated successfully", notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific notification
const deleteNotification = async (req, res) => {
  try {
    const { username, notificationId } = req.params;

    const user = await Student.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove the notification using `$pull`
    const updatedUser = await Student.findOneAndUpdate(
      { username },
      { $pull: { notificationInvestments: { _id: notificationId } } },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "Notification not found" });

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark all notifications as read for a user

const markNotificationsAsRead = async (req, res) => {
  const { username } = req.params;
  const user = await Student.findOne({ username });

  if (!user) return res.status(404).json({ message: "User not found" });

  user.notificationInvestments.forEach(notification => {
    notification.read = true;  // ✅ This works with the schema fix
  });

  await user.save();
  res.status(200).json({ message: "All notifications marked as read" });
};


export {
  markNotificationsAsRead,
  postNotification,
  getNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
  postNotificationToAllUsers
};
