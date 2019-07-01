/*
 *  공지사항 - 회원 조회, 조회수 업데이트 - 관련 라우팅 함수 정의
 *
 * @date 2018-10-30
 * @author shjinji
 */


//공지사항 리스트 
var listStory = function(req, res) {
    console.log('/board/liststory 패스 요청됨. user');

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {
        var options = {
            "criteria": { "bbs_id": req.query.bbs_id },
            "perPage": req.query.perPage,
            "curPage": req.query.curPage
        };
        
        if(req.query.searchinfo != '') {
            console.log(req.query.searchinfo)
           
            var sinfo = '.*' + req.query.searchinfo + '*.';
            if(req.query.seloption == 'title') {
                options.criteria = { $and: [ { bbs_id: req.query.bbs_id }, { title : {$regex : sinfo, $options:"i" }} ] };
            }else if(req.query.seloption == 'writer') {
                options.criteria = { $and: [ { bbs_id: req.query.bbs_id }, { writer : {$regex : sinfo, $options:"i" }} ] };
            }else {
                options.criteria = { $and: [ { bbs_id: req.query.bbs_id }, { contents : {$regex : sinfo, $options:"i" }} ] };
            }
        }

        database.BoardModel.countByBbsId(options, function(err, count) {
            if (err) {
                console.dir(err);
                res.json({ success: false, message: err });
                res.end();
            } else if (count) {
                // console.log('검색어와 일치합니다..'+count);
                database.BoardModel.findByBbsId(options, function(err, results) {
                    //console.log(results);
                    var totalPage = Math.ceil(count / req.query.perPage);
                    console.log("count : " + count + " totalPage : " + totalPage);
                    var pageInfo = {
                        "totalPage": totalPage,
                        "perPage": req.query.perPage,
                        "curPage": req.query.curPage
                    };
                    var resBody = { "pageInfo": pageInfo, "stories": results, "count": count };
                    res.json(resBody);
                    res.end();
                });
            } else {
                // console.log('일치하는 데이터가 없습니다!!');
                res.json({ success: false, message: "No Data" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};


// 조회수 업데이트
var updateViewCount = function(req, res) {
    console.log('updateViewCount 요청됨.');

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

        var bbs_id = req.body.bbs_id;
        var story_id = req.body.story_id;
        var view = req.body.view;
        var options = { "criteria": { "bbs_id": bbs_id, "story_id": story_id }, "view": view };

        database.BoardModel.updateViewCount(options, function(err) {
            if (err) {
                console.log("updateViewCount Update.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.dir("updateViewCount Update.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};


module.exports.listStory = listStory;
module.exports.updateViewCount = updateViewCount;
