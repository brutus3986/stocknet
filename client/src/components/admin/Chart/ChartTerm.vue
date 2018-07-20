<template>
    <main>
        <div class="container">
            <form novalidate @submit.stop.prevent>
                <div class="form-inline">
                    <div class="form-group col-md-4">
                        <label for="indate" class="col-md-4 col-form-label">조회날짜</label>
                        <div class="col-md-8">
                            <input type="date" v-model="indate" id="indate" class="form-control indatemod">
                        </div>
                    </div>
                    <div class="form-group col-md-4">
                        <em class="spaceem"> ~</em>
                        <input type="date" v-model="indate1" id="indate1" class="form-control indate1mod">
                    </div>    
                    <div class="form-group col-md-4">    
                        <label for="gubun1" class="col-md-4 col-form-label pyogilabelmod">표기방식</label>
                        <div class="col-md-8">
                            <select v-model.number="gubun1" id="gubun1" class="form-control pyogiselmod"> 
                                <option value=0>전체</option>
                                <option value=1>회선사용량(bps)</option> 
                                <option value=2>회선사용률(%)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div v-if="allshow" class="form-inline">
                    <div class="form-group col-md-4">
                        <label for="gubun2" class="col-md-4 col-form-label">대분류</label>
                        <div class="col-md-8">
                            <select v-model.number="gubun2" id="gubun2" v-on:change="onLargeChange" class="form-control largeselmod"> 
                                <option value=1>주문</option>
                                <option value=2>시세</option>
                                <option value=3>PB</option> 
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-md-4">    
                        <label for="gubun3" class="col-md-4 col-form-label">중분류 </label>
                        <div class="col-md-8">
                            <select v-model.number="gubun3" id="gubun3" v-on:change="onMiddleChange" class="form-control midselmod"> 
                                <option v-if="totalshow" value=0>전체</option>
                                <option v-for="mlist in middlelist" v-bind:key="mlist.value" v-bind:value="mlist.value">
                                    {{mlist.name}}
                                </option>
                            </select>
                        </div>
                    </div>    
                    <div class="form-group col-md-4">
                        <label for="gubun4" class="col-md-4 col-form-label">회원사명 </label>
                        <div class="col-md-8">
                            <select v-model="gubun4"  class="form-control userselmod" >
                                <option value="">전체</option>
                                <option v-for="item in userlist" v-bind:key="item.index" v-bind:value="item.cable_name">
                                    {{item.name}}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>  
                <!-- <div v-if="allshow" class="form-inline">
                    <div class="form-group col-md-4">
                        <label for="gubun2" class="col-md-6 col-form-label">대분류 </label>
                        <div class="col-md-6">
                            <select v-model.number="gubun2" id="gubun2" v-on:change="onLargeChange" class="form-control largeselmod"> 
                                <option value=1>주문</option>
                                <option value=2>시세</option>
                                <option value=3>PB</option> 
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-md-4">    
                        <label for="gubun3" class="col-md-4 col-form-label midlabelmod midlabelmod">중분류 </label>
                        <div class="col-md-8">
                            <select v-model.number="gubun3" id="gubun3" v-on:change="onMiddleChange" class="form-control midselmod"> 
                                <option v-if="totalshow" value=0>전체</option>
                                <option v-for="mlist in middlelist" v-bind:key="mlist.value" v-bind:value="mlist.value">
                                    {{mlist.name}}
                                </option>
                            </select>
                        </div>
                    </div>    
                    <div class="form-group col-md-4">
                        <label for="gubun4" class="col-md-4 col-form-label userlabelmod">회원사명 </label>
                        <div class="col-md-8">
                            <select v-model="gubun4"  class="form-control userselmod" >
                                <option value="">전체</option>
                                <option v-for="item in userlist" v-bind:key="item.user_id" v-bind:value="item.cable_name">
                                    {{item.name}}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>     -->
                <div class="form-group tar">
                    <button type="submit" @click="fetchChartListTerm" class="btn btn-basic col-md-2">조회</button>
                </div>
			</form>
			<div class="tal mb20">
                <input type="button" class="btn btn-small" @click='downloadImageTerm' value="Image 전체 다운로드">
                <input type="button" class="btn btn-small" @click='downloadExcelTerm' value="Excel 전체 다운로드">
            </div>			
            <ul class="list-group">
                <li v-for="clist in chartlist" v-bind:key="clist.index" class="list-group-item" style="text-align:center;">
                    <a v-bind:href="clist.xlssrc"><img src="/assets/img/excel.jpg" title="엑셀 다운로드" border="0px" width="30"></a>
                    <img style="width:750px;" v-bind:src="clist.imgsrc">
                </li>
            </ul>
        </div>
    </main>
