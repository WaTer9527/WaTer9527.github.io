---
layout: post
title:  "JDK5.0新增特性：静态导入"
date:   2016-04-12 23:30:32 +0800
categories: dev
tags: Java
author: 王涛
---

为了访问静态成员，我们必须通过他们所属的类来调用。例如，使用静态成员时必须这样写：

{% highlight java %}
double r = Math.cos(Math.PI * theta);
{% endhighlight %}

为了解决这个问题，人们有时把静态成员放入一个接口，让使用该静态成员的类来继承接口。这种写法糟糕的已经榜上有名了：接口常量反模式-the Constant Interface Antipattern（参考Effective Java第17条）。问题是一个类对其他类的静态成员的使用只是一个实现细节。而当一个类继承一个接口时，静态成员成为了类的公共API。实现细节不应泄露到公共API。

静态导入概念允许访问其他类的静态成员而不必继承该类。取代的写法是，使用import在程序头部导入静态成员，可以单个导入：

{% highlight java %}
import static java.lang.Math.PI;
{% endhighlight %}

也可以集体导入：

{% highlight java %}
import static java.lang.Math.*;
{% endhighlight %}

一旦静态成员已导入，就可以不受类的限制而直接使用：

{% highlight java %}
double r = cos(PI * theta);
{% endhighlight %}

静态导入的声明和普通导入的声明是类似的。普通导入声明的是从包中导入类，允许使用导入的类而不受包的限制，而静态导入声明的是从类中导入静态成员，允许使用导入的静态成员而不受类的限制。

那么我们该什么时候使用静态导入呢？谨慎使用！当不得不声明本地的常量副本或者滥用继承（接口常量反模式）时使用。换句话说，当需要频繁的访问一个或两个类中的静态成员时使用。如果过度使用静态导入功能，程序将不可读和不可维护，并且会污染所有导入静态成员的命名空间。代码的读者（包括作者，几个月后）将分不清静态成员来自哪一个类。使用通配符*导入一个类中的所有静态成员尤其会降低可读性，如果只是需要其中的一个或两个静态成员，单个导入他们。使用得当，静态导入会消除对类名的重复引用，提高程序的可读性。

**[官网文档](http://docs.oracle.com/javase/1.5.0/docs/guide/language/static-import.html)**

（完）