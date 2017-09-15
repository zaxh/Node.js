const express = require('express'),
	router = express.Router(),
	sql = require('../module/mysql'),
	crypto = require('crypto');

router.get('/',(req,res) => {
	res.render('reg');
});
/*//返回首页
router.get('/',(req,res) => {
	res.render('index');
});*/
router.post('/',(req,res)=>{
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
	})
});

module.exports = router;