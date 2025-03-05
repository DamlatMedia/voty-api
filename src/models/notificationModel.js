import mongoose from 'mongoose';

//define schema for user 

const NotificationSchema = new mongoose.Schema({
    update: String,
    title: String,
    description: String,
    read: { type: Boolean, default: false },  // ✅ Add this
    createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', NotificationSchema);

// Export the user model
export default Notification;