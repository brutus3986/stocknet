/*
 * 사용자설정 관련 라우팅 함수 정의
 *
 * @date 2018-04-05
 * @author shjinji
 */
var Promise = require("bluebird");
var async = require('async');


//사용자설정 메뉴의 고객사 리스트 가져오기
var userList = function(req, res) {
    console.log('/user/userList 패스 요청됨.');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var options = {
            "perPage": req.query.perPage,
            "curPage": req.query.curPage,
            "seloption": req.query.seloption,
            "searchinfo": req.query.searchinfo
        };
        if(req.query.searchinfo != '') {
            console.log('*******************');
            console.log(req.query.searchinfo)
            console.log('*******************');

            var sinfo = '.*' + req.query.searchinfo + '*.';
            if(req.query.seloption == 'userid') {
                options.criteria = { $and: [ { bbs_id: req.query.bbs_id }, { userid : {$regex : sinfo, $options:"i" }} ] };
            }else {
                options.criteria = { $and: [ { bbs_id: req.query.bbs_id }, { name : {$regex : sinfo, $options:"i" }} ] };
            }
        }
        var stmt = mapper.getStatement('userInfo', 'countByBbsId', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                var startPage = req.query.perPage  * (req.query.curPage -1) ;
                var userCnt = rows[0][0]['userCnt'] ;
                if(userCnt > 0) {
                    var options = {
                        "perPage": req.query.perPage,
                        "curPage": req.query.curPage,
                        "seloption": req.query.seloption,
                        "searchinfo": req.query.searchinfo,
                        "startPage" : startPage,
                        "limitPage" : req.query.perPage
                    };
                    try {
                        var stmt = mapper.getStatement('userInfo', 'findAll', options, {language:'sql', indent: '  '});
                        console.log(stmt);
                        Promise.using(pool.connect(), conn => {
                            conn.queryAsync(stmt).then(results => {
                                    var totalPage = Math.ceil(userCnt / req.query.perPage);
                                    console.log(" totalPage : " + totalPage) ;
                                    var pageInfo = {
                                        "totalPage" : totalPage,
                                        "perPage"   : req.query.perPage,
                                        "curPage"   : req.query.curPage,
                                     };
                                    var resBody = { "pageInfo": pageInfo, "userslist": results[0] };
                                    //console.log("resbody" + JSON.stringify(resBody));
                                    res.json(resBody);
                                    res.end();
                            }).catch(err => {
                                console.log("getUserList.. FAIL");
                                res.json({ success: false, message: "No Data" });
                                res.end();
                            });
                        });
                    } catch(exception) {
                        console.log("getUserList....... FAIL"+exception ) ;
                        res.json({ success: false, message: "FAIL" });
                        res.end();
                    }//회원
                }else {
                     res.json({ success: false, message: "No Data" });
                     res.end();
                }                
            }).catch(err => {
            res.json({ success: false, message: err });
            res.end();
            });
        });
    } catch(exception) {
        console.log("userList " + exception);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};

var useridcheck = function(req, res) {
    console.log('/user/useridCheck 패스 요청됨');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var options = {"userid": req.body.userid};
        var stmt = mapper.getStatement('userInfo', 'getUserId', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(user => {
                if (user[0]== null || user[0] == '') {
                    console.log("사용가능한 ID..1");
                    res.json({ success: false, message: "No ID" });
                    res.end();
                } else {
                    console.log("존재하는 ID..");
                    res.json({ success: true, message: "HAS ID" });
                    res.end();
                }                
             }).catch(err => {
                console.log(err);
                res.json({ success: false, message: err });
                res.end();
            });
        });
    } catch(exception) {
        console.log("useridCheck " + exception);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};


//신규사용자 등록
var insertInfo = function(req, res) {
    console.log('/users/insertinfo 패스 요청됨 ');

    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

 
        var bbs_id = req.body.bbs_id;
        var userinfo = req.body.userinfo;
        var options = { "bbs_id": bbs_id , "userinfo": userinfo };

        var stmt = mapper.getStatement('userInfo', 'insertUser', options.userinfo, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(result => {
                console.log("Insert.... OK");
                console.log(result);
                res.json({ success: true, message: "OK" });
                res.end();
             }).catch(err => {
                console.log("Insert.... FAIL");
                res.json({ success: false, message: "FAIL" });
                res.end();
            });
        });
   } catch(exception) {
        console.log("Insert " + exception);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};


