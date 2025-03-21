/**
 * message controller
 */

import { factories } from '@strapi/strapi';
import admin, { db } from '../../../utils/firebase';

export default {
  ...factories.createCoreController('api::message.message'),

  async getUsers(ctx) {
    try {
      const users = await strapi.db.query('plugin::users-permissions.user').findMany({
        select: ['id', 'email', 'username']
      });
      
      return {
        data: users
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return ctx.badRequest("Failed to fetch users");
    }
  },

  async find(ctx) {
    try {
      console.log("Fetching messages from Firebase...");
      
      const chatRoomsRef = db.collection('chats');
      const chatRoomsSnapshot = await chatRoomsRef.get();
      
      const allMessages = [];
      
      for (const roomDoc of chatRoomsSnapshot.docs) {
        const roomId = roomDoc.id;
        console.log(`Fetching messages for chat room: ${roomId}`);
        
        const messagesRef = await db.collection('chats')
          .doc(roomId)
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .get();
        
        for (const messageDoc of messagesRef.docs) {
          const data = messageDoc.data();
          const messageData = {
            id: messageDoc.id,
            chatRoomId: roomId,
            content: data.content || data.message,
            sender: parseInt(data.sender || data.senderId),
            receiver: parseInt(data.receiver || data.receiverId),
            senderEmail: data.senderEmail,
            createdAt: data.createdAt?.toDate?.() || data.timestamp?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || data.timestamp?.toDate?.() || new Date(),
            publishedAt: data.published_at?.toDate?.() || data.timestamp?.toDate?.() || new Date()
          };
          
          // Sync each message with Strapi
          await strapi.service('api::message.message').syncMessage(messageData);
          
          allMessages.push(messageData);
        }
      }

      console.log(`Total messages found: ${allMessages.length}`);

      return {
        data: allMessages.sort((a, b) => b.createdAt - a.createdAt),
        meta: { 
          count: allMessages.length,
          rooms: chatRoomsSnapshot.size
        }
      };

    } catch (error) {
      console.error("Error details:", error);
      return ctx.badRequest(`Failed to fetch messages: ${error.message}`);
    }
  },

  async create(ctx) {
    try {
      const { content, senderId, recipientId } = ctx.request.body;
      
      // Validate numeric IDs
      if (!content || !senderId || !recipientId || 
          !(/^\d+$/.test(senderId) && /^\d+$/.test(recipientId))) {
        return ctx.badRequest('Missing or invalid fields. IDs must be numeric.');
      }

      // Create chat room ID in Flutter format
      const ids = [senderId, recipientId];
      ids.sort(); // Sort to match Flutter's format
      const chatRoomId = ids.join("_");

      // Get sender email from Strapi user
      const sender = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: senderId }
      });

      const messageData = {
        message: content, // Use 'message' to match Flutter
        senderId: senderId.toString(),
        senderEmail: sender?.email,
        receiverId: recipientId.toString(),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };

      const messageRef = await db.collection("chats")
        .doc(chatRoomId)
        .collection("messages")
        .add(messageData);

      return {
        data: {
          id: messageRef.id,
          chatRoomId,
          ...messageData,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error("Error creating message:", error);
      return ctx.badRequest("Failed to create message");
    }
  }
};
