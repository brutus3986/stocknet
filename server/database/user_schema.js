/*
 * 사용자설정 데이터베이스 스키마를 정의하는 모듈
 *
 * @date 2018-04-05
 * @author shjinji
 */


var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose) {
    // 스키마 정의
    var UserSchema = mongoose.Schema({

        bbs_id: { type: Number, required: true, index: 'hashed', 'default': 0 },
        userid: { type: String, unique: true, required: true, trim: true }, // 사용자계정
        password: { type: String, 'default': '' }, // 비밀번호
        hashed_password: { type: String, 'default': '' },
        user_level: { type: String, 'default': 'normal' }, // 관리자 혹은 일반사용자
        name: { type: String, index: 'hashed', trim: true, 'default': '-' }, // 고객사명
        machine_name: { type: String, index: 'hashed', trim: true, 'default': '-' }, // 조회장비명  (SK,BOOKOOK을 보겠다)
        cable_name: { type: String, index: 'hashed', trim: true, 'default': '-' }, // 파일명 이름 (씨티증권 : CITI)
        phone: { type: String, index: 'hashed', trim: true, 'default': '-' }, // 핸드폰 앞번호
        phonenumber: { type: String, index: 'hashed', trim: true, 'default': '-' }, // 핸드폰 나머지 번호
        email: { type: String, index: 'hashed', trim: true, 'default': '-' }, // EMAIL
        ipaddr: { type: String, trim: true, 'default': '-' }, // IPADDR
        grpcode: { type: String, trim: true, 'default': '-' }, // 상품코드
        starttime: { type: Number, 'default': 00 }, // 접속시간  to 
        endtime: { type: Number, 'default': 00 }, // 접속시간 from
        loginfailcount: { type: Number, 'default': 0 }, // 계정마다 로그인 fail count
        lockyn: { type: Boolean, 'default': false }, // 계정잠김여부 
        route_gubun1: { type: Boolean, 'default': false }, // 서울현물
        route_gubun2: { type: Boolean, 'default': false }, // 서울파생
        route_gubun3: { type: Boolean, 'default': false }, // 부산파생
        route_gubun4: { type: Boolean, 'default': false }, // 주문테스트
        market_gubun1: { type: Boolean, 'default': false }, // 유가
        market_gubun2: { type: Boolean, 'default': false }, // 코스닥
        market_gubun3: { type: Boolean, 'default': false }, // ELW
        market_gubun4: { type: Boolean, 'default': false }, // 채권
        market_gubun5: { type: Boolean, 'default': false }, // 지수옵션
        market_gubun6: { type: Boolean, 'default': false }, // 선물
        market_gubun7: { type: Boolean, 'default': false }, // 부산파생시세
        market_gubun8: { type: Boolean, 'default': false }, // 시세테스트
        pb_gubun1: { type: Boolean, 'default': false }, // PB
        pb_gubun2: { type: Boolean, 'default': false }, // API
        pb_gubun3: { type: Boolean, 'default': false }, // DR
        today_visit: { type: Number, 'default': 0 }, // Today visit
        total_visit: { type: Number, 'default': 0 }, // Total visit
        salt: { type: String, 'default': '' },
        created_at: { type: Date, index: { unique: false }, 'default': Date.now },
        updated_at: { type: Date, index: { unique: false }, 'default': Date.now },
        last_visitday: { type: Date, index: { unique: false }, 'default': Date.now }, // 마지막 방문 날짜
    });

    // 내부 공통함수 정의
    var validatePresenceOf = function(value) {
        return value && value.length;
    };
    var makeSalt = function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    }

    var encryptPassword = function(plainText, inSalt) {
        if (inSalt) {
            return crypto.createHash('sha256', inSalt).update(plainText).digest('base64');
        } else {
            return crypto.createHash('sha256', this.salt).update(plainText).digest('base64');
        }
    }

    // 주석풀어야함. password를 사용하려고 주석처리

    // password를 virtual 메소드로 정의 : MongoDB에 저장되지 않는 편리한 속성임. 특정 속성을 지정하고 set, get 메소드를 정의함
    // UserSchema
    //   .virtual('password')
    //   .set(function(password) {
    //     this._password = password;
    //     this.salt = makeSalt();
    //     this.hashed_password = encryptPassword(password, this.salt);
    //     console.log('virtual password 호출됨 : ' + this.hashed_password);
    //   })
    //   .get(function() { return this._password });


    // 입력된 칼럼의 값이 있는지 확인
    UserSchema.path('userid').validate(function(userid) {
        return userid.length;
    }, 'userid 칼럼의 값이 없습니다.');

    // 모델 객체에서 사용할 수 있는 메소드 정의
    UserSchema.statics = {
        //로그인하려는 ID가 존재하는지 확인
        checkByUserID: function(userid, callback) {
            return this.findOne({userid:userid}, {loginfailcount: 1,lockyn:2}).exec(callback);
        },
        //로그인 (ID체크) login.js에서 사용
        loginByUser: function(options, callback) {
            console.log(options.criteria);
            return this.find(options.criteria).exec(callback);
        },
        //로그인 실패 시,카운트 업데이트 
        countPlus: function(userid, callback) {
            return this.findOneAndUpdate({"userid":userid}, { $inc: { "loginfailcount": 1 } }).exec(callback);
        },
        // 5번 비밀번호 틀림 -> 계정 잠김
        loginfaillock: function(userid, callback) {
            return this.findOneAndUpdate({"userid":userid},  {"lockyn": true } ).exec(callback);
        },
        //게시판구분(bbsid)으로 조회
        countByBbsId: function(options, callback) {
            return this.find(options.criteria).count().exec(callback);
        },
        //userid로 조회 (사용사 설정 수정/삭제 시 비밀번호 확인)  
        findByUserId: function(userid, callback) {
            return this.find({ userid }).exec(callback);
        },
        //전체 사용자 가져오기
        findAll: function(options, callback) {
            return this.find(options.criteria)
                // .sort({'userid': -1})
                .sort({ 'updated_at': -1 })
                .skip(Number(options.perPage) * (Number(options.curPage) - 1))
                .limit(Number(options.perPage))
                .exec(callback);
        },
        //신규사용자 ID 중복확인 왜 빈 객체로 보이지............[] 처리요망
        // idcheck: function(userid, callback) {
        //     return this.find({ userid: { $exists: false } }).exec(callback);
        // },
        //사용자정보 수정
        updateInfo: function(options, callback) {
            return this.findOneAndUpdate(options.criteria, options.userinfo).exec(callback);
        },
        //사용자정보 삭제
        deleteInfo: function(options, callback) {
            return this.findOneAndRemove(options.criteria, options.userinfo).exec(callback);
        },
        //기존 비밀번호 확인
        getOrginPwd: function(options, callback) {
            return this.find(options.criteria).exec(callback);
        },
        //일반사용자 비밀번호 변경
        changePwd: function(options, callback) {
            return this.findOneAndUpdate(options.criteria, options.pwdInfo).exec(callback);
        },
        //userid로 방문횟수 조회 login.js에서 사용
        userVisitCount: function(options, callback) {
            return this.find(options.criteria).exec(callback);
        },
        //로그인 시 방문 업데이트 login.js에서 사용
        updateCount: function(useroptions, callback) {
            return this.update(useroptions.criteria, useroptions.userview).exec(callback);
        },
        // 사용자설정 조회케이블 목록에 사용
        findCableName: function(user_level, callback) {
            return this.find({ user_level }, { _id: 0, name: 1, cable_name: 2 }).sort({'name':1}).exec(callback);
        },
        //대분류,중분류에 따른 회원사명 가져오기
        // getUserByGubun : function(options,callback){
        //     return this.find(options,{_id:0,userid:1,name:2}).exec(callback);
        // },
        getUserByGubun: function(options, callback) {
            return this.find(options, { _id: false, userid: true, name: true, cable_name: true }).exec(callback);
        },
        //어떻게 사용하지..
        authenticate: function(plainText, inSalt, hashed_password) {
            if (inSalt) {
                console.log('inSalt authenticate 호출됨 : %s -> %s : %s', plainText, encryptPassword(plainText, inSalt), hashed_password);
                return encryptPassword(plainText, inSalt) === hashed_password;
            } else {
                console.log('authenticate 호출됨 : %s -> %s : %s', plainText, encryptPassword(plainText), this.hashed_password);
                return encryptPassword(plainText) === this.hashed_password;
            }
        }
    };

    UserSchema.methods = {
        insertInfo: function(callback) {
            return this.save(callback);
        },
    }
    console.log('UserSchema 정의함.');
    return UserSchema;
};

// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;