
const domain = 'https://www.1kanaixiong.com';
const baseUrl = domain + '/album-web/web/';
import globalRequest from './globalRequest.js'

//查询分类列表
async function getAlbumTypeList(){
	var [error, res] = await uni.request({
	    url: `${baseUrl}getAlbumTypeList.json`,
		method:'POST',
		data:{}
	});
	if(res){
		return res.data.data;
	}else{
		return {
			code:'1',
			error
		}
	}
	
}

//新增相册或者分类
async function addOrUpdateAlbumTypeInfo(data){
	var [error, res] = await uni.request({
	    url: `${baseUrl}addOrUpdateAlbumTypeInfo.json`,
		method:'POST',
	    data
	});
	if(res){
		return res.data;
	}else{
		return {
			code:'1',
			error
		}
	}
}
//分页获取相册下的照片
function getAlbumTypeInfo(data){
	return globalRequest({
	    url: `${baseUrl}getAlbumTypeInfo.json`,
		method:'POST',
	    data
	});
}
//分页获取相册下的照片
function delFile(data){
	return globalRequest({
	    url: `${baseUrl}delFile.json`,
		method:'POST',
	    data
	});
}
/**
 * 图片上传地址
 */
const uploadAction=`${baseUrl}addFile.file`;

export default {
	//查询相册分类列表
	getAlbumTypeList,
	//新增相册或者分类
	addOrUpdateAlbumTypeInfo,
	//分页获取相册下的照片
	getAlbumTypeInfo,
	//上传图片
	uploadAction,
	//删除图片
	delFile,

}