//详述 let var const 三种声明变量的方式之间的具体差别
// var 声明变量存在变量提升、重复声明、变量污染的问题。
// let、const声明引入块级作用域的概念，解决变量提升、重复声明，变量污染的问题。
// let 声明会有临时性死区问题的存在。
// let 声明之后不允许再次声明，可以更改。
// const 声明之后不允许更改，一般用来声明常量。这个不允许更改不是绝对的，当使用const 声明的是引用类型（数组、函数、对象）时，是可以更改对象属性的，但是不允许更改对象引用。这是因为对象存在堆中，栈中保存的是对象的引用，因此只要引用不变，对象的属性和方式是可以更改的。
