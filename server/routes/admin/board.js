/*
 * 공지사항을 위한 라우팅 함수 정의
 *
 * @date 2018-04-05
 * @author shjinji
 */
var Promise = require("bluebird");
var async = require('async');


//공지사항 리스트 
var listStory = function(req, res) {
    console.log('/board/liststory 패스 요청됨 admn.');
 
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
        console.log("listStory " + err);
    }
    
};


//공지사항 신규등록
var insertStory = function(req, res) {
    console.log('/board/insertstory 패스 요청됨.');

    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var bbs_id = req.body.bbs_id;
        var storyInfo = req.body.storyinfo;
        (storyInfo.notice == true)?storyInfo.notice = '1':storyInfo.notice = '' ; 
        (storyInfo.comp_name == null || storyInfo.comp_name == undefined)?storyInfo.comp_name='': storyInfo.comp_name= storyInfo.comp_name;
        (storyInfo.comp_no == null || storyInfo.comp_no== undefined)?storyInfo.comp_no='': storyInfo.comp_no= storyInfo.comp_no;
        var options = {  "bbs_id": bbs_id , "storyinfo": storyInfo };
        var stmt = mapper.getStatement('board', 'getMaxStoryId', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(result => {
                 if(result[0] === null){
                    var maxStoryId = 1;
                }else{
                    var maxStoryId = result[0][0].story_id + 1;
                }
                
                options.storyinfo.story_id = maxStoryId;
                storyInfo.story_id = maxStoryId;
                //게시물입력
                try {
                    console.log(JSON.stringify(storyInfo));
                    var stmt = mapper.getStatement('board', 'insertStory', storyInfo, {language:'sql', indent: '  '});
                    console.log(stmt);
                    Promise.using(pool.connect(), conn => {
                        conn.queryAsync(stmt).then(rows => {
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
                    console.log("Insert2.... FAIL");
                    res.json({ success: false, message: "FAIL" });
                    res.end();
                }//게시물입력
            }).catch(err => {
                res.json({ success: false, message: err });
                res.end();
            });
        });
    } catch(exception) {
        console.log("insertStory " + err);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};

//공지사항 게시글 수정
var updateStory = function(req, res) {
    console.log('/board/updatestory 패스 요청됨.');

    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var bbs_id = req.body.bbs_id;
        var storyInfo = req.body.storyinfo;
        var options = {  "bbs_id": bbs_id , "storyinfo": storyInfo };
        (storyInfo.notice == true)?storyInfo.notice = '1':storyInfo.notice = '' ; 
        (storyInfo.comp_name == null || storyInfo.comp_name == undefined)?storyInfo.comp_name='': storyInfo.comp_name= storyInfo.comp_name;
        (storyInfo.comp_no == null || storyInfo.comp_no== undefined)?storyInfo.comp_no='': storyInfo.comp_no= storyInfo.comp_no;
        console.log("storyInfo" + JSON.stringify(storyInfo));
        var stmt = mapper.getStatement('board', 'updateStory', storyInfo, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                console.log("Update.... OK");
                res.json({ success: true, message: "OK" });
                res.end();
            }).catch(err => {
                console.log("Update.... FAIL");
                res.json({ success: false, message: "FAIL" });
                res.end();
            });
        });
    } catch(exception) {
        console.log("updateViewCount Update.... FAIL");
        res.json({ success: false, message: "DB connection Error" });
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
        var options = { "bbs_id": bbs_id, "story_id": story_id };
        console.log("option   :::" +  JSON.stringify(options));
        var stmt = mapper.getStatement('board', 'updateViewCount',options , {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                console.log("updateViewCount Update.... OK");
                res.json({ success: true, message: "OK" });
                res.end();
            }).catch(err => {
                console.log("updateViewCount Update.... FAIL");
                res.json({ success: false, message: "FAIL" });
                res.end();
            });
        });
     } catch(exception) {
        console.log("updateViewCount Update.... FAIL");
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }


};

//공지사항 게시글 삭제
var deleteStory = function(req, res) {
    console.log('/board/deletestory 패스 요청됨.');
    try {

        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var bbs_id = req.body.bbs_id;
        var storyInfo = req.body.storyinfo;
        
        var options = { "bbs_id": bbs_id, "story_id": storyInfo.story_id };
        console.log("option   :::" +  JSON.stringify(options));
        var stmt = mapper.getStatement('board', 'deleteStory',options , {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                console.log("deleteStory Update.... OK");
                res.json({ success: true, message: "OK" });
                res.end();
            }).catch(err => {
                console.log("deleteStory Update.... FAIL");
                res.json({ success: false, message: "FAIL" });
                res.end();
            });
        });
     } catch(exception) {
        console.log("deleteStory " + err);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};
module.exports.listStory = listStory;
module.exports.insertStory = insertStory;
module.exports.updateStory = updateStory;
module.exports.updateViewCount = updateViewCount;
module.exports.deleteStory = deleteStory;