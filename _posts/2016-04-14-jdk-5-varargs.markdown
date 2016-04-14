---
layout: post
title:  "JDK5.0新增特性：变长参数-Varargs"
date:   2016-04-14 23:26:32 +0800
categories: dev
tags: Java
author: 王涛
---

在过去的JDK版本中，如果一个方法需要接受任意数量的参数值，需要将形参定义为一个数组，在调用方法之前将所有的值放到这个数组中。例如下面这个消息格式化的例子：

{% highlight java %}
Object[] arguments = {
    new Integer(7),
    new Date(),
    "a disturbance in the Force"
};

String result = MessageFormat.format(
    "At {1,time} on {1,date}, there was {2} on planet "
     + "{0,number,integer}.", arguments);
{% endhighlight %}

变长参数的特性仍然会将多个参数封装到数组中，但是它会隐藏这个过程，通过编译器自动实现。并且，它与先前存在的API向上兼容。例如，MessageFormat.format方法现在有这样的声明：

{% highlight java %}
public static String format(String pattern,
                                Object... arguments);
{% endhighlight %}

最后一个参数的类型后面的3个句号意味着这些参数将会被转换为一个数组或者参数序列，并且变长参数只能定义在最后一个。假如MessageFormat.format使用变长参数声明，上面的调用就可以写成下面这种简洁的方式：

{% highlight java %}
String result = MessageFormat.format(
    "At {1,time} on {1,date}, there was {2} on planet "
    + "{0,number,integer}.",
    7, new Date(), "a disturbance in the Force");
{% endhighlight %}

下面这段程序则说明了变长参数和自动装箱可以高效的协作：

{% highlight java %}
// Simple test framework
public class Test {
    public static void main(String[] args) {
        int passed = 0;
        int failed = 0;
        for (String className : args) {
            try {
                Class c = Class.forName(className);
                c.getMethod("test").invoke(c.newInstance());
                passed++;
            } catch (Exception ex) {
                System.out.printf("%s failed: %s%n", className, ex);
                failed++;
            }
        }
        System.out.printf("passed=%d; failed=%d%n", passed, failed);
    }
}
{% endhighlight %}

这个小程序是一个完整的，最简的测试框架。它接收命令行输入的一组类名，对于每一个类名，它使用这个类的无参构造器实例化一个对象，并调用名为test的无参方法。如果在实例化或调用方法过程中抛出异常，就认为对这个类的测试失败。程序会输出每次失败的测试结果说明。通过反射进行实例化类对象和调用方法的过程不再需要显式的创建数组，因为getMethod方法和invoke方法可以接收变长参数。这段程序同时还使用了JDK5新增的基于变长参数的printf方法。变长参数使得这段程序看起来更自然。

**[官网文档](http://docs.oracle.com/javase/1.5.0/docs/guide/language/varargs.html)**

（完）