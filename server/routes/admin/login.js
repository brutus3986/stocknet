/*
 * Login 위한 라우팅 함수 정의
 *
 * @date 2018-04-05
 * @author shjinji
 */

var crypto = require('crypto');
var config = require('../../config/config');
var Promise = require("bluebird");
var async = require('async');

//로그인
var checkLogin = function(req, res) {
    console.log('users 모듈 안에 있는 checkLogin 호출됨.');

    var userid = req.body.userid;
    var password = req.body.password;
    var vueDate  = req.body.vueDate;
    var gubun =  req.body.gubun;            
    var options = {userid: req.body.userid, password: req.body.password};

    // 운영 전환
    if(config.runenv == "dev") {
        var ip = "211.255.203.41";
    }else {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    }
    //접속 허용 시간 
    var dt = new Date();
    var dt_time = dt.getHours();
    console.log('client IP***********--> ' + ip);

    //options.criteria.userid = userid;
    //options.criteria.hashed_password = crypto.createHash('sha256', config.pwd_salt).update(password).digest('base64');;

    console.log("userid : [" + userid + "]  password : [" + password + "]");
// console.log("hashed_password : [" + options.criteria.hashed_password + "]");
   
    if (userid.length > 0 && password.length > 0) {
        try{
            var pool = req.app.get("pool");
            var mapper = req.app.get("mapper");
            var stmt = mapper.getStatement('userInfo', 'checkByUserID', options, {language:'sql', indent: '  '});
            console.log(stmt);
            Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
            //database.UserModel.checkByUserID(userid, function(err, user) {  //존재하는 계정인지 검색
                // 등록된 사용자의 경우
                if(rows[0].length > 0 ){
                    try{
                            //database.UserModel.loginByUser(options, function(err, user) {
                        var stmt = mapper.getStatement('userInfo', 'getUser', options, {language:'sql', indent: '  '});
                        console.log(stmt);
                        Promise.using(pool.connect(), conn => {
                            conn.queryAsync(stmt).then(user => {
                                //존재하는 계정의 비밀번호 틀린 횟수와 잠김여부
                                var count = rows[0][0].loginfailcount;
                                var lockyn = rows[0][0].lockyn;
                                if (user[0].length > 0) {    //ID와 비밀번호가 동시에 일치하는 경우 1
                                    console.log('계정 일치.');
                                    console.log('잠김여부 : '+ user[0][0].lockyn);
                                    console.log('fail count : '+ user[0][0].loginfailcount);
                                    console.log(' 이름 : ' + user[0][0].name);
                                    console.log(' IP주소 : ' + user[0][0].ipaddr);
                                    console.log(' 접속시간 TO : ' + user[0][0].starttime);
                                    console.log(' 접속시간 FROM : ' + user[0][0].endtime);
                                    console.log(' 현재 시간대 :' + dt_time);

                                    var dbIpaddr = user[0][0].ipaddr.split(',');
                                     if (dbIpaddr.indexOf(ip) !== -1) { //계정일치, 접속 허용IP 일치
                                        if (user[0][0].starttime <= dt_time && dt_time <= user[0][0].endtime && user[0][0].lockyn != 'Y') {
                                            
                                            countInfo(req,res); 
                                            //usersloginCount(req,res);

                                            // database.UserModel.failcntzero(userid, function(err, user) {
                                            //     if (err) {
                                            //         console.log("Error.......: " + err);
                                            //     }
                                            //     // console.log('페일카운트......제로.....000000 ')
                                            // }); 
                                            var stmt = mapper.getStatement('userInfo', 'failcntzero', options, {language:'sql', indent: '  '});
                                            console.log(stmt);
                                            Promise.using(pool.connect(), conn => {
                                                conn.queryAsync(stmt).then(user => {
                                                        console.log('페일카운트......제로.....000000 ')
                                                     }).catch(err => {
                                                        console.log("Error.......: " + err); 
                                                });
                                            });
                                            
                                            res.json({
                                                success: true,
                                                message: "OK",
                                                userid: userid,
                                                username: user[0][0].name,
                                                user_level: user[0][0].user_level,
                                                lockyn: user[0][0].lockyn,
                                                machine_name: user[0][0].machine_name,
                                                route_gubun1: user[0][0].route_gubun1,
                                                route_gubun2: user[0][0].route_gubun2,
                                                route_gubun3: user[0][0].route_gubun3,
                                                route_gubun4: user[0][0].route_gubun4,
                                                market_gubun1: user[0][0].market_gubun1,
                                                market_gubun2: user[0][0].market_gubun2,
                                                market_gubun3: user[0][0].market_gubun3,
                                                market_gubun4: user[0][0].market_gubun4,
                                                market_gubun5: user[0][0].market_gubun5,
                                                market_gubun6: user[0][0].market_gubun6,
                                                market_gubun7: user[0][0].market_gubun7,
                                                market_gubun8: user[0][0].market_gubun8
                                            });
                                            makeSessionKey(req, user[0][0]);
                                            res.end();
                                        }else if(user[0][0].lockyn == 1) {
                                                console.log(user[0][0].lockyn);
                                                console.log('계정 잠김 상태');
                                                res.json({ success: false, message: "lock" });
                                                res.end();
                                            }else {
                                                console.log('계정은 일치, IP정보 일치, 접속시간 불일치');
                                                res.json({ success: false, message: "No Auth TIME" });
                                                res.end();
                                        }
                                    } else {
                                        console.log('계정은 일치하지만, IP정보가 다름!!');
                                        res.json({ success: false, message: "No Auth IP" });
                                        res.end();
                                    }
                                }else{
                                    console.log('계정존재, 계정일치하지만 , 비밀번호 틀림');
                                    
                                    if(count <= 4 && lockyn== 0 ){  //비밀번호만 틀리고 계정이 잠기지 않은 상태
                                        console.log('비밀번호만 틀리고 계정이 잠기지 않은 상태');
                                        res.json({ success: false, message: "WRONG PASSWD" , cnt: count+1});
                                        res.end();
                                        if(count==4){
                                            var stmt = mapper.getStatement('userInfo', 'loginfaillock', options, {language:'sql', indent: '  '});
                                            console.log(stmt);
                                            Promise.using(pool.connect(), conn => {
                                                conn.queryAsync(stmt).then(user => {
                                                        console.dir("lock.... OK ");
                                                     }).catch(err => {
                                                        console.log("lock.... FAIL " + err);
                                                });
                                            });

                                            // database.UserModel.loginfaillock(userid, function(err) {
                                            //     if (err) {
                                            //         console.log("lock.... FAIL " + err);
                                            //     } else {
                                            //         console.dir("lock.... OK ");
                                            //     }
                                            // });9
                                        }else{
                                            //fail count  업데이트 
                                            var stmt = mapper.getStatement('userInfo', 'countPlus', options, {language:'sql', indent: '  '});
                                            console.log(stmt);
                                            Promise.using(pool.connect(), conn => {
                                                conn.queryAsync(stmt).then(user => {
                                                        console.log("failCountUpdate.... FAIL " + err);
                                                     }).catch(err => {
                                                        console.dir("failCountUpdate.... OK ");
                                                });
                                            });

                                            // database.UserModel.countPlus(userid, function(err) {
                                            //     if (err) {
                                            //         console.log("failCountUpdate.... FAIL " + err);
                                            //     } else {
                                            //         console.dir("failCountUpdate.... OK ");
                                            //     }
                                            // });
                                        }
                                    }else{   //비밀번호가 틀리고 계정이 잠긴 상태
                                        console.log('비밀번호만 틀리고 계정이 잠긴 상태');
                                        res.json({ success: false, message: "lock" });
                                        res.end();
                                    }
                                }
                            }).catch(err => {
                                console.log("Error while performing Query.");
                                res.json({
                                    success: false,
                                    message: err
                                });
                                res.end();
                            });
                        });
                    } catch(exception) {
                        console.log("getUser " + err);
                        res.json({ success: false, message: "DB connection Error" });
                        res.end();
                    }      
                }else{
                    console.log('존재하지 않는 ID입니다.....')
                    res.json({ success: false, message: "NOT USER" });
                    res.end();
                }
            }).catch(err => {
                console.log("Error while performing Query.....");
                res.json({
                    success: false,
                    message: err
                });
                res.end();
            });
        });                            
        } catch(exception) {
            res.json({
                success: false,
                message: err
            });
            res.end();
        }      
    } else {
        res.json({ success: false, message: "ERROR LOGIN" });
        res.end();
    }
};

