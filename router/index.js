const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql.js'),
    NavModel = require('./nav.js');
   
   function setnavModel(callFunction,res,other){
   	navModel=new NavModel(callFunction,res,other);
	navModel.getDatas();
   }

router.get('/',(req,res) => {
	// 传递数据
	res.locals.admin = req.session.admin;
	res.locals.username = req.session.username;
	setnavModel(callFunction,res);
});

var callFunction=function(firNav,res){
	sql('select * from article order by id desc limit 0,6',(err,data)=>{
		// 用来响应模板引擎文件的
    	res.render('index',{data:data,firNav:firNav});
	});
}
// 文章分页
router.get('/article/list-:page.html',(req,res)=>{
	// console.log(req[params]);
	sql('select * from article',(res,data)=>{
		req.session.pages = data.length%6 ? parseInt(data.length/6)+1 : parseInt(data.length/6);
	});
	setnavModel(callFunction1,res,req);
});

var callFunction1=function(firNav,res,req){
	// 倒叙排列
	sql('select * from article order by id desc limit ?,6',[(req.params.page-1)*6],(err,data)=>{
		res.render('articleList.ejs',{data:data,pages:req.session.pages,firNav:firNav});
	});
}

// 访问 文章详情页
router.get('/article/:id.html',(req,res)=>{
	// req.params 同时接收get,post,其他 提交数据的形式
	// console.log(req.params);
	sql('select * from article where id=?',[req.params.id],(err,data)=>{
		if(data.length === 0){
			// status 返回状态码
			res.status(404).render('404.ejs');
			return
		}
		if(err){
			res.status(500).render('err.ejs');
			return
		}
		let other = [data,req.params.id];
		setnavModel(callFunction2,res,other);
	});
});
// 提交评论
router.post('/article/:id.html',(req,res)=>{
	const content = req.body.content,
		id = req.params.id;
	sql('insert into articlecomment (id,uid,pid,content) values(0,0,?,?)',[id,content],(err,data)=>{
		sql('select * from article where id=?',[id],(err,data1)=>{
			let other = [data1,id];
			setnavModel(callFunction2,res,other);
		});
	});
});
var callFunction2=function(firNav,res,other){
	sql('select * from articlecomment where pid=?',[other[1]],(err,data2)=>{
		res.render('article',{data:other[0],comment:data2,firNav:firNav});
	});
}
// 退出
router.get('/logout',(req,res) => {
	res.clearCookie('login');// 清楚cookie
	res.redirect('/');// 网址重定向
});
// 登录
router.get('/login',(req,res) => {
	res.render('login.ejs');
});

// 使用use 来匹配网址，那么login.js中就直接是/
router.use('/admin',require('./admin'));
router.use('/login',require('./login.js'));
router.use('/reg',require('./reg.js'));
module.exports = router;