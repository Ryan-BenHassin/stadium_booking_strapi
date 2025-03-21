interface Window {
  strapi: {
    backendURL: string;
    getToken: () => string;
    admin: {
      user: {
        id: number;
        email: string;
        firstname: string;
        username: string;
      };
    };
  };
}
