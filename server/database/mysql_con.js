/*
 * 설정
 *
 * @date 2018-08-31
 * @author ThreeOn
 */
var mysql = require('mysql');
var config = require('./mysql_config');

// database 객체에 db, schema, model 모두 추가
var mydb = {};

mydb.init = function(app) {
	console.log('init() 호출됨.');
	
  mydb.db = mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
  });

  mydb.db.connect(function (err) {
      if (err) {
          console.error('mysql connection error :' + err);
      } else {
          console.info('mysql is connected successfully.');
      }
  })

  var modelLen = config.db_model.length;
	console.log('설정에 정의된 모델의 수 : %d', modelLen);
	
	for (var i = 0; i < modelLen; i++) {
		var curItem = config.db_model[i];
		
		// database 객체에 속성으로 추가
		mydb[curItem.modelName] = require(curItem.file);
		console.log('[MYSQL] 모델 이름 [%s] 이 mydb 객체의 속성으로 추가됨.', curItem.modelName);
	}
	
  app.set('mydb', mydb);
  console.log('[MYSQL]mydb 객체가 app 객체의 속성으로 추가됨.');
  setInterval(keepAlive, 30*1000 );    
}

function keepAlive() {
  mydb.db.query("select 1", function(err) {
    // console.log(err);
  });
}
// database 객체를 module.exports에 할당
module.exports = mydb;
