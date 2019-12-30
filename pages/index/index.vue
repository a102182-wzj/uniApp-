<template>
	<view class="content">
		<swiper style="height:300upx" indicator-dots=true indicator="#e8e8e8" indicator-active-color="red">
		
			<swiper-item v-for="(item,index) in 3" :key="index" v-if="newsList[currentTab]!=undefined">
				<view :style="{backgroundImage:`url(${newsList[currentTab][index].image})`,
				backgroundRepeat:'no-repeat',width:'750upx',height:'100%',
				 backgroundSize: 'cover',
				  backgroundPosition:'center',display:'flex',alignItems:'flex-end'}">
					<view style="color:white;font-size:15px;margin-bottom: 20upx;margin-left: 20upx;">{{newsList[currentTab][index].title| ellipsis}}</view>
				</view>
			</swiper-item>
			<!-- <view v-else>
				<view :style="{backgroundColor:'#e8e8e8'}">
				</view>
			</view> -->
		</swiper>
		<liuyuno-tabs :tabData="tabList" @tabClick='tabClick' />
		<view class="listItem" v-for="(item,index) in newsList[currentTab]" :key="index">
			<!-- {{test(index)}} -->
			<view :style="{width:'400upx',fontSize:'16px'}">
				<view>{{item.title| ellipsis}}</view>
				<view style="margin-top: 20upx;font-size: 15px;color:#b4b4b4">{{item.passtime}}</view>
			</view>
			<image :src="item.image" :style="{width:'250upx',height:'100%'}">
				<uni-icons type="arrowright" size="15"></uni-icons>
			</image>
			<!-- <view>描述</view> -->
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import liuyunoTabs from "@/components/liuyuno-tabs/liuyuno-tabs.vue";
	import {
		mapState,
		mapMutations,
		mapActions,
		mapGetters
	} from 'vuex';
	export default {
		components: {
			uniIcons,
			liuyunoTabs
		},
		data() {
			return {
				currentTab: 0,
				tabList: ['网易新闻', '腾讯新闻'],
				page: 0
			}
		},
		computed: {
			// ...mapState('News', ['newsList']),
			// ...mapGetters('News', ['getterNewsList']),
			...mapState('News',['newsList'])
		},
		created() {
			uni.showLoading({
				title: '正在加载中',
				mask: true
			})
			uni.request({
				//#ifdef H5
				url: '/api/getWangYiNews',
				//#endif
				//#ifndef H5
				url: 'https://api.apiopen.top/getWangYiNews',
				//#endif
				method: 'POST',
				success: (res) => {
					uni.hideLoading()
					if (res.data.code == 200) {
						this.getNewsList(res.data.result)
					} else {
						uni.showToast({
							title: res.data.message
						})
					}

				},
				fail: (res) => {
					debugger;
				}
			})
		},
		onReachBottom() {
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
						icon: 'loading'
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
							console.log('tenctNews', tenctNews)
							let payload = {
								index: this.currentTab,
								data: tenctNews
							}
							this.concatNewsList(payload)
						},
					})
			}
		},
		methods: {
			test(index){
				console.log(`渲染${index}次`)
			},
			tabClick(e) {
				console.log('e', e)
				this.currentTab = e
				console.log('currentTab', this.currentTab)
				if (this.newsList[this.currentTab] == undefined) {
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
					uni.showToast({
						title: '正在加载'
					})
					uni.request({
						url: url,
						method: 'POST',
						success: (res) => {
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
							this.getNewsList(tenctNews)
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
