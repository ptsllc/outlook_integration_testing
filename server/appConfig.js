// Standard SQL Server
const db_config_prod = {
  server: "server_name",
  authentication: {
    type: "default",
    options: {
      userName: "username",
      password: "password",
    },
  },
  options: {
    port: 1433,
    database: "database_name",
    encrypt: false,
    validateBulkLoadParameters: false,
  },
};

// SQLEXPRESS
const db_config = {
  server: "computer_name",
  authentication: {
    type: "default",
    options: {
      userName: "username",
      password: "password",
    },
  },
  options: {
    instanceName: "SQLEXPRESS",
    validateBulkLoadParameters: false,
    encrypt: false,
    database: "database_name",
  },
};

const emailFrom = "";
const smtp_config = {
  host: "smtp.xxx.com",
  port: 587,
  secure: false,
  auth: {
    user: "username",
    pass: "password",
  },
};

const local_port = 5150;

module.exports = {
  db_config,
  smtp_config,
  emailFrom,
  local_port,
};
