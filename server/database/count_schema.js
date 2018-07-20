/*
 * 방문자수 카운팅 데이터베이스 스키마를 정의하는 모듈
 *
 * @date 2018-04-05
 * @author shjinji
 */


var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose) {

    // 스키마 정의
    var CountSchema = mongoose.Schema({
        today_count: { type: Number, 'default': 0 }, // Today visit
        total_count: { type: Number, 'default': 0 }, // Total visit
        created_at: { type: Date, 'default': Date.now },
        updated_at: { type: Date, 'default': Date.now }
    });

    // 모델 객체에서 사용할 수 있는 메소드 정의
    CountSchema.statics = {
        //오늘방문자수(),전체방문자수()를 위한 방문횟수 조회
        getVisitCount: function(callback) {
            return this.find().exec(callback);
        },
        //오늘방문자수(),전체방문자수()를 위한 방문횟수 업데이트, RESET도 함께 사용
        //로그인해서 방문자수 업데이트updateCountInfo , 사용자설정 RESET 에서 updateCountInfo (2군데 사용)
        updateCountInfo: function(options, callback) {
            return this.update(options).exec(callback);
        },

    };

    CountSchema.methods = {

    }

    console.log('CountSchema 정의함.');
    return CountSchema;
};

// module.exports에 CountSchema 객체 직접 할당
module.exports = Schema;