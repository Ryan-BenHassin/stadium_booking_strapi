/**
 * message router
 */

import { factories } from '@strapi/strapi';

export default {
  routes: [
    {
      method: 'GET',
      path: '/messages',
      handler: 'message.find',
      config: {
        policies: [],
        middlewares: [],
        auth: false
      },
    },
    {
      method: 'POST',
      path: '/messages',
      handler: 'message.create',
      config: {
        policies: [],
        middlewares: [],
        auth: false
      },
    }
  ],
};
