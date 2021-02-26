// 引用计数算法的原理及优缺点

// 答：
// 对于一个对象A,只要有任何一个对象引用了A,则A的引用计数器就加1;当引用失效时,引用计数器就减1。只要对象A的引用计数器的值为0,即表示对象A不可能再被使用,可进行回收。

// 缺点
// 它需要单独的字段存储计数器,这样的做法增加了存储空间的开销。
// 每次复制都需要更新计数器,伴随着加法和减法操作,这增加了时间开销。
// 引用计数器有一个严重的问题,即无法处理循环引用的情况。这是一条致命缺陷,导致在Java的垃圾回收器中没有使用这类算法。
