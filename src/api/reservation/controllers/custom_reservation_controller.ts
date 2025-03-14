import { factories } from '@strapi/strapi';

export default {
  async findMe(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }

    const reservations = await strapi.entityService.findMany('api::reservation.reservation', {
      filters: { user: user.id },
      populate: ['complex'],
    });

    return { data: reservations };
  }
};
