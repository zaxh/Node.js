const express = require('express'),
	router = express.Router(),
	sql = require('../module/mysql.js'),
	crypto = require('crypto'),
    NavModel = require('./nav.js');

function setnavmodel(callFunction,res){
	navModel = new NavModel(callFunction,res);
	navModel.getDatas();
}

router.get('/',(req,res) => {
	// console.log(req.cookies);
	res.render('login');
})
	
router.post('/',(req,res) => {
	const user = req.body.user,
			pwd = req.body.pwd,
			md5 = crypto.createHash('md5'); 
	sql('select * from user where username=? and used=1',[user],(err,data) => {
		// console.log(data);
		if (data.length !== 0) {
			//md5 加密
			let newPwd = md5.update(pwd).digest('hex');
			if(data[0]['password'] === newPwd){
				// 1.cookie的名称  2.数据  3.过期时间(毫秒计算的)
				res.cookie('login',{name:user},{maxAge: 1000*60*60*24});
				/*
				 * session 所有后台页面都是可以访问到的
				 * locals 只是当前页面要能访问
				 * 保存到服务器上面的session 会在关闭页面的时候 session下保存的所有数据都会清空
				*/
				req.session.admin = data[0]['admin'];
				req.session.username = data[0]['username'];
				// res.locals.result = '<h1>登录成功</h1>';
				setnavmodel(callFunction,res);
			}else{
				res.locals.result = '<h1>密码错误</h1>';
				res.render('login');
			}
		}else{
			res.render('reg');
		}
	});
});

var callFunction = function(firNav,res){
	sql('select * from article order by id desc limit 0,4',(err,data)=>{
    	res.render('index',{data:data,firNav:firNav});
	});
}

module.exports = router;