// 보안을 강화하고자 한다면, session key / IP를 DB에 저장하고 모든 조회시 체크
// route_loader.js 지금은 loginkey == undefined 로만 체크하기로 함
// 필요하면, IP / ID 로 DB 세션값 체크, 속도 이슈 생기면 DB를 REDIS로 구성
var makeSessionKey = function(req, user) {
    var sDate = new Date();

    req.session.loginkey = user.ipaddr + "_" + user.userid + "_" + sDate.toString();
    req.session.save();
    console.log("session loginkey: " + req.session.loginkey);
}

//방문자수 카운트 후 업데이트 (v_count 컬렉션)
var countInfo = function(req,res) {
    console.log('login 모듈 안에 있는 countInfo 호출됨.');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
         var options = {userid: req.body.userid, password: req.body.password};
        //카운트 조회
         var stmt = mapper.getStatement('userInfo', 'getVisitCount', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(count => {

        //database.CountModel.getVisitCount(function(err, count) {
            if (count[0][0].count > 0 ) {
                //이 함수는 로그인 모듈(gubun==1)과 사용자설정화면(gubun==2)에서 같이 쓰기 때문에 구분함
                //로그인 모듈에서는 로그인 후 방문자수 업데이트
                if (req.body.gubun == 1) {
                   
                    var indate = req.body.vueDate;
                    console.log('vue에서 받은 오늘 날짜:'+ indate);
                    var dbdate = count[0][0].updated_at;

                    var inputDate = dbdate.toISOString().substr(0, 10);

                    console.log('DB에서 가져온 마지막 날짜 :'+ dbdate);
                    console.log('DB에서 가져온 마지막 날짜 변환 :'+ inputDate);

                    console.log('DB에서 가져온 마지막 날짜 변환 :'+ count[0][0].today_visit  + count[0][0].total_visit);
                    
                    //조회날짜와 DB날짜가 같다면 (조회시점이 오늘이라면)
                    if (indate === inputDate) {
                        //같은 날짜라면 오늘 방문자수 +1 
                        var today_visit = count[0][0].today_visit + 1;
                        var total_visit = count[0][0].total_visit + 1;
                        // console.log("같은날짜 today_count : [" + today_count + "] total_count : [" + total_count + "]");
                    } else {
                        //다른날짜면 오늘방문자수 = 0에서 시작
                        var today_visit = 1;
                        var total_visit = count[0][0].total_visit + 1;
                        // console.log("다른날짜 0에서 시작 today_count : [" + today_count + "] total_count : [" + total_count + "]");
                    }

                    //var uDate = new Date();
                    // console.log('uDate: '+uDate);

                    var options = { userid: req.body.userid,"today_visit": today_visit, "total_visit": total_visit };
 
                    //방문자수 업데이트 
                    console.log("loginoption" + JSON.stringify(options))
                    var stmt = mapper.getStatement('userInfo', 'updateInfo', options, {language:'sql', indent: '  '});
                    console.log(stmt);
                    Promise.using(pool.connect(), conn => {
                        conn.queryAsync(stmt).then(user => {
                            console.dir("countInfo Update.... OK ");
                         }).catch(err => {
                            console.log("countInfo Update.... FAIL " + err);
                        });
                    });
                    
                    // database.CountModel.updateCountInfo(options, function(err) {
                    //     if (err) {
                    //         console.log("UpdateCountInfo.... FAIL " + err);
                    //     } else {
                    //         console.dir("UpdateCountInfo.... OK ");
                    //     }
                    // });
                    //사용자설정 화면에서 CALL
                } else if (req.body.gubun == 2) {
                    //카운트만 가져오기

                    var today_visit = count[0][0].today_visit;
                    var total_visit = count[0][0].total_visit;
                     res.json({ success: true, message: "OK", dayCount: today_visit, totalCount: total_visit });
                    res.end();
                };
                //결과값(count)가 없음   
            } else {
                res.json({ success: false, message: "No Data" });
                res.end();
            };
        }).catch(err => {
            console.log("countInfo.... FAIL " + err);
            res.json({ success: false, message: "FAIL" });
            res.end();
        });
    });//getVisitCount 끝
  

        //database.db 데이터베이스 connection ERROR
    } catch(exception) {
        console.log("countInfo " + exception);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

//로그인한 id 당일접속 업데이트 (users 컬렉션)
var usersloginCount = function(req, res) {
    console.log('users 컬렉션 당일접속 업데이트');

    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var indate = req.body.vueDate;
        var userid = req.body.userid;
        console.log('당일접속 vue에서 받은 오늘 날짜:'+ indate);
        console.log('당일접속 vue에서 받은 userid  :' + userid);

        var options = { "userid": userid  };
        //카운트 조회
        var stmt = mapper.getStatement('userInfo', 'getVisitCount', options, {language:'sql', indent: '  '});
    
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(user => {

        //database.UserModel.userVisitCount(options, function(err, count) {
            if (err) {
                console.dir(err);
                res.json({ success: false, message: err });
                res.end();
                //결과값(count)이 있으면
            } else if (count) {
                // console.log('로그인 당일접속 count 있음');

                var dbdate = count[0].last_visitday; //마지막 방문일
                var inputDate = dbdate.toISOString().substr(0, 10);
                // console.log('당일접속 DB에서 가져온 마지막 방문 날짜 :'+ dbdate);
                // console.log('당일접속 DB에서 가져온 마지막 날짜 변환 :'+ inputDate);

                //조회날짜와 DB날짜가 같다면 (조회시점이 오늘이라면)
                if (indate === inputDate) {
                    //같은 날짜라면 오늘 방문자수 +1 
                    var today_visit = count[0].today_visit + 1;
                    var total_visit = count[0].total_visit + 1;
                    // console.log("같은날짜 today_visit : [" + today_visit + "] total_visit : [" + total_visit + "]");
                } else {
                    //다른날짜면 오늘방문자수 = 0에서 시작
                    var today_visit = 1;
                    var total_visit = count[0].total_visit + 1;
                    // console.log("다른날짜 0에서 시작 today_visit : [" + today_visit + "] total_visit : [" + total_visit + "]");
                }
                var uDate = new Date();

                //방문자수 업데이트 
                var options = { "userid": userid,"today_visit": today_visit, "total_visit": total_visit, "last_visitday": uDate }
                 var stmt = mapper.getStatement('userInfo', 'updateInfo', options, {language:'sql', indent: '  '});
                console.log(stmt);
                Promise.using(pool.connect(), conn => {
                    conn.queryAsync(stmt).then(user => {
                        console.dir("Update.... OK ");
                     }).catch(err => {
                        console.log("Update.... FAIL " + err);
                    });
                });

                // database.UserModel.updateCount(useroptions, function(err) {
                //     if (err) {
                //         console.log("UserModelCount.... FAIL " + err);
                //     } else {
                //         console.dir("UserModelCount.... OK ");
                //     }
                // });
                //결과값(count)가 없음   
            } else {
                res.json({ success: false, message: "No Data" });
                res.end();
            };
        }).catch(err => {
            console.log("Update.... FAIL " + err);
            res.json({ success: false, message: "FAIL" });
            res.end();
        });
    });//getVisitCount 끝
  

        //database.db 데이터베이스 connection ERROR
    } catch(exception) {
        console.log("usersloginCount " + err);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
}

module.exports.checkLogin = checkLogin;
module.exports.countInfo = countInfo;