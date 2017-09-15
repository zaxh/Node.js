const express = require('express'),
	router = express.Router(),
	sql = require('../module/mysql.js'),
	crypto = require('crypto'),
	upload = require('../module/multer.js'),
	fs = require("fs"),
	os = require('os');

router.use((req,res,next) => {
	if(req.session.admin){
		next();
	}else{
		res.render('login');
	}
});
router.get('/',(req,res) => {
	res.locals.username = req.session.username;
	res.render('admin/admin');
});
/************用户操作**********************/
// 查询操作
//会员查询
router.get('/user',(req,res) => {
	sql('select * from member inner join user where user.admin = 0 and member.userid = user.id ',(err,data) => {
		res.render('admin/user',{data:data});
	})
});
//管理员查询
router.get('/adminuser',(req,res) => {
	sql('select * from member inner join user where user.admin = 1 and member.userid = user.id ',(err,data) => {
		res.render('admin/adminuser',{data:data});
	})
});
// 删除操作
//会员删除
router.post('/user',(req,res) => {
	sql('delete from user where id=?',[req.body.id],(err,data) => {
		sql('delete from member where userid=?',[req.body.id],(err,data)=>{
			if(err){
				res.send("删除失败");
				return
			}
			res.json({
				result: "删除成功"
			});	
		})		
	})
});
//管理员删除
router.post('/adminuser',(req,res) => {
	sql('delete from user where id=?',[req.body.id],(err,data) => {
		sql('delete from member where userid=?',[req.body.id],(err,data)=>{
			if(err){
				res.send("删除失败");
				return
			}
			res.json({
				result: "删除成功"
			});	
		})	
	})
});
// 修改操作  跳转到修改页面
router.get('/user/update',(req,res) => {
	const id = req.query.id;
	sql('select * from member inner join user where user.id=? and member.userid=? and member.userid = user.id ',[id,id],(err,data) => {
		res.render('admin/update',{data:data});
	})
});
router.post('/user/update',(req,res)=>{
	const id = req.body.id,
		name = req.body.name,
		pwd = req.body.pwd,
		admin = req.body.admin,
		surname = req.body.surname,
		personalname = req.body.personalname,
		sex = req.body.sex,
		idCard = req.body.idCard,
		mail = req.body.mail,
		phone = req.body.phone,
		address = req.body.address,
		time =  new Date().toLocaleString().slice(0,10),
		md5 = crypto.createHash('md5'),
		newPwd = md5.update(pwd).digest('hex');
	sql('update user set username=?,password=?,admin=? where id=?',[name,newPwd,admin,id],(err,data)=>{
		sql('update member set surname=?,personalname=?,mail=?,sex=?,idCard=?,phone=?,address=?,time=? where userid=?',[surname,personalname,mail,sex,idCard,phone,address,time,id],(err,data)=>{
			if (err) {
				res.send('错误');
				return;
			}
			res.json({
				successed: '修改成功！'
			});
		});
		
	})
});
//修改密码
router.get('/user/updatePwd',(req,res)=>{
	const id = req.query.id;
	sql('select * from member inner join user where user.id=? and member.userid=? and user.id = member.userid',[id,id],(err,data) => {
		res.render('admin/updatePwd',{data:data});
	})
});
router.post('/user/updatePwd',(req,res)=>{
	const id = req.body.id,
		pwd = req.body.pwd,
		md5 = crypto.createHash('md5'),
		newPwd = md5.update(pwd).digest('hex');
		console.log(id,pwd);
	sql('update user set password=? where id=?',[newPwd,id],(err,data)=>{
		if (err) {
			res.send('错误');
			return;
		}
		res.json({
			successed: '修改成功！'
		});
		
	});
});
//添加用户
router.get('/user/userInsert',(req,res)=>{
	res.render('admin/userInsert.ejs');
});
router.post('/user/userInsert',(req,res)=>{
	const name = req.body.name,
		pwd = req.body.pwd,
		admin = req.body.admin,
		surname = req.body.surname,
		personalname = req.body.personalname,
		sex = req.body.sex,
		idCard = req.body.idCard,
		mail = req.body.mail,
		phone = req.body.phone,
		address = req.body.address,
		time =  new Date().toLocaleString().slice(0,10),
		md5 = crypto.createHash('md5');
	sql('select * from user where username=?',[name],(err,data) => {
		if (data.length === 0) {
		    // 加密 密码  编码格式hex
			let newPwd = md5.update(pwd).digest('hex');
			sql('INSERT INTO user (id,username,password,admin,used) VALUES (0,?,?,?,1)',[name,newPwd,admin],(err,data)=>{
				sql('select id from user where username = ?',[name],(err,id)=>{
					sql('INSERT INTO member (id,userid,surname,personalname,mail,sex,idCard,phone,address,time) VALUES (0,?,?,?,?,?,?,?,?,?)',[id[0]['id'],surname,personalname,mail,sex,idCard,phone,address,time],(err,data1)=>{
						if (err) {
							res.send('错误');
							return;
						}
						res.json({
							successed: '注册成功'
						});
					})
				})
			})
		}else{
			res.send('错误');
		}
	});
})
/******文章 操作******/
// 文章
router.get('/article',(req,res)=>{
	sql('select * from article',(err,data)=>{
		res.render('admin/article',{data:data});
	})
});
// 删除文章
router.post('/article',(req,res)=>{
	var ids = req.body.id;
	var _sql = 'delete from article where id = ';
	if(ids.length === 1){
		_sql += ids[0];
	}else{
		_sql += ids[0];
		for(var i=1; i<ids.length;i++){
			_sql += ' or id='+ids[i]
		}
	}
	sql( _sql,(err,data)=>{
		if (err) {
			res.send("删除失败");
			return
		}
		res.json({
			result:"删除成功！"
		});
	});
});
//修改文章
router.get('/article/articleUpdate',(req,res)=>{
	sql('select * from article where id=?',[req.query.id],(err,data)=>{
		res.render('admin/articleUpdate',{data:data});
	})
});
router.post('/article/articleUpdate',(req,res)=>{
	const title = req.body.title,
		author = req.body.author,
		comefrom = req.body.comefrom,
		tag = req.body.tag,
		content = req.body.content,
		id = req.body.id,
		time = new Date().toLocaleString().slice(0,10);
	sql('update article set title=?,author=?,comefrom=?,tag=?,content=?,time=? where id=?',[title,author,comefrom,tag,content,time,id],(err,data)=>{
		if (err) {
			res.send("修改失败");
			return
		}
		res.json({
			result: '修改成功！'
		});
	});
});
// 发布文章
router.get('/article/articleInsert',(req,res)=>{
	res.render('admin/articleInsert');
});
// upload.single 用来接受一个文件
router.post('/article/articleInsert',upload.single('img'),(req,res)=>{
	const title = req.body.title,
		tag = req.body.tag,
		author = req.body.author,
		comefrom = req.body.comefrom,
		content = req.body.content,
		img = '/img/article/' + req.file.filename,
		time = new Date().toLocaleString().slice(0,10),
		articletype = req.body.articletype;
	sql('insert into article (id,title,tag,author,comefrom,content,time,img,articletype) values (0,?,?,?,?,?,?,?,?)',[title,tag,author,comefrom,content,time,img,articletype],(err,data)=>{
		if(err){
			console.log(err);
			return
		}
		res.render('admin/articleInsert');
	});
});
/**************导航 操作*******************/
router.get('/nav',(req,res)=>{
	sql('select * from nav',(err,data)=>{
		res.render('admin/nav',{data:data});
	});
});
//删除
router.post('/nav',(req,res)=>{
	var ids = req.body.id;
	var _sql = 'delete from nav where id = ';
	if(ids.length === 1){
		_sql += ids[0];
	}else{
		_sql += ids[0];
		for(var i=1; i<ids.length;i++){
			_sql += ' or id='+ids[i]
		}
	}
	sql( _sql,(err,data)=>{
		if (err) {
			res.send("删除失败");
			return
		}
		res.json({
			result:"删除成功！"
		});
	});
});
// 修改
router.get('/nav/navUpdate',(req,res)=>{
	sql('select * from nav where id=?',[req.query.id],(err,data)=>{
		res.render('admin/navUpdate',{data:data});
	});
});
router.post('/nav/navUpdate',(req,res)=>{
	const id = req.body.id,
		title = req.body.title,
		classification = req.body.classification,
		comefrom = req.body.comefrom,
		time = new Date().toLocaleString().slice(0,10);
		url = req.body.url;
	sql('update nav set title=?,classification=?,comefrom=?,time=?,url=? where id=?',[title,classification,comefrom,time,url,id],(err,data)=>{
		if (err) {
			res.send("失败");
			return
		}
		res.json({
			result: "更新成功！"
		})
	});
});
//添加
router.get('/nav/navInsert',(req,res)=>{
	sql('select * from nav where level=1 order by navid asc',(err,data)=>{
		res.render('admin/navInsert',{data:data});
	});
});
router.post('/nav/navInsert',(req,res)=>{
	const title = req.body.title,
		classification = req.body.classification,
		comefrom = req.body.comefrom,
		time = new Date().toLocaleString().slice(0,10);
		navid = req.body.navid,
		level = req.body.level,
		url = req.body.url;
	sql('insert into nav (id,title,classification,comefrom,time,navid,level,url) values(0,?,?,?,?,?,?,?)',[title,classification,comefrom,time,navid,level,url],(err,data1)=>{
		sql('select * from nav where level=1 order by navid asc',(err,data)=>{
			res.render('admin/navInsert',{data:data});
		});
	});
});
/****其他页面********************/
router.get('/welcome',(req,res)=>{
	let info={
		hostname: os.hostname(),
		networkInterfaces: os.networkInterfaces(),
		type: os.type(),
		totalmem: os.totalmem(),
		cpus: os.cpus()
	}
	res.render('admin/welcome.ejs',{info: info});
});
router.get('/404',(req,res)=>{
	res.render('404.ejs');
});
router.get('/charts-1',(req,res)=>{
	res.render('admin/charts-1.ejs');
});
router.get('/charts-2',(req,res)=>{
	res.render('admin/charts-2.ejs');
});
router.get('/charts-3',(req,res)=>{
	res.render('admin/charts-3.ejs');
});
router.get('/charts-4',(req,res)=>{
	res.render('admin/charts-4.ejs');
});
router.get('/charts-5',(req,res)=>{
	res.render('admin/charts-5.ejs');
});
router.get('/charts-6',(req,res)=>{
	res.render('admin/charts-6.ejs');
});
router.get('/charts-7',(req,res)=>{
	res.render('admin/charts-7.ejs');
});
/*
// 退出
router.get('/logout',(req,res) => {
	res.clearCookie('login');// 清楚cookie
	res.redirect('/');// 网址重定向
});
// 登录
router.get('/login',(req,res) => {
	res.render('login.ejs');
});*/
module.exports = router