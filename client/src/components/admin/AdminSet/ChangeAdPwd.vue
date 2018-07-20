<template>
<div class="container mt-3 mt-sm-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <form id="form" role="form" v-on:click="validateForm"> 
                <div class="form-group">
                    <label class="form-control-label" for="oldpassword">Old Password</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"> <i class="fas fa-key fa-fw"></i> </span>
                        </div>
                        <input id="oldpassword" name="oldpassword" class="form-control" type="password" v-model.trim="oldpassword" v-bind:class="{ 'is-invalid': attemptSubmit && missingoldpwd }">
                        <div class="invalid-feedback">This field is required.</div>
                    </div>
                </div><!-- /form-group -->
                <div class="form-group">
                    <label class="form-control-label" for="newpassword">New Password</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"> <i class="fas fa-unlock fa-fw"></i> </span>
                        </div>
                        <input id="newpassword" name="newpassword" class="form-control" type="password" v-model.trim="newpassword" v-bind:class="{ 'is-invalid': attemptSubmit && missingnewpwd }">
                        <div class="invalid-feedback">This field is required.</div>
                    </div>
                </div><!-- /form-group -->
                <div class="form-group">
                    <label class="form-control-label" for="connewpassword">Confirm New Password</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"> <i class="fas fa-unlock-alt fa-fw"></i> </span>
                        </div>
                        <input id="connewpassword" name="connewpassword" class="form-control" type="password" v-model.trim="connewpassword" v-bind:class="{ 'is-invalid': attemptSubmit && wrongMatching }">  
                        <div class="invalid-feedback">Make sure the New Password.</div>
                    </div>
                </div><!-- /form-group -->
            </form>
            <button class="btn" v-bind:class="{'btn-basic' : activeClass, 'btn-basic2' : errorClass , disabled: disabledBtn }" @click="setNewPwd">Submit</button> 
        </div><!-- /col -->
    </div><!-- /row -->
</div><!-- /container -->
</template>


</template>
<script>
import Constant  from  './../../../store/constant.js'
import Config    from  './../../../js/config.js'

export default {
    data: function() {
        return {
            oldpassword    : '',
            newpassword    : '',
            connewpassword : '',
            attemptSubmit  : false,
            activeClass    : false,
            errorClass     : true,
            disabledBtn    : true
        };
    },
    computed: {
        missingoldpwd: function () { return this.oldpassword === ''; },
        missingnewpwd: function () { return this.newpassword === ''; },
        wrongMatching: function () {
            if(this.connewpassword !== this.newpassword) {  //비밀번호 같지않음.
                this.activeClass = false
                this.errorClass  = true
                this.disabledBtn = true
                return true;    // 두개의 값이 달라야 true가 되어 is invalid class active
            }else{   //비밀번호 같음.
                this.activeClass = true
                this.errorClass  = false
                this.disabledBtn = false
                return false;
            }
        },
    },
    methods: {
        validateForm: function (event) {
            this.attemptSubmit = true;
        },
        setNewPwd: function(){
            console.log('setNewPwd');
            var self = this;
            var userid = self.$store.state.user.userid ;
            
            if(this.newpassword !== this.connewpassword){
                alert('신규 비밀번호가 같지 않습니다.')
            }else if(this.password==''||this.newpassword==''||this.connewpassword==''){
                alert('비밀번호를 입력해주십시오.')
            }else{
                axios.post(Config.base_url+'/changepwd', {
                    "userid"      : userid,
                    "orgpassword" : self.oldpassword,
                    "pwdInfo" : {
                        "updated_at"   : Date.now(),
                        "password"     : self.newpassword,
                    }
                }).then(function(response) {
                    // console.log(response);
                    if(response.data.success == true) {
                        alert('비밀번호가 변경되었습니다.')
                        self.$router.push({
                            path: "/admin/notice"
                        });
                    }else {
                        alert("기존 비밀번호가 일치하지 않습니다.")
                    }
                });
            }
        }
       
    }
}
</script>
<style scoped>
.form-control {border-radius: 2px;}
.form-control-label {color:#111;font-size:1.125rem;}
.btn-basic {background:#2877c7;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-basic:hover {background:#145392;}
.btn-basic2 {background:#8c9dad;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-basic2:hover {background:#66737e;}
</style>
