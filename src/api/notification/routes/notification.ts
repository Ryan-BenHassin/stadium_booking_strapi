export default {
  routes: [
    {
      method: 'POST',
      path: '/notify-users',
      handler: 'notification.notifyUsers',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'POST',
      path: '/notify-user',
      handler: 'notification.notifyUser',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
  ],
};
