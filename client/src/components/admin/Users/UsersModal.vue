<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3 v-if="gubun===1"><i class="fa fa-user-plus"></i>사용자등록</h3>
                        <h3 v-if="gubun===2"><i class="fa fa-user-edit"></i>사용자수정</h3>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group input-group">
                                <label class="col-md-2 col-form-label">고객사명</label>
                                <div class="input-group-prepend">
                                    <span class="input-group-text"> <i class="far fa-user fa-fw"></i> </span>
                                </div>
                                <input type="text" class="form-control" v-model="userinfo.name" id="name" required="required">
                            </div> <!-- 고객사명// -->
                            <div v-if="gubun===1" class="form-group input-group">
                                <label class="col-md-2 col-form-label">사용자계정</label>
                                <div class="input-group-prepend">
                                    <span class="input-group-text"> <i class="far fa-id-card fa-fw"></i> </span>
                                </div>
                                <input type="text" class="form-control mod" v-model.trim="userinfo.userid" id="userid" required="required">
                                <input type="hidden" v-bind:value="userinfo.oldId" id="oldId">   <!-- 사용자 계정변경시 예전 userid// -->
                                <button type="button" class="btn btn-gray" @click="idConfirm">중복확인</button>
                            </div> <!-- 사용자계정 gubun=1 신규// -->
                            <div v-if="gubun===2" class="form-group input-group">
                                <label class="col-md-2 col-form-label">사용자계정</label>
                                <div class="input-group-prepend">
                                    <span class="input-group-text"> <i class="far fa-id-card fa-fw"></i> </span>
                                </div>
                                <input type="text" class="form-control" v-model="userinfo.userid" id="userid" required="required">
                            
                                <toggle-button v-model="userinfo.lockyn" :color="{checked: '#f44e42', unchecked: '#c6c6c6'}" :labels="{checked: '잠김', unchecked: '풀림'}" :width="80" :height="35"/> 
                                상태: <input type="text" v-model="userinfo.lockyn" style="width:50px;">
                                <input type="hidden" v-bind:value="userinfo.oldId" id="oldId">   <!-- 사용자 계정변경시 예전 userid// -->
                            </div> <!-- 사용자계정 gubun=2 변경// -->
                            <div class="form-group input-group">
                                <label class="col-md-2 col-form-label">비밀번호</label>
                                <div class="input-group-prepend">
                                    <span class="input-group-text"> <i class="fas fa-unlock-alt fa-fw"></i> </span>
                                </div>
                                <input type="password" class="form-control" v-model="userinfo.password" id="password" required="required">
                                <input type="hidden"  v-model="userinfo.oldpassword" id="oldpassword"> <!-- 비밀번호를 안보이기 하기위한  oldpassword// -->
                            </div> <!-- 사용자계정// -->
                            <div class="form-group input-group">
                                <label class="col-md-2 col-form-label">조회 장비명</label>
                                <div class="input-group-prepend">
                                    <span class="input-group-text"> <i class="fa fa-desktop fa-fw"></i> </span>
                                </div>
                                <select class="custom-select" style="max-width: 180px;" v-model="selectedCable" v-on:change="cableAdd">
                                    <option value="ALL" style="color:red">모든회원</option>
                                    <option v-for="item in cablelist" :key="item.index" :value="item.cable_name">
                                        {{item.name}}
                                    </option>    
                                </select>
                                <input type="text" class="form-control" v-model="userinfo.machine_name" id="machine_name">
                            </div> <!-- 조회 장비명// -->
                            <div class="form-group input-group">
                                <label class="col-md-2 col-form-label">접속허용IP</label>  
                                <div class="input-group-prepend">
                                    <span class="input-group-text"> <i class="far fa-hdd fa-fw"></i> </span>
                                </div>
                                <input class="form-control" v-model="userinfo.ipaddr" id="ipaddr">
                            </div> <!-- 접속허용IP// -->
                            <div class="form-group input-group">
                                <label class="col-md-2 col-form-label">접속시간</label>  
                                <div class="input-group-prepend">
                                    <span class="input-group-text"> <i class="far fa-clock fa-fw"></i> </span>
                                </div>
                                <select class="custom-select" style="max-width: 180px;" v-model="userinfo.starttime" v-on:change="changeTime">
                                    <option v-for="time in timelist" :key="time.index" :value="time.value">
                                        {{time.text}}
                                    </option>    
                                </select>
                                <select class="custom-select" style="max-width: 180px;" v-model="userinfo.endtime" v-on:change="changeTime">
                                    <option v-for="time in timelist" :key="time.index" :value="time.value">
                                        {{time.text}}
                                    </option>    
                                </select>
                                <input class="form-control" v-bind:value="conntime" readonly="readonly" id="conntime"> 
                            </div> <!-- 접속허용IP// -->
                            <div class="form-group input-group">
                                <label class="col-md-2 col-form-label">핸드폰번호</label>
                                <div class="input-group-prepend">
                                    <span class="input-group-text"> <i class="fas fa-phone fa-fw"></i> </span>
                                </div>
                                <select class="custom-select" style="max-width: 180px;" v-model="userinfo.phone">
                                    <option v-for="option in options" :key="option.index" :value="option.value">
                                        {{option.text}}
                                    </option>    
                                </select>
                                <input class="form-control" v-model="userinfo.phonenumber" id="phone">
                            </div> <!-- 핸드폰번호// -->
                            <div class="form-group input-group">
                                <label class="col-md-2 col-form-label">E-mail 주소</label>
                                <div class="input-group-prepend">
                                    <span class="input-group-text"> <i class="far fa-envelope fa-fw"></i> </span>
                                </div>
                                <input class="form-control" v-model="userinfo.email" id="email">
                            </div> <!-- 이메일주소// -->
                            <div class="form-group input-group">
                                <label class="col-md-2 col-form-label">사용자 권한</label>
                                <div class="input-group-prepend">
                                    <span class="input-group-text"> <i class="fas fa-user fa-fw"></i> </span>
                                </div>
                                <select class="custom-select" v-model="userinfo.user_level">
                                    <option value="normal">일반고객</option>
                                    <option value="admin">관리자</option>
                                    <option value="pbcable">PB회선</option>
                                    <option value="test">test계정</option>
                                </select> 
                            </div> <!-- 사용자 권한// -->
                            <div class="form-group input-group">
                                <label class="col-md-2 col-form-label">회선종류</label> 
                                <div class="form-check form-check-inline">
                                    <h5 class="lamod"><i class="fa fa-chart-line"></i> 주문&nbsp; : </h5>
                                    <div class="checkbox checkbox-primary">
                                        <input type="checkbox"  v-model="userinfo.route_gubun1" id="route_gubun1">   <!-- 서울현물 -->
                                        <label for="route_gubun1" class="form-check-label"> 서울현물</label>
                                    </div>
                                    <div class="checkbox checkbox-primary">
                                        <input type="checkbox"  v-model="userinfo.route_gubun2" id="route_gubun2">   <!-- 서울파생 -->
                                        <label for="route_gubun2" class="form-check-label"> 서울파생 </label>
                                    </div>
                                    <div class="checkbox checkbox-primary">
                                        <input type="checkbox"  v-model="userinfo.route_gubun3"  id="route_gubun3">  <!-- 부산파생 -->
                                        <label for="route_gubun3" class="form-check-label"> 부산파생 </label>
                                    </div>
                                    <div class="checkbox checkbox-primary">
                                        <input type="checkbox" v-model="userinfo.route_gubun4"  id="route_gubun4">  <!-- 주문테스트 -->
                                        <label for="route_gubun4" class="form-check-label"> 주문테스트 </label>
                                    </div>
                                </div>
                            
								<div class="form-check form-check-inline col-md-offset-2">    
									<h5 class="lamod"><i class="fa fa-chart-bar"></i> 시세&nbsp; : </h5>                          
									<div class="checkbox checkbox-primary">
										<input type="checkbox" v-model="userinfo.market_gubun1" id="market_gubun1">  <!-- 유가 -->
										<label for="market_gubun1" class="form-check-label"> 유가 </label>
									</div>
									<div class="checkbox checkbox-primary">
										<input type="checkbox" v-model="userinfo.market_gubun2" id="market_gubun2">  <!-- 코스닥 -->
										<label for="market_gubun2" class="form-check-label"> 코스닥 </label>
									</div>
									<div class="checkbox checkbox-primary">
                                        <input type="checkbox" v-model="userinfo.market_gubun3" id="market_gubun3">  <!-- ELW -->
                                        <label for="market_gubun3" class="form-check-label"> ELW </label>
                                    </div>
                                    <div class="checkbox checkbox-primary">
                                        <input type="checkbox" v-model="userinfo.market_gubun4" id="market_gubun4">  <!-- 채권 -->
                                        <label for="market_gubun4" class="form-check-label"> 채권 </label>
                                    </div>
                                    <div class="checkbox checkbox-primary">
                                        <input type="checkbox" v-model="userinfo.market_gubun5" id="market_gubun5">  <!-- 지수옵션 -->
                                        <label for="market_gubun5" class="form-check-label"> 지수옵션 </label>
                                    </div>
                                    <div class="checkbox checkbox-primary">
                                        <input type="checkbox" v-model="userinfo.market_gubun6" id="market_gubun6">  <!-- 선물 -->
                                        <label for="market_gubun6" class="form-check-label"> 선물 </label>
                                    </div>
                                    <div class="checkbox checkbox-primary">
                                        <input type="checkbox" v-model="userinfo.market_gubun7" id="market_gubun7">  <!-- 부산파생시세 -->
                                        <label for="market_gubun7" class="form-check-label"> 부산파생시세 </label>
                                    </div>
                                    <div class="checkbox checkbox-primary">
                                        <input type="checkbox" v-model="userinfo.market_gubun8" id="market_gubun8">  <!-- 시세테스트 -->
                                        <label for="market_gubun8" class="form-check-label"> 시세테스트 </label>
                                    </div>
                                </div>    
                            </div>      
                        </form>
                    </div>
                    <div class="modal-footer">
                        <div v-if="gubun===1" class="tar">
                            <button type="submit" class="btn btn-primary" @click="insertInfo">등록</button>
                        </div>
						<div v-else class="tar" role="group" >
                            <button type="submit" class="btn btn-basic" @click="confirmPwd(1)">수정</button>
                            <button type="submit" class="btn btn-basic" @click="confirmPwd(2)">삭제</button>
                        </div>
                            <button type="submit" class="btn btn-cancel" @click="closeInfo">취소</button>
					</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: ["userinfo", "gubun","cablelist"],
    data: function() {
        return {
            toggled  : false,
            pwdgubun : 0,   //비밀번호 모달 update (1) 와 delete (2) 에서 함께씀
            conntime: this.userinfo.starttime + "시 ~ "+ this.userinfo.endtime + "시",
            selectedCable: [],
            options:[
                    {text:"010",   value:"010"},
                    {text:"011",   value:"011"},
                    {text:"016",   value:"016"},
                    {text:"017",   value:"017"},
                    {text:"018",   value:"018"},
                    {text:"019",   value:"019"},
                    {text:"02",    value:"02"},
                    {text:"070",   value:"070"}
            ],
            timelist:[
                    {text:"00",   value:"0"},
                    {text:"01",   value:"1"},
                    {text:"02",   value:"2"},
                    {text:"03",   value:"3"},
                    {text:"04",   value:"4"},
                    {text:"05",   value:"5"},
                    {text:"06",   value:"6"},
                    {text:"07",   value:"7"},
                    {text:"08",   value:"8"},
                    {text:"09",   value:"9"},
                    {text:"10",   value:"10"},
                    {text:"11",   value:"11"},
                    {text:"12",   value:"12"},
                    {text:"13",   value:"13"},
                    {text:"14",   value:"14"},
                    {text:"15",   value:"15"},
                    {text:"16",   value:"16"},
                    {text:"17",   value:"17"},
                    {text:"18",   value:"18"},
                    {text:"19",   value:"19"},
                    {text:"20",   value:"20"},
                    {text:"21",   value:"21"},
                    {text:"22",   value:"22"},
                    {text:"23",   value:"23"},
                    {text:"24",   value:"24"},
            ],    
        };
    },
    mounted: function () {
        this.getCableList();
    },
    methods: {
        insertInfo: function() {
            this.userinfo.cable_name = this.userinfo.machine_name;
            this.$EventBus.$emit("insertInfo", this.userinfo);
        },
        confirmPwd: function(pwdgubun){
            this.userinfo.pwdgubun = pwdgubun;
            this.$EventBus.$emit("confirmPwd", this.userinfo);
        },
        closeInfo: function() {
            this.$EventBus.$emit("closeInfo", this.userinfo);
        },
        getCableList: function(){
            this.$EventBus.$emit("getCableList");
        },
        idConfirm: function(){
            this.$EventBus.$emit("idConfirm",this.userinfo);
        },
        cableAdd: function(){
            if(this.userinfo.machine_name===''){
                var newCable = this.userinfo.machine_name + this.selectedCable;
            }else{
                var newCable = this.userinfo.machine_name + "," +this.selectedCable;
            }
                this.userinfo.machine_name = newCable;
            //ALL을 선택했을시, PB회선 이외 다른 회원 선택 못하게..
            return this.userinfo.machine_name;
        },
        changeTime : function(){
            if(this.userinfo.starttime >= this.userinfo.endtime){
                alert('허용 시간을 다시 설정해주십시오.');
            }else{
                this.conntime= this.userinfo.starttime + "시 ~ "+ this.userinfo.endtime + "시";
            }
            return this.conntime;
        }
        
    }
};
</script>

