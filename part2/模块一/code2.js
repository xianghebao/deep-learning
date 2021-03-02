#!/usr/bin/env node


// 编程题
// 1. 脚手架实现过程 ， 并使用nodejs完成自定义脚手架
// 答：
// 首先创建目录 初始化 yarn init 创建出 package.json
// 在package.json中 输入 bin入口
// 在根目录创建 lib.js文件添加bin 并且入口文件必须有我文件头  #!/usr/bin/env node
// 使用npm link /yarn link  之后输入文件名就可以使用
// 引入inquirer 模块 创建用户与命令行交互的工具 编写所需问题及字段
// 创建模板目录templates 将项目文件导入到目录中
// 引入ejs模块 结合所需功能问题变量 改写 templates 下项目文件 达到所需功能
// 在inquirer回调中 结合nodejs 读写功能 和ejs 模块将问题变量 重写到项目中
// 然后发布到npm上


// 注： 向上看 第一行
// 具体代码

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')  //命令行交互寻问
const ejs = require('ejs')   // 模板引擎

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Project name?'
  },
 ])
.then(anwsers => {
    // 模板目录
  const tmplDir = path.join(__dirname, 'templates')
    //   目标目录
  const destDir = process.cwd()
    // 将模板下的文件全部转换到目标目录
  fs.readdir(tmplDir, (err, files) => {
    if (err) throw err
    files.forEach(file => {
        // 模板引擎渲染
      ejs.renderFile(path.join(tmplDir, file), anwsers, (err, result) => {
        if (err) throw err
    // 将结果写入目标里面
        fs.writeFileSync(path.join(destDir, file), result)
      })
    })
  })
})