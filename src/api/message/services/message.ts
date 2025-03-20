/**
 * message service
 */

import { factories } from '@strapi/strapi';
import { db } from '../../../utils/firebase';

const getBaseService = factories.createCoreService('api::message.message');

export default {
  ...getBaseService,
  
  async syncMessage(messageData) {
    try {
      const existing = await strapi.db.query('api::message.message').findOne({
        where: { firebaseId: messageData.id }
      });

      if (!existing) {
        // Create new message in Strapi
        await strapi.entityService.create('api::message.message', {
          data: {
            content: messageData.content,
            sender: messageData.sender,
            recipient: messageData.receiver,
            timestamp: new Date(messageData.createdAt),
            firebaseId: messageData.id,
            chatRoomId: messageData.chatRoomId,
            publishedAt: new Date(messageData.publishedAt)
          }
        });
      }
    } catch (error) {
      console.error('Error syncing message:', error);
    }
  }
};
