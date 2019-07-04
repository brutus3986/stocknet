<template>
    <main>
        <div class="container">
            <br>
            <div class="form">   
                <div class="total-num">
					<span class="count"> 오늘방문자수 : <em>( {{today_count}} )</em> &nbsp; 누적수 : <em>( {{total_count}} )</em>
                        <button type="submit" class="btn btn-small" @click="resetModal"> RESET </button>
                    </span>
                </div>   
                <div class="search">     <!-- 고객사명으로 검색  -->
                    <div class="form-group">
                        <select v-model="seloption" class="form-control">
                            <option v-for="option in options" :key="option.index" :value="option.value">
                                {{option.text}}
                            </option>    
                        </select>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" v-model.trim="searchinfo" v-on:keyup.enter="fetchUsersList"/>
                    </div>    
                </div>       
            </div>
            <commonModal v-if="resetCountModal"></commonModal>
            <br> 
            <UsersTable :userslist="userslist"></UsersTable>
            <div class="paging-row">
                <div class="pginnerdiv">
                    <ul class="pagination">
                        <li class="page-item"><a class="page-link"  @click="prevInfo"> &lt;&lt; </a></li>
                        <li v-for="curPage in totalPage" v-bind:key="curPage.index">
                            <a class="page-link curpage"  @click="setPage(curPage)">
                                {{curPage}}
                            </a>
                        </li> 
                        <li class="page-item"><a class="page-link"  @click="nextInfo"> &gt;&gt; </a></li>
                    </ul>
                </div>       
            </div>
			<p class="tar">
                <button @click="addUsers" class="btn btn-basic">사용자추가</button>
                <button @click="addPBUsers" class="btn btn-basic">PB회원추가</button>
            </p>
            <UsersModal v-if="showModal" :userinfo="userinfo" :gubun="modalgubun" :cablelist="cablelist"></UsersModal>
            <PBUsersModal v-if="pbModal" :pbuserinfo="pbuserinfo" :totalPage="totalPage"></PBUsersModal>    <!-- totalPage.. 진짜 매번 넘겨주는걸 까먹는다... -->
            <pwdModal  v-if="pwdModal" :userinfo="userinfo"></pwdModal>
        </div>
    </main>
</template>
<script>
import  Config       from  './../../../js/config.js'
import  commonModal  from  './../../common/commonModal.vue'
import  UsersTable   from  './UsersTable.vue'
import  UsersModal   from  './UsersModal.vue'
import  PBUsersModal from  './PBUsersModal.vue'
import  pwdModal     from  './pwdModal.vue'

