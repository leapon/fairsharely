var debug = require('debug')('audit');
var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {

  var module_name = 'audit';
  var block = {
    app: app,
    role: 'admin'
  };

  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));

  block.model = {
    module_name: { type: 'string' },
    item_id: { type: 'string' },
    field: { type: 'string' },
    value_old: { type: 'string' },
    value_new: { type: 'string' },
    create_by: { type: 'string', config:{ auto:true } },
    create_date: { type: 'date', config:{ auto:true } },
    edit_by: { type: 'string', config:{ auto:true } },
    edit_date: { type: 'date', config:{ auto:true } }
  };

  block.option = {
    edit_fields: ['module_name', 'item_id', 'field', 'value_old', 'value_new'],
    list_fields: ['module_name', 'item_id', 'field', 'value_old', 'value_new', 'create_by', 'create_date'],
    filter_fields: ['module_name', 'item_id', 'field']
  };

  // data
  block.data.addItemWeb = function(req, res, next) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    debug('addItemWeb:', parameter);
    block.data.addItem(req, res, parameter, callback);
  };

  block.data.addItem = function(req, res, item, callback) {
    debug('addItem:', item);
    block.data.add(req, res, item, function(error, docs, info) {
      debug('addItem result:', error, docs, info);
      app.cb(error, docs, info, req, res, callback);
    });
  };

  block.data.editItemWeb = function(req, res, next) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    debug('editItemWeb:', parameter);
    block.data.editItem(req, res, parameter, callback)
  };

  block.data.editItem = function(req, res, item, callback) {
    debug('editItem:', item);
    block.data.edit(req, res, item, function(error, docs, info) {
      debug('editItem result:', error, docs, info);
      app.cb(error, docs, info, req, res, callback);
    });
  };

  block.data.getItemWeb = function(req, res, next) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    debug('getWeb parameter:', parameter);
    var condition = tool.getQueryCondition(parameter);
    var filter = tool.getQueryFilter(parameter);
    block.data.getItem(req, res, condition, filter, callback);
  };

  block.data.getItem = function(req, res, condition, filter, callback) {
    debug('getItem query condition:', condition);
    debug('getItem query filter:', filter);
    block.data.get(req, res, condition, filter, function(error, docs, info) {
      debug('getItem result:', error, docs, info);
      app.cb(error, docs, info, req, res, callback);
    });
  };

  // page
  block.page.index = function(req, res) {
    var page = app.getPage(req, { title:'audit' });
    res.render('audit/index', { page:page });
  };

  block.page.add = function(req, res) {
    var page = app.getPage(req, { title:'Add audit' });
    res.render('audit/edit', { page:page });
  };

  block.page.edit = function(req, res) {
    var parameter = tool.getReqParameter(req);
    var itemId = parameter.id;
    block.data.getById(req, res, itemId, function(error, docs, info) {
      var page = app.getPage(req, { title:'Edit audit' });
      var item = docs && docs[0] || null;
      debug('edit item:', item);
      res.render('audit/edit', { page:page, item:item });
    });
  };

  // data route
  app.server.post('/data/audit/add', block.data.addItemWeb);
  app.server.post('/data/audit/:id/edit', block.data.editItemWeb);
  app.server.get('/data/audit/get', block.data.getItemWeb);
  // page route
  app.server.get('/audit', block.page.index);
  app.server.get('/audit/add', block.page.add);
  app.server.get('/audit/:id/edit', block.page.edit);

  return block;
};
