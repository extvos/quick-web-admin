module.exports = {
	runtimeCompiler: true,

	chainWebpack: config => {
		config
			.plugin('html')
			.tap(args => {
				args[0].title = 'Muse Vue Ant Design - by Creative Tim'
				return args
			})
	},
	devServer: {
		port: 8090,
		
		host: "localhost",
		
		https: false,
		
		// 自动启动浏览器
		
		open: false,
		proxy: {
			"/": {
				target: "http://localhost:8080", //设置调用的接口域名和端口
				changeOrigin: true, //是否跨域
				ws:true,
				// pathRewrite: {
				// 	"^/api": ""
				// }
			}
		}
	}
}
