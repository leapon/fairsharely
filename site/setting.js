exports.setting = {
  // web
  http_port: 8000,
  // database
  database: {
    type: 'mongo',
    port: 27017,
    host: 'localhost',
    name: 'eventfy'
  },
  // email
  email: {
    service: 'gmail',
    username: 'leapon.email',
    password: 'password',
    sender: 'info@leapon.com'
  }
};

