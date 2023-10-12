const path = require("path");
const defaultSettings = require("./src/settings");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title;
// target: 'http://192.168.100.63:8080',
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/bjsp-ui/" : "/",
  productionSourceMap: process.env.NODE_ENV === "production" ? false : true,
  devServer: {
    port: 8081,
    open: true,
    proxy: {
      "/api": {
        // target: 'http://192.168.100.35:9999', //外网
        // target: "http://192.168.100.191:8081",
        // target: "http://192.168.100.71:8080",
        // target: "http://114.255.129.72:9999",
        target: "http://192.168.100.191:8081",
        // target: "http://192.168.2.242:8080",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
        logLevel: 'debug', // 打印代理后的实际请求路径在终端中
      },
    }, // 设置代理
    disableHostCheck: true,
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
  chainWebpack(config) {
    config.module.rule("svg").exclude.add(resolve("src/assets/icons"));
    config.module
      .rule("icons")
      .test(/\.(svg)(\?.*)?$/)
      .include.add(resolve("src/assets//icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
};