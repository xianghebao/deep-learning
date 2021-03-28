// 1、使用 Webpack 实现 Vue 项目打包任务
// 基本功能需要实现对Vue项目中常用的各类资源文件的打包处理，使用Webpack的loader实现，涉及的常用资源文件包含

// vue文件
// JS文件，需要使用babel进行es语法转换
// CSS、Less、Sass、PostCSS等样式文件处理
// 图片、字体等静态资源的处理
// 对于开发阶段与生产阶段，应当区分不同的打包配置，将公共的打包配置提取到公共的配置文件中，将开发阶段与生产阶段独立的配置内容放到相应的独立的配置文件中，并使用webpack-merge插件实现配置的合并

// 公共配置
    // entry入口配置
    // output输出配置
    // module.rules下的loader配置
    // 其他一些额外处理
// 开发阶段需要的打包配置
    // devServer
    // HMR支持
    // Source Map支持
    // 其他一些额外处理
// 生产阶段需要的打包配置
    // 对js、css等资源的压缩处理
    // 复制静态资源到输出目录
    // 代码拆分，提取公共代码
    // Tree Shaking配置
    // 其他一些额外处理
    // 规范化处理
    // Lint支持

// 具体实现待补充

// 公共配置webpack.common.js实现


// 基本功能需要实现对Vue项目中常用的各类资源文件的打包处理，使用Webpack的loader实现，涉及的常用资源文件包含

// 实现思路：

// 具体实现
//1. 公共配置webpack.common.js实现
    // entry：指定src/main.js作为入口文件
    // output：
    // filename：'[name].js'
    // path：指定dist目录作为输出路径，必须是绝对路径，使用path.resolve(__dirname, './dist')
    // publicPath: 开发阶段应当跟生产阶段进行区分，通常开发阶段指向'/'即可，生产阶段可以配置'/public'，可以使用process.env.NODE_ENV判断当前是否是production模式，然后指向不同的资源路径，也可以使用.env配置文件统一配置不同模式的环境变量，然后使用指定的环境变量例如process.env.ASSET_PATH来指定
    // module.rules：
    // 处理vue文件：
    // 使用vue-loader
    // 需要额外安装vue-template-compiler
    // 并在plugins中配置VueLoaderPlugin
    // 处理js文件：
    // 使用babel-loader（安装babel-loader @babel/core @babel/preset-env）
    // 处理CSS、Less、Sass、PostCSS等样式文件（当前项目中只用到了CSS与Less）：
    // Less：安装less与less-loader，使用less-loader/css-loader/style-loader
    // CSS：使用css-loader与style-loader
    // 当使用mini-css-extract-plugin时，使用MiniCssExtractPlugin.loader替换style-loader
    // 处理pulic/index.html模板：使用ejs-webpack-loader
    // 处理图片、字体等静态资源：
    // 使用url-loader，同时安装file-loader
    // 在options中额外指定limit，并按照类型指定不同的输出文件名及目录（需指定esModule: false）
    // 其他处理：
    // 配置resolve.alias方便模块导入解析
    // 使用html-webpack-plugin插件处理生成html（也可以在开发和生产使用不同的配置，这里统一在webpack.common.js中处理），html模板使用public目录下的index.html文件，文件中使用到额外的参数BASE_URL，通过templateParameters属性传入
    // 环境变量注入：根据当前process.env.NODE_ENV（运行时设置），加载相应的.env配置文件，使用dotenv进行解析，并使用webpack.DefinePlugin插件注入到process.env中
    // Lint相关配置处理
    // 对.vue,.js文件，配置先执行eslint-loader
    // 使用mini-css-extract-plugin插件抽取css样式到一个指定的文件
//2. 开发阶段配置webpack.dev.js实现
    // 安装并使用webpack-merge，合并webpack.common.js中的公共配置
    // dev环境变量注入：使用webpack.DefinePlugin插件，加载并注入.env.development配置文件中配置的环境变量（使用dotenv）
    // devServer：
    // 安装webpack-dev-server
    // 配置devServer属性的相关配置，例如HOST、PORT等，如果.env中有相关配置，则优先使用.env中的配置
    // HMR：devServer属性中，配置hot: true，同时结合webpack.HotModuleReplacementPlugin插件开启HMR热更新
    // Source Map：配置devtool属性，使用cheap-module-eval-source-map模式
//3. 生产阶段配置webpack.prod.js实现
    // 对js、css进行压缩处理
    // 使用uglifyjs-webpack-plugin插件压缩js代码
    // 使用optimize-css-assets-webpack-plugin压缩css代码
    // 复制public目录下的静态资源
    // 使用copy-webpack-plugin插件
    // 代码拆分
    // 配置optimization.splitChunks
    // Tree Shaking配置
    // 配置optimization.concatenateModules开启scope hoisting
    // 配置optimization.usedExports只导出使用到的模块内容
    // 配置optimization.minimize代码压缩
