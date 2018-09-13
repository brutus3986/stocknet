<template>
    <div class="login"> <!-- login start-->
        <div class="overlay"> 
            <div class="container">
                <div class="logo">
                </div>
                <div class="row">
                    <div class="col-md-12 mx-auto title">
                        <span class="word-8rem">STOCK-NET</span>
                        <h2>초고속 통신망 서비스</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 col-md-offset-4 mx-auto">
                        <form novalidate @submit.stop.prevent>
                            <div class="form-group">
                                <input type="text" class="form-login" placeholder="USER ID" name="userid" v-model="userid" autofocus/>
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-login" placeholder="PASSWORD" name="password" v-model="password">
                            </div>
                            <div>
                                <button type="submit" class="btn btn-block btn-lg btn-login" v-on:click="loginWithInfo()">로그인</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="contact">
                    <p>웹서비스 가입문의 : 네트워크 운영팀 02-767-7128</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Config   from "./../../js/config.js"
import Constant from "./../../store/constant.js"

export default {
    props: [],
    data() {
      return {
        userid   : "",
        password : "",
        count:0,
        };
    },
    computed: {
        idcompare: function () {
            if(this.connewpassword !== this.newpassword) {  //비밀번호 같지않음.
                this.disabledBtn = true
                return true;    // 두개의 값이 달라야 true가 되어 is invalid class active
            }else{   //비밀번호 같음.
                this.disabledBtn = false
                return false;
            }
        },
    },
    methods: {
        loginWithInfo(event) {
            console.log('loginWithInfo');
            var vm = this;
            console.log('카운트 ....' + vm.count);
            if (this.loginExceptionHandler()) return true;
            axios.post(Config.base_url+'/login', {
                userid   : vm.userid,
                password : vm.password,
                count : vm.count,
            }).then(function(response) {
                vm.clearForm();
                if(response.data.success == true) {
                    // console.log(response.data);
                    var userid = response.data.userid;
                    vm.updateVisitCount();              // 방문자수 업데이트 (v_count 컬렉션)
                    vm.loginCount(userid);              // 당일접속 업데이트 (users 컬렉션)
                    vm.$store.commit(Constant.ADD_USER, {
                    userid: response.data.userid, 
                    username: response.data.username, 
                    user_level:response.data.user_level, 
                    machine_name:response.data.machine_name,
                    grpgubun:{  route_gubun1:response.data.route_gubun1,
                                route_gubun2:response.data.route_gubun2,
                                route_gubun3:response.data.route_gubun3,
                                route_gubun4:response.data.route_gubun4,
                                market_gubun1:response.data.market_gubun1,
                                market_gubun2:response.data.market_gubun2,
                                market_gubun3:response.data.market_gubun3,
                                market_gubun4:response.data.market_gubun4,
                                market_gubun5:response.data.market_gubun5,
                                market_gubun6:response.data.market_gubun6,
                                market_gubun7:response.data.market_gubun7,
                                market_gubun8:response.data.market_gubun8
                            }//market_gubun9:response.data.market_gubun9
                    });
                    var user_level = response.data.user_level;
                    
                    //관리자와 일반유저 구분
                    if(user_level==="admin"){
                        vm.$router.push({
                            path: "/admin/notice"
                        });
                    }else{
                        vm.$router.push({
                            path: "/user/notice"
                        });
                    }
                }else if(response.data.message == 'No Auth IP' ) {    //승인되지 않은 IP
                     alert("승인되지 않은 IP입니다.");
                }else if(response.data.message == 'No Auth TIME' ) {  //승인되지 않은 접속시간
                     alert("승인되지 않은 시간입니다.");
                }else if(response.data.message == 'lock' ) {  //계정 잠김 상태
                     alert("비밀번호 5회 이상 잘못 입력으로 인해 계정이 잠겼습니다. 관리자에게 문의주시기 바랍니다. 신광섭 ( 02-767-7128 )");
                }else if(response.data.message == 'NOT USER' ) {  //계정이 존재하지 않음
                     alert("존재하지 않는 ID 입니다.");
                }else if(response.data.message == 'WRONG PASSWD' ){
                    var cnt = response.data.cnt;
                    alert("비밀번호가 일치하지 않습니다. 5회 중 "+ cnt +"회 틀림.");
                    
                    // if(vm.cnt>=5){
                    //      axios.post(Config.base_url+'/wrongpasswd', {
                    //         userid   : vm.userid,
                    //         lockyn   : true
                    //     })
                    // }
                }
            });
        },
        updateVisitCount : function(){
            console.log('updateVisitCount');
            var dt = new Date();
            var td_year = dt.getFullYear() ;
            var td_month = dt.getMonth() + 1 ;
            var td_date = dt.getDate() ;
            if(td_month < 10) td_month = "0" + td_month ;
            if(td_date < 10) td_date = "0" + td_date ;
            var indate = td_year +'-'+ td_month +'-'+ td_date ;

            axios.get(Config.base_url+'/updatevisitcount',{
                params: {
                    'vueDate': indate,
                    'gubun'  : 1                   //로그인 구분 : 로그인하면 방문자수가 올라가는데 사용자 설정 화면에서도 카운트가 올라가지 않게 하기 위해
                }
            }).then(function(response){
                // console.log(response);
            });
        },
        loginCount: function(userid){
            console.log('loginCount');
            var dt = new Date();
            var td_year = dt.getFullYear() ;
            var td_month = dt.getMonth() + 1 ;
            var td_date = dt.getDate() ;
            if(td_month < 10) td_month = "0" + td_month ;
            if(td_date < 10) td_date = "0" + td_date ;
            var indate = td_year +'-'+ td_month +'-'+ td_date ;
            
            axios.get(Config.base_url+'/logincount',{
                params: {
                    'userid' : userid,
                    'vueDate': indate,
                }
            }).then(function(response){
                // console.log(response);
            });

        },
        loginExceptionHandler() {
            if (this.userid === "" || this.password === "") {
                alert("계정과 비밀번호를 입력해주세요.");
                return true;
            }
            return false;
        },
        clearForm() {
            this.userid   = "";
            this.password = "";
        }
    }
  };


