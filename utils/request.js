export default {
	request:function(company, url, header, Type, data) {
		console.log('进入了request')
		let baseUrl= this.chooseCompany(company)
		console.log('baseUrl',baseUrl)
		uni.showLoading({
			title: '加载中'
		})
		uni.request({
			url: baseUrl + url,
			header: header,
			method: Type,
			data: data,
			success: (res) => {
				console.log('res',res)
				return res
			},
			fail: (res) => {
				uni.showToast({
					title: '网络请求错误,稍后重试'
				})
			},
			complete: () => {
				uni.hideLoading()
			}
		})
	},
	chooseCompany :function (company) {
		console.log('执行了选择公司')
		let baseUrl=''
		switch (company) {
			case 'wangyi':
				//#ifdef H5
				baseUrl = '/api'
				//#endif
				//#ifndef H5
				baseUrl = 'https://api.apiopen.top'
				//#endif
				break;
			case 'tenct':
				//#ifdef H5
				baseUrl = '/tenct'
				//#endif
				//#ifndef H5
				baseUrl = 'https://pacaio.match.qq.com'
				//#endif
		}
		return baseUrl
	}
}
