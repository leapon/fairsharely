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
    var message = parameter.message || '';
    // Send an SMS text message
    twilio_client.sendMessage({
      to:'+12404262685', // Any number Twilio can deliver to, need verified number when trial!!!
      from: app.setting.twilio.from, // A number you bought from Twilio and can use for outbound communication
      body: 'Account message:' + message // body of the SMS message
    }, function(error, responseData) { //this function is executed when a response is received from Twilio
      app.cb(error, [], responseData, req, res, callback);
    });
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
