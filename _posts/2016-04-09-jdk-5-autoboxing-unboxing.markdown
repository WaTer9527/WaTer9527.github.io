---
layout: post
title:  "JDK5.0新增特性：自动装箱与拆箱"
date:   2016-04-09 21:00:32 +0800
categories: dev
tags: Java
author: 王涛
---
## What-什么是自动装箱和拆箱

自动装箱（autoboxing）指编译器自动将基本数据类型转换为包装类，而拆箱(unboxing)则是将程序中的包装类转换为基本数据类型。
理解这句话必须先理解其中的三个名词：编译器、基本数据类型和包装类。

 * 编译器就是将一种语言（通常为高级语言，这里指Java编程语言）翻译为另一种语言（通常为低级语言，这里指编译后的命令语言）的程序。
 * 基本数据类型在Java语言中包括byte、short、int、long、float、double、boolean、char共8项。
 * 包装类对应基本数据类型分别为Byte、Short、Integer、Long、Float、Double、Boolean、Character。
 
**[官网文档](http://docs.oracle.com/javase/1.5.0/docs/guide/language/autoboxing.html)**

## How-怎样进行自动装箱和拆箱

在JDK5.0之前，要生成一个数值为2的Integer对象，需要这样写：

{% highlight java %}
Integer i = new Integer(2);//装箱
Integer j = Integer.valueOf(2);//装箱
int a = i.intValue();//拆箱
{% endhighlight %}

而从JDK5.0开始，只需这样写：

{% highlight java %}
Integer i = 2;//自动装箱
int a = i;//自动拆箱
{% endhighlight %}

查看编译后的字节码（使用javap命令）可以发现，自动装箱替换为Integer.valueOf方法，而自动拆箱替换为intValue方法。

## Why-为什么要进行自动装箱和拆箱

下面这段话是官网文档中的片段：

 > As any Java programmer knows, you can’t put an int (or other primitive value) into a collection. Collections can only hold object references, so you have to boxprimitive values into the appropriate wrapper class (which is Integer in the case of int). When you take the object out of the collection, you get the Integer that you put in; if you need an int, you must unbox the Integer using the intValue method. All of this boxing and unboxing is a pain, and clutters up your code. The autoboxing and unboxing feature automates the process, eliminating the pain and the clutter.
 
 简单翻译下：在Java语言中，程序员不能够向集合中添加基本数据类型的值（比如int类型）。集合中只能保存对象的引用，所以程序员必须把该值包装到其对应的包装类中（对应int类型的包装类是Integer)。当从集合中取出对象时，得到的是Integer类型的对象，如果需要int类型的值，程序员必须使用intValue这个方法对该对象作拆箱处理。所有的装箱和拆箱给程序员带来痛苦，使程序变得混乱。自动装箱和拆箱的特性使其过程自动化，排除了对程序员和代码的干扰。
 
 总之，自动装箱和拆箱简化了包装类的使用，减少了程序员的编码量，但是对运行时并没有任何的改变。
 
 （完）
