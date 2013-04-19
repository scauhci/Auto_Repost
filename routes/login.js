var https = require("https");
var querystring = require("querystring");
var url = require("url");
var content = new Array(
	"[兔子]",
	"[困]",
	"[江南style]",
	"[转发]",
	"[杰克逊]",
	"[围观]",
	"[打哈欠]",
	"[奥特曼]",
	"[偷笑]",
	"[威武]",
	"[心]",
	"[bm彩色]",
	"[din转转]",
	"[偷乐]",
	"[lt切克闹]",
	"[moc转发]",
	"[膜拜了]",
	"[moc弹跳]",
	"[din兴奋]",
	"[啦啦啦啦]"
);
var content2 = new Array(
	"不解释 //@任重致远-MR梁广彬: yoyoyo//@C860_拉姆: [din兴奋]大家一起转",
	"喜刷喜刷刷",
	" 一天可以转发三次，兄弟们上！//@任重致远-MR梁广彬: 转发微博",
	"顶起！！",
	"十佳工作室评选，求转发 //@C860_拉姆: 转发微博",
	"我转我转我转转转 //@C860_拉姆: [din兴奋]大家一起转",
	"大家一起转 //@C860_拉姆: [din兴奋]大家一起转 //@C860_拉姆: 转发微博",
	"支持！",
	"Sto",
	"转发微博",
	"我转 //@任重致远-MR梁广彬: 刷屏2",
	"转起",
	"无",
	"不解释",
	"repost",
	"[困] //@leaf志良: [围观][围观]",
	"[din转转]",
	"Orz",
	"[围观]//@钟政123: 不解释 //@C860_拉姆: 转发微博",
	"十佳工作室评选，求转发",
	" //@Q悠嘻猴: [困]+3",
	"帮你转转吧 //@钟政123: [din转转]",
	"记得请我吃饭[困] //@C860_拉姆: [din兴奋]大家一起转",
	"[围观][围观] //@leaf志良: 十佳工作室评选，求转发",
	"[困] //@Q悠嘻猴: [困]+2//@C860_拉姆: 转发微博//@leaf志良: [围观][围观]//@任重致远-MR梁广彬: 大家帮忙转一下谢谢！"
);
var appkey = "1916406843";   //appkey
var callbackurl = "http://hcitest3.cloudfoundry.com/login";   //token回调地址
exports.appkey = appkey;
exports.callbackurl = callbackurl;
var appsecret = "5dbe7e275c65363bd9b97ca81277fbe8";   //appsecret
var ut = new Array();   //存放用户TOKEN的数组
var start = 0;   //计时器运行状态
var repost_delay = 1000*20;   //每条微博转发间隔，默认20秒
var repost_round_delay = 17*3600*1000;   //微博转发周期，默认为一天
var setup_delay = 1000*30;   //服务器部署时间与转发微博时间的间隔

if(start==0) {
	//计时器启动
	start==1;
	setTimeout(function(){
		//首次运行
		if(ut.length!=0){
			dorespost();
			setTimeout(function(){dorespost();} ,repost_delay);
			setTimeout(function(){dorespost();} ,repost_delay*2);
		}
		//按周期重复执行
		setInterval(function(){
			if(ut.length==0) return;
			dorespost();
			setTimeout(function(){dorespost();} ,repost_delay);
			setTimeout(function(){dorespost();} ,repost_delay*2);
		},repost_round_delay);
	},setup_delay);
}

function dorespost() {
	console.log("send msg over...");
	var mid_1 = 3564265627983763;   //HCI
	var mid_2 = 3564248012154726;   //Sudo
	var delay = 1000*10;   //两条微博之间的间隔
	for(var i=0;i<ut.length;++i)
	{
		repost(ut[i],mid_1);
		setTimeout((function(e) {
			return function() {
				repost(ut[e],mid_2);
			}
		})(i),delay);
	}
}

exports.login = function(req,res) {

	var params = url.parse(req.url,true).query;
	var getcode = params["code"];
	var postdata = querystring.stringify({
		client_id : appkey,
		client_secret : appsecret,
		grant_type : "authorization_code",
		code : getcode,
		redirect_uri : callbackurl,
	});

	var options = {
		host : "api.weibo.com",
		port : 443,
		path : "/oauth2/access_token",
		method : "POST",
		headers : {
			"Content-Type" : "application/x-www-form-urlencoded",
			"Content-Length" : postdata.length
		}
	};

	var req = https.request(options, function(res) {
		res.setEncoding("utf8");
		res.on("data",function(data) {
			var jdata = JSON.parse(data);
			var token;
			token = jdata["access_token"];
			// 判断token是否重复
			if(ut.length==0) ut.push(token);
			for(var i=0;i<ut.length;++i) {
				if(ut[i]==token) break;
				else if(i==ut.length-1&&ut[i]!=token) {
					ut.push(token);
					break;
				};
			}
		});
	});

	req.write(postdata + "\n");
	req.end();
	res.render('ok');
};

function repost(thetoken,mid) {
	//console.log("send msg");
	var repostdata = querystring.stringify({
		access_token : thetoken,
		id : mid,
		type : "1",
		status : content2[parseInt(Math.random()*25)]
	});

	var repost = {
		host : "api.weibo.com",
		port : 443,
		path : "/2/statuses/repost.json",
		method : "POST",
		headers : {
			"Content-Type" : "application/x-www-form-urlencoded",
			"Content-Length" : repostdata.length
		}
	};
	console.log(repostdata);
	var rpreq = https.request(repost, function(res) {
		res.setEncoding("utf8");
		res.on("data",function(data) {
			// console.log(data);
		});
	});

	rpreq.write(repostdata + "\n");
	rpreq.end();

}