</script>

<style scoped>

.login {
    color: #fff; text-align: center; 
    background:url(/assets/img/login-bg.jpg)  no-repeat center top ;
    background-size:cover; 
    padding-top: 0rem;
    padding-bottom: 0rem; 
}

.login .logo {
    position: absolute;
    top: 20px;
    left: 30px;
}

.login .overlay {
    position: relative;
    /* background-color: #12181e;
    background-size:cover; 
    opacity: 0.9;   */
}

.login .title {
    padding-top: 8rem;
    padding-bottom: 4rem; 
}

.login form {
    padding-bottom: 7rem; 
}

.login .word-8rem {
    font-size : 5rem;
    font-weight:500;  
}
.login .form-login {
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #FFF;
    background:rgba(0,0,0,0.3);
    background-clip: padding-box;
    border: 1px solid #9ab5d0;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.login .form-login::placeholder {color:#9ab5d0;}
.login .form-login:focus {background:rgba(0,127,255,0.2);border: 1px solid #FFF;}
.login .btn-login {background:#2c6daf;color:#fff;}
.login .btn-login:hover {background:#077ff6;}
.login .contact {
    text-align: right;
}
.contact p {
    padding-bottom: 1rem;
    color:#dadada;
}
/* input[type="text" ] {
    -webkit-text-security: disc !important;
} */
.login input:-webkit-autofill {
    /* background-color: rgb(250, 255, 189) !important;
    background-image: none !important;
    color: rgb(0, 0, 0) !important; */
    /* -webkit-box-shadow: 0 0 0 100px rgba(0,127,255,0.2) inset;
    -moz-box-shadow: 0 0 0 100px rgba(0,127,255,0.2) inset; */
    box-shadow: 0px 0px 0px rgba(0,0,0,0.3) inset;
    /* background:rgba(0,127,255,0.2)!important;border: 1px solid #FFF!important; */
}

</style>
