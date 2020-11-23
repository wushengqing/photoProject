<template>
	<view>

		<template v-for="(typeItem,typeIndex) in typeList" >
			<view class="album-listr-box" v-if="typeIndex===0">
				<view class="title flex" style="display: none;">
					<view class="flex1">{{ typeItem.name }}</view>
					<view class="btns">
						<text class="btn c-bule">编辑</text>
						<text class="btn c-red">删除</text>
					</view>
				</view>
				<view class="albumList flex-wrap" style="padding:20upx;justify-content: space-between;">
					<navigator :url="`../adminAlbum/photo?id=${item.id}&title=${item.name}`" class="img-view" v-for="(item,index) in typeItem.sTypeList">
						<image :lazy-load="true" class="img-bg" :src="item.minFileUrl|| '../../static/image/empty.png'"></image>
						<view class="total-count"><text class="iconfont f22">&#xe616</text>{{ item.sum }}张</view>
						<view class="delete" @click.stop="deleteAlbum(item)"><text class="iconfont f22">&#xe61f</text></view>
						<view class="edit" @click.stop="openAddAlbumDialog(item)"><text class="iconfont f22">&#xe61a</text></view>
						<view class="up" @click.stop="upAlbumIndex(typeItem,index)"><text class="iconfont f22">&#xe61b</text></view>
						<view class="down" @click.stop="downAlbumIndex(typeItem,index)"><text class="iconfont f22">&#xe61c</text></view>
						<view class="desc-view">
							<view class="img-title">{{ item.name }}</view>
						</view>
					</navigator>
					<view class="img-view img-view-add " @click="openAddAlbumDialog({parentId:typeItem.id})">
						<view class="flex" style="justify-content: center; align-items: center; width: 100%; height: 100%;">
							<text class="iconfont">&#xe617</text>
							<text class="flex1" style="text-align: center; margin-top: 50upx;">新增相册</text>
						</view>
					</view>
				</view>
			</view>
		</template>
		<view class="title flex">
			<view class="flex1 c-grey">已下架相册</view>
		</view>
		<template v-for="(typeItem,typeIndex) in typeList" >
			<view class="album-listr-box" v-if="typeIndex===0">
				<view class="title flex" style="display: none;">
					<view class="flex1">{{ typeItem.name }}</view>
					<view class="btns">
						<text class="btn c-bule">编辑</text>
						<text class="btn c-red">删除</text>
					</view>
				</view>
				<view class="albumList flex-wrap" style="padding:20upx;justify-content: space-between;">
					<view class="c-grey tc w100off mt-30 font22" v-if="typeItem && typeItem.deleteTypeList && typeItem.deleteTypeList.length===0">暂无下架相册~</view>
					<navigator :url="`../adminAlbum/photo?id=${item.id}&title=${item.name}`" class="img-view" v-for="item in typeItem.deleteTypeList">
						<image class="img-bg" :src="item.topFileUrl|| '../../static/image/empty.png'"></image>
						<view class="total-count"><text class="iconfont f22">&#xe616</text>{{ item.sum }}张</view>
						<view class="edit" @click.stop="onShelfAlbum(item)"><text class="iconfont f22">&#xe61e</text></view>
						<view class="desc-view">
							<view class="img-title">{{ item.name }}</view>
						</view>
					</navigator>
				</view>
			</view>
		</template>
		<view class="album-listr-box" style="padding: 50upx 20px 20px 20px; display: none;">
			<cl-button type="primary" icon="cl-icon-plus" style="width: 100%; background: #409EFF; border:#409EFF solid 1px;">
				<text>添加分类</text>
			</cl-button>
		</view>
		<!-- 确认框 -->
		<cl-confirm ref="cl-confirm"></cl-confirm>
		<cl-message ref="message"></cl-message>
		<!--新增-->
		<cl-dialog :visible.sync="dialog.show" :show-cancel-button="false" :show-confirm-button="false">
			<view class="cs-det">
				<cl-card label="相册名称">
					<cl-input v-model="dialog.name" placeholder="请输入内容"></cl-input>
				</cl-card>

			</view>

			<template slot="footer">
				<cl-button size="small" @tap="dialog.show=false">
					<text>取消</text>
				</cl-button>
				<cl-button type="primary" size="small" @tap="addAlbum()">
					<text>确定</text>
				</cl-button>
			</template>
		</cl-dialog>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: true,
				typeList: [{
					name: '男装',
					id: 1,
					show: true,
					sTypeList: [

					]
				}, ],
				dialog: {
					show: false,
					name: '',
					id: '',
					parentId: ''
				}
			}
		},
		methods: {
			async getData() {
				this.loading = true;
				let typeList = await this.$api.getAlbumTypeList();
				typeList.sTypeList = typeList.map(itemType => {
					itemType.deleteTypeList = itemType.sTypeList.filter(item => item.typeState === 1);
					itemType.sTypeList = itemType.sTypeList.filter(item => item.typeState === 0);
					itemType.sTypeList.forEach((item,index)=>{
						item.index = item.index || item.id
					})
					itemType.sTypeList.sort((a,b)=>{
							return a.index-b.index;
					})
				});
				this.typeList = typeList;
				this.loading = false;

			},
			//打开新增相册弹窗
			openAddAlbumDialog(item = {}) {
				this.dialog = {
					...item,
					show: true
				}
				this.dialog.name = item.name || '';
				this.dialog.id = item.id || '';
				this.dialog.parentId = item.parentId || 0;
			},
			async addAlbum() {
				if (!this.dialog.name) {
					this.$refs["message"].open({
						type: 'error',
						message: "请填写相册名称！",
					});
					return;
				}
				let par = {
					name: this.dialog.name,
					parentId: this.dialog.parentId || 0,
					typeState: 0
				}
				if (this.dialog.id) {
					par.id = this.dialog.id;
				}
				if (this.dialog.parentId) {
					par.parentId = this.dialog.parentId;
				}
				let res = await this.$api.addOrUpdateAlbumTypeInfo(par);

				if (res.code === 0) {
					this.$refs["message"].open({
						type: 'success',
						message: par.id ? "保存成功！" : '创建成功！',
					});
					this.dialog.show = false;
					this.getData()
				} else {
					this.$refs["message"].open({
						type: 'error',
						message: par.id ? "保存失败！" : '创建失败！',
					});
				}
			},
			//上架相册
			async onShelfAlbum(item){
				let res = await this.$api.addOrUpdateAlbumTypeInfo({
					id: item.id,
					typeState: 0
				});
				this.getData()
			},
			//下架相册
			async deleteAlbum(item) {
				this.$refs["cl-confirm"].open({
					title: "提示",
					message: `是否下架相册【${item.name}】`,
					callback: async ({
						action
					}) => {
						if (action === 'confirm') {
							let res = await this.$api.addOrUpdateAlbumTypeInfo({
								id: item.id,
								typeState: 1
							});
							this.getData()
						}
					}
				});
			},
			//上移一位
			async upAlbumIndex(typeItem,index){
				if(index===0){
					return false;
				}
				[typeItem.sTypeList[index-1].index,typeItem.sTypeList[index].index]= [typeItem.sTypeList[index].index,typeItem.sTypeList[index-1].index];
				await this.$api.addOrUpdateAlbumTypeInfo({
					id: typeItem.sTypeList[index-1].id,
					typeState: 0,
					index:typeItem.sTypeList[index-1].index
				});
				await this.$api.addOrUpdateAlbumTypeInfo({
					id: typeItem.sTypeList[index].id,
					typeState: 0,
					index:typeItem.sTypeList[index].index
				});
				typeItem.sTypeList.sort((a,b)=>{
					return a.index-b.index;
				});
			},
			//下移一位
			async downAlbumIndex(typeItem,index){
				if(index===typeItem.sTypeList.length-1){
					return false;
				}
				[typeItem.sTypeList[index+1].index,typeItem.sTypeList[index].index]= [typeItem.sTypeList[index].index,typeItem.sTypeList[index+1].index];
				await this.$api.addOrUpdateAlbumTypeInfo({
					id: typeItem.sTypeList[index+1].id,
					typeState: 0,
					index:typeItem.sTypeList[index+1].index
				});
				await this.$api.addOrUpdateAlbumTypeInfo({
					id: typeItem.sTypeList[index].id,
					typeState: 0,
					index:typeItem.sTypeList[index].index
				});
				typeItem.sTypeList.sort((a,b)=>{
						return a.index-b.index;
				});
			}
		},
		onLoad() {
			this.getData();
		},
		onShow() {
			let userInfo = uni.getStorageSync('userInfo') || '';
			console.log(userInfo);
			if (!userInfo || userInfo.userNum !== 'kanaixiong' || userInfo.userPassword !== 'knx123456') {
				//跳转到登录
				uni.navigateTo({
					url: '../admin/admin'
				});
			}
		},
		async onPullDownRefresh(){
			//下拉刷新
			await this.getData();
			uni.stopPullDownRefresh();
		},
	}
</script>

<style lang="scss">
	page {
		background: #eee;
	}

	.album-listr-box {
		margin-bottom: 30upx;
		background: #fff;
		padding-bottom: 30upx;
	}

	.title {
		line-height: 88upx;
		font-size: 35upx;
		font-weight: bold;
		padding-left: 20upx;
	}

	.btns {
		font-weight: normal;

		.btn {
			font-size: 30upx;
			margin-right: 20upx;
		}
	}

	.img-view-add {
		height: 330upx;
		border: $font-color-spec solid 1upx;
		border-radius: 10upx;
		color: $font-color-spec;
		position: relative;

		.iconfont {
			position: absolute;
			top: 100upx;
			left: 50%;
			width: 40upx;
			margin-left: -20upx;
			font-size: 40upx;

		}
	}
</style>
