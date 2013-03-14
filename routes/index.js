
/*
 * GET home page.
 */

var reqs = exports,
  db = app.db;

reqs.index = function(req, res) {
    res.render('index', { title: 'Landingbee' });
};

reqs.admin = function(req, res) {
  if(req.params.password !== 'IamAdmin!!') {
    res.redirect('/');
    return;
  }
  res.render('admin', {title: 'admin'});
};

reqs.addCategory = function(req, res) {
  res.render('add-category', {title: 'admin - add category'});
};

reqs.saveCategory = function(req, res) {
  var data = {name: req.body.name, order: 1};
  console.log(data);
  var query = db.query('INSERT INTO category SET ?', data, function(err, result) {
    console.log(query);
    console.log(result);
    res.redirect('/nimda/category/add');
  });
};

reqs.addStore = function(req, res) {
  res.render('add-store', {title: 'admin - add store'});
};

reqs.showStats = function(req, res) {
  res.render('show-stats', {title: 'admin - show stats'});
};