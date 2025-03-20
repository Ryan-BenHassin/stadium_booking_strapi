
import contentTypeBuilder from '@strapi/plugin-content-type-builder/strapi-admin';
import upload from '@strapi/plugin-upload/strapi-admin';
import usersPermissions from '@strapi/plugin-users-permissions/strapi-admin';


const plugins = {
  'content-type-builder': contentTypeBuilder,
  'upload': upload,
  'users-permissions': usersPermissions,
};

export default plugins;
