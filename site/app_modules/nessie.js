var debug = require('debug')('nessie');
var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {

  var module_name = 'nessie';
  var block = {
    app: app,
    role: 'user',
    apidata: {
      key: 'd9258cbfb78477d7caaa4cd76ab13bda',
      customer_id: '57efd227267ebde464c48989',
      account_id: '57efd2e5267ebde464c4898a',
      merchant_id: '57efd667267ebde464c4898d'
    }
  };

  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));

  block.model = null;
  block.option = null;

  // data
  block.data.getAccountInfo = function(req, res, next) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    debug('getAccountInfo:', parameter);

    var error = null;
    var docs = [];
    var info = { message:'account info' };

    app.cb(error, docs, info, req, res, callback);
  };

  // page
  block.page.index = function(req, res) {
    var page = app.getPage(req, { title:'nessie' });
    page.apidata = block.apidata;
    res.render('nessie/index', { page:page });
  };

  // data route
  app.server.get('/data/nessie/account/:id/info', block.data.getAccountInfo);

  // page route
  app.server.get('/nessie', block.page.index);

  return block;
};
