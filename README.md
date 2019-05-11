react-native和graphql版本项目管理系统

目前只适配了Android端

运行流程：

1. git clone

2. npm install

3. cd server & npm install

4. 安装[docker](https://docs.docker.com/compose/install/)
windows和macos用户安装docker desktop就好了，linux及其他用户需要另外安装docker-compose

5. 安装docker后，在server目录下，运行
```
docker-compose up -d
prisma deploy
```
tips: 运行docker-compose up -d之前，最好配置下国内的docker镜像库，要不然会很慢
配置教程：阿里云提供[服务](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)
将加速器地址地址复制到docker-》 settings -》 Daemon -》 Registry mirrors里面，apply就好，之后pull镜像就会很快了

6. 可通过prisma list 查看服务是否开启成功，或者浏览器输入http://localhost:4466/_admin，可以看到几个数据库就成功了

7. 在server目录下，运行 node src/index.js, 服务器端口是4000
在浏览器中打开localhost:4000 可以进入graphql background，右边docs可以查看接口

8. 查看本机ip，修改src/AppEntry.js中ip字段

9. 连接上Android手机或者打开Android虚拟机，在根目录进行 react-native run-android 可以进行应用安装

10. 在chart目录中，如果你安装了http-server（没安装的话，npm install http-server -g）,运行http-server -p 9898，然后就可以浏览器打开localhost:9898查看整个schema结构关系

技术栈：

Frontend:

react-native

graphql

react-apollo

apollo-boost（apollo套件）

@shoutem/ui（ui）

react-navigation（路由）

@react-native-community/async-storage（客户端存储）

react-native-pose（动画）

react-native-charts-wrapper（图表）

prisma

Backend:

graphql-yoga

prisma

prisma-client-lib

bcryptjs 密码加密

jsonwebtoken  生成token


docker（prisma本地服务）

待解决的bug

1. follow 