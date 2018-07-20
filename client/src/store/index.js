import Vue from 'vue';
import Vuex from 'vuex';
import Constant from './constant.js';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user: [{ userid: "", username: "", user_level: "", gubun: 0, grpgubun: {}, machine_name: "" }]
    },
    mutations: {
        [Constant.ADD_USER]: (state, payload) => {
            state.user.userid = payload.userid;
            state.user.username = payload.username;
            state.user.user_level = payload.user_level;
            state.user.grpgubun = payload.grpgubun;
            state.user.machine_name = payload.machine_name;
        },
        [Constant.DELETE_USER]: (state) => {
            state.user.userid = "";
            state.user.username = "";
            state.user.user_level = "";
            state.user.grpgubun = "";
            state.user.machine_name = "";
        },
    }
});

export default store;