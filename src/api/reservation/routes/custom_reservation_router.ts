import custom_reservation_controller from "../controllers/custom_reservation_controller";

export default {
  routes: [
    {
      method: 'GET',
      path: '/reservations/me',
      handler: custom_reservation_controller.findMe,
      config: {
        policies: [],
      },
    },
    // {
    //   method: 'GET',
    //   path: '/reservations',
    //   handler: custom_reservation_controller.find,
    //   config: {
    //     policies: [],
    //   },
    // },
    // {
    //   method: 'GET',
    //   path: '/reservations/:id',
    //   handler: custom_reservation_controller.findOne,
    //   config: {
    //     policies: [],
    //   },
    // },
    // {
    //   method: 'POST',
    //   path: '/reservations',
    //   handler: custom_reservation_controller.create,
    //   config: {
    //     policies: [],
    //   },
    // },
    // {
    //   method: 'PUT',
    //   path: '/reservations/:id',
    //   handler: custom_reservation_controller.update,
    //   config: {
    //     policies: [],
    //   },
    // },
    // {
    //   method: 'DELETE',
    //   path: '/reservations/:id',
    //   handler: custom_reservation_controller.delete,
    //   config: {
    //     policies: [],
    //   },
    // }
  ],
};
