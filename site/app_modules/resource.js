var debug = require('debug')('resource');
var util = require('util');
var tool = require('leaptool');
var moment = require('moment');

module.exports = function(app) {

  var module_name = 'resource';
  var block = {
    app: app,
    role: 'admin',
  };

  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));

  block.model = {
    name: {
      type: 'string'
    },
    type: {
      type: 'string',
      values: ['page', 'file']
    },
    url: {
      type: 'string'
    },
    role: {
      type: 'string'
    },
    status: {
      type: 'string',
      values: ['active', 'inactive']
    },
    create_date: {
      type: 'date'
    },
    create_by: {
      type: 'string'
    },
    edit_date: {
      type: 'date'
    },
    edit_by: {
      type: 'string'
    }
  };

  block.option = {
    edit_fields: ['name', 'type', 'url', 'role', 'status'],
    list_fields: ['name', 'type', 'url', 'role', 'status'],
    filter_fields: ['name', 'type']
  };

  // data
  block.data.check = function(req, res) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);

    app.cb(null, [], {}, req, res, callback);
  };

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

  block.data.deleteItemWeb = function(req, res, next) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    debug('deleteItemWeb parameter:', parameter);
    block.data.deleteItem(req, res, item, callback);
  };

  block.data.deleteItem = function(req, res, item, callback) {
    debug('deleteItem:', item);
    block.data.delete(req, res, item, function(error, docs, info) {
      debug('deleteItem result:', error, docs, info);
      app.cb(error, docs, info, req, res, callback);
    });
  };

  // data route
  app.server.post('/data/resource/add', block.data.addItemWeb);
  app.server.post('/data/resource/:id/edit', block.data.editItemWeb);
  app.server.get('/data/resource/get', block.data.getItemWeb);
  app.server.get('/data/resource/check', block.data.check);

  return block;
};
