/*
 * 공지사항 데이터베이스 스키마를 정의하는 모듈
 *
 * @date 2018-04-05
 * @author shjinji
 */


var Schema = {};

Schema.createSchema = function(mongoose) {

    // 스키마 정의
    var BoardSchema = mongoose.Schema({
        bbs_id: { type: Number, required: true, index: 'hashed', 'default': '' }, // BBS_ID
        story_id: { type: Number, required: true, index: 'hashed', 'default': 0 }, // STORY_ID
        title: { type: String, required: true, 'default': '' }, // 공지사항 제목
        contents: { type: String, required: true, 'default': '' }, // 공지사항 내용   
        writer: { type: String, required: true, 'default': '' }, // 등록자
        view: { type: Number, 'default': 0 }, // 조회수
        created_at: { type: Date, index: { unique: false }, 'default': Date.now }, // created_at
        updated_at: { type: Date, index: { unique: false }, 'default': Date.now }, // updated_at
        display: { type: Boolean, 'default': true },
        notice: { type: Boolean, 'default': false } // 공지 글 구분(checkbox)
    });

    // 값이 유효한지 확인하는 함수 정의
    var validatePresenceOf = function(value) {
        return value && value.length;
    };

    // 모델 객체에서 사용할 수 있는 메소드 정의
    BoardSchema.statics = {
        //bbsid로 조회
        findByBbsId: function(options, callback) {
            return this.find(options.criteria)
                .sort({ 'notice': -1, 'story_id': -1 })
                .skip(Number(options.perPage) * (Number(options.curPage) - 1))
                .limit(Number(options.perPage))
                .exec(callback);
        },
        //bbsid로 카운트
        countByBbsId: function(options, callback) {
            return this.find(options.criteria).count().exec(callback);
        },
        //다음공지사항 등록을 위한 storyid max값 조회
        getMaxStoryId: function(options, callback) {
            return this.findOne(options.criteria).sort({ story_id: -1 }).exec(callback);
        },
        //공지사항 업데이트
        updateStory: function(options, callback) {
            return this.findOneAndUpdate(options.criteria, options.storyinfo).exec(callback);
        },
        updateViewCount: function(options, callback) {
            // console.log('options.view....'+options.view);
            return this.updateOne(options.criteria, { $set: { view: options.view } }).exec(callback);
        },
        // 공지사항 삭제
        deleteStory: function(options, callback) {
            return this.findOneAndRemove(options.criteria, options.storyinfo).exec(callback);
        },
    }

    BoardSchema.methods = {
        insertStory: function(callback) {
            return this.save(callback);
        },
    }
    return BoardSchema;
};

// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;