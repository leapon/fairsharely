var debug = require('debug')('role');
var util = require('util');
var tool = require('leaptool');
var moment = require('moment');

module.exports = function(app) {

  var module_name = 'role';
  var block = {
    app: app,
    role: 'admin',
  };

  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));

  block.model = {
    name: {
      type: 'string',
      required: true
    },
    status: {
      type: 'string',
      values: ['active', 'inactive']
    },
    create_by: { type: 'string', config:{ auto:true } },
    create_date: { type: 'date', config:{ auto:true } },
    edit_by: { type: 'string', config:{ auto:true } },
    edit_date: { type: 'date', config:{ auto:true } }
  };

  block.option = {
    edit_fields: ['name', 'status'],
    list_fields: ['name', 'status'],
    filter_fields: ['name', 'status']
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

  // data route
  app.server.post('/data/role/add', block.data.addItemWeb);
  app.server.post('/data/role/:id/edit', block.data.editItemWeb);
  app.server.get('/data/role/get', block.data.getItemWeb);

  return block;
};
