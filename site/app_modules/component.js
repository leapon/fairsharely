'use strict';
var debug = require('debug')('component');
var tool = require('leaptool');

module.exports = function(app) {

  var module_name = 'component';
  var block = {
    app: app,
    role: 'user',
    model: null
  };

  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));

  // page section
  block.page.index = function(req, res) {
    var page = app.getPage(req, {
      module_name: module_name,
      page_name: 'component',
      title: 'component'
    });
    res.render('component/index', { page:page });
  };

  // page route
  app.server.get('/component', block.page.index);

  return block;
};
