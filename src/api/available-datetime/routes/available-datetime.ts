export default {
  routes: [
    {
      method: 'GET',
      path: '/available-datetimes/:complexId',
      handler: 'available-datetime.find',
      config: {
        auth: false, // Make it publicly accessible
        policies: [],
        middlewares: [],
      },
    },
  ],
};