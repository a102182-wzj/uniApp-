import Vue from 'vue'
import Vuex from 'vuex'
import News from '../pages/index/store/index.js'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
	},
	mutations: {
	
	},
	actions:{
		test(context){
		// 	context.commit("mutations")
		}
	},
	modules:{
		News
	}
})
export default store
