<template>
	<view :style="{height:screenHeight}">
		<swiper id="header" indicator-dots=true indicator="#e8e8e8" indicator-active-color="red">
			<swiper-item v-for="(item,index) in 3" :key="index" v-if="newsListTotal[currentTab]!=undefined">
				<view :style="{backgroundImage:`url(${newsListTotal[currentTab][index].image})`,
				backgroundRepeat:'no-repeat',width:'750upx',height:'100%',
				 backgroundSize: 'cover',
				  backgroundPosition:'center',display:'flex',alignItems:'flex-end'}">
					<!-- {{newsListTotal[currentTab][index].title| ellipsis}} -->
					<view style="color:white;font-size:30upx;margin-bottom: 20upx;margin-left: 20upx;">{{newsListTotal[currentTab][index].title}}</view>
				</view>
			</swiper-item>
		</swiper>
		<wuc-tab id="tab" :tab-list="tabList" :tabCur.sync="currentTab" @change="tabClick"></wuc-tab>
		<swiper :current="currentTab" @change="swiperChange" :style="{height:footerHeight+'px'}">
			<swiper-item v-for="(item,index1) in tabList" :key="index1">
				<scroll-view @scrolltolower="scrolltoLower()" :style="{height:footerHeight+'px'}" scroll-y="true">
					<view class="listItem" v-for="(item,index) in newsListTotal[currentTab]" :key="index">
						<view :style="{width:'400upx',fontSize:'25upx'}">
							<view>{{item.title| ellipsis}}</view>
							<view style="margin-top: 20upx;font-size: 20upx;color:#b4b4b4">{{item.passtime}}</view>
						</view>
						<image :src="item.image" :style="{width:'250upx',height:'100%'}">
							<uni-icons type="arrowright" size="15"></uni-icons>
						</image>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import liuyunoTabs from "@/components/liuyuno-tabs/liuyuno-tabs.vue";
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import utils from '../../utils/request.js';
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';
	export default {
		components: {
			uniIcons,
			WucTab
		},
		data() {
			return {
				currentTab: 0,
				tabList: [{
					name: '网易新闻'
				}, {
					name: '腾讯新闻'
				}],
				page: 0, //用于腾讯新闻请求页数
				scrollY: false,
				newsListTotal: [],
				screenHeight: '',
				footerHeight: ''
			}
		},
		mounted() {
			this.getHeights()
		},
		computed: {
			...mapState('News', ['newsList']),
			getNewsListTotal() {
				return this.newsListTotal
			}

		},
		created() {
			uni.getSystemInfo({
				success: (res) => {
					this.screenHeight = `${res.windowHeight}px`
				}
			})
			console.log('正在创建实例')
			let data=utils.request('wangyi','/getWangYiNews',{},'POST')
			console.log('data11111',data)
			// let data=request('wangyi','/getWangYiNews',{},'POST')
			// console.log('data',data)
			// uni.showLoading({
			// 	title: '正在加载中',
			// 	mask: true
			// })
			// uni.request({
			// 	//#ifdef H5
			// 	url: '/api/getWangYiNews',
			// 	//#endif
			// 	//#ifndef H5
			// 	url: 'https://api.apiopen.top/getWangYiNews',
			// 	//#endif
			// 	method: 'POST',
			// 	success: (res) => {
			// 		uni.hideLoading()
			// 		if (res.data.code == 200) {

			// 			this.newsListTotal.push(res.data.result)
			// 			console.log('this.newsListTotal', this.newsListTotal)
			// 			// this.getNewsList(res.data.result)
			// 		} else {
			// 			uni.showToast({
			// 				title: res.data.message
			// 			})
			// 		}

			// 	},
			// 	fail: (res) => {
			// 		debugger;
			// 	}
			// })
		},
		//页面触底生命周期
		onReachBottom() {

		},
		methods: {
			getHeight(selector) {
				return new Promise((res, rej) => {
					let currentHeight = uni.createSelectorQuery().select(selector);
					currentHeight.boundingClientRect(function(data) { //data - 各种参数
						currentHeight = data.height
						// console.log('currentHeight', currentHeight)
						res(currentHeight)
					}).exec()
				})
			},
			async getHeights() {
				console.log('执行了渲染完毕')
				let headerHeight = await this.getHeight('#header')
				let tabHeight = await this.getHeight('#tab')
				console.log('headerHeight', headerHeight)
				console.log('tabHeight', tabHeight)
				let screenHeight = parseInt(this.screenHeight)
				console.log('screenHeight', screenHeight)
				this.footerHeight = screenHeight - headerHeight - tabHeight
				console.log('footerHeight', this.footerHeight)
			},
			swiperChange(swiper) {
				this.tabClick(swiper.detail.current)
			},
			tabClick(e) {
				this.currentTab = e
				if (this.getNewsListTotal[this.currentTab] == undefined) {
					console.log('走了if')
					let url = ''
					switch (e) {
						case 1:
							//#ifdef H5
							url =
								`/tenct/irs/rcd?cid=56&ext=games&token=c786875b8e04da17b24ea5e332745e0f&num=20&expIds=20190106A13PFT%7C20190108A04MLS&page=${this.page}`
							//#endif
							//#ifndef H5
							url =
								`https://pacaio.match.qq.com/irs/rcd?cid=56&ext=games&token=c786875b8e04da17b24ea5e332745e0f&num=20&expIds=20190106A13PFT%7C20190108A04MLS&page=${this.page}`
							//#endif
					}
					uni.showLoading({
						title: '正在加载',
						icon: 'loading',
						mask: true
					})
					uni.request({
						url: url,
						method: 'POST',
						success: (res) => {
							uni.hideLoading()
							let data = res.data.data
							let tenctNews = []
							for (let i = 0; i < data.length; i++) {
								let news = {
									image: data[i].bimg,
									passtime: data[i]['publish_time'],
									path: data[i].url,
									title: data[i].title
								}
								tenctNews.push(news)
							}
							this.newsListTotal.push(tenctNews)
							// this.getNewsList(tenctNews)
						},
					})
				}
			},
			scrolltoLower() {
				console.log('执行了触底')
				console.log('newsList', this.newsList)
				switch (this.currentTab) {
					case 0:
						uni.showToast({
							title: "已经是最后一页",
							duration: 1000,
							icon: 'none'
						})
						break;
					case 1:
						uni.showToast({
							title: "加载中",
							icon: 'loading',
							mask: true
						})
						this.page++
						let url = ''
						//#ifdef H5
						url =
							`/tenct/irs/rcd?cid=56&ext=games&token=c786875b8e04da17b24ea5e332745e0f&num=20&expIds=20190106A13PFT%7C20190108A04MLS&page=${this.page}`
						//#endif
						//#ifndef H5
						url =
							`https://pacaio.match.qq.com/irs/rcd?cid=56&ext=games&token=c786875b8e04da17b24ea5e332745e0f&num=20&expIds=20190106A13PFT%7C20190108A04MLS&page=${this.page}`
						//#endif
						uni.request({
							url: url,
							method: 'POST',
							success: (res) => {
								uni.hideToast()
								console.log('执行了1')
								let data = res.data.data
								console.log('data', data)
								let tenctNews = []
								for (let i = 0; i < data.length; i++) {
									let news = {
										image: data[i].bimg,
										passtime: data[i]['publish_time'],
										path: data[i].url,
										title: data[i].title
									}
									tenctNews.push(news)
								}
								let payload = {
									index: this.currentTab,
									data: tenctNews
								}
								// this.newsListTotal=this.newsListTotal[this.currentTab].concat(tenctNews)
								this.$set(this.newsListTotal, this.currentTab, this.newsListTotal[this.currentTab].concat(tenctNews))
								console.log('newsListTotal', this.newsListTotal)
							},
						})
				}
			},
			...mapActions('News', ['getNewsList', 'concatNewsList'])
		},
		filters: {
			ellipsis(text) {
				if (text.length > 24) {
					text = text.substr(0, 25)
					text += "..."
				}
				return text
			}
		}
	}
</script>

<style>
	@import url("./index.less");
</style>
