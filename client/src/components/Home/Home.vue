<template>
    <div class="container_net">
        <LoginForm></LoginForm>
        <div class="container cog">  
            <div class="row">
                <div class="col-md-3 col-sm-6">  
                    <div class="icontxt">
                        <a>
                        <h4>증권망 서비스</h4>
                        <p>증권,파생 주문 및 체결 시세제공 전용서비스</p>
                        <i class="fa fa-cog fa-5x"></i>
                        </a>
                    </div>
                </div>       
                <div class="col-md-3 col-sm-6"> 
                    <div class="icontxt">
                        <a>
                        <h4>전송 서비스 </h4>
                        <p>고객전용 사설네트워크</p>
                        <i class="fa fa-random fa-5x"></i>
                        </a>
                    </div>                                         
                </div>
                <div class="col-md-3 col-sm-6"> 
                    <div class="icontxt">
                        <a>
                        <h4>DWDM 서비스</h4>
                        <p>초고속 광네트워크를 이용한 네트워크 DR솔루션</p>
                        <i class="fa fa-road fa-5x"></i>
                        </a>
                    </div> 
                </div>
                <div class="col-md-3 col-sm-6"> 
                    <div class="icontxt">
                        <a>
                        <h4>유지보수 서비스</h4>
                        <p>단말회선 장비에 대한 통합유지보수 서비스</p>
                        <i class="fa fa-wrench fa-5x"></i>
                        </a>
                    </div>
                </div>
        </div>
        </div>
        <div id="about_1"></div>
        <header class="content1">  <!-- about start-->
            <div class="container">
                <h1><small>Stock-Net은 전국규모의 초고속 광통신 인프라에 기반한</small><br/>
                 <strong>자본시장 전용의 네트워크 서비스</strong><small>입니다.</small></h1>
                <p>주요고객은 금융투자업계 및 일반법인, 유관기관 등으로 420여개사가 서비스 이용중에 있습니다.</p>
            </div><!-- end .container -->
        </header> 
        <div class="container about" >
            <div class="row">
                <div class="col-md-offset-1 col-md-6">
                    <img src="/assets/img/about1.png" alt="" class="img-responsive">
                </div>
                <div class="col-md-offset-1 col-md-5">
                    <br><br><br>
                    <p> Stock-Net은 전국 규모의 초고속 광통신 인프라에
                    기반한 증권&middot;파생시장 주문 및 체결, 시세제공 목적의 자본시장 전용 네트워크 서비스 입니다.</p>
                    <p> 전국 단위의 금융투자회사 본&middot;지점용 전송망, DR(Disaster Recovery)망, 초고속 인터넷 공급망(ISP),
                    글로벌 금융거래를 위한 해외망 연동, 정부&middot;유관기관과의 연동, 유지보수 등 토털 네트워크 서비스를
                    제공하고 있습니다.
                    </p>
                </div>
            </div>
        <hr>
            <div class="row">
                <div class="col-md-offset-1 col-md-5">
                    <br><br><br><br>
                    <p> 통신장비의 이중화, 통신경로의 다원화, 증권망 통제센터 및 네트워크 백업센터
                    운용 등을 통해 24시간 사전장애감지 및 실시간 백업체계 제공으로 최고의 속도와 안정성, 업무의 연속성을
                    보장합니다.
                    </p>
                </div>
                <div class="col-md-6 col-md-offset-1">
                    <img src="/assets/img/about2.png" alt="" class="img-responsive imgs">
                </div>
            </div>
        </div>
        <div class="footer address">
            ㈜코스콤 네트워크 운영팀 : 02-767-7128 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; COPYRIGHT&#169; KOSCOM CORP. ALL RIGHTS RESERVED.
        </div>
        <LoginNoticeModal v-if="showModal"></LoginNoticeModal>
    </div>
</template> 

<script>
import LoginForm        from './LoginForm.vue';
import LoginNoticeModal from './LoginNoticeModal.vue';
import MainHeader       from './../common/MainHeader.vue'

export default {
    data() {
        return {
            showModal : true,
        };
    },
    // props: ['logoutGubun'],
    components: {
        LoginForm: LoginForm,
        LoginNoticeModal:LoginNoticeModal,
        // MainHeader:MainHeader
    },
    beforeCreate() {
        this.$forceupdate;
    },
    created: function() {
        //  if(this.gubun){
        //     console.log('로그아웃을 한번이라도 한 상태 : ')
        //     this.showModal = false;
        // }else{
        //     console.log('처음 방문 : ')
        //     this.showModal = true;
        // }
        // this.$EventBus.$on('logout'  , this.logout );
        this.$EventBus.$on('popClose'    , this.popClose  );   //리뉴얼 공지팝업 MODAL 닫기
    },
    beforeDestroy() {
        this.$EventBus.$off('popClose');
        // this.$EventBus.$off('logout');
    },    
    methods: {
        popClose: function() {
            console.log('popClose');
            this.showModal = false;
        },
        // logout: function(logoutGubun){
        //     console.log('logout : '+ logoutGubun);
        //     this.gubun = logoutGubun;
        //     this.showModal = false;
        // }
    }
}
</script>

