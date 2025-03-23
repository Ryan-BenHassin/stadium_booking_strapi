import { sendNotification } from '../../../../services/firebase';

export default {
  async afterUpdate(event) {
    const { result } = event;

    console.log(`\n\n SALEEEEM \n\n`);
    
    if (result && result.state) {
      const reservation = await strapi.db.query('api::reservation.reservation').findOne({
        where: { id: result.id },
        populate: ['user']
      });

      if (reservation?.user?.fcmToken) {
        const notificationMessage = `Your reservation has been ${result.state.toLowerCase()}`;
        await sendNotification([reservation.user.fcmToken], {
          title: 'Reservation Update',
          message: notificationMessage
        });
      }
    }
  }
};
