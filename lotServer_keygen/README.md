# ServSpeeder-NodeJS
针对[原项目](https://github.com/ruterfu/ServerSpeeder-AutoInstaller)的nodejs实现避免了安装tomcat把小内存VPS直接搞炸的风险.

## 如何运行
---
在您已经安装nodejs(v4.0.0+)环境的情况下
```
git clone https://github.com/Srar/ServerSpeeder-AutoInstaller.git
cd ./ServerSpeeder-AutoInstaller/ServerSpeederCreckServer
npm install
node app.js
```
程序默认监听4000端口，您可以访问特定路由来生成授权文件:
```
http://127.0.0.1:4000/regenspeeder/lic?bandWidth=1G&mac=00:00:00:00:00:00&expires=2023-03-03
```
上述例子会为`00:00:00:00:00:00`MAC地址网卡生成一个速度上限1Gpbs和到期时间为`2023-03-03`的授权文件

锐速心跳包访问地址, 您可以通过配置Nginx与Hosts来强制指定访问:
* my.serverspeeder.com
* www.serverspeeder.com
* dl.serverspeeder.com
```
server {
    listen          80;
    server_name     my.serverspeeder.com www.serverspeeder.com dl.serverspeeder.com;

    charset utf8;

    location / {
        proxy_pass http://127.0.0.1:4000/;
    }
}
```
