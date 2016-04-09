---
layout: post
title:  "JDK5.0文档翻译 - 泛型"
date:   2016-04-09 22:00:32 +0800
categories: dev
tags: Java
---

当你从集合中取出一个元素时，你必须将它（从Object类型）强制转换成集合中存储的类型。这不仅使事情复杂化，而且是不安全的。由于编译器没有检查强制转换的类型和集合存储的类型的一致性，程序可能会在运行时出现错误。

泛型为程序员和编译器提供了确认集合类型的机制，使得类型可以得到检查。当编译器知晓了集合中元素的类型后，编译器就可以检查你是否正确的使用集合，并且可以注入与集合中取出的值类型相同的类型转换，即保证了类型转换的正确性。

下面是JDK5.0之前对集合的使用代码：

{% highlight java %}
// Removes 4-letter words from c. Elements must be strings
static void expurgate(Collection c) {
    for (Iterator i = c.iterator(); i.hasNext(); )
      if (((String) i.next()).length() == 4)
        i.remove();
}
{% endhighlight %}

而下面则是使用了泛型以后的代码：

{% highlight java %}
// Removes the 4-letter words from c
static void expurgate(Collection<String> c) {
    for (Iterator<String> i = c.iterator(); i.hasNext(); )
      if (i.next().length() == 4)
        i.remove();
}
{% endhighlight %}

当你看到代码<Type>，可以等同于“Type类型的”；上面代码Collection<String>的定义可以等同于"String类型的集合“，使用泛型的代码变得既简洁又安全。我们省去了不安全类型转换的同时也减少了括号的使用量。更重要的是，我们把方法的部分说明从注释转移到了方法的签名中，这样编译器就能在编译期验证类型限制，保证不会在运行时违反该限制。因为程序编译过程中没有警告，我们可以确定在运行时它不会抛出类型转换异常。在大型程序中使用泛型则会提高其可读性和鲁棒性。

正如泛型规范的作者Gilad Bracha所说，当我们定义一个Collection<String>类型的变量c后，在任何时候、任何地点使用变量c都是有效的，编译器会帮助实现这一点，如果使用不正确，编译时会有警告。而由程序员编写的强制类型转换，只是程序员的一厢情愿，其正确性在运行时才会由虚拟机验证。

除了在集合类中的使用，泛型还有许多其他的用处。“支持类”，比如WeakReference和ThreadLocal，针对泛型做了更新，即被泛型化处理。更出人意料的是，Class类也做了泛型化处理。Class的泛型作为实际类型的标记，为运行时和编译器提供类型信息。这使得下面这种静态工厂的实现成为了可能，实例为新的AnnotatedElement接口的getAnnotation方法。

{% highlight java %}
<T extends Annotation> T getAnnotation(Class<T> annotationType);
{% endhighlight %}

这是一个泛型方法。通过参数推导出类型形参T的值，并且返回一个合适的T的实例，如下所示：

{% highlight java %}
Author a = Othello.class.getAnnotation(Author.class);
{% endhighlight %}

没有使用泛型时，你必须将返回值强转为Author类型。而且你也没有办法让编译器去检查实际的参数是否是Annotation的子类。

泛型通过类型擦除技术实现：泛型的类型信息只在编译之前存在，过后将被编译器擦除。这种实现方式的主要优点就是保证了泛型代码与遗留代码（未使用泛型）的互操作性。主要缺点是类型信息在运行时是得不到的，这就导致了在和不良代码的交互中出现类型转换失败。不过，对于集合类，是有办法保证这种运行时的类型安全的。

类java.util.Collections装备了包装器方法用来保证运行时的类型安全。在结构上他们与synchronized包装器方法和unmodifiable包装器方法类似。这些“已检查的集合包装器方法“对于调试时非常有用的。假设你定义了一个String类型的集合s，而遗留代码莫名其妙的向s中插入了一个Integer对象。如果没有包装器，在将该问题元素取出之前代码将一切正常，而后自动类型转换将失败。这时候，定位问题已经太晚了。然而，你可以将这种写法：

{% highlight java %}
Set<String> s = new HashSet<String>();
{% endhighlight %}

改成下面这种写法：

{% highlight java %}
Set<String> s = new HashSet<String>();
{% endhighlight %}

该集合将会在遗留代码视图插入Integer对象是抛出类型转换异常。异常的栈轨迹可以帮助你诊断并修复问题。

你需要在所有能用到泛型的地方使用泛型。与获得的清晰度和安全性相比，泛型化代码所带来的额外工作是值得的。泛型类库不是凭空产生的，需要技术专家去实现（直接编写或者泛型化现有类库）。这里有个坑：如果使用5.0之前的虚拟机版本运行编译后的代码，泛型可能会失效。

如果你熟悉C++的模板机制，你可能会任务泛型也差不多，但是这只是表面现象。泛型不会为每个具体的实现生成一个新类，也不允许“模板元编程”。

泛型知识还有很多，同学仍需努力。

**[官网文档](http://docs.oracle.com/javase/1.5.0/docs/guide/language/generics.html)**

（完）