export default {
    props:[],
    data:function(){
        return{
            //사용자 설정 : 2
            bbs_id    : 2,
            curPage   : 1,
            totalPage : 0,
            perPage   : 10,
            showModal : false,
            pbModal   : false,
            resetCountModal:false,
            pwdModal  : false,
            modalgubun: 0,
            userslist :[],
            pbuserinfo:{},
            userinfo  :{},
            cablelist :[],
            today_count : 0,
            total_count : 0,
            idcheckgubun : 0,
            searchinfo:'',
            seloption: 'name',
            options:[
                {text:"고객사명",   value:"name"},
                {text:"사용자계정", value:"userid"},
            ]
        } 
    },
    components: {
        UsersTable   : UsersTable,
        UsersModal   : UsersModal,
        PBUsersModal : PBUsersModal,
        commonModal  : commonModal,
        pwdModal     : pwdModal
    },
    computed:{
/*        
        filtered: function(){
            var selectinfo = this.seloption;
            var sinfo = this.searchinfo;
            
            if(selectinfo==="name"){
                return this.userslist.filter(function(userslist,index){
                    if(userslist.name.indexOf(sinfo) > -1){
                        return true;
                    }
                })
            }else if (selectinfo==="userid"){
                return this.userslist.filter(function(userslist,index){
                    if(userslist.userid.indexOf(sinfo) > -1){
                    return true;
                    }
                })
            }
        },
*/        
    },
    mounted : function(){
        this.fetchUsersList()
        this.getVisitCount()
    },
    created: function() {
        // this.$EventBus.$on('updateInfo'  , this.updateInfo );
        // this.$EventBus.$on('deleteInfo'   , this.deleteInfo );
        this.$EventBus.$on('idConfirm', this.idConfirm);     //ID중복확인
        this.$EventBus.$on('insertInfo'  , this.insertInfo );
        this.$EventBus.$on('closeInfo'    , this.closeInfo  );   //사용자정보 MODAL 닫기
        this.$EventBus.$on('showInfo'     , this.showInfo   );
        this.$EventBus.$on('resetCount'   , this.resetCount );
        this.$EventBus.$on('closeModal'   , this.closeModal );   //RESET MODAL 닫기  closepwd
        this.$EventBus.$on('confirmPwd'   , this.confirmPwd); 
        this.$EventBus.$on('enterPwd'     , this.enterPwd);
        this.$EventBus.$on('closePwd'     , this.closePwd); 
        this.$EventBus.$on('getCableList' , this.getCableList);   //조회장비명 추가
        this.$EventBus.$on('getPBUserList', this.getPBUserList);
        this.$EventBus.$on('insertPBInfo' , this.insertPBInfo);
        this.$EventBus.$on('deletePBInfo' , this.deletePBInfo);
        this.$EventBus.$on('prevPBInfo' , this.prevPBInfo);
        this.$EventBus.$on('setPBPage' , this.setPBPage);
        this.$EventBus.$on('nextPBInfo' , this.nextPBInfo);
    },
    beforeDestroy() {
        // this.$EventBus.$off('updateInfo');
        // this.$EventBus.$off('deleteInfo');
        this.$EventBus.$off('idConfirm');
        this.$EventBus.$off('insertInfo');
        this.$EventBus.$off('closeInfo' );
        this.$EventBus.$off('showInfo'  );
        this.$EventBus.$off('resetCount');
        this.$EventBus.$off('closeModal');
        this.$EventBus.$off('confirmPwd');
        this.$EventBus.$off('enterPwd');
        this.$EventBus.$off('closePwd');
        this.$EventBus.$off('getCableList');
        this.$EventBus.$off('getPBUserList');
        this.$EventBus.$off('insertPBInfo');
        this.$EventBus.$off('deletePBInfo');
        this.$EventBus.$off('prevPBInfo');
        this.$EventBus.$off('setPBPage');
        this.$EventBus.$off('nextPBInfo');
    },
    methods:{
        fetchUsersList: function(){
            console.log('fetchUsersList');
            var vm = this;
            
            axios.get(Config.base_url+'/users/userlist',{
                params: {
                    "seloption" : vm.seloption,
                    "searchinfo" : vm.searchinfo,
                    "curPage": vm.curPage,
                    "perPage": vm.perPage
                }
            }).then(function(response){
                // console.log(response);
                var tlist = response.data.userslist;
                //변경일자 자르기
                tlist.forEach(function(user, index) {
                    // console.log('변경일자 자르기 전: ' +user.updated_at);
                    user.updated_at = user.updated_at.substring(0, 10);
                });
                vm.userslist = tlist;
                vm.totalPage = response.data.pageInfo.totalPage;
            })
        },
        getCableList: function(){
            console.log('getCableList');
            var vm = this;
            
            axios.get(Config.base_url+'/getCableList').then(function(response){
                // console.log(response);
                vm.cablelist = response.data.cablelist;
            });
        },
        getPBUserList: function(){
            console.log('getPBUserList');
            var vm = this;
            
            axios.get(Config.base_url+'/getPBUserList',{
                params: {
                    "curPage": this.curPage,
                    "perPage": this.perPage
                }
            }).then(function(response){
                // console.log(response);
                vm.pbuserinfo = response.data.pbuserinfo;
                vm.totalPage = response.data.pageInfo.totalPage;
            });
        },
        insertPBInfo: function(pbuserinfo){
            console.log('insertPBInfo');
            var newname = pbuserinfo.newname;
            var newcable_name = pbuserinfo.newcable_name;
            var vm = this;
            
            axios.post(Config.base_url+'/users/insertpbinfo', {
                "name"       : newname,
                "cable_name" : newcable_name
            }).then(function(response) {
                // console.log(response);
                vm.getPBUserList();
            });
        },
        deletePBInfo: function(user){
            console.log('deletePBInfo');
            var pbusername = user.name;
            var pbuserid = user._id;
            var pbusercable_name = user.cable_name;
            var vm = this;
            
            axios.post(Config.base_url+'/users/deletepbinfo', {
                "_id"   : pbuserid,
                "name"   : pbusername,
                "cable_name"   : pbusercable_name,
            }).then(function(response) {
                // console.log(response);
                vm.getPBUserList();
            });
        },
        getVisitCount:function(){
            console.log('getVisitCount');
            var vm = this;
            var dt = new Date();
            var td_year = dt.getFullYear() ;
            var td_month = dt.getMonth() + 1 ;
            var td_date = dt.getDate() ;
            if(td_month < 10) td_month = "0" + td_month ;
            if(td_date < 10) td_date = "0" + td_date ;
            var indate = td_year +'-'+ td_month +'-'+ td_date ;
             axios.post(Config.base_url+'/updatevisitcount',{
                    vueDate : indate,
                    gubun   : 2   ,//사용자설정 화면 구분 : 2 , 로그인 후 업데이트 구분 : 1
                    userid  : this.$store.state.user.userid
            }).then(function(response){
                 console.log(response.data.dayCount);
                vm.today_count = response.data.dayCount;
                vm.total_count = response.data.totalCount;
            });
        },
        resetModal: function(){
            console.log('resetModal');
            var vm = this;
            vm.resetCountModal = true;
        },
        resetCount:function(){
            console.log('resetCount');
            var vm = this;
            vm.resetCountModal = false;
            
            axios.post(Config.base_url+'/resetcount',{
                userid  : this.$store.state.user.userid
            }).then(function(response){
                // console.log(response);
                vm.getVisitCount();
            });
        },
        closeModal: function() {
            console.log('closeModal');
            var vm = this;
            vm.resetCountModal = false;
        },
        clearInfo : function(){
            console.log('clearInfo');
            this.modalgubun = 1;        // 신규 1, 수정 2
            this.userinfo = {
                "bbs_id"         : 2 ,
                "userid"         : "",
                "oldId"          : "",
                "name"           : "",
                "password"       : "",
                "oldpassword"    : "",
                "phone"          : "",
                "phonenumber"    : "",
                "email"          : "",
                "ipaddr"         : "",    
                "machine_name"   : "",
                "starttime"      : 8,
                "endtime"        : 18,
                "conntime"       :"",
                "user_level"     : "normal",
                "lockyn"         : 0,
                "loginfailcount" : 0,
                "route_gubun1"   : 1,     // 서울현물
                "route_gubun2"   : 1,     // 서울파생
                "route_gubun3"   : 1,     // 부산파생
                "route_gubun4"   : 1,     // 주문테스트
                "market_gubun1"  : 1,     // 유가
                "market_gubun2"  : 1,     // 코스닥
                "market_gubun3"  : 1,     // ELW
                "market_gubun4"  : 1,     // 채권
                "market_gubun5"  : 1,     // 지수옵션
                "market_gubun6"  : 1,     // 선물
                "market_gubun7"  : 1,     // 부산파생시세
                "market_gubun8"  : 1,     // 시세테스트
            };
        },
        addUsers : function(){
            console.log("addUsers");
            this.clearInfo();
            this.showModal = true;    
        },
        addPBUsers : function(){
            console.log("addPBUsers");
            this.pbModal = true;
        },
        showInfo: function(user) {
            console.log("showInfo");
            this.modalgubun = 2;    // 신규 1, 수정 2
            this.showModal  = true;
            this.userinfo.userid        = user.userid;              // 사용자계정
            this.userinfo.oldId         = user.userid;              // userid 변경시 원래의 userid
            this.userinfo.name          = user.name;                // 고객명
            this.userinfo.password      = "";
            this.userinfo.oldpassword   = user.password;            // 사용자 비밀번호 변경시 
            this.userinfo.phone         = user.phone;               // 핸드폰 앞번호
            this.userinfo.phonenumber   = user.phonenumber;         // 핸드폰 나머지 번호
            this.userinfo.email         = user.email;               // E-mail주소
            this.userinfo.ipaddr        = user.ipaddr;              // 접속허용  IP
            this.userinfo.starttime     = user.starttime;           // 접속가능시간 to
            this.userinfo.endtime       = user.endtime;             // 접속가능시간 from
            this.userinfo.user_level    = user.user_level;          // 유저 레벨 (일반고객, 관리자)
            this.userinfo.lockyn        = user.lockyn;              // 계정 잠김여부
            this.userinfo.machine_name  = user.machine_name;        // 조회 장비명
            this.userinfo.route_gubun1  = user.route_gubun1;        // 서울현물 
            this.userinfo.route_gubun2  = user.route_gubun2;        // 서울파생
            this.userinfo.route_gubun3  = user.route_gubun3;        // 부산파생
            this.userinfo.route_gubun4  = user.route_gubun4;        // 주문테스트
            this.userinfo.market_gubun1 = user.market_gubun1;       // 유가
            this.userinfo.market_gubun2 = user.market_gubun2;       // 코스닥
            this.userinfo.market_gubun3 = user.market_gubun3;       // ELW
            this.userinfo.market_gubun4 = user.market_gubun4;       // 채권
            this.userinfo.market_gubun5 = user.market_gubun5;       // 지수옵션
            this.userinfo.market_gubun6 = user.market_gubun6;       // 선물
            this.userinfo.market_gubun7 = user.market_gubun7;       // 부산파생시세
            this.userinfo.market_gubun8 = user.market_gubun8;       // 시세테스트
        },
        idConfirm : function(userinfo) {
            console.log('idConfirm');
            var idch = userinfo.userid;
            var vm = this;
            
            if(idch == ''){
                alert('ID를 입력하세요.');
            }else{
                axios.post(Config.base_url+'/users/idconfirm', {
                    "userid" : idch
                }).then(function(response) {
                    // console.log(response);
                    if(response.data.success==true){
                        alert('존재하는 ID 입니다.');
                    }else{
                        vm.idcheckgubun = 1; // 중복인증 구분
                        alert('사용가능한 ID 입니다.');
                    }
                });
            }
        },
        insertInfo: function(userinfo) {
            console.log('insertInfo');
            var vm = this;
            var checkinfo_id = userinfo.userid;
            var checkinfo_password = userinfo.password;
            var checkinfo_name = userinfo.name;
            
            if(checkinfo_id=='' || checkinfo_password=='' || checkinfo_name==''){
                vm.idcheckgubun = 0;
                alert('필수 입력사항을 입력해 주십시오.');
            }else if(vm.idcheckgubun==0){
                alert('ID 중복체크를 해주십시오.');
            }else{
                vm.showModal = false;
                axios.post(Config.base_url+'/users/insertinfo', {
                    "bbs_id"   : this.bbs_id,
                    "userinfo" : userinfo
                }).then(function(response) {
                    // console.log(response);
                    vm.fetchUsersList();
                });
            }
        },
        //수정, 삭제 시 비밀번호 모달
        confirmPwd: function(){
            console.log('confirmPwd');
            var vm = this;
            vm.pwdModal = true;
        },
        //비밀번호 입력 확인
        enterPwd : function(userinfo){
            console.log('enterPwd');
            var adminid = this.$store.state.user.userid;
            var vm = this;
            vm.pwdModal = false;
            var adminpwd = userinfo.m_password;
            var pwdgubun = userinfo.pwdgubun;
                        
            axios.post(Config.base_url+'/confirmpassword',{
                "userid"  : adminid ,   
                "password": adminpwd
            }).then(function(response){
                // console.log(response);
                if(response.data.success==false){
                    alert('비밀번호가 틀립니다.');
                }else{
                    if(pwdgubun==1){   //1:수정 수정, 삭제 비밀번호 확인 모달창을 같이 써서 구분.
                        vm.updateInfo(userinfo);
                    }else {  //2:삭제
                        vm.deleteInfo(userinfo);
                    }
                }
            });
        },
        updateInfo: function(userinfo) {
            console.log('updateInfo');
             if(userinfo.password===''){
                this.userinfo.password = userinfo.oldpassword;
            }else{
                this.userinfo.password = userinfo.password;
            }
            var vm = this;
            vm.showModal = false;
            userinfo.updated_at  = Date.now();
            
            axios.post(Config.base_url+'/users/updateInfo', {
                "bbs_id"   : this.bbs_id,
                "userinfo" : userinfo
            }).then(function(response) {
                // console.log(response);
                vm.fetchUsersList();
            });
        },
        deleteInfo: function(userinfo) {
            console.log("deleteInfo");
            var vm = this;
            vm.showModal = false;
            
            axios.post(Config.base_url+'/users/deleteinfo', {
                "bbs_id"   : this.bbs_id,
                "userinfo" : userinfo
            }).then(function(response) {
                // console.log(response);
                vm.fetchUsersList();
            });
        },
        closeInfo: function() {
            console.log('closeInfo');
            var vm = this;
            vm.showModal = false;
            vm.pbModal = false;
        },
        closePwd:function(){
            console.log('closePwd');
            var vm = this;
            vm.pwdModal = false;
        },
        prevInfo: function() {
            if (this.curPage > 1) {
                this.curPage -= 1;
                this.fetchUsersList();
            }
        },
        setPage : function(curPage){
            this.curPage = curPage;
            this.fetchUsersList();
        },
        nextInfo: function() {
            if (this.totalPage > this.curPage) {
                this.curPage += 1;
                this.fetchUsersList();
            }
        },
        //PB회원설정 페이지네비게이션
        prevPBInfo: function() {
            if (this.curPage > 1) {
                this.curPage -= 1;
                this.getPBUserList();
            }
        },
        setPBPage : function(curPage){
            this.curPage = curPage;
            this.getPBUserList();
        },
        nextPBInfo: function() {
            if (this.totalPage > this.curPage) {
                this.curPage += 1;
                this.getPBUserList();
            }
        },
    }
}
</script>
<style scoped>
.form {display:block;padding-bottom: 1rem;}
.total-num {float:left;}
.search {float:right;}
.form-group {display: inline-block;}
.form-control {border-radius: 2px;}
.count{color:#777;font-size: 1.25rem;}
.count em {color:#1577da;font-style: normal;font-weight: bold;}
.btn-small {background:#8c9dad;color:#FFF;font-size:0.75rem;padding:2px 8px;}
.btn-small:hover {background:#7ea1c5;}
.btn{
    margin-left: 10px;
}
.pagetext {
    padding: 5px 30px 0px 30px;
}

.mod {
    margin-left : 15px;
}

.search{
    margin-left : 160px;
}

.paging-row {
    width: 100%;
    text-align : center;
}
.pginnerdiv{
    display: inline-block;
}
ul.pagination li {display: inline;}

ul.pagination li a {
    color: rgb(32, 32, 32);
    float: left;
    padding: 8px 16px;
    text-decoration: none;
    transition: background-color .3s;
    border: 1px solid #ddd;
}
ul li a:hover, ul li a:focus {  
    color:#fff;  
    border:1px solid rgb(228, 219, 217);  
    background-color:rgb(228, 219, 217);   
}
ul.pagination li a:hover:not(.active) {background-color: #ddd;}
.tar {text-align:right;}
.btn-basic {background:#2877c7;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-basic:hover {background:#145392;}
</style>