<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 60%;
    margin: 0px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header {margin-top: 0;padding:10px 0 5px 0;color: #486bdf;border-bottom:2px solid #111;}
.modal-header h3 i::before {color:#2877c7;}
.tar {text-align:right;}
.btn-basic {background:#2877c7;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-basic:hover {background:#145392;}
.btn-cancel {background:#8c9dad;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-cancel:hover {background:#66737e;}
.btn-gray {background:#8c9dad;color:#FFF;font-size:0.9375rem;padding:6px 16px 7px;margin-left:5px;}
.btn-gray:hover {background:#66737e;}

.modal-body {
    margin: 15px 0;
    max-height: 800px;
    padding:0;
}
/* .modal-body .form-group {border-bottom:1px solid #e5e5e5;padding-bottom:15px;} */
.form-control, .custom-select {border-radius: 2px;}
.col-form-label {margin:0;padding: 5px 0 0 5px;color:#111;font-size:1.125rem}

.modal-default-button {
    float: right;
}

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

.form-check-label {
    /* padding: 0.3rem 0.5rem;
    margin:0; */
} 
.form-check {padding:3px 0 8px;}
.lamod {
    float: left;
    margin:6px 15px 0 0;
    font-size:1rem;
    color:#7290b4;
    font-weight:bold;
}
.checkbox{
    display: inline-block;
    margin-left: 0px;
    padding:0px;
}
.form-check-inline {display: inline-block;}
.checkbox label {
    display: inline-block;
    vertical-align: middle;
    position: relative;
    padding:4px 5px 0 3px;
}

.checkbox label::before {
    content: "";
    display: inline-block;
    position: absolute;
    width: 20px;
    height: 20px;
    left: -20px;
    top:6px;
    border: 1px solid #cccccc;
    border-radius: 3px;
    background-color: #fff;
    -webkit-transition: border 0.15s ease-in-out, color 0.15s ease-in-out;
    -o-transition: border 0.15s ease-in-out, color 0.15s ease-in-out;
    transition: border 0.15s ease-in-out, color 0.15s ease-in-out;
}

.checkbox label::after {
    display: inline-block;
    position: absolute;
    width: 20px;
    height: 20px;
    left: -20px;
    top: 5px;
    padding-left: 3px;
    padding-top: 5px;
    font-size: 11px;
    color: #555555;
}

.checkbox input[type="checkbox"] {
    opacity: 0;
    z-index: 1;
}

.checkbox input[type="checkbox"]:focus + label::before {
    outline: thin dotted;
    outline: 5px auto -webkit-focus-ring-color;
    outline-offset: -2px;
} 
.checkbox-primary input[type="checkbox"]:checked + label::before {
    background-color: #428bca;
    border-color: #428bca;
}

.checkbox-primary input[type="checkbox"]:checked + label::after {
    color: #fff;
}

.checkbox input[type="checkbox"]:checked + label::after {
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    content: '\f00c';
    padding-top: 3px;
    padding-left: 4px;
}

.checkbox input[type="checkbox"]:disabled + label {
    opacity: 0.65;
}

.checkbox input[type="checkbox"]:disabled + label::before {
    background-color: #eeeeee;
    cursor: not-allowed;
}
.mod{
    width: 60%;
}
@media (min-width:992px) {
    .col-md-offset-2 {margin-left:16.66666667%;}
}

</style>
