`use strict`;

// lv0
// const config = {
//   app: {
//     port: 3000,
//   },
//   db: {
//     host: "localhost",
//     port: 20717,
//     name: "db",
//   },
// };

// lv1
// const dev = {
//   app: {
//     port: 3000,
//   },
//   db: {
//     host: "localhost",
//     port: 20717,
//     name: "dbDEV",
//   },
// };
// const prod = {
//   app: {
//     port: 3000,
//   },
//   db: {
//     host: "localhost",
//     port: 20717,
//     name: "dbPROD",
//   },
// };

// lv2
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 20717,
    name: process.env.DEV_DB_NAME || "dbDEV",
  },
};
const prod = {
  app: {
    port: process.env.PROD_APP_PORT || 3000,
  },
  db: {
    host: process.env.PROD_DB_HOST || "localhost",
    port: process.env.PROD_DB_PORT || 20717,
    name: process.env.PROD_DB_NAME || "dbPROD",
  },
};
const config = { dev, prod };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