<style scoped>
a:hover { 
    text-decoration: none;
}      
.control { 
    position: inherit; 
    top: 50%; 
    z-index: 5; 
    display: inline-block; 
    right: 50%;
} 
header { 
    color: #fff; 
    text-align: center; 
    padding: 80px 0;
    word-break: keep-all;
}
header h1 {letter-spacing: -0.025em;line-height: 1.5em;}
header small {color: #fff;padding-bottom:4px;border-bottom:1px solid #fff;}
header strong {color: #fff;padding-bottom:2px;border-bottom:1px solid #fff;}
header p {color: #C0C0C0; margin-top:50px;
}
.sans {  
    font-family: 'Source Sans Pro', sans-serif; 
}
/*  icons */
.service {
    margin: 40px 0;
}
.service a { 
    display: block;
}
.cog .row {padding-bottom:70px;}
.icontxt { 
    display: block; 
    text-align: left;
    padding:0 30px 0 0;
    word-break:keep-all;
    margin-top:60px;
} 
.icontxt h4 {
    color:#2877c7;
    font-weight: bold; 
    font-family: 'Source Sans Pro'; 
    font-size: 24px; 
    text-transform: uppercase;
}
.icontxt p {color:#777;margin-top:20px;}
.icontxt a h4+p {min-height:70px;}
.icontxt a i {display:block;text-align: right;color:#538cc6;padding-right:20px;}
.icons {      
    float: left;
    display: block;
    font-size: 30px;
    color: #fff;
    background-color: #FF8000;
    border-radius: 50%;
    text-align: center;
    margin-right: 15px ;
    padding: 20px;
    border:4px solid #FF8040;
    transition: all 0.3s;
}  
.service a:hover .icons  { 
    background-color:#0080C0;
}
.service a:hover .icontxt h4 { 
    color: #0080FF; 
}
.about p { 
    line-height: 1.8em; 
    font-size: 18px; 
    color: #282923;
    margin: 0 0 10px;
}
.about .image {
    margin-left: auto; 
    margin-right: auto; 
    display: block;
}
.about  { 
    padding: 50px 0;
}
#about_1 { 
    margin-top: -85px; 
    padding-top: 85px 
}  /*  nav-fix 때문에 생기는 공백 상쇄 */

.footer {
    padding : 20px ;
    background-color : #151616;
    color : #ffffff;
    text-align : center ;
}
.content1 {
    background:url(/assets/img/slide-bg.jpg)  no-repeat center top fixed;
    background-size:cover; 
}
/*Waypoints
========================================================================== */
.wp1 { visibility: hidden; }
.bounceInLeft, .bounceInRight, .fadeInUp, .fadeInUpDelay, .fadeInDown, .fadeInUpD, .fadeInLeft, .fadeInRight { visibility: visible; }
.delay-05s { animation-delay: 0.5s; -webkit-animation-delay: 0.5s; }
.delay-1s { animation-delay: 1s; -webkit-animation-delay: 1s; }
/*
==========================================*/

.rounded-circle{
    margin-left: 50px;
    margin-bottom: 1rem;
}
.imgs{
    margin-left: 100px;
    width: 100%;
}
/* @media */

@media  (min-width: 768px) {
    .icons { 
        margin: 0 auto; 
        position: relative; 
        left: 30%;
    }
    .row div .icontxt {border-right:1px solid #e5e5e5;}
    .row div:last-child .icontxt {border-right:none;}
    .icontxt a i {position: relative;bottom:0;}

}
@media (max-width: 767px) {
    .row div .icontxt {text-align:center;}
    .icontxt a h4+p {min-height:140px;}
    .icontxt a i {display:block;text-align: center;color:#538cc6;padding-right:0;}
}
@media (max-width: 767px) {
    .icontxt p { 
        display: none; 
    }
    .icontxt {
        line-height:10px; 
        padding: 0; 
        margin: 0;
    }
    .icontxt h4+p { 
        display: none; 
    }
    .icons { 
        padding: 20px; 
        margin: 10px 0 10px 20px; 
    }
    .book img { 
        width: 50%; 
        height: auto;
    }
    .control { 
        display: none;
    } 
}

</style>