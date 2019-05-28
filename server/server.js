/**
 * STOCK-NET
 * @date 2017-12-20
 * @author ThreeOn
 */


// Express 기본 모듈 불러오기
var express = require('express'),
    http = require('http'),
    path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    cors = require('cors'),
    fs = require('fs'),
    errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');

// connect-flash 미들웨어 불러오기
var flash = require('connect-flash');

// 모듈로 분리한 설정 파일 불러오기
var config = require('./config/config');

// 모듈로 분리한 설정 파일 불러오기
var cron = require('./config/cron_scheduler');

// 모듈로 분리한 데이터베이스 파일 불러오기
var database = require('./database/database');

// 모듈로 분리한 라우팅 파일 불러오기
var route_loader = require('./routes/route_loader');

// 익스프레스 객체 생성
var app = express();

//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', config.server_port); //8031

//Cross Origin Resource Sharing
app.use(cors());

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
    secret: '!@!!#!#!#!@$^#$$#%#$%#%$%#%#$#$',
    resave: false,
    saveUninitialized: true
}));

// public 폴더를 static으로 오픈
// app.use('/public', static(path.join(__dirname, 'public')));
app.use(static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));


//라우팅 정보를 읽어들여 라우팅 설정
var router = express.Router();
route_loader.routerInit(app, router);


//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/error/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// cron 작업 등록
cron.init(app);

//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function(err) {
    console.log('uncaughtException 발생함 : ' + err);
    console.log('서버 프로세스 종료하지 않고 유지함.');

    console.log(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function() {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function() {
    console.log("Express 서버 객체가 종료됩니다.");
    if (database.db) {
        database.db.close();
    }
});

// 시작된 서버 객체를 리턴받도록 합니다. 
var server = http.createServer(app).listen(app.get('port'), function(req, res) {
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
    // 데이터베이스 초기화
    database.init(app, config);
});
