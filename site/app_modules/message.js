var debug = require('debug')('message');
var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {

  var module_name = 'message';
  var block = {
    app: app,
    role: 'user'
  };

  var twilio_client = require('twilio')(
    app.setting.twilio.account_sid,
    app.setting.twilio.authtoken
  );

  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));

  block.model = null;
  block.option = null;

  // data
  block.data.sendMessage = function(req, res, next) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    debug('sendMessage:', parameter);
    app.cb(error, docs, info, req, res, callback);
  };

  // page
  /*
  block.page.index = function(req, res) {
    var page = app.getPage(req, { title:'message' });
    res.render('message/index', { page:page });
  };
  */

  // data route
  app.server.get('/data/message/send', block.data.sendMessage);

  // page route
  //app.server.get('/message', block.page.index);

  return block;
};
