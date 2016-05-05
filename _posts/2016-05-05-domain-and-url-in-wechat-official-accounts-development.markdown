---
layout: post
title:  "微信公众号开发-域名和URL配置"
date:   2016-05-05 23:45:31 +0800
categories: blog
tags: Wechat
author: 王涛
---

公众号主要通过**公众号消息会话**和**公众号网页**来为用户提供服务的。

对于公众号消息会话，开发者只有很小的自主开发权限，只能自定义菜单，使用微信提供的几类消息服务-群发消息、被动回复消息、客服消息、模板消息等。

公众号内网页，才是开发者施展拳脚的地方，在这里，开发者既可以通过网页授权获取用户基本信息来提供定制化服务，也可以通过微信JS-SDK调用微信原生功能-录制和播放微信语音、监听微信分享、拍照、微信支付等。

## 一、基本配置

### 服务器URL

**使用场景**：开发者服务器接入时正确响应微信发送的Token验证。

**[相关文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421135319&token=&lang=zh_CN)**

## 二、公众号设置-->功能设置

### 业务域名

**使用场景**：网页中存在输入框时。

1. 设置业务域名后，在微信内访问该域名下页面时，不会被重新排版。用户在该域名上进行输入时，不出现下图所示的安全提示。

2. 填写的业务域名需通过ICP备案的验证，可填写三个域名（例：wxmovie.qq.com)，一个月内最多可修改三次域名，任意一个域名变更记为一次。

![没有设置业务域名时的网页示例]({{ site.url }}/assets/images/service-domain-example.jpg)

### JS接口安全域名

**使用场景**：使用JS-SDK提供的接口时。

**[相关文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115&token=&lang=zh_CN)**

1. 设置JS接口安全域名后，公众号开发者可在该域名下调用微信开放的JS接口。

2. 填写的JS接口安全域名要求是一级或一级以上域名，须通过ICP备案的验证，可填写三个域名(例：qq.com)，一个月内最多可修改三次域名，任意一个域名变更记为一次。

## 三、接口权限-->网页账号-->修改

### OAuth2.0网页授权回调域名

**使用场景**：调用**微信授权引导URL**(https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect)时，其中参数REDIRECT_URI位于授权回调域名下。

**[相关文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842&token=&lang=zh_CN)**

用户在网页授权页同意授权给公众号后，微信会将授权数据传给一个回调页面，回调页面需在此域名下，以确保安全可靠。回调页面域名不支持IP地址。

1. 在微信公众号请求用户网页授权之前，开发者需要先到公众平台官网中的开发者中心页配置授权回调域名。请注意，这里填写的是域名（是一个字符串），而不是URL，因此请勿加 http:// 等协议头。

2. 授权回调域名配置规范为全域名，比如需要网页授权的域名为：www.qq.com，配置以后此域名下面的页面http://www.qq.com/music.html 、 http://www.qq.com/login.html 都可以进行OAuth2.0鉴权。但http://pay.qq.com 、 http://music.qq.com 、 http://qq.com无法进行OAuth2.0鉴权。

3. 如果公众号登录授权给了第三方开发者来进行管理，则不必做任何设置，由第三方代替公众号实现网页授权即可。

## 四、微信支付-->开发配置-->公众号支付

### 支付授权目录、测试授权目录

**使用场景**：需要调用微信支付的页面必须位于该授权目录下。

1. 所有使用公众号支付方式发起支付请求的链接地址，都必须在支付授权目录之下。

2. 最多设置3个支付授权目录，且域名必须通过ICP备案。

3. 头部要包含http或https，须细化到二级或三级目录，以左斜杠“/”结尾。

**[我的微信公众号开发项目](https://github.com/WaTer9527/wechat-mp4j)**

(完)