---
layout: post
title:  "JDK5.0新增特性：泛型"
date:   2016-04-09 22:30:32 +0800
categories: dev
tags: Java
---

## What - 什么是泛型？

泛型（generics）是JDK5.0新增的一个特性，是参数化类型（Parameterized Type)的应用。

在写该文章时还没有找到泛型这个词的中文解释，只能通过英文解释来理解了。generic，形容词，翻译为一般的、类的。个人认为泛型指泛化的类型，从这个意思来看generics type更适合泛型这个词。泛型本质上是对类型的抽象，并将抽象后的类型以参数形式定义，即参数化类型。
 
最典型的就是集合类中出现的泛型，比如JDK5.0中开始使用泛型的List接口：
 
{% highlight java %}
public interface List<E> extends Collection<E> {
    Iterator<E> iterator();
    <T> T[] toArray(T[] a);
}
{% endhighlight %}

使用该接口时：

{% highlight java %}
List<Integer> myIntList = new LinkedList<Integer>();
myIntList.add(new Integer(0));
Integer x = myIntList.iterator().next();
{% endhighlight %}

其中List<E>是泛型接口，toArray是泛型方法。尖括号中的E可以称之为形参（the formal type parameter），而使用时尖括号中的Integer则称为实参（the actual type argument）。形参是泛型接口、泛型类或泛型方法定义时声明的参数，实参则是其在使用时传入的类型。

## How - 怎样定义及使用泛型？

### 1.定义简单的泛型

以java.util包中的List和Iterator接口为例：

{% highlight java %}
public interface List<E> {
    void add(E x);
    Iterator<E> iterator();
}
public interface Iterator<E> {
    E next();
    Boolean hasNext();
}
{% endhighlight %}

泛型化的List和Iterator接口在尖括号中声明了泛型的形参（formal type parameter），该形参E为大写字母，是Element的缩写。由此可以理解形参的推荐声明方式：

1. 简写，一个字母最好。
2. 大写，突出泛型。
3. 语义化，如E(Element)、T(Type)、K(Key)、V(Value)。

声明形参后，该形参可以在声明的作用范围（下一个{}代码块）中使用。

### 2.泛型和子类型

继续深入了解泛型，看下面的代码片段：

{% highlight java %}
List<String> ls = new ArrayList<String>();//1
List<Object> lo = ls;//2
{% endhighlight %}

问题来了，该片段能否通过编译？第一行当然是正确的，需要注意的是第二行。该问题就可以归结为：is a List of String a List of Object。

我们可以通过下面的代码来回答这个问题：
  
{% highlight java %}
lo.add(new Object());//3
String s = ls.get(0);//4:attempts to assign an Object to a String!
{% endhighlight %}

将这段代码解释一下：定义了两个变量ls和lo，分别是String类型的List和Object类型的List。假设第二行是正确的，即String类型的List是Object类型的List的子类型。按照假设，第三行是毫无疑问正确的，问题出在第四行，此时的ls中不只是String类型的对象，所以强制类型转换将出现异常。

当然，第二行在实际的编译时不会通过，所以后面的异常也不会发生。
 
总之，如果Foo是Bar的子类型（子类或子接口），而G是泛型的声明，G<Foo>仍然不是G<Bar>的子类型。

### 3.通配符

假设要写一个程序，将一个集合中的所有元素打印出来。在JDK5.0之前的版本中你一般会这么写：

{% highlight java %}
void printCollection(Collection c) {
    Iterator i = c.iterator();
    for (k = 0; k < c.size(); k ++) {
        System.out.println(i.next());
    }
}
{% endhighlight %}

而刚接触泛型后你可能会像下面这样改写（同时使用了foreach）：

{% highlight java %}
void printCollection(Collection<Object> c) {
    for ( Object e : c) {
        System.out.println(e);
    }
}
{% endhighlight %}

问题在于改写后的代码使用范围减小了。改写前的代码适用于所有的Collection类型的参数，而改写后的代码只适用于Collection<Object>类型的参数，正如我们刚刚了解的，Collection<Object>既不是Collection<String>的父类型，也不是Collection<Integer>的父类型。

这个问题的解决方案就是通配符，Collection<?>，指元素为任意类型的集合。正确的泛型化改写应当时这样的：

{% highlight java %}
void printCollection(Collection<?> c) {
    for (Object e : c) {
        System.out.println(e);
    }
}
{% endhighlight %}

在上面的代码中，使用通配符的Collection对象可以遍历，并把元素转换为Object类型，这是合理的，因为Object类是所有类的父类。但是这里还存在另外一个问题：我们不能向Collection<?>中添加任何对象，null例外。这是因为通配符？表示该集合存储的元素类型未知，可以是任何类型。向集合中加入元素需要是未知类型的子类型，只有null是所有类型的子类型，所以会出现上面的问题。

### 4.边界通配符

假设需要一个绘图软件来绘制长方形、圆形等形状，让你来编程实现，你可能会定义 下面几个类的层级关系：

{% highlight java %}
public abstract class Shape {
    public abstract void draw(Canvas c);
}

public class Circle extends Shape {
    private int x, y, radius;
    public void draw(Canvas c) {
        ...
    }
}

