FROM node:12.19.0-alpine
ADD ./src /root/lotServer
WORKDIR /root/lotServer
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 4000
CMD ["node", "app.js"]