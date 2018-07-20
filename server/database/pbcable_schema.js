/*
 * 사용자설정에서 조회장비명에 대해 username과 cablename에 대한 정의
 *
 * @date 2018-04-05
 * @author shjinji
 */


var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose) {

    // 스키마 정의
    var PBCableSchema = mongoose.Schema({
        name: { type: String, trim: true, 'default': '-' }, // 고객사명
        cable_name: { type: String, trim: true, 'default': '-' }, // 조회회선이름
        created_at: { type: Date, 'default': Date.now },
        updated_at: { type: Date, 'default': Date.now }
    });

    // 모델 객체에서 사용할 수 있는 메소드 정의
    PBCableSchema.statics = {
        //PB 사용자정보 카운트 가져오기
        countPBuser: function(callback) {
            console.log('countPBuser....')
            return this.find().count().exec(callback);
        },
        //PB 사용자정보 가져오기
        findPBUSerbyChart: function(callback) {
            return this.find({}, { _id: true, name: true, cable_name: true }).exec(callback);
        },
        //PB 사용자정보 가져오기
        findPBuser: function(options, callback) {
            return this.find({}, { _id: true, name: true, cable_name: true })
                .sort({ 'name': 1 })
                .skip(Number(options.perPage) * (Number(options.curPage) - 1))
                .limit(Number(options.perPage))
                .exec(callback);
        },
        //PB 사용자정보 삭제
        deletePBUserInfo: function(options, callback) {
            return this.findOneAndRemove(options.criteria, options.pbuserinfo).exec(callback);
        },
    };

    PBCableSchema.methods = {
        //PB 사용자정보 등록
        insertPBuserInfo: function(callback) {
            return this.save(callback);
        },
    }

    console.log('PBCableSchema 정의함.');
    return PBCableSchema;
};

// module.exports에 CountSchema 객체 직접 할당
module.exports = Schema;