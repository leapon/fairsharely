'use strict';
var debug = require('debug')('web');
var tool = require('leaptool');

module.exports = function(app) {

  var module_name = 'web';
  var block = {
    app: app,
    role: 'user',
    model: null
  };

  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));

  block.data.receiveContact = function(req, res, next) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    debug('receiveContact:', parameter);
    var emailContent = {
      to: 'info@leapon.com',
      subject: 'Ping from leapbase webserver',
      content: 'Contact created on <b>' + Date() + '</b>' + '<br/><br/>- leapbase',
      isHtml: true
    };
    app.mailer && app.mailer.send(emailContent, function(error, info) {
      debug('contact mail result:', error, info);
      app.renderInfoPage(error, null, {
        message:'contact received on ' + Date()
      }, req, res);
    });
  };

  // data route
  app.server.post('/data/web/contact', block.data.receiveContact);
  // page route
  app.server.get('/', block.page.showPage);
  app.server.get('/page/:page_name', block.page.showPage);

  return block;
};
