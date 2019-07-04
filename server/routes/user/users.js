/*
 * 사용자 - 회원 비밀번호 변경 - 관련 라우팅 함수 정의
 *
 * @date 2018-10-30
 * @author shjinji
 */
var Promise = require("bluebird");
var async = require('async');


//사용자 - 일반 고객 비밀번호 변경
var changePwd = function(req, res) {
    console.log('일반사용자 changePwd 호출됨.');

    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var userid = req.body.userid; //사용자 ID
        var pwdInfo = req.body.pwdInfo;
        pwdInfo.userid = userid;
        var orgpassword = req.body.orgpassword; //기존비밀번호
        var options = { "userid": userid , "pwdInfo": pwdInfo };
        console.log("option:" + JSON.stringify(options)) ;
        var stmt = mapper.getStatement('userInfo', 'getOrginPwd', options.pwdInfo, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(result => {
                var orginPwd = result[0][0].password;
                if (orgpassword == orginPwd) {
                    var stmt = mapper.getStatement('userInfo', 'changePwd', options.pwdInfo, {language:'sql', indent: '  '});
                    console.log(stmt);
                    Promise.using(pool.connect(), conn => {
                        conn.queryAsync(stmt).then(user => {
                            console.dir("Update.... OK ");
                            res.json({ success: true, message: "OK" });
                            res.end();
                         }).catch(err => {
                            console.log("Update.... FAIL " + err);
                            res.json({ success: false, message: "FAIL" });
                            res.end();
                        });
                    });
                    
                } else {
                    console.log("Password Update.... FAIL " );
                    res.json({ success: false, message: "Wrong Origin Password" });
                    res.end();
                }

             }).catch(err => {
                console.log(err);
                res.json({ success: false, message: err });
                res.end();
            });
        });

    } catch(exception) {
        console.log("changePwd " + exception);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
}


module.exports.changePwd = changePwd;
