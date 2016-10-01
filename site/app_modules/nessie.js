var debug = require('debug')('nessie');
var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {

  var module_name = 'nessie';
  var block = {
    app: app,
    role: 'user'
  };

  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));

  block.model = null;
  block.option = null;

  // data
  /*
  block.data.addItemWeb = function(req, res, next) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    debug('addItemWeb:', parameter);
    block.data.addItem(req, res, parameter, callback);
  };
  */

  // page
  block.page.index = function(req, res) {
    var page = app.getPage(req, { title:'nessie' });
    res.render('nessie/index', { page:page });
  };


  // data route
  //app.server.get('/data/nessie/get', block.data.getItemWeb);

  // page route
  app.server.get('/nessie', block.page.index);

  return block;
};
