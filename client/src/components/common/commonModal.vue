<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                <div class="modal-header">
                    <h5><i class="fas fa-power-off"></i>방문자수 초기화</h5>
                </div>
                <div class="modal-body">
                    <slot name="body">
                        초기화를 진행하시겠습니까?
                    </slot>
                </div>
                <div class="modal-footer">
                    <slot name="footer">
                        <div class="tar" role="group" >
                            <button type="submit" class="btn btn-basic" @click="resetCount">확인</button>
                            <button type="submit" class="btn btn-cancel" @click="closeModal">취소</button>
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
    props: [],
    data: function() {
        return {
        };
    },
    methods: {
        resetCount: function() {
            this.$EventBus.$emit("resetCount");
        },
        closeModal: function() {
            this.$EventBus.$emit("closeModal");
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

