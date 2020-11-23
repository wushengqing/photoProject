<template>
	<view class="">
		<view class="img-list flex-wrap">
			<view class="img-view2-add" @tap="chooseImage()">
				<text class="iconfont">&#xe617</text>
			</view>
			<view class="img-view2" v-for="(item,index) in imgList" :style="{display:item.hide?'none':''}">
				<image lazy-load class="img-cover" :src="item.minFileUrl||item.fileUrl" @tap="previewImage(index)"></image>
				<view class="set-cover" @click.stop="setAsCover(item)"><text class="iconfont font28">&#xe619</text></view>
				<view class="delete" @click.stop="deletePhoto(item)"><text class="iconfont f22">&#xe618</text></view>
			</view>
			<view class="page-footer tc">
				<text v-if="loading">加载中...</text>
				<text class="c-grey" v-else-if="imgList.length>0 && imgList.length>=pageInfo.total">已全部加载~</text>
			</view>
		</view>
		<cl-message ref="message"></cl-message>
		<cl-loading-mask :loading="upload.loading" :text="`正在上传${upload.progress}/${upload.total}`" fullscreen></cl-loading-mask>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				loading: false,
				imgList: [],
				upload: {
					loading: false,
					total: 0,
					progress: 0,
				},
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
						res.data.forEach(item => {
							item.hide = false;
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
			//选择图片
			chooseImage() {
				uni.chooseImage({
					sizeType: ['original', 'compressed'],
					success: (chooseImageRes) => {
						console.log(chooseImageRes);
						const tempFilePaths = chooseImageRes.tempFilePaths;
						this.upload.total = tempFilePaths.length;
						this.upload.progress = 0;
						this.uploadFile(tempFilePaths);
						this.upload.loading = true;
					}
				});
			},
			//依次上传图片
			uploadFile(files) {
				uni.uploadFile({
					url: this.$api.uploadAction,
					filePath: files[0],
					name: 'file',
					formData: {
						typeId: this.id,
					},
					success: (uploadFileRes) => {
						files.shift();
						this.upload.progress = this.upload.total - files.length;
						if (files.length > 0) {
							this.uploadFile(files);
						} else {
							this.upload.loading = false;
							this.$refs["message"].open({
								type: 'success',
								message: "已全部上传",
							});
							this.pageInfo.currentPage = 1;
							this.getData();
						}
					}
				});
			},
			//预览大图
			previewImage(index) {
				let imgArray = [];
				this.imgList.forEach(item => {
					imgArray.push(item.fileUrl)
				})
				uni.previewImage({
					urls: imgArray,
					current: index,
					loop: true
				});
			},
			//设置为封面
			async setAsCover(item) {
				let par = {
					id: this.id,
					topFileId: item.id,
					typeState: 0
				}
				let res = await this.$api.addOrUpdateAlbumTypeInfo(par);
				if (res.code === 0) {
					this.$refs["message"].open({
						type: 'success',
						message: '相册封面设置成功！',
					});
				} else {
					this.$refs["message"].open({
						type: 'error',
						message: '相册封面设置失败！',
					});
				}
			},
			deletePhoto(item) {
				this.$api.delFile({
					id: item.id
				}).then(res => {
					if (res.code === 0) {
						this.$refs["message"].open({
							type: 'success',
							message: '删除成功！',
						});
						item.hide = true;
					} else {
						this.$refs["message"].open({
							type: 'error',
							message: '删除失败！',
						});
					}
				})
			}
		},
		onLoad(options) {
			let userInfo = uni.getStorageSync('userInfo') || '';
			if (!userInfo || userInfo.userNum !== 'kanaixiong' || userInfo.userPassword !== 'knx123456') {
				//跳转到登录
				uni.navigateTo({
					url: '../admin/admin'
				});
			}
			this.id = parseInt(options.id);
			if(!this.id){
				//跳转到登录
				uni.navigateTo({
					url: '../adminAlbum/adminAlbum'
				});
			}
			uni.setNavigationBarTitle({
				title: decodeURIComponent(options.title)
			});
			this.$nextTick(() => {
				this.getData();
			})
		},
		onReachBottom() {
			if (this.loading || this.imgList.length >= this.pageInfo.total) {
				return false;
			}
			this.getData();
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