public class Rectangle extends Shape {
    private int x, y, width, height;
    public void draw(Canvas c) {
        ...
    }
}

public class Canvas {
    public void draw (Shape s) {
        s.draw(this);
    }
}
{% endhighlight %}

一次绘图可能会包含多种形状，假如把这些形状放到一个列表中，那么我们就需要在Canvas类中添加一个方法，实现一次操作把这些形状都绘制出来：

{% highlight java %}
public void drawAll(List<Shape> shapes) {
    for(Shape s : shapes) {
        s.draw(this);
    }
}
{% endhighlight %}

现在问题又来了，drawAll这个方法被调用时只能传入类型为List<Shape>的参数，而不能传入类型为List<Circle>的参数。其实我们想要的方法能够接收任何属于Shape类型的列表，下面就是这种情况的解决方案-边界通配符：

{% highlight java %}
public void drawAll(List<? extends Shape> shapes) {
    ...
}
{% endhighlight %}

现在，drawAll方法可以接收所有元素为Shape子类型的列表了，在这里，我们把<? extends Shape>中的Shape类型称之为通配符的上边界。

边界通配符带来灵活性的同时也带来了弊端：不能向边界通配符的列表中添加元素，下面的代码在编译时会报错：

{% highlight java %}
public void addRectangle(List<? extends Shape> shapes) {
    //Compile-time error!
    shapes.add(0, new Rectangle());
}
{% endhighlight %}

编译不通过的原因是：add方法的参数应当是<? extends Shape>中Shape类的子类型，具体是什么子类型是未知的，不能保证具体的子类型是Rectangle的超类，所以添加Rectangle对象是不安全的。

### 5.泛型方法

考虑实现一个方法，该方法拷贝一个数组中的所有对象到集合中。第一次编码可能如下：

{% highlight java %}
static void fromArrayToCollection(Object[] a, Collection<?> c) {
    for (Object o : a) {
        c.add(o);//compile-time error
    }
}
{% endhighlight %}

上面的代码将会出现编译错误，原因是无法向类型为 Collection<?>的c中放入任何对象。下面就是这种问题的解决方案-泛型方法：

{% highlight java %}
static <T> void fromArrayToCollection (T[] a, Collection<T> c) {
    for(T o : a) {
        c.add(o);//Correct
    }
}
{% endhighlight %}

注意泛型方法的格式，类型参数<T>需要放在函数返回值之前，并且可以是多个参数，例如<T, S extends T>。只要集合中元素的类型是数组中元素类型的超类，我们就可以调用上面的方法。

{% highlight java %}
Object[] oa = new Object[100];
Collection<Object> co = newArrayList<Object>();
 
// T inferred to be Object
fromArrayToCollection(oa, co);
 
String[] sa = new String[100];
Collection<String> cs = newArrayList<String>();
 
// T inferred to be String
fromArrayToCollection(sa, cs);
 
// T inferred to be Object
fromArrayToCollection(sa, co);
 
Integer[] ia = new Integer[100];
Float[] fa = new Float[100];
Number[] na = new Number[100];
Collection<Number> cn = newArrayList<Number>();
 
// T inferred to be Number
fromArrayToCollection(ia, cn);
 
// T inferred to be Number
fromArrayToCollection(fa, cn);
 
// T inferred to be Number
fromArrayToCollection(na, cn);
 
// T inferred to be Object
fromArrayToCollection(na, co);
 
// compile-time error
fromArrayToCollection(na, cs);
{% endhighlight %}

注意调用泛型方法时不需要传递类型参数，编译器会根据实际传入的参数来自动匹配。当然在某些情况下需要指定传递类型参数，比如当存在与泛型方法相似的方法（同名并且参数类型相似）的时候， 如下面的例子：

{% highlight java %}
public  <T> void go(T t) {
    System.out.println("genericfunction");
}
public void go(String str) {
    System.out.println("normalfunction");
}
public staticvoid main(String[] args) {
    FuncGenric fg = new FuncGenric();
    fg.go("haha");//打印normal function
    fg.<String>go("haha");//打印generic function
    fg.go(new Object());//打印generic function
    fg.<Object>go(newObject());//打印genericfunction
}
{% endhighlight %}

## Why - 为什么要使用泛型

在使用泛型技术之前，对集合类的操作经常会用到强制类型转换，而这部分的工作是程序员来完成的。大量的强制类型转换不仅降低了代码的可读性，还增加了代码出错的几率（程序员是不可控的）。

泛型技术提供了一种机制，可以使编译器来保证强制类型转换的正确性。对于List<Integer>定义的列表对象myIntList的方法调用，编译器会在必要的时候添加类型检查和类型转换，从而保证放入和取出的值均为 Integer类型。

本质上来讲，泛型技术只是一种方便程序员进行代码开发的语法糖，在编译器生成的字节码文件中，泛型将被原生类型（Raw Type）所取代。对运行时来说，语法糖并不会提供实质性的功能改进，但它能提升语法的严谨性、可读性，减少编码出错的几率。

**[官网文档](http://docs.oracle.com/javase/tutorial/extra/generics/index.html)**

（完）