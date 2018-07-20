/**
 * 패스포트 라우팅 함수 정의
 *
 * @date 2016-11-10
 * @author Mike
 */
  
module.exports = function(router, passport) {
    console.log('user_passport 호출됨.');


    // 홈 화면
    router.route('/').get(function(req, res) {
        console.log('/ 패스 요청됨..............');
        // res.render('./user/index.ejs', {message: req.flash('loginMessage')});
        res.render('./user/index.html', {message: req.flash('loginMessage')});
    });
        
    // 관리자 홈 화면
    router.route('/admin').get(function(req, res) {
        console.log('/admin 패스 요청됨..............');
        res.render('./admin/index.ejs', {message: req.flash('loginMessage')});
    });
        

    // 로그인 인증
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect : '/board', 
        failureRedirect : '/', 
        failureFlash : true 
    }));

    // 관리자 로그인 인증
    router.route('/adminlogin').post(passport.authenticate('admin-login', {
        successRedirect : '/admin/user', 
        failureRedirect : '/admin', 
        failureFlash : true 
    }));
    
    // 로그아웃
    router.route('/logout').get(function(req, res) {
        console.log('/logout 패스 요청됨.');
        req.logout();
        res.redirect('/');
    });

    // 관리자 로그아웃
    router.route('/adminlogout').get(function(req, res) {
        console.log('/admin/logout 패스 요청됨.');
        req.logout();
        res.redirect('/admin');
    });

    // 홈 화면
    /*    
    router.route('/').get(function(req, res) {
        console.log('/ 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('index.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('index.ejs', {login_success:true});
        }
    });
    */    

    // 회원가입 화면
    /*
    router.route('/signup').get(function(req, res) {
        console.log('/signup 패스 요청됨.');
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });
    */
        
    // 프로필 화면
    /*
    router.route('/profile').get(function(req, res) {
        console.log('/profile 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/profile 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('profile.ejs', {user: req.user[0]._doc});
            } else {
                res.render('profile.ejs', {user: req.user});
            }
        }
    });
    */
    
};