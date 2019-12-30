const state = {
	//接口受限 固定写死 下标0为网易新闻 下表1为腾讯新闻
	newsList: []
}

// actions
const actions = {
	getNewsList(context, data) {
		context.commit('GETNEWSLIST', data)
	},
	concatNewsList(context, payload) {
		context.commit('CONCATNEWSLIST', payload)
	}
}
const getters={
	getterNewsList(state){
	console.log('state',state)	
	}
}
// mutations
const mutations = {
	GETNEWSLIST(state, data) {
		let listCopy = state.newsList
		listCopy.push(data)
		state.newsList = listCopy
	},
	CONCATNEWSLIST(state, {
		index,
		data
	}) {
		let listCopy=state.newsList	
		// let listCopy = state.newsList[index]
		let lista=listCopy[index]
		lista=lista.concat(data)
		listCopy[index]=lista
		state.newsList = { ...state.newsList, newsList: listCopy },
		console.log('state',state.newsList.newsList)
	}
}

export default {
	namespaced: true,
	state,
	actions,
	mutations
}
