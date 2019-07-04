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
        console.log("option" + JSON.stringify(options));
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
        (userinfo.market_gubun1 == true)?userinfo.market_gubun1 = 1:0 ;
        (userinfo.market_gubun2 == true)?userinfo.market_gubun2 = 1:0 ;
        (userinfo.market_gubun3 == true)?userinfo.market_gubun3 = 1:0 ;
        (userinfo.market_gubun4 == true)?userinfo.market_gubun4 = 1:0 ;
        (userinfo.market_gubun5 == true)?userinfo.market_gubun5 = 1:0 ;
        (userinfo.market_gubun6 == true)?userinfo.market_gubun6 = 1:0 ;
        (userinfo.market_gubun7 == true)?userinfo.market_gubun7 = 1:0 ;
        (userinfo.market_gubun8 == true)?userinfo.market_gubun8 = 1:0 ;
        (userinfo.route_gubun1 == true)?userinfo.route_gubun1 = 1:0 ; 
        (userinfo.route_gubun2 == true)?userinfo.route_gubun2 = 1:0 ; 
        (userinfo.route_gubun3 == true)?userinfo.route_gubun3 = 1:0 ; 
        (userinfo.route_gubun4 == true)?userinfo.route_gubun4 = 1:0 ; 
        var options = { "bbs_id": bbs_id , "userinfo": userinfo };
        console.log("stmt" + JSON.stringify(options));
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
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var bbs_id = req.body.bbs_id;
        var userinfo = req.body.userinfo;
        (userinfo.market_gubun1 == true)?userinfo.market_gubun1 = 1:0 ;
        (userinfo.market_gubun2 == true)?userinfo.market_gubun2 = 1:0 ;
        (userinfo.market_gubun3 == true)?userinfo.market_gubun3 = 1:0 ;
        (userinfo.market_gubun4 == true)?userinfo.market_gubun4 = 1:0 ;
        (userinfo.market_gubun5 == true)?userinfo.market_gubun5 = 1:0 ;
        (userinfo.market_gubun6 == true)?userinfo.market_gubun6 = 1:0 ;
        (userinfo.market_gubun7 == true)?userinfo.market_gubun7 = 1:0 ;
        (userinfo.market_gubun8 == true)?userinfo.market_gubun8 = 1:0 ;
        (userinfo.route_gubun1 == true)?userinfo.route_gubun1 = 1:0 ; 
        (userinfo.route_gubun2 == true)?userinfo.route_gubun2 = 1:0 ; 
        (userinfo.route_gubun3 == true)?userinfo.route_gubun3 = 1:0 ; 
        (userinfo.route_gubun4 == true)?userinfo.route_gubun4 = 1:0 ; 
        var options = { "bbs_id": bbs_id, "userid": userinfo.oldId , "userinfo": userinfo };
        console.log("par:" + JSON.stringify(options.userinfo));
        var stmt = mapper.getStatement('userInfo', 'updateUser', options.userinfo, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(result => {
                console.dir("Update.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
             }).catch(err => {
                console.log("Update.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            });
        });
    } catch(exception) {
        console.log("updateInfo " + exception);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }


};


//사용자 삭제
var deleteInfo = function(req, res) {
    console.log('/users/deleteinfo 패스 요청됨.');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var bbs_id = req.body.bbs_id;
        var userinfo = req.body.userinfo;
        var options = { "bbs_id": bbs_id, "userid": userinfo.userid , "userinfo": userinfo };
        
        var stmt = mapper.getStatement('userInfo', 'daleteUser', options.userinfo, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(result => {
                console.dir("deleteInfo.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
             }).catch(err => {
                console.log("deleteInfo.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            });
        });

    } catch(exception) {
        console.log("deleteInfo " + exception);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};


//방문자수 설정 RESET
var resetCount = function(req, res) {
    console.log('/users/resetCount 패스 요청됨.');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var userid = req.body.userid;
        console.log("biddu" + JSON.stringify(req.body) )
        //방문자수 누적수 RESET
        var today_count = 0;
        var total_count = 0;
        var uDate = new Date();
        var options = { "userid":userid,"today_count": today_count, "total_count": total_count, "updated_at": uDate };
        var stmt = mapper.getStatement('userInfo', 'updateCountInfo', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(result => {
                console.dir("UpdateCountInfo.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
             }).catch(err => {
                console.log("UpdateCountInfo.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            });
        });


    } catch(exception) {
        console.log("resetCount " + exception);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};

//사용사 설정 수정/삭제 시 비밀번호 확인
var confirmPwd = function(req, res) {
    console.log('/users/confirmPwd 패스 요청됨.');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var userid = req.body.userid;
        var pwd = req.body.password;
        var options = { "userid": userid};   
        var stmt = mapper.getStatement('userInfo', 'findByUserId', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(user => {
                 var dbpwd = user[0][0].password;
                if (dbpwd == pwd) {
                    // console.log('입력한 비밀번호가 DB 비번과 일치함');
                    res.json({ success: true, message: "OK" });
                    res.end();
                } else {
                    // console.log('입력한 비밀번호가 DB 비번과 일치하지 않음.');
                    res.json({ success: false, message: "NOT CORRECT PWD" });
                    res.end();
                }
             }).catch(err => {
                console.dir(err);
                res.json({ success: false, message: err });
                res.end();
            });
        });
    } catch(exception) {
        console.log("/users/confirmPwd " + exception);
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
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var name = req.body.name;
        var cable_name = req.body.cable_name;
        var options = { "name": name, "cable_name": cable_name };
        var stmt = mapper.getStatement('pbcables', 'insertPBuserInfo', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(results => {
                console.log("Insert.... OK");
                res.json({ success: true, message: "OK" });
                res.end();
             }).catch(err => {
                console.log("Insert.... FAIL");
                res.json({ success: false, message: "FAIL" });
                res.end();
            });
        });
    } catch(exception) {
        console.log("insertPBInfo " + exception);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};



var deletePBInfo = function(req, res) {
    console.log('/users/deletePBInfo 패스 요청됨 ');

    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var options = { "name": req.body.name, "cable_name": req.body.cable_name  };
        var stmt = mapper.getStatement('pbcables', 'deletePBUserInfo', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(results => {
                console.dir("Delete.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
             }).catch(err => {
                console.log("Delete.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            });
        });
    } catch(exception) {
        console.log("deletePBInfo " + exception);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

}

var failcntChange = function(req, res) {
    console.log('/admin/users/failcntChange 호출됨.');
    //console.log('로그인 fail count 0으로..');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var userid = req.query.userid; //사용자 ID
        var lockyn = req.query.lockyn; //잠김 여부
        var options = { "userid": userid , "lockinfo": {"lockyn":lockyn, "loginfailcount": 0} };
        var stmt = mapper.getStatement('userInfo', 'failcntzero', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(results => {
                console.log("failCount made zero.... OK");
                res.json({ success: true, message: "OK" });
                res.end();
             }).catch(err => {
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