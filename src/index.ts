export default {
    register() {},
    
    async bootstrap({ strapi }) {
      strapi.admin.services.permission.conditionProvider.register({
        displayName: 'Is Complex owneRRRRR',
        name: 'is-complex-owner',
        plugin: 'admin',
        handler: (user) => {
          return {
            $or: [
              {
                complex: {
                  admin_user: {
                    id: {
                      $eq: user.id
                    }
                  }
                }
              },
              {
                'complex.admin_user.id': {
                  $eq: user.id
                }
              }
            ]
          };
        }
      });
    }
  };
  