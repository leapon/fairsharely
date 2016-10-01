var debug = require('debug')('item');
var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {

  var module_name = 'item';
  var block = {
    app: app,
    role: 'user'
  };

  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));

  block.model = {
    name: { type: 'string' },
    type: { type: 'string' },
    field: { type: 'string' },
    value: { type: 'string' },
    create_by: { type: 'string', config:{ auto:true } },
    create_date: { type: 'date', config:{ auto:true } },
    edit_by: { type: 'string', config:{ auto:true } },
    edit_date: { type: 'date', config:{ auto:true } }
  };

  block.option = {
    edit_fields: ['name', 'type', 'field', 'value'],
    list_fields: ['name', 'type', 'field', 'value'],
    filter_fields: ['name', 'type', 'field']
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
    debug('getItemWeb parameter:', parameter);
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
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    debug('delete headcount:', parameter);
    // one item delete: parameter is id
    // multiple items delete: parameter is ids
    block.data.delete(req, res, parameter, function(error, docs, info) {
      debug('headcount delete result:', error, docs, info);
      app.cb(error, docs, info, req, res, callback);
    });
  };

  block.data.deleteItems = function(req, res, next) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    debug('delete items:', parameter);
    // one item delete: parameter is id
    // multiple items delete: parameter is ids
    block.data.delete(req, res, parameter, function(error, docs, info) {
      debug('headcount delete result:', error, docs, info);
      app.cb(error, docs, info, req, res, callback);
    });
  };

  // page
  block.page.index = function(req, res) {
    var page = app.getPage(req, { title:'item' });
    res.render('item/index', { page:page });
  };

  block.page.view = function(req, res) {
    tool.setReqParameter(req, { module_name:module_name });
    app.module['admin'].page.viewModuleItemPage(req, res);
    /*
    var parameter = tool.getReqParameter(req);
    var itemId = parameter.id;
    block.data.getById(req, res, itemId, function(error, docs, info) {
      var page = app.getPage(req, { title:'item' });
      var item = docs && docs[0] || null;
      debug('view item:', item);
      res.render('item/view', { page:page, item:item });
    });
    */
  };

  block.page.add = function(req, res) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    var page = app.getPage(req, { title:'add ' + module_name });
    var moduleModule = app.module[module_name];
    page.moduleName = module_name;
    page.moduleModel = moduleModule.model;
    page.moduleOption = moduleModule.option;
    page.webEngine = app.engine;
    res.render('item/add', { page:page });
  };

  block.page.addPost = function(req, res) {
    var parameter = tool.getReqParameter(req);
    block.data.addItemWeb(req, res, null, function(error, docs, info) {
      var item = docs && docs[0] || null;
      if (item && item._id) {
        res.redirect('/item/' + item._id + '/view');
      } else {
        app.renderInfoPage(eror, docs, info, req, res);
      }
    });
  };

  block.page.edit = function(req, res) {
    var parameter = tool.getReqParameter(req);
    var itemId = parameter.id;
    block.data.getById(req, res, itemId, function(error, docs, info) {
      var page = app.getPage(req, { title:'Edit item' });
      var item = docs && docs[0] || null;
      debug('edit item:', item);
      res.render('item/edit', { page:page, item:item });
    });
  };

  // data route
  app.server.get('/data/item/get', block.data.getItemWeb);
  app.server.post('/data/item/add', block.data.addItemWeb);
  app.server.post('/data/item/:id/edit', block.data.editItemWeb);
  app.server.post('/data/item/:id/delete', block.data.deleteItemWeb);
  app.server.post('/data/item/delete', block.data.deleteItems);
  // page route
  app.server.get('/item', block.page.index);
  app.server.get('/item/add', block.page.add);
  app.server.post('/item/add', block.page.addPost);
  app.server.get('/item/:id/view', block.page.view);

  return block;
};
