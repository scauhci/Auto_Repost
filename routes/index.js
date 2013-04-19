
/*
 * GET home page.
 */
var login = require("./login");

exports.index = function(req, res){
  res.render('index', {
  	title: 'HCI微博管理系统',
  	appkey: login.appkey,
  	callbackurl: login.callbackurl
  });
};