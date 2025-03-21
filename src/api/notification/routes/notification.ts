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
  ],
};
