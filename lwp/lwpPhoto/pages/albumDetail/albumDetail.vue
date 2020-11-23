<template>
	<view class="">
		<view class="img-list flex-wrap">
			<view class="img-view2" v-for="(item,index) in imgList">
				<image 
					lazy-load 
					class="img-cover" 
					mode="aspectFill"
					:src="item.minFileUrl || item.fileUrl" @tap="previewImage(index)"></image>
			</view>
			<view class="page-footer tc">
				<text v-if="loading">加载中...</text>
				<text class="c-grey" v-else-if="imgList.length>0 && imgList.length>=pageInfo.total">已全部加载~</text>
			</view>
		
		</view>
		<cl-message ref="message"></cl-message>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				title:'',
				loading: false,
				imgList: [],
				pageInfo: {
					currentPage: 1,
					pageSize: 21,
					total: 0,
				}
			}
		},
		methods: {
			getData(type) {
				this.loading = true;
				let par = {
					typeId: this.id,
					currentPage: this.pageInfo.currentPage,
					pageSize: this.pageInfo.pageSize
				}
				this.$api.getAlbumTypeInfo(par).then(res => {
					this.loading = false;
					if (res.code === 0) {
						res.data.forEach(item=>{
							item.hide=false;
						})
						if (this.pageInfo.currentPage === 1) {
							this.imgList = res.data;
						} else {
							this.imgList.push(...res.data);
						}
						this.pageInfo.currentPage++;
						this.pageInfo.total = res.totalNum;
					} else {
						this.$refs["message"].open({
							type: 'error',
							message: "请求错误！",
						});
					}
				});
			},
			//预览大图
			previewImage(index) {
				let imgArray = [];
				this.imgList.forEach(item=>{
					imgArray.push(item.fileUrl)
				})
				uni.previewImage({
					urls: imgArray,
					current:index,
					loop:true
				});
			},
			
			
		},
		onLoad(options) {
			this.id = parseInt(options.id);
			this.$nextTick(() => {
				this.getData();
			})
			uni.setNavigationBarTitle({
				title: decodeURIComponent(options.title)
			});
			this.title =  decodeURIComponent(options.title)
			
		},
		onReachBottom() {
			if (this.loading || this.imgList.length >= this.pageInfo.total) {
				return false;
			}
			this.getData();
		},
		onshow(){
			
		},
		onShareAppMessage(){
			return {
			      title: '厂家直销，主营中高档童装',
			      path: 'pages/index/index',
				  content:this.title 
			    }
		},
		async onPullDownRefresh(){
			//下拉刷新
			this.pageInfo.currentPage = 1;
			await this.getData();
			uni.stopPullDownRefresh();
		},
	}
</script>

<style lang="scss">
	.container-dark {
		background: #eee;
		padding: 10upx;
	}

	.page-footer {
		width: 100%;
		line-height: 45upx;
		font-size: 26upx;
	}
</style>
