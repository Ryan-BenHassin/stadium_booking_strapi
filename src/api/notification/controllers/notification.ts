import { sendNotification } from '../../../services/firebase';

export default {
  async notifyUsers(ctx) {
    try {
      const { userIds, message, title } = ctx.request.body;

      if (!userIds || !Array.isArray(userIds)) {
        return ctx.badRequest('User IDs array is required');
      }

      const users = await strapi.db.query('plugin::users-permissions.user').findMany({
        where: { id: { $in: userIds } },
        select: ['fcmToken']
      });

      const tokens = users.map(user => user.fcmToken).filter(Boolean);
      
      if (tokens.length === 0) {
        return ctx.badRequest('No valid FCM tokens found for the specified users');
      }

      await sendNotification(tokens, { title, message });

      return ctx.send({
        success: true,
        message: `Notifications sent to ${tokens.length} users`
      });
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async notifyUser(ctx) {
    try {
      const { userId, message, title } = ctx.request.body;

      if (!userId) {
        return ctx.badRequest('User ID is required');
      }

      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: userId },
        select: ['fcmToken']
      });

      if (!user?.fcmToken) {
        return ctx.badRequest('No valid FCM token found for the specified user');
      }

      await sendNotification([user.fcmToken], { title, message });

      return ctx.send({
        success: true,
        message: 'Notification sent successfully'
      });
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  }
};
