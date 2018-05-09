# NodeJS项目


### 目录结构
+ bin 项目入口文件夹   
    + www 主运行程序，开启服务器
+ config 配置文件夹
    + settings.js 定义数据库等配置信息
+ models 模型文件夹，为数据库orm化准备，目前不用看里面内容
+ public  静态资源文件夹
    + vendor 引用库文件夹，所有的引用库都要放置其中
    + 其他资源分类放置
+ routes  路由处理
    + index 处理\路径
    + register 处理\register路径
+ views   Jade页面目录，Jade可与html互相转化
    + index 主页面入口
    + error、layout、mixins 目前仅为错误处理页面
    + register 注册页面
+ app.js 应用入口程序，服务器启动后加载本文件
+ package.json 引用包声明文件
+ .gitignore  git忽略文件

### 快速开始
1. 安装nodejs和npm（官网下载的安装包包含了这两个，推荐用最新版本）
2. 命令行执行 NPM install或NPM update
3. 修改setting.js中开发环境下的数据库配置（用户名，密码，数据库名）
4. 命令行执行 node bin/www启动运行





 