//사용자정보 수정
var updateInfo = function(req, res) {
    console.log('/users/updateinfo 패스 요청됨');

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {
        var bbs_id = req.body.bbs_id;
        var userinfo = req.body.userinfo;
        var options = { "criteria": { "bbs_id": bbs_id, "userid": userinfo.oldId }, "userinfo": userinfo };

        database.UserModel.updateInfo(options, function(err) {
            if (err) {
                console.log("Update.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.dir("Update.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};


//사용자 삭제
var deleteInfo = function(req, res) {
    console.log('/users/deleteinfo 패스 요청됨.');

    var database = req.app.get('database');
    if (database.db) {
        var bbs_id = req.body.bbs_id;
        var userinfo = req.body.userinfo;
        var options = { "criteria": { "bbs_id": bbs_id, "userid": userinfo.userid }, "userinfo": userinfo };

        database.UserModel.deleteInfo(options, function(err) {
            if (err) {
                console.log("Delete.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.dir("Delete.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};


//방문자수 설정 RESET
var resetCount = function(req, res) {
    console.log('/users/resetCount 패스 요청됨.');

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {
        //방문자수 누적수 RESET
        var today_count = 0;
        var total_count = 0;
        var uDate = new Date();
        var options = { "today_count": today_count, "total_count": total_count, "updated_at": uDate };

        //방문자수 업데이트 
        database.CountModel.updateCountInfo(options, function(err) {
            if (err) {
                console.log("UpdateCountInfo.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.dir("UpdateCountInfo.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });

    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};

//사용사 설정 수정/삭제 시 비밀번호 확인
var confirmPwd = function(req, res) {
    console.log('/users/confirmPwd 패스 요청됨.');
    
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

        var userid = req.body.userid;
        var pwd = req.body.password;
    
        database.UserModel.findByUserId(userid, function(err, user) {
            if (err) {
                console.dir(err);
                res.json({ success: false, message: err });
                res.end();
            } else if (user) {
                var dbpwd = user[0].password;
                if (dbpwd == pwd) {
                    // console.log('입력한 비밀번호가 DB 비번과 일치함');
                    res.json({ success: true, message: "OK" });
                    res.end();
                } else {
                    // console.log('입력한 비밀번호가 DB 비번과 일치하지 않음.');
                    res.json({ success: false, message: "NOT CORRECT PWD" });
                    res.end();
                }
            } else {
                res.json({ success: false, message: "No Data" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};

//사용자설정 조회장비명 가져오기
var getCableList = function(req, res) {
    console.log('/users/getCableList 패스 요청됨.');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var options = {user_level : 'normal'} ;
        var stmt = mapper.getStatement('userInfo', 'findCableName', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(results => {
                var resBody = { "cablelist": results[0] };
                res.json(resBody);
                res.end();
             }).catch(err => {
                console.log("cablelist.... FAIL" + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            });
        });
    } catch(exception) {
        console.log("getCableList " + exception);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

var getPBUserList = function(req, res) {
    console.log('/users/getPBUserList 패스 요청됨.');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var startPage = req.query.perPage  * (req.query.curPage -1) ;
        var options = {
            "perPage": req.query.perPage,
            "curPage": req.query.curPage,
            "startPage" : startPage,
            "limitPage" : req.query.perPage
        };
        var stmt = mapper.getStatement('pbcables', 'countPBuser', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(count => {
            
                var stmt = mapper.getStatement('pbcables', 'findPBuser', options, {language:'sql', indent: '  '});              
                Promise.using(pool.connect(), conn => {
                    conn.queryAsync(stmt).then(results => {
                        var totalPage = Math.ceil(count[0][0].count / req.query.perPage);
                        console.log("\n PBUSER count : " + count[0] + " totalPage : " + totalPage);
                        var pageInfo = {
                            "totalPage": totalPage,
                            "perPage": req.query.perPage,
                            "curPage": req.query.curPage
                        };
                        var resBody = { "pageInfo": pageInfo, "pbuserinfo": results[0] };
                        res.json(resBody);
                        res.end();
                     }).catch(err => {
                        console.log("getPBUserList.... FAIL"+ err);
                        res.json({ success: false, message: "FAIL" });
                        res.end();
                    });
                });
             }).catch(err => {
                console.dir(err);
                res.json({ success: false, message: err });
                res.end();
            });
        });
    } catch(exception) {
        console.log("getPBUserList " + exception);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
}

var insertPBInfo = function(req, res) {
    console.log('/users/insertPBInfo 패스 요청됨 ');
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

        var name = req.body.name;
        var cable_name = req.body.cable_name;
        var options = { "name": name, "cable_name": cable_name };

        var PM = new database.PBCableModel(options);
        PM.insertPBuserInfo(function(err, result) {
            console.log('insertInfo.............');
            if (err) {
                console.log("Insert.... FAIL");
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.log("Insert.... OK");
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};



var deletePBInfo = function(req, res) {
    console.log('/users/deletePBInfo 패스 요청됨 ');

    var database = req.app.get('database');
    if (database.db) {
        var options = { "criteria": { _id: req.body._id }, "pbuserinfo": { "name": req.body.name, "cable_name": req.body.cable_name } };

        database.PBCableModel.deletePBUserInfo(options, function(err) {
            if (err) {
                console.log("Delete.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.dir("Delete.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

}

var failcntChange = function(req, res) {
    console.log('/admin/users/failcntChange 호출됨.');
    //console.log('로그인 fail count 0으로..');
    var database = req.app.get('database');
    var userid = req.query.userid; //사용자 ID
    var lockyn = req.query.lockyn; //잠김 여부
    var options = { "criteria": { "userid": userid }, "lockinfo": {"lockyn":lockyn, "loginfailcount": 0} };
    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {
        database.UserModel.failcntzero(options, function(err, user) {
            if (err) {
                res.json({ success: false, message: err });
                res.end();
            } 
            console.log("failCount made zero.... OK");
            res.json({ success: true, message: "OK" });
            res.end();
        });    
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
}

module.exports.userList = userList;
module.exports.useridcheck = useridcheck;
module.exports.insertInfo = insertInfo;
module.exports.updateInfo = updateInfo;
module.exports.deleteInfo = deleteInfo;
module.exports.resetCount = resetCount;
module.exports.confirmPwd = confirmPwd;
module.exports.getCableList = getCableList;
module.exports.getPBUserList = getPBUserList;
module.exports.insertPBInfo = insertPBInfo;
module.exports.deletePBInfo = deletePBInfo;
module.exports.failcntChange = failcntChange;