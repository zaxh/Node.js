const mysql = require('mysql');

module.exports = function(sql,value,callback){
let config = mysql.createConnection({
	// 数据库的地址
	host:"localhost",
	user:"root",
	password:"",
	port:"3306",
	// 使用哪个数据库
	database:"nodetest"
});
// 开始连接
config.connect();
// 进行数据库操作 1.数据库代码  2.回调
config.query(sql,value,(err,data) => {
	callback&&callback(err,data);
})
// 结束连接
config.end();	
}
