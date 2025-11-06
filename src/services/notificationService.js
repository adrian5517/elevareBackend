const Notification = require('../models/Notification');

class NotificationService {
  async createNotification(userId, title, message, type = 'info', link = null) {
    try {
      const notification = await Notification.create({
        user: userId,
        title,
        message,
        type,
        link
      });

      // TODO: Send real-time notification via Socket.io
      // const io = req.app.get('io');
      // io.to(`user_${userId}`).emit('notification', notification);

      return notification;
    } catch (error) {
      console.error('Notification creation error:', error);
      throw error;
    }
  }

  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { isRead: true, readAt: Date.now() },
        { new: true }
      );
      return notification;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }

  async getUserNotifications(userId, limit = 20) {
    try {
      const notifications = await Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit);
      return notifications;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
