/*
 *  공지사항 - 회원 조회, 조회수 업데이트 - 관련 라우팅 함수 정의
 *
 * @date 2018-10-30
 * @author shjinji
 */
var Promise = require("bluebird");
var async = require('async');

//공지사항 리스트 
var listStory = function(req, res) {
    console.log('/board/liststory 패스 요청됨 user.');
 
    if(req.query.bbs_id == undefined) {
        console.log("F5 TEST..........................");
    }
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var startPage = req.query.perPage  * (req.query.curPage -1) ;

        var options = {
            "bbs_id": req.query.bbs_id ,
            "perPage": req.query.perPage,
            "curPage": req.query.curPage,
            "seloption": req.query.seloption,
            "searchinfo": req.query.searchinfo,
            "startPage": req.query.perPage  * (req.query.curPage -1),
            "limitPage" : req.query.perPage
        };
        console.log("option:" +  JSON.stringify(options));
        var stmt = mapper.getStatement('board', 'getBbsInfo', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(results => {
                    var totalPage = Math.ceil(results.length / req.query.perPage);
                    var pageInfo = {
                        "totalPage": totalPage,
                        "perPage": req.query.perPage,
                        "curPage": req.query.curPage
                    };
                    var resBody = { "pageInfo": pageInfo, "stories": results[0], "count": results[0].length,  success: true};
                    res.json(resBody);
                    res.end();
            }).catch(err => {
                console.log("findByBbsId " + err);
                res.json({
                    success: false,
                    message: err
                });
                res.end();
            });

        });
    } catch(exception) {
        console.log("listStory::: " + exception);
        res.end();
    }
    
};


// 조회수 업데이트
var updateViewCount = function(req, res) {
    console.log('updateViewCount 요청됨.');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var bbs_id = req.body.bbs_id;
        var story_id = req.body.story_id;
        var view = req.body.view;
        var options = { "bbs_id": bbs_id, "story_id": story_id , "view": view };
        var stmt = mapper.getStatement('board', 'updateViewCount', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(results => {
                console.dir("updateViewCount Update.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
             }).catch(err => {
                console.log("updateViewCount Update.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            });
        });

    } catch(exception) {
        console.log("listStory " + err);
        res.end();
    }

};


module.exports.listStory = listStory;
module.exports.updateViewCount = updateViewCount;
