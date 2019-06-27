/**
 * 라우팅 모듈을 로딩하여 설정
 * 
 * 라우팅 모듈 파일에 대한 정보는 config.js의 route_info 배열에 등록함
 *
 * @date 2018-07-30
 * @author ThreeOn
 */

var route_loader = {};

var config = require('../config/route_config');

route_loader.sessionCheckRegister = function(app) {
	console.log('route_loader.sessionCheckRegister 호출됨.');
	var infoLen = config.route_info.length;
	// console.log('설정에 정의된 라우팅 모듈의 수 : %d', infoLen);
 
	for (var i = 0; i < infoLen; i++) {
		var curItem = config.route_info[i];

// 보안을 강화하고자 한다면, session key / IP를 DB에 저장하고 모든 조회시 체크
// route_loader.js 지금은 loginkey == undefined 로만 체크하기로 함
// 필요하면, IP / ID 로 DB 세션값 체크, 속도 이슈 생기면 DB를 REDIS로 구성
		if(curItem.session == 'check') {
			console.log("seesionCheck path : [" + curItem.path + "]");
			app.all(curItem.path, function(req, res, next) {
				console.log("loginkey : " + req.session.loginkey);
				if(req.session.loginkey) {
					console.log("session SUCCESS");
					next();
				}else {
					console.log("session FAIL.......");
					var error = new Error('session error');
					error.status = 404;
					next(error);
				}
			});
		}
	}
};

route_loader.routerInit = function(app, router) {
	console.log('route_loader.routerInit 호출됨.');
	return initRoutes(app, router);
};

// route_info에 정의된 라우팅 정보 처리
function initRoutes(app, router) {
	var infoLen = config.route_info.length;
	// console.log('설정에 정의된 라우팅 모듈의 수 : %d', infoLen);
 
	for (var i = 0; i < infoLen; i++) {
		var curItem = config.route_info[i];
			
		// 모듈 파일에서 모듈 불러옴
		var curModule = require(curItem.file);
		// console.log('%s 파일에서 모듈정보를 읽어옴.', curItem.file);
		
		//  라우팅 처리
		if (curItem.type == 'get') {
            router.route(curItem.path).get(curModule[curItem.method]);
		} else if (curItem.type == 'post') {
            router.route(curItem.path).post(curModule[curItem.method]);
		} else {
			router.route(curItem.path).post(curModule[curItem.method]);
		}
		
		
		// console.log('라우팅 모듈 [%s]이(가) 설정됨.', curItem.method);
	}

    // 라우터 객체 등록
    app.use('/', router);
}

module.exports = route_loader;

