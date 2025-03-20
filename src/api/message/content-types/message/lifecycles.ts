import admin, { db } from '../../../../utils/firebase';

export default {
  async afterCreate(event) {
    const { result } = event;
    
    try {
      // Get complete message data with relations
      const messageData = await strapi.db.query('api::message.message').findOne({
        where: { id: result.id },
        populate: ['sender', 'recipient']
      });

      if (!messageData?.sender || !messageData?.recipient) {
        throw new Error('Message relations not found');
      }

      // Create chat room ID
      const ids = [messageData.sender.id, messageData.recipient.id].sort();
      const chatRoomId = ids.join('_');

      // Prepare Firebase message data
      const firebaseMessage = {
        content: messageData.content,
        senderId: messageData.sender.id.toString(),
        senderEmail: messageData.sender.email,
        receiverId: messageData.recipient.id.toString(),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: new Date(),
      };

      // Add to Firebase
      const messageRef = await db.collection('chats')
        .doc(chatRoomId)
        .collection('messages')
        .add(firebaseMessage);

      // Update Strapi message with Firebase ID
      await strapi.db.query('api::message.message').update({
        where: { id: result.id },
        data: {
          firebaseId: messageRef.id,
          chatRoomId
        }
      });

    } catch (error) {
      console.error('Error syncing to Firebase:', error);
      // Consider adding error handling/retry logic here
    }
  }
};
