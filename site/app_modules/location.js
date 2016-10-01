var debug = require('debug')('location');
var util = require('util');
var multer = require('multer');
var tool = require('leaptool');

module.exports = function(app) {

  var module_name = 'location';
  var block = {
    app: app,
    role: 'user'
  };

  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));

  block.model = {
    name: { type: 'string' },
    address: { type: 'string' },
    coordinate: { type: 'string' }, // array type needs work
    photo: { type: 'file' },
    create_by: { type: 'string', config:{ auto:true } },
    create_date: { type: 'date', config:{ auto:true } },
    edit_by: { type: 'string', config:{ auto:true } },
    edit_date: { type: 'date', config:{ auto:true } }
  };

  block.option = {
    edit_fields: ['name', 'address', 'coordinate', 'photo'],
    list_fields: ['name', 'address', 'coordinate'],
    filter_fields: ['name', 'address']
  };

  // data
  block.data.addItemWeb = function(req, res, next) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    debug('addItemWeb:', parameter);
    block.data.addItem(req, res, parameter, callback);
  };

  block.data.addItem = function(req, res, location, callback) {
    debug('addItem:', location);
    block.data.add(req, res, location, function(error, docs, info) {
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

  block.data.editItem = function(req, res, location, callback) {
    debug('editItem:', location);
    block.data.edit(req, res, location, function(error, docs, info) {
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
    block.data.deleteItem(req, res, location, callback);
  };

  block.data.deleteItem = function(req, res, location, callback) {
    debug('deleteItem:', location);
    block.data.delete(req, res, location, function(error, docs, info) {
      debug('deleteItem result:', error, docs, info);
      app.cb(error, docs, info, req, res, callback);
    });
  };

  // page
  block.page.index = function(req, res) {
    var page = app.getPage(req, { title:'location' });
    res.render('location/index', { page:page });
  };

  block.page.view = function(req, res) {
    tool.setReqParameter(req, { module_name:module_name });
    app.module['admin'].page.viewModuleItemPage(req, res);
    /*
    var parameter = tool.getReqParameter(req);
    var locationId = parameter.id;
    block.data.getById(req, res, locationId, function(error, docs, info) {
      var page = app.getPage(req, { title:'Edit location' });
      var location = docs && docs[0] || null;
      debug('view location:', location);
      res.render('location/view', { page:page, location:location });
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
    res.render('location/add', { page:page });
  };

  block.page.addPost = function(req, res) {
    block.data.addItemWeb(req, res, null, function(error, docs, info) {
      var item = docs && docs[0] || null;
      if (item && item._id) {
        res.redirect('/location/' + item._id + '/view');
      } else {
        app.renderInfoPage(eror, docs, info, req, res);
      }
    });
  };

  block.page.edit = function(req, res) {
    var parameter = tool.getReqParameter(req);
    var locationId = parameter.id;
    block.data.getById(req, res, locationId, function(error, docs, info) {
      var page = app.getPage(req, { title:'Edit location' });
      var location = docs && docs[0] || null;
      debug('edit location:', location);
      res.render('location/edit', { page:page, location:location });
    });
  };

  // upload support using multer
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'site/public' + '/upload/')
    },
    filename: function (req, file, cb) {
      cb(null, 'location-' + file.fieldname + '-' + Date.now() + '.png')
    }
  })
  var upload = multer({ storage: storage })
  var moduleUpload = upload.fields([{ name: 'photo', maxCount: 1 }]);

  // data route
  app.server.get('/data/location/get', block.data.getItemWeb);
  app.server.post('/data/location/add', moduleUpload, block.data.addItemWeb);
  app.server.post('/data/location/:id/edit', block.data.editItemWeb);
  app.server.post('/data/location/:id/delete', block.data.deleteItemWeb);
  // page route
  app.server.get('/location', block.page.index);
  app.server.get('/location/add', block.page.add);
  app.server.post('/location/add', moduleUpload, block.page.addPost);
  app.server.get('/location/:id/view', block.page.view);

  return block;
};
