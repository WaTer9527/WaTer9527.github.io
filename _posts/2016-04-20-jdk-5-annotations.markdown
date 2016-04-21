---
layout: post
title:  "JDK5.0新增特性：注解-Annotations"
date:   2016-04-20 22:41:31 +0800
categories: dev
tags: Java
author: 王涛
---

许多API都会需要写相当数量的模板代码。例如，为了写一个JAX-RPC的web服务，程序员必须提供一组接口及其实现。其实，有一种简便的方法，我们只需要为远程访问（提供服务）的方法加上注解，然后使用工具自动识别这些注解并生成模板代码即可。

其他的API需要维护一些附属文件，而这些附属文件是要与源代码中的更改保持同步的。例如JavaBeans需要为每一个bean维护一个BeanInfo的类，Enterprise JavaBean(EJB)则需要部署描述符号（deployment descriptor）。如果这些附属文件中包含的信息是通过程序本身的注解来维护，那么这种维护方式将更方便、不易出错。

Java平台一直有各种专设注解机制。例如修饰符transient就是一个专设的注解，用于表明一个成员变量在序列化时应当被忽略，同时javadoc的标签@deprecated也是一个专设的注解，用于表明方法已被弃用，不应该使用。从JDK5.0版本开始，该平台具有了通用注解（也称为元数据）工具，它允许程序员定义和使用自己的注解类型。该工具包含注解类型的定义语法、注解类型的声明（使用）语法、注解解释API、注解类文件以及注解处理工具。

注解不会直接影响程序的语义，但是它们会影响工具和类库处理程序的方式，从而间接地影响到程序运行时的语义。注解的访问方式包括源文件、字节码文件、运行时反射。

注解补充Javadoc标签。在一般情况下，如果该标记是为了影响或产生文档，它应该是一个javadoc标签;否则，它应该是一个注解。

典型的应用程序的程序员可能永远不需要定义一个注解类型，但定义注解类型并不难。注释类型的定义和普通接口的定义是类似的：

* 在interface关键字前加@符号。

* 每一个方法定义一个注解类型的元素。

* 方法必须是无参的并且没有抛出（throws）声明。

* 返回类型仅限于基本类型、String、Class、enums、annotations或者这些类型的数组类型。

* 方法可以定义默认值。

下面是定义一个注解类型的示例：

{% highlight java %}
/**
 * Describes the Request-For-Enhancement(RFE) that led
 * to the presence of the annotated API element.
 */
public @interface RequestForEnhancement {
    int    id();
    String synopsis();
    String engineer() default "[unassigned]"; 
    String date();    default "[unimplemented]"; 
}
{% endhighlight %}

一旦定义了一个注解类型，你就可以用它来为声明添加注解。注解是一种特殊的修饰符，并且可以用在任何可以使用其他修饰符（例如public、static、final）的地方。按照约定，注解必须位于其他修饰符的前面。注解的使用：

* 以@符号开头。

* 后面是注解类型的名称。

* 再后面是一个括号，括号中包含注解的名称-值对的列表（element-value pairs）。值必须是编译期的常量。

下面是一个使用了上面定义的注解的方法声明：

{% highlight java %}
@RequestForEnhancement(
    id       = 2868724,
    synopsis = "Enable time-travel",
    engineer = "Mr. Peabody",
    date     = "4/1/3007"
)
public static void travelThroughTime(Date destination) { ... }
{% endhighlight %}

我们把没有定义元素的注解类型称之为标记注解类型（a marker annotation type），例如：

{% highlight java %}
/**
 * Indicates that the specification of the annotated API element
 * is preliminary and subject to change.
 */
public @interface Preliminary { }
{% endhighlight %}

使用标记注解时，允许省略括号，如下所示：

{% highlight java %}
@Preliminary 
public class TimeTravel { ... }
{% endhighlight %}

如果注解只定义了一个元素，元素应该命名为value，如下所示：

{% highlight java %}
/**
 * Associates a copyright notice with the annotated API element.
 */
public @interface Copyright {
    String value();
}
{% endhighlight %}

如果注解只有一个元素并且该元素命名为value，在使用注解时允许省略元素的名称和等号（=），如下所示：

{% highlight java %}
@Copyright("2002 Yoyodyne Propulsion Systems")
public class OscillationOverthruster { ... }
{% endhighlight %}

综上所述，我们现在可以创建一个基于注解的测试框架。首先我们需要定义一个注解类型Test，Test用来标识测试方法，被标识的测试方法应当使用测试工具来运行：

{% highlight java %}
import java.lang.annotation.*;

/**
 * Indicates that the annotated method is a test method.
 * This annotation should be used only on parameterless static methods.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Test { }
{% endhighlight %}

请注意，注解类型的定义也是被注解的。这些注解被称为元注解（meta-annotations）。第一个元注解（@Retention(RetentionPolicy.RUNTIME)）表明这种类型的注解可以被虚拟机（VM）保留，这样在运行时就可以通过反射来获得它们。第二个元注解（@Target(ElementType.METHOD)）表明这种注解类型只能对方法使用。

下面是一个示例程序，该类的部分方法使用了上面定义的Test注解：

{% highlight java %}
public class Foo {
    @Test 
	public static void m1() { }
	
    public static void m2() { }
	
    @Test
	public static void m3() {
        throw new RuntimeException("Boom");
    }
	
    public static void m4() { }
	
    @Test 
	public static void m5() { }
	
    public static void m6() { }
	
    @Test 
	public static void m7() {
        throw new RuntimeException("Crash");
    }
	
    public static void m8() { }
}
{% endhighlight %}

这里是测试工具：

{% highlight java %}
import java.lang.reflect.*;

public class RunTests {
   public static void main(String[] args) throws Exception {
      int passed = 0, failed = 0;
      for (Method m : Class.forName(args[0]).getMethods()) {
         if (m.isAnnotationPresent(Test.class)) {
            try {
               m.invoke(null);
               passed++;
            } catch (Throwable ex) {
               System.out.printf("Test %s failed: %s %n", m, ex.getCause());
               failed++;
            }
         }
      }
      System.out.printf("Passed: %d, Failed %d%n", passed, failed);
   }
}
{% endhighlight %}

该工具接收命令行参数中输入的类名，根据类名通过反射获取该类的所有方法，迭代该方法数组，对使用了Test注解的方法执行测试流程：调用该方法，如果抛出异常，则测试不通过并打印错误信息。最终，程序将打印测试通过和不通过的统计结果。下面是运行上面程序的结果（类为之前定义的Foo）结果：

{% highlight java %}
$ java RunTests Foo
Test public static void Foo.m3() failed: java.lang.RuntimeException: Boom 
Test public static void Foo.m7() failed: java.lang.RuntimeException: Crash 
Passed: 2, Failed 2
{% endhighlight %}

虽然这个测试工具只是一个简单的示例，但它说明了注解强大的可扩展性。

**[官网文档](http://docs.oracle.com/javase/1.5.0/docs/guide/language/annotations.html)**

（完）