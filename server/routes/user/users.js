/*
 * 사용자 - 회원 비밀번호 변경 - 관련 라우팅 함수 정의
 *
 * @date 2018-10-30
 * @author shjinji
 */

//사용자 - 일반 고객 비밀번호 변경
var changePwd = function(req, res) {
    console.log('일반사용자 changePwd 호출됨.');

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

        var userid = req.body.userid; //사용자 ID
        var pwdInfo = req.body.pwdInfo;
        var orgpassword = req.body.orgpassword; //기존비밀번호
        var options = { "criteria": { "userid": userid }, "pwdInfo": pwdInfo };

        database.UserModel.getOrginPwd(options, function(err, result) {

            if (err) {
                res.json({ success: false, message: err });
                res.end();
            } else if (result) {
                console.log(result);
                var orginPwd = result[0].password;
    
                if (orgpassword == orginPwd) {
                    database.UserModel.changePwd(options, function(err) {
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
                    console.log("Update.... FAIL " + err);
                    res.json({ success: false, message: "Wrong Origin Password" });
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
}


module.exports.changePwd = changePwd;
