/*
 * Login 위한 라우팅 함수 정의
 *
 * @date 2018-04-05
 * @author shjinji
 */


//로그인
var checkLogin = function(req, res) {
    console.log('users 모듈 안에 있는 checkLogin 호출됨.');

    var userid = req.body.userid;
    var password = req.body.password;
    var vueDate  = req.body.vueDate;
    var gubun =  req.body.gubun;            
    var options = {
        "criteria": { userid: req.body.userid, password: req.body.password}
    };

    console.log('+++++++++++++++++++++++++++++++');
    console.log('잘들어오나.. ' + vueDate + ' & gubun:  ' + gubun);

    // 운영으로 갈때 주석풀기
    // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    var ip = "211.255.203.42";
    console.log('접속시도IP : ' + ip);
    //접속 허용 시간 
    var dt = new Date();
    var dt_time = dt.getHours();
    console.log('client IP***********--> ' + ip);

    console.log("userid : [" + userid + "]  password : [" + password + "]");
    var database = req.app.get('database');
    
    if (userid.length > 0 && password.length > 0) {
        // var UM = req.app.get('database').UserModel;
        database.UserModel.checkByUserID(userid, function(err, user) {  //존재하는 계정인지 검색
            //console.log(JSON.stringify(user));
            
            //존재하는 계정의 비밀번호 틀린 횟수와 잠김여부
            var count = user.loginfailcount;
            var lockyn = user.lockyn;
            
            // 등록된 사용자의 경우
            if(user !== null){
                console.log('id가 존재합니다.');
                if (err) {
                    console.log("Error.......: " + err);
                    res.json({ success: false, message: err });
                    res.end();
                }
                database.UserModel.loginByUser(options, function(err, user) {
                    if (err) {
                        console.log("Error.......: " + err);
                        res.json({ success: false, message: err });
                        res.end();
                    }
                    
                    if (user.length > 0) {    //ID와 비밀번호가 동시에 일치하는 경우 1
                    console.log('계정 일치.');
                    console.log('잠김여부 : '+ user[0].lockyn);
                    console.log('fail count : '+ user[0].loginfailcount);
                    console.log(' 이름 : ' + user[0].name);
                    console.log(' IP주소 : ' + user[0].ipaddr);
                    console.log(' 접속시간 TO : ' + user[0].starttime);
                    console.log(' 접속시간 FROM : ' + user[0].endtime);
                    console.log(' 현재 시간대 :' + dt_time);

                    countInfo(req,res); 
                    usersloginCount(req,res);
                    
                    var dbIpaddr = user[0].ipaddr.split(',');
                    if (dbIpaddr.indexOf(ip) !== -1) { //계정일치, 접속 허용IP 일치
                        if (user[0].starttime <= dt_time && dt_time <= user[0].endtime && user[0].lockyn == false) {
                            database.UserModel.failcntzero(userid, function(err, user) {
                                if (err) {
                                    console.log("Error.......: " + err);
                                }
                                console.log('페일카운트......제로.....000000 ')
                            });    
                            res.json({
                                success: true,
                                message: "OK",
                                userid: userid,
                                username: user[0].name,
                                user_level: user[0].user_level,
                                lockyn: user[0].lockyn,
                                machine_name: user[0].machine_name,
                                route_gubun1: user[0].route_gubun1,
                                route_gubun2: user[0].route_gubun2,
                                route_gubun3: user[0].route_gubun3,
                                route_gubun4: user[0].route_gubun4,
                                market_gubun1: user[0].market_gubun1,
                                market_gubun2: user[0].market_gubun2,
                                market_gubun3: user[0].market_gubun3,
                                market_gubun4: user[0].market_gubun4,
                                market_gubun5: user[0].market_gubun5,
                                market_gubun6: user[0].market_gubun6,
                                market_gubun7: user[0].market_gubun7,
                                market_gubun8: user[0].market_gubun8
                            });
                            res.end();
                        }else if(user[0].lockyn == true) {
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
                    
                    if(count <= 4 && lockyn===false){  //비밀번호만 틀리고 계정이 잠기지 않은 상태
                        console.log('비밀번호만 틀리고 계정이 잠기지 않은 상태');
                        res.json({ success: false, message: "WRONG PASSWD" , cnt: count+1});
                        res.end();
                        if(count==4){
                            database.UserModel.loginfaillock(userid, function(err) {
                                if (err) {
                                    console.log("lock.... FAIL " + err);
                                } else {
                                    console.dir("lock.... OK ");
                                }
                            });
                        }else{
                            //fail count  업데이트 
                            database.UserModel.countPlus(userid, function(err) {
                                if (err) {
                                    console.log("failCountUpdate.... FAIL " + err);
                                } else {
                                    console.dir("failCountUpdate.... OK ");
                                }
                            });
                        }
                    }else{   //비밀번호가 틀리고 계정이 잠긴 상태
                        console.log('비밀번호만 틀리고 계정이 잠긴 상태');
                        res.json({ success: false, message: "lock" });
                        res.end();
                    }
                }
            });
            }else{
                console.log('존재하지 않는 ID입니다.....')
                res.json({ success: false, message: "NOT USER" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "ERROR LOGIN" });
        res.end();
    }
};

//방문자수 카운트 후 업데이트 (v_count 컬렉션)
var countInfo = function(req,res) {
    console.log('login 모듈 안에 있는 countInfo 호출됨.');

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

        //카운트 조회
        database.CountModel.getVisitCount(function(err, count) {
            if (err) {
                console.dir(err);
                res.json({ success: false, message: err });
                res.end();

                //결과값(count)이 있으면
            } else if (count) {
                //이 함수는 로그인 모듈(gubun==1)과 사용자설정화면(gubun==2)에서 같이 쓰기 때문에 구분함
                //로그인 모듈에서는 로그인 후 방문자수 업데이트
                if (req.body.gubun == 1) {
                   
                    var indate = req.body.vueDate;
                    // console.log('vue에서 받은 오늘 날짜:'+ indate);
                    var dbdate = count[0].updated_at;
                    var inputDate = dbdate.toISOString().substr(0, 10);

                    // console.log('DB에서 가져온 마지막 날짜 :'+ dbdate);
                    // console.log('DB에서 가져온 마지막 날짜 변환 :'+ inputDate);

                    //조회날짜와 DB날짜가 같다면 (조회시점이 오늘이라면)
                    if (indate === inputDate) {
                        //같은 날짜라면 오늘 방문자수 +1 
                        var today_count = count[0].today_count + 1;
                        var total_count = count[0].total_count + 1;
                        // console.log("같은날짜 today_count : [" + today_count + "] total_count : [" + total_count + "]");
                    } else {
                        //다른날짜면 오늘방문자수 = 0에서 시작
                        var today_count = 1;
                        var total_count = count[0].total_count + 1;
                        // console.log("다른날짜 0에서 시작 today_count : [" + today_count + "] total_count : [" + total_count + "]");
                    }

                    var uDate = new Date();
                    // console.log('uDate: '+uDate);
                    var options = { "today_count": today_count, "total_count": total_count, "updated_at": uDate }

                    //방문자수 업데이트 
                    database.CountModel.updateCountInfo(options, function(err) {
                        if (err) {
                            console.log("UpdateCountInfo.... FAIL " + err);
                        } else {
                            console.dir("UpdateCountInfo.... OK ");
                        }
                    });
                    //사용자설정 화면에서 CALL
                } else if (req.body.gubun == 2) {
                    //카운트만 가져오기
                    var today_count = count[0].today_count;
                    var total_count = count[0].total_count;
                    res.json({ success: true, message: "OK", dayCount: today_count, totalCount: total_count });
                    res.end();
                };
                //결과값(count)가 없음   
            } else {
                res.json({ success: false, message: "No Data" });
                res.end();
            };
        }); //getVisitCount 끝

        //database.db 데이터베이스 connection ERROR
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

//로그인한 id 당일접속 업데이트 (users 컬렉션)
var usersloginCount = function(req, res) {
    console.log('users 컬렉션 당일접속 업데이트');

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

        var indate = req.body.vueDate;
        var userid = req.body.userid;
        console.log('당일접속 vue에서 받은 오늘 날짜:'+ indate);
        console.log('당일접속 vue에서 받은 userid  :' + userid);

        var options = { "criteria": { "userid": userid } };
        //카운트 조회
        database.UserModel.userVisitCount(options, function(err, count) {
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
                var userview = { "today_visit": today_visit, "total_visit": total_visit, "last_visitday": uDate }
                var useroptions = { "criteria": { "userid": userid }, "userview": userview }

                database.UserModel.updateCount(useroptions, function(err) {
                    if (err) {
                        console.log("UserModelCount.... FAIL " + err);
                    } else {
                        console.dir("UserModelCount.... OK ");
                    }
                });
                //결과값(count)가 없음   
            } else {
                res.json({ success: false, message: "No Data" });
                res.end();
            };
        }); //getVisitCount 끝

        //database.db 데이터베이스 connection ERROR
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
}

module.exports.checkLogin = checkLogin;
module.exports.countInfo = countInfo;