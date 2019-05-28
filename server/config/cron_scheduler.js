/**
 * CRON SCHEDULER
 * 
 * @date 2018-10-30
 * 
 * @author shinji
 */

var cron_scheduler = {};

var cron = require('node-cron');

cron_scheduler.init = function(app) {
	console.log('cron_scheduler.init 호출됨.');
	return cronRegister(app);
};

// route_info에 정의된 라우팅 정보 처리
function cronRegister(app) {
	// cron 작업 등록
	cron.schedule('* 0 * * *', function(){
	// cron.schedule('*/1 * * * *', function(){
		var nDate = new Date();
		console.log('dailyCronJob 작업 실행 : ' + nDate);
		dailyCronJob(app);
	});
}

function dailyCronJob(app) {
    var database = app.get('database');

    if (database.db) {
        database.UserModel.initTodayVisit(function(err, result) {
            if (err) {
                console.log("initTodayVisit.... ERROR " + err);
            } else {
				console.dir("initTodayVisit.... OK : ");
				console.log(result);
            }
        });
    } else {
		console.dir("initTodayVisit DB ERROR");
    }
}

module.exports = cron_scheduler;

