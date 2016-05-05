---
layout: post
title:  "微信支付签名算法注意事项"
date:   2016-05-05 18:22:31 +0800
categories: blog
tags: Wechat
author: 王涛
---

最近在做微信公众号开发，其中需要对接微信支付，遇到不少坑，这其中主要包括签名和配置域名及url。下面介绍签名算法中可能会踩到的坑：

* **过滤空值**

* **参数排序**

* **参数名大小写敏感**

* **签名字符串尾部拼接"key={key}"**，key值设置路径：[微信商户平台](https://pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置

* **MD5运算后所有字符转换为大写**

下面是实现签名的步骤（附部分Java代码）：

**一、过滤**

规则：如果参数的值为空不参与签名；验证调用返回或微信主动通知签名时，传送的sign参数不参与签名，将生成的签名与该sign值作校验。

示例代码：

{% highlight java %}
/**
 * 除去数组中的空值和签名参数
 * 
 * @param sArray
 *            签名参数组
 * @return 去掉空值与签名参数后的新签名参数组
 */
public static Map<String, String> paraFilter(Map<String, String> sArray) {

	Map<String, String> result = new HashMap<String, String>();

	if (sArray == null || sArray.size() <= 0) {
		return result;
	}

	for (String key : sArray.keySet()) {
		String value = sArray.get(key);
		if (value == null || value.equals("") || key.equalsIgnoreCase("sign")) {
			continue;
		}

		result.put(key, value);
	}

	return result;
}
{% endhighlight %}

**二、排序**

规则：参数名ASCII码从小到大排序（字典序）。

**三、拼接字符串**

规则：使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串prestr

示例代码：

{% highlight java %}
/**
 * 把数组所有元素排序，并按照“参数=参数值”的模式用“&”字符拼接成字符串
 * 
 * @param params
 *            需要排序并参与字符拼接的参数组
 * @return 拼接后字符串
 */
public static String createLinkString(Map<String, String> params) {

	List<String> keys = new ArrayList<String>(params.keySet());
	Collections.sort(keys);

	String prestr = "";

	for (int i = 0; i < keys.size(); i++) {
		String key = keys.get(i);
		String value = params.get(key);

		if (i == keys.size() - 1) {// 拼接时，不包括最后一个&字符
			prestr = prestr + key + "=" + value;
		} else {
			prestr = prestr + key + "=" + value + "&";
		}
	}

	return prestr;
}
{% endhighlight %}

**四、签名**

规则：在prestr最后拼接上key得到stringSignTemp字符串，并对stringSignTemp进行MD5运算，再将得到的字符串所有字符转换为大写，得到sign值。

示例代码：

{% highlight java %}
String sign = MD5(prestr + "&key=" + key).toUpperCase();
{% endhighlight %}

**[我的微信公众号开发项目](https://github.com/WaTer9527/wechat-mp4j)**

(完)