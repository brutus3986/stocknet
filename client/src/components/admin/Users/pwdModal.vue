<template>
    <transition name="modal">
    <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                <div class="modal-header">
                    <h5><i class="fas fa-unlock fa-fw"></i>비밀번호 확인</h5>
                </div>
                <div class="modal-body">
                    <slot name="body">
                        <input type="password" class="form-control" placeholder="PASSWORD" v-model="m_password" name="password" 
                         v-on:keyup.enter="enterPwd" >
                    </slot>
                </div>
                <div class="modal-footer">
                    <slot name="footer">
                        <div class="tar" role="group" >
                            <button type="submit" class="btn btn-basic"   @click="enterPwd">확인</button>
                            <button type="submit" class="btn btn-cancel" @click="closePwd">취소</button>
                        </div>
                    </slot>
                </div>
                </div>
            </div>
        </div>
    </transition>  
</template>
<script>
export default {
    props: ['userinfo'],
    data: function() {
        return {
            m_password : '',
        };
    },
    methods: {
        enterPwd: function() {
            this.userinfo.m_password= this.m_password;
            this.$EventBus.$emit("enterPwd",this.userinfo);
        },
        closePwd: function() {
            this.$EventBus.$emit("closePwd");
        }
    }    
}
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
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
*/

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
.modal-header {margin-top: 0;padding:10px 0 5px 0;color: #486bdf;border-bottom:2px solid #111;}
.modal-header h5 i::before {color:#2877c7;}
.tar {text-align:right;}
.btn-basic {background:#2877c7;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-basic:hover {background:#145392;}
.btn-cancel {background:#8c9dad;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-cancel:hover {background:#66737e;}
</style>