</template>
<script>
import Config  from "./../../../js/config.js"

export default {
    props: [],
    data() {
        return {
            indate: "",
            indate1: "",
            gubun1: 1,              // 표기방식
            gubun2: 1,              // 대분류
            gubun3: 0,              // 중분류
            gubun4: "",              // 회원사명
            filegubun: "IMAGE",
            allshow    :true,
            totalshow : true,        //주문시세 선택시 중분류 전체가능, PB 선택시 중분류 전체 선택불가
            chartlist: [],
            userlist : [],           // 회원사명
            orderlist : [
                {name:"서울현물", value:1},
                {name:"서울파생", value:2},
                {name:"부산파생", value:3},
                {name:"주문테스트", value:4},
            ],
            siselist : [
                {name:"유가", value:1},
                {name:"코스닥", value:2},
                {name:"ELW", value:3},
                {name:"채권", value:4},
                {name:"지수옵션", value:5},
                {name:"선물", value:6},
                {name:"부산파생시세", value:7},
                {name:"시세테스트", value:8},
            ],
            pblist : [
                {name:"API", value:1},
                {name:"BCP", value:2},
                {name:"채권공시", value:3},
                {name:"CTI", value:4},
                {name:"그룹웨어", value:5},
                {name:"HTS", value:6},
                {name:"인터넷", value:7},
                {name:"KOSMOS", value:8},
                {name:"MG", value:9},
                {name:"MMF", value:10},
                {name:"MTS", value:11},
                {name:"NFS", value:12},
                {name:"장외채권", value:13},
                {name:"PB", value:14},
                {name:"원장", value:15},
                {name:"기타", value:16},
            ],
            defaultlist : [],
        };
    },
    components: {
        
    },
    computed : {
        middlelist : function() {
            if(this.gubun2 == 1) return this.orderlist ;
            else if(this.gubun2 == 2) return this.siselist ;
            else if(this.gubun2 == 3) return this.pblist ;
            else return this.defaultlist;
        },
        excellist : function() {
            var tlist = this.chartlist;
        }
    },
    mounted: function () {
        this.getTodayDate() ;
        this.getUserList();
    },
    methods: {
        getTodayDate: function() {
            var dt = new Date();
            var td_year = dt.getFullYear() ;
            var td_month = dt.getMonth() + 1 ;
            var td_date = dt.getDate() ;
            if(td_month < 10) td_month = "0" + td_month ;
            if(td_date < 10) td_date = "0" + td_date ;
            this.indate = td_year + "-" + td_month + "-" + td_date ;
            this.indate1 = this.indate;
        },
        getUserList: function(){
            console.log('getUserList');
            var vm = this;
            
            axios.post(Config.base_url+'/chart/userlist', {
                "gubun2"  : this.gubun2,
                "gubun3"  : this.gubun3,
            }).then(function(response) {
                // console.log(response)
                vm.userlist = response.data.userlist;
            });
        },
        onLargeChange: function() {
            console.log('onLargeChange');
            // 대분류 선택 변경시 중분류 전체로 셋팅
            if(this.gubun2 == 1 || this.gubun2 ==2){
                this.gubun3 = 0;    //주문, 시세 선택시 중분류 전체 선택 가능
                this.totalshow = true;
            }else {
                this.gubun3 = 1;    //PB 선택시 중분류 전체 없앰. 
                this.totalshow = false;
            }
            this.getUserList();
        },
        onMiddleChange: function() {
            console.log('onMiddleChange');
            // 중분류 선택 변경시 회원 전체로 셋팅  --> 초기화 하지 않는 것이 편리할 듯
            // this.gubun4 = "";
            this.getUserList();
        },
        clearForm: function(){
            console.log('clearForm');
            this.chartlist=[];
        },
        fetchChartListTerm: function () {
            console.log("fetchChartListTerm");
            var tomonth = this.indate1.split('-');
            var frommonth = this.indate.split('-');
            var dat1 = new Date(tomonth[0], tomonth[1], tomonth[2]);  //~까지
            var dat2 = new Date(frommonth[0], frommonth[1], frommonth[2]); //~부터
            var diff = dat1 - dat2;
            var currDay = 24 * 60 * 60 * 1000;// 시 * 분 * 초 * ms 일계산
            var daydiff = parseInt(diff/currDay)
            var vm = this;
            
            if(daydiff > 91 ){
                alert('3개월이내 조회만 가능합니다.');
                vm.clearForm();
            }else{
                axios.get(Config.base_url+'/chart/chartlistterm',{
                    params: {
                        "indate": this.indate,
                        "indate1": this.indate1,
                        "gubun1": this.gubun1,
                        "gubun2": this.gubun2,
                        "gubun3": this.gubun3,
                        "gubun4": this.gubun4,
                    }
                }).then(function (response) {
                    // console.log(response);
                    var success = response.data.success ;
                    if(success) {
                        // console.log(response.data.clist);
                        var tlist = response.data.clist;
                        tlist.forEach(function(clist,index) {
                            clist.imgsrc = Config.base_url + clist.imgsrc;
                            clist.xlssrc = Config.base_url + clist.xlssrc;
                            // console.log('forEach:::imgsrc:::'+clist.imgsrc);
                        });
                        vm.chartlist = tlist;
                    }else {
                        alert(response.data.message);
                        vm.clearForm();
                    }
                });
            }
        },
        downloadImageTerm: function () {
            console.log("downloadImageTerm");
            this.filegubun = "IMAGE";
            this.downloadFileTerm();
        },
        downloadExcelTerm: function () {
            console.log("downloadExcelTerm");
            this.filegubun = "EXCEL";
            this.downloadFileTerm();
        },
        downloadFileTerm: function () {
            console.log("downloadFileTerm.");
            var vm = this;
            
            axios.get(Config.base_url+'/chart/downloadfileterm',{
                params: {
                    "indate": this.indate,
                    "indate1": this.indate1,
                    "gubun1": this.gubun1,
                    "gubun2": this.gubun2,
                    "gubun3": this.gubun3,
                    "gubun4": this.gubun4,
                    "filegubun": this.filegubun,
                }
            }).then(function (response) {
                // console.log(response);
                var success = response.data.success ;
                var filename = response.data.filename ;
                if(success) {
                    var aUrl = Config.base_url + "/public/download/" + filename;
                    // vue component 에서 window.open 인식못함
                    // 강제 link click() 이벤트 생성 - ThreeOn 2018.05.24
                    // window.open(Config.base_url+"/public/download/" + filename);
                    var link = document.createElement("a");
                    link.href = aUrl;
                    link.innerHTML = aUrl;
                    link.click();
                    // console.log("link open : " + aUrl);
                }else {
                    alert(response.data.message);
                }
            });
        },
    }
}
</script>
<style scoped>
.form-group{
    margin-bottom: 15px;
}
.form-control {border-radius: 2px;}
.indatemod{width:185px;}
.spaceem{margin-left: -30px}
.indate1mod{margin-left:30px; width:185px;}
.pyogiselmod{width:185px;}
.largeselmod{width:185px;}
.midselmod{width:185px;}
.userselmod{width:185px;}
/* 
.pyogilabelmod{margin-left: -60px;} 
.largeselmod{margin-left:-26px;width:180px;}
.userlabelmod{margin-left: -60px;}
.midlabelmod{margin-left:-40px;}
.midselmod{margin-left:-20px;width:182px;}
 */
.form-inline {padding:0;background:#f9f9f9;}
.form-inline:first-child {padding-top:20px;border-top:1px solid #dcdcdc;}
.form-inline label {color:#111;font-size:1.125rem;}
.btn{
    margin-left: 5px;  
    /* 원래450px; */
}
.btn-small {background:#8c9dad;color:#FFF;font-size:1rem;padding:2px 8px;}
.btn-small:hover {background:#7ea1c5;}
.tal {text-align:left;}
.tar {text-align:right;}
.mt20 {margin-top:20px;}
.mb20 {margin-bottom:20px;}
.btn-basic {background:#2877c7;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-basic:hover {background:#145392;}
.btn-cancel {background:#8c9dad;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-cancel:hover {background:#66737e;}
.tar::before {content:"";display:block;width:100%;height:15px;border-top:1px solid #dcdcdc;}
</style>