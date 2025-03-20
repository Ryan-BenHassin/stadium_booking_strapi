import type { StrapiApp } from '@strapi/strapi/admin';
import { Message } from '@strapi/icons';

export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
  },
  bootstrap(app: StrapiApp) {
    app.addMenuLink({
      to: '/chat',
      icon: Message,
      intlLabel: {
        id: 'chat.link',
        defaultMessage: 'Chat',
      },
      Component: async () => {
        const component = await import('./pages/Chat');
        return component;
      },
      permissions: [],
    });
  },
};