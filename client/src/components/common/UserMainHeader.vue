<template>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <router-link to="/user/notice" class="navbar-brand">STOCK-NET</router-link>
            <div id="navbar" class="collapse navbar-collapse">
                <div class="navbar-nav mr-auto">
                    <ul class="nav navbar-nav">
                        <li class="nav-item">
                            <router-link to="/user/notice" class="nav-link">공지사항</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/user/chart" class="nav-link">일간성능</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/user/chartterm" class="nav-link">기간성능</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/user/changepwd" class="nav-link">비밀번호변경</router-link>
                        </li>
                    </ul>
                </div>
                <div class="navbar-nav">
                    <li>
                        <router-link to="/user/changepwd" class="info"><i class="fa fa-user"></i> {{ username }} 님</router-link>
                    </li>
                    <li>
                        <a class="btn-login" @click="logout"><i class="fa fa-sign-out-alt"></i> LOGOUT </a>  
                    </li>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import Constant from './../../store/constant.js'

export default {
	data() {
		return {
				userid:"",
                username : "",
		};
    },
    mounted: function() {
		this.getUserName();
	},
	methods: {
		getUserName() {
			this.userid = this.$store.state.user.userid ;
            this.username = this.$store.state.user.username ;
            // console.log("username [" + this.$store.state.user.username + "]");
            
			if(this.username == "" || this.username == undefined) {
                this.logout();
			}else {
				// console.log("Success call...........");
			}
		},
		logout() {
			this.userid = "";
            this.username = "";
			this.$store.commit(Constant.DELETE_USER);
			this.$router.push({
				path: "/"
            });
		}
	}
};
</script>

<style scoped>
.navbar {padding:0 1rem;}
.navbar-brand {font-weight: bold;margin-right:2rem;}
nav {margin-bottom:3.125rem;background:#171e26;}
.nav-item a.nav-link {display:block;padding:13px 25px 15px;border-bottom:3px solid #171e26;color:rgba(255,255,255,0.75)}
.nav-item a.nav-link:hover {border-bottom:3px solid #0f87ff;color:rgba(255,255,255,1);}
.nav-item .router-link-active {border-bottom:3px solid #0f87ff!important;color:rgba(255,255,255,1)!important;}
.navbar .info {color:rgba(255,255,255,0.75);text-decoration:none;}
.navbar .info:hover {color:rgba(255,255,255,1);}
.navbar-nav .router-link-active {border-bottom:none;color:rgba(255,255,255,1);}
.navbar .btn-login {margin-left:20px;border-radius: 3px;padding:3px 10px;background:#a03737;color:#FFF;font-size:0.75rem;cursor: pointer;}
.navbar .btn-login:hover {color:#FFF;background:#d45252;} 
</style>
