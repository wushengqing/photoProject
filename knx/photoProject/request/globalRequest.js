function globalRequest(requestInfo) {
	return new Promise((resolve, reject) => {
		uni.request({
			...requestInfo,
			success: (res) => {
				resolve(res.data)
			},
			fail: () => {
				reject("")
			}

		})
	})
}
export default globalRequest
