---
layout: post
title:  "JDK5.0新增特性：foreach循环"
date:   2016-04-13 22:26:32 +0800
categories: dev
tags: Java
author: 王涛
---

在JDK5之前，迭代一个集合很繁琐。例如下面这个方法-从一个集合中遍历定时器任务并取消它们：

{% highlight java %}
void cancelAll(Collection<TimerTask> c) {
    for (Iterator<TimerTask> i = c.iterator(); i.hasNext(); )
        i.next().cancel();
}
{% endhighlight %}

使用迭代器实现循环的写法使代码看起来很混乱。而且，这样写更容易发生错误。迭代器变量i在每次循环中出现了3次：多出来的两次就有可能带来错误。foreach的写法避免了代码的混乱、减少了出错的机会。下面是使用foreach实现这个方法的代码：

{% highlight java %}
void cancelAll(Collection<TimerTask> c) {
    for (TimerTask t : c)
        t.cancel();
}
{% endhighlight %}

上面这段代码中的(:)可以理解为“in”，循环语句for(TimerTask t : c)可以理解为“对于c中的每个TimerTask类型对象t”。如你所见，foreach写法将美观和泛型结合在一起，避免代码混乱的同时也保证了类型安全。因为这种写法既不需要声明迭代器，也不需要为迭代器提供泛型声明（编译器帮助我们实现这部分逻辑，我们不必关心这部分实现）。

下面的例子是人们对两个集合做嵌套循环常犯的错误：

{% highlight java %}
List suits = ...;
List ranks = ...;
List sortedDeck = new ArrayList();

// BROKEN - throws NoSuchElementException!
for (Iterator i = suits.iterator(); i.hasNext(); )
    for (Iterator j = ranks.iterator(); j.hasNext(); )
        sortedDeck.add(new Card(i.next(), j.next()));
{% endhighlight %}

你能找出错误吗？如果找不到也没关系，许多高级程序员也犯过这个错误。问题在于外层循环的集合suits使用迭代器访问了过多的next()方法，在内层循环中既调用了内层集合的next()方法，也调用了外层集合的next()方法。为了解决这个问题，需要在外层循环的作用域中增加一个变量来保存suit：

{% highlight java %}
// Fixed, though a bit ugly
for (Iterator i = suits.iterator(); i.hasNext(); ) {
    Suit suit = (Suit) i.next();
    for (Iterator j = ranks.iterator(); j.hasNext(); )
        sortedDeck.add(new Card(suit, j.next()));
}
{% endhighlight %}

那么，如果使用foreach应该怎么写这段代码呢？它简直是为嵌套循环量身定做的：

{% highlight java %}
for (Suit suit : suits)
    for (Rank rank : ranks)
        sortedDeck.add(new Card(suit, rank));
{% endhighlight %}

foreach循环同样适用于数组，区别在于隐藏的是索引变量而不是迭代器。下面方法返回的是一个整数数组中所有元素的和：

{% highlight java %}
// Returns the sum of the elements of an int array
int sum(int[] a) {
    int result = 0;
    for (int i : a)
        result += i;
    return result;
}
{% endhighlight %}

那么什么时候才应该使用foreach循环呢？任何时候，除了需要删除操作时。因为删除集合中的元素需要访问迭代器iterator来调用remove()方法，foreach循环将迭代器隐藏了，所以无法调用remove()方法。因此，foreach循环不适合做过滤操作，同样的也不适合替换列表或数组中的元素，最后，它也不适合同时遍历不同类型集合的循环。尽管如此，设计者仍然在JDK5推出了foreach循环，因为它可以在大多数情况下使用并简化代码结构。

**[官网文档](http://docs.oracle.com/javase/1.5.0/docs/guide/language/foreach.html)**

（完）