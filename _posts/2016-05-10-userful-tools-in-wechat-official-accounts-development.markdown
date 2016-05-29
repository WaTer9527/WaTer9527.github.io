---
layout: post
title:  "微信公众号开发-那些神兵利器"
date:   2016-05-10 08:23:41 +0800
categories: blog
tags: Wechat
keywords: 微信,公众号,开发,工具,ngrok,weui
excerpt: 介绍了微信公众号开发常用的工具，像ngrok，weui，微信web开发者工具，公众平台测试账号，在线接口调试工具。
author: 王涛
---

## 反向代理[ngrok](https://ngrok.com/)

微信公众号开发第一步，服务器配置，要想接入自己的服务，要求服务器能够接受微信的请求并且根据其文档提供的规则正确响应请求。填写URL时要求必须以http://或https://开头，分别支持80端口和443端口。

那么问题来了，作为一个开发者，可能我们在一个本地的内网中，也可能没有域名或者固定IP，那么怎么让微信服务器访问到我们的服务呢？推荐的解决办法是使用ngrok服务，在国内有许多网友自行搭建的ngrok服务，大家可以搜索一下。

比如，若提供ngrok服务的域名为tunnel.example.com，我们启动本地的ngrok工具，设置subdomain为water，并映射端口至8080。那么在服务器配置中填写URL配置为：http://water.tunnel.example.com后，微信服务器访问该地址时，我们位于本地的服务(地址：http://localhost:8080)将会接收到该请求。

ngrok在公共的端点和本地运行的 Web 服务器之间建立一个安全的通道。其功能不止这些，大家可以查看[ngrok官网](https://ngrok.com/)查看所有功能。

## 微信网页开发样式库[**weui**](http://weui.github.io/weui/#/)

WeUI 是一套同微信原生视觉体验一致的基础样式库，由微信官方设计团队为微信内网页开发量身设计，可以令用户的使用感知更加统一。在微信网页开发中使用 WeUI，有如下优势：

1. 同微信客户端一致的视觉效果，令所有微信用户都能更容易地使用你的网站

2. 便捷获取快速使用，降低开发和设计成本

3. 微信设计团队精心打造，清晰明确，简洁大方

该样式库目前包含 button、cell、dialog、progress、toast、article、icon 等各式元素，已经在[GitHub](https://github.com/weui/weui)上开源。

## [微信web开发者工具](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1455784140&token=&lang=zh_CN)

为帮助开发者更方便、更安全地开发和调试基于微信的网页，微信团队推出了 web 开发者工具。它是一个桌面应用，通过模拟微信客户端的表现，使得开发者可以使用这个工具方便地在 PC 或者 Mac 上进行开发和调试工作。

你可以：

1. 使用自己的微信号来调试微信网页授权

2. 调试、检验页面的 JS-SDK 相关功能与权限，模拟大部分 SDK 的输入和输出

3. 使用基于 weinre 的移动调试功能，支持 X5 Blink 内核的远程调试

4. 利用集成的 Chrome DevTools 协助开发

## [公众平台测试账号](http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)

公众平台测试账号可以帮助开发者避免在生产环境上进行页面和接口的开发调试。测试账号支持大部分的测试接口，不支持微信支付接口。

## [在线接口调试工具](http://mp.weixin.qq.com/debug)

此工具旨在帮助开发者检测调用【微信公众平台开发者API】时发送的请求参数是否正确，提交相关信息后可获得服务器的验证结果。

此外，还有许多可以使用的工具：

* 调试自身服务的http请求处理，推荐使用Postman或者Fiddler。

* json格式数据与Java对象转换的类库[fastjson](https://github.com/alibaba/fastjson)。

* 编码解码工具类库[commons-codec](https://github.com/apache/commons-codec)，包含公众号开发中使用的MD5、SHA1算法等。

(完)



