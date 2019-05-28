<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3><i class="fas fa-edit"></i>&nbsp;&nbsp;공지사항</h3>
                    </div>
                    <div class="modal-body">
                        <p class="bodymod">
                        <br/>
                        안녕하십니까, 코스콤 네트워크 운영팀입니다.<br/>
                        <br/>
                        7월 16일 부로 <strong>"코스콤 회선 트래픽 웹서비스"</strong> &nbsp;홈페이지가<br/>
                        <br/>
                        개편되었습니다. 사용자 접속 계정의 비밀번호가 <span style="color:red;font-weight:bold">초기화</span> 되었으니<br/>
                        <br/>
                        최초 접속시, 코스콤 담당자께 반드시 문의 주시기 바랍니다.<br/>
                        <br/>
                        </p>
                        <p style="margin-left:25px;">
                        <i class="fas fa-check fa-fw"></i>
                        코스콤 회선 트래픽 웹서비스는 크롬(Chrome), 익스플로러 </p>
                        <p style="margin-left:50px;"> 11버전(ie11)에 최적화 되어 있습니다.</p>
                        <br/>
                        <p style="margin-left:25px;">
                        <i class="fas fa-check fa-fw"></i>
                        사용자 비밀번호를 <span style="color:red;font-weight:bold"> 5회</span> 잘못 입력한 경우, 서비스 이용에 </p>
                        <p style="margin-left:50px;">제한이 됩니다.</p>
                        <br/>
                        <p style="margin-left:25px;">
                        <i class="fas fa-user fa-fw"></i>
                        담당자 :  &nbsp;신광섭 과장 ( 02-767-7128 / ksshin@koscom.co.kr)<br/>
                        <p class="space_mod">양현중 대리 ( 02-767-7119 / yang@koscom.co.kr)</p>
                    </div>
                    <div class="modal-footer">
                        <div class="tar" role="group" >
                            <button type="submit" class="btn btn-basic" @click="popClose">확인</button>
                        </div>
					</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: [],
    data: function() {
        return {
        };
    },
    methods: {
        popClose: function() {
            this.$EventBus.$emit("popClose");
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
    width: 580px;
    height: 710px;
    margin: 0px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
    font-size:1.0625rem;
}

.bodymod{margin-left:30px;}
.space_mod{margin-left: 120px;}
.modal-header {margin-top: 0;padding:10px 0 5px 0;color: #486bdf;border-bottom:2px solid #111;}
.modal-header h3 i::before {color:#2877c7;}
.tar {text-align:right;}
.btn-basic {background:#8c9dad;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-basic:hover {background:#2877c7;}
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
