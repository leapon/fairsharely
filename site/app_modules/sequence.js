var debug = require('debug')('sequence');
var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {

  var module_name = 'sequence';
  var block = {
    app: app,
    role: 'admin'
  };

  block.option = {
    edit_fields: ['name', 'start', 'value', 'format', 'increment'],
    list_fields: ['name', 'start', 'value', 'format', 'increment'],
    filter_fields: ['name', 'value', 'format']
  };

  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));

  block.model = {
    name: { type: 'string' },
    start: { type: 'number' },
    value: { type: 'number' },
    format: { type: 'string' },
    increment: { type: 'number', defaultValue: 1 },
    status: { type: 'string' },
    create_by: { type: 'string', config:{ auto:true } },
    create_date: { type: 'date', config:{ auto:true } },
    edit_by: { type: 'string', config:{ auto:true } },
    edit_date: { type: 'date', config:{ auto:true } }
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

  block.data.getNextSequenceWeb = function(req, res, next) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    var sequenceName = parameter.sequence || '';
    debug('getNextSequenceWeb parameter:', parameter);
    block.data.getNextSequence(req, res, sequenceName, function(error, value) {
      debug('next sequence for ' + sequenceName + ' :', error, value);
      app.cb(error, [{ value:value }], {}, req, res, callback);
    });
  };

  block.data.getNextSequence = function(req, res, sequenceName, callback) {
    var condition = { name:sequenceName };
    var filter = {};
    debug('getNextSequence condition:', condition);
    block.data.get(req, res, condition, filter, function(error, docs, info) {
      var sequence = docs && docs[0] || null;
      seqinfo = { sequence:sequenceName };
      if (sequence) {
        if (sequence.value < sequence.start) {
          sequence.value = sequence.start;
        }
        var increment = sequence.increment || 1;
        sequence.value = sequence.value + increment;
        block.data.edit(req, res, sequence, function(error, docs, info) {
          var result = docs && docs[0];
          var sequenceResult = sequence.format + result.value;
          callback && callback(null, sequenceResult, seqinfo);
        });
      } else {
        var error = 'sequence ' + sequenceName + ' is not found';
        debug(error);
        callback && callback(error, -9999, seqinfo);
      }
    });
  };

  // page
  block.page.index = function(req, res) {
    var page = app.getPage(req, { title:'sequence' });
    res.render('sequence/index', { page:page });
  };

  // data route
  app.server.get('/data/sequence/get', block.data.getItemWeb);
  app.server.post('/data/sequence/add', block.data.addItemWeb);
  app.server.post('/data/sequence/:id/edit', block.data.editItemWeb);
  app.server.post('/data/sequence/:id/delete', block.data.deleteItemWeb);
  app.server.get('/data/sequence/:sequence/next', block.data.getNextSequenceWeb);
  // page route
  app.server.get('/' + module_name, block.page.index);

  return block;
};
