const http = require('http'),
    express = require('express'),
    path = require('path'),
    app = express(),
    bodyParser = require('body-parser'),//post 方式提交表单时
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    sql = require('./module/mysql');
    


// 设置模板引擎的目录
app.set('views',__dirname+'/views');
// 设置使用的模板引擎是什么
app.set('view engine','ejs');
// 设置静态资源目录 css js img etc.
app.use(express.static(__dirname+'/public'));

app.use(bodyParser.json());// 用来接收json的数据
// extended:true 可以接收任何数据类型的数据
app.use(bodyParser.urlencoded( { extended:true } ));
app.use(cookieParser('xumoting')); // 密钥
app.use(session( { 
					resave: true,  // 新增
					saveUninitialized: true,  // 新增
					secret:'node'
				} )); // 密钥 密钥最好设置随机数
app.use(function(req,res,next){
	if (req.cookies['login']) {
		res.locals.login = req.cookies.login.name;
	}
	if(res.locals.login && req.session.admin){
        sql('SELECT * FROM user where username = ?',[res.locals.login],(err,data) => {
            req.session.admin = Number(data[0]['admin']);
            // 继续往下执行
            next()
        })
    }else{
        next()
    }
});

app.use('/ueditor/ue',require('./module/ue'));
// http://localhost:233
app.use('/',require('./router/index'));
http.createServer(app).listen(233);