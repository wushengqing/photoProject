<template>
	<view class="demo-tabs">
		<view class="tabs">
			<view class="tab" :class="{active:index===tabIndex}" @click="changeTab(index)" v-for="(item,index) in typeList">{{ item.name }}</view>
		</view>
		<view class="flex-wrap" style="padding:20upx;justify-content: space-between;">
			<navigator :key="item.id" :url="`../albumDetail/albumDetail?id=${item.id}&title=${item.name}`" class="img-view mt-30"
			 v-for="item in sTypeList">
				<image 
					lazy-load 
					class="img-bg"
					mode="aspectFill"
					:src="item.minFileUrl|| '../../static/image/empty.png'"></image>
				<view class="total-count"><text class="iconfont f22">&#xe616</text>{{ item.sum }}张</view>
				<view class="desc-view">
					<view class="img-title">{{ item.name }}</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabIndex: 0,
				typeList: [],
			};
		},
		computed: {
			sTypeList() {
				if (this.typeList.length == 0) {
					return [];
				}
				return this.typeList[this.tabIndex].sTypeList;
			},
		},
		//13859173539
		methods: {
			async getData() {
				let typeList = await this.$api.getAlbumTypeList();
				typeList.forEach(itemType => {
					itemType.label = itemType.name;
					itemType.visible = true;
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
			},
			changeTab(index) {
				this.tabIndex = index;
			}
		},
		onLoad() {
			this.getData();
		},
		onShareAppMessage() {
			return {
			      title: '厂家直销，主营中高档童装',
			      path: 'pages/index/index'
			    }
		},
		async onPullDownRefresh(){
			//下拉刷新
			await this.getData();
			uni.stopPullDownRefresh();
		},
	};
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.tabs {
		padding: 0 20upx;
		line-height: 40upx;
		display: none;

		.tab {
			font-size: 28upx;
			display: inline-block;
			padding: 0 20upx;

			&.active {
				color: $base-color;
				border-bottom: $base-color solid 1upx;
			}
		}
	}
</style>
