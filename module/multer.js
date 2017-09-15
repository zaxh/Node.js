const multer = require('multer'),
	path = require('path');

// 上传路径的处理，上传之后的重命名
let storage = multer.diskStorage({
	// 上传路径处理
	destination:  path.join(process.cwd(),'public/img/article'),
	// file:上传文件的信息  cb:回调
	filename:function(req,file,callback){
	    //console.log(file);
		let filename = (file.originalname).split(".");
		callback(null, `${Date.now()}.${filename[filename.length-1]}`);
	}
});
let fileFilter = function(req,file,callback){
	if (file.mimetype === 'image/gif' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		callback(null,true);//true 允许上传，false 不允许上传
	}else{
		callback(null,false);
	}
}
let upload = multer({
	storage: storage,
	limits: {
		//限制上传文件的大小
	}
	//fileFilter: fileFilter
});
module.exports = upload;