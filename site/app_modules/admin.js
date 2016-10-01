var debug = require('debug')('admin');
var util = require('util');
var multer = require('multer');
var jwt = require('jsonwebtoken');
var tool = require('leaptool');

module.exports = function(app) {

  var module_name = 'admin';
  var block = {
    app: app,
    role: 'admin',
    model: null
  };

  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));

  // make sure token is valid
  block.data.checkToken = function(req, res, next) {
    if (req.session && req.session.user) {
      next(); // no need for token check if user is logged in already
    } else {
      // check header or url parameters or post parameters for token
      var token = req.body.token || req.query.token || req.headers['x-access-token'];
      if (token) {
        jwt.verify(token, app.setting.token_secret, function(err, value) {
          if (err) {
            debug('token verify error:', err);
            return res.json({ success: false, message: 'Invalid token' });
          } else {
            debug('api token check - decoded token value:', value);
            app.module.user.data.getByField(req, res, 'username', value.user, function(error, docs, info) {
              var user = docs && docs[0] || null;
              debug('token user found:', user);
              if (user) {
                req.user = user;
                next();
              } else {
                return res.json({ success: false, message: 'No user found for token' });
              }
            })
          }
        });
      } else {
        // if there is no token, return 403
        return res.status(403).send({
            success: false,
            message: 'No token provided'
        });
      }
    }
  };

  // make sure logged in user has access to route
  block.data.checkAccess = function(req, res, next) {
    var user = req.session && req.session.user || req.user;
    if (user) {
      var module_name = tool.getModuleFromUrl(req.url);
      var module_in_url = module_name && app.module[module_name];
      var module_role_name = module_in_url && module_in_url.role || '';
      debug('req url info:', req.url, ', module role:', module_role_name);
      debug('user info:', user.username, ', roles:', user.roles);
      if (user.roles.indexOf(module_role_name) >= 0) {
        next(); // user's roles include url's corresponding module role name
      } else {
        return res.status(403).send({
            success: false,
            message: 'User access is denied'
        });
      }
    } else {
      return res.status(403).send({
          success: false,
          message: 'No user info found'
      });
    }
  };

  block.data.deleteItems = function(req, res, next) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    var moduleName = parameter['module_name'];
    var moduleModule = app.module[moduleName];
    debug('admin delete items:', parameter);
    // one item delete: parameter is id
    // multiple items delete: parameter is ids
    moduleModule.data.delete(req, res, parameter, function(error, docs, info) {
      debug('headcount delete result:', error, docs, info);
      app.cb(error, docs, info, req, res, callback);
    });
  };
  
  // site admin page
  block.page.getAdminPage = function(req, res) {
    var page = app.getPage(req, { title:'admin' });
    res.render('admin/index', { page:page });
  };

  block.page.getModulePage = function(req, res) {
    var parameter = tool.getReqParameter(req);
    var page = app.getPage(req, { title:'admin' });
    var moduleName = parameter['module_name'];
    var moduleModule = app.module[moduleName];
    page.moduleName = moduleName;
    page.moduleModel = moduleModule.model;
    page.moduleOption = moduleModule.option;
    res.render('admin/module', { page:page });
  };

  block.page.addModulePage = function(req, res) {
    var parameter = tool.getReqParameter(req);
    var page = app.getPage(req, { title:'add module' });
    var moduleName = parameter['module_name'];
    var moduleModule = app.module[moduleName];
    page.moduleName = moduleName;
    page.moduleModel = moduleModule.model;
    page.moduleOption = moduleModule.option;
    page.webEngine = app.engine;
    res.render('admin/module_add', { page:page });
  };

  block.page.viewModuleItemPage = function(req, res) {
    var parameter = tool.getReqParameter(req);
    var itemId = parameter.id;
    var moduleName = parameter['module_name'];
    var moduleModule = app.module[moduleName];
    moduleModule.data.getById(req, res, itemId, function(error, docs, info) {
      var item = docs && docs[0] || null;
      var page = app.getPage(req, { title:'View ' + moduleName });
      page.moduleName = moduleName;
      page.moduleModel = moduleModule.model;
      page.moduleOption = moduleModule.option;
      page.webEngine = app.engine;
      debug('view item:', item);
      res.render('admin/module_item_view', { page:page, item:item });
    });
  };

  // data
  app.server.all('/data/admin', block.page.checkLogin);
  app.server.all('/data/admin/*', block.page.checkLogin);
  app.server.post('/data/admin/:module_name/delete', block.data.deleteItems);
  // page
  app.server.all('/admin', block.page.checkLogin);
  app.server.all('/admin/*', block.page.checkLogin);
  app.server.get('/admin', block.page.getAdminPage);
  app.server.get('/admin/module/:module_name', block.page.getModulePage);
  app.server.get('/admin/module/:module_name/add', block.page.addModulePage);
  app.server.get('/admin/module/:module_name/:id/view', block.page.viewModuleItemPage);

  return block;
};
