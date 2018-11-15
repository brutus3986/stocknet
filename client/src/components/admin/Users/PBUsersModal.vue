<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3><i class="fa fa-user-friends"></i> PB회원 리스트</h3>
                    </div>
                    <div class="modal-body">
                        <div class="form-group form-inline">
                             <div class="col-md-6">
                                <input class="form-control searchname" placeholder="이름" v-model="newname" type="text">
                            </div>
                           
                            <div class="col-md-6">
                                <input class="form-control searchcablename" placeholder="파일명"  v-model="newcable_name" type="text">
                            </div>
                        </div>
                       <table class="table tbl-stocknet2">
                            <thead class="thead-default">
                                <tr class="info">
                                    <th>PB회원명</th>
                                    <th>트래픽조회파일명</th>
                                    <th style="display:none">ID</th>
                                    <th>설정</th>
                                </tr>
                            </thead>
                            <tbody> 
                                <tr v-for="user in pbuserinfo" v-bind:key="user._id" >
                                    <td>
                                        {{user.name}}
                                    </td>
                                    <td>
                                        {{user.cable_name}}
                                    </td>
                                    <td style="display:none">
                                        {{user._id}}
                                    </td>
									<td>
                                        <i @click="deletePBInfo(user)"  class="fas fa-trash-alt"></i>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="paging-row">
                        <div class="pginnerdiv">
                            <ul class="pagination">
                                <li class="page-item"><a class="page-link"  @click="prevPBInfo"> &lt;&lt; </a></li>
                                <li v-for="curPage in totalPage" v-bind:key="curPage.index">
                                    <a class="page-link curPage"  @click="setPBPage(curPage)">
                                        {{curPage}}
                                    </a>
                                </li> 
                                <li class="page-item"><a class="page-link"  @click="nextPBInfo"> &gt;&gt; </a></li>
                            </ul>
                        </div>       
                    </div>
                    <div class="modal-footer">
                        <div class="row" role="group" >
                            <button type="submit" class="btn btn-basic" @click="insertPBInfo">등록</button>
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
    props: ["pbuserinfo","totalPage"],
    data: function(){
        return{
            newname:'',
            newcable_name:'',
        }
    },
    mounted: function () {
        this.getPBUserList();
    },
    methods: {
        insertPBInfo: function() {
            this.pbuserinfo.newname= this.newname;
            this.pbuserinfo.newcable_name= this.newcable_name;
            this.clearInfo();
            this.$EventBus.$emit("insertPBInfo", this.pbuserinfo);
        },
        deletePBInfo: function(user) {
            this.$EventBus.$emit("deletePBInfo", user);
        },
        closeInfo: function() {
            this.$EventBus.$emit("closeInfo",this.pbuserinfo);
        },
        getPBUserList: function(){
            this.$EventBus.$emit("getPBUserList",this.pbuserinfo);
        },
        clearInfo : function(){
            this.newname = '';
            this.newcable_name = '';
        },
        prevPBInfo: function(){
            this.$EventBus.$emit("prevPBInfo",this.pbuserinfo);
        },
        setPBPage: function(curPage){
            this.$EventBus.$emit("setPBPage",curPage);
        },
        nextPBInfo: function(){
            this.$EventBus.$emit("nextPBInfo",this.pbuserinfo);
        },


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
    width: 45%;
    margin: 0px auto;
    padding: 25px;
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

.modal-body {
    margin: 15px 0px;
    max-height: 550px;
    overflow-y:auto;
    padding:0;
}

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
.searchname{
    margin-top: 5px;
    margin-left: 100px;
    margin-bottom: 5px;
    width: 70%;
}
.searchcablename{
    margin-top: 5px;
    margin-left: 10px;
    margin-bottom: 5px;
    width: 70%;
}

.mod{
     margin-left : 60px;
}
.paging-row {
    width: 100%;
    text-align : center;
}
.pginnerdiv{
    display: inline-block;
}

.pagination > li > a {
    color: rgb(32, 32, 32);
    /* float: left; */
    /* float: none; */
    padding: 6px 12px;
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

.form-control, .custom-select {border-radius: 2px;}
.tbl-stocknet2 {border-top:2px solid #111;}
.tbl-stocknet2 thead th {background:#f9f9f9;border-left:1px solid #dcdcdc;border-bottom:1px solid #dcdcdc;text-align:center;color:#111;font-size:1.0625rem;font-weight: normal;}
.tbl-stocknet2 thead th:first-child {border-left:none;}
.tbl-stocknet2 thead th, .tbl-stocknet2 tbody td {padding:8px 10px 9px;vertical-align: middle}
.tbl-stocknet2 tbody td {border-bottom:1px solid #dcdcdc;text-align:center;}
.tbl-stocknet2 tbody td.tal {text-align:left;}
.tbl-stocknet2 i {cursor: pointer;}
.tbl-stocknet2 i:hover {color:#486bdf;}

</style>