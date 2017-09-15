const sql = require('../module/mysql.js');

let fn = function(firNav,i){
	return new Promise((resolve,reject)=>{
		sql('select * from nav where level=2 and navid=?',[firNav[i]['navid']],(err,secNav)=>{
				firNav[i].child = secNav;
				resolve();
			});
	});
};

function NavModel(callFunction,res,other){
	this.getDatas=function(){	
		sql('select * from nav where level=1',(err,firNav)=>{
			let arr = [];
			for(let i in firNav){
				arr[i] = fn(firNav,i);
			}
			Promise.all(arr).then(function(){
				if (other) {
					callFunction(firNav,res,other);
				}else{
					callFunction(firNav,res);
				}
				                                                                                                                                                                                                                                                                                                                                                                                                                                                 
			});
		});
	};
}
module.exports=NavModel;