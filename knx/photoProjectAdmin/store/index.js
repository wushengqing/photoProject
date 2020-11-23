import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: {
			id: ''
		},
	},
	mutations: {
		login(state, userInfo) {
			state.hasLogin = true;
			state.userInfo = userInfo;
			uni.setStorage({ //缓存用户登陆状态
				key: 'userInfo',
				data: userInfo
			})

		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({
				key: 'userInfo'
			})
		}
	},
	actions: {

	}
})

export default store
