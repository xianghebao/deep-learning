var a =[]
for(var i=0 ; i<10;i++){
    a[i]=function(){
        console.log(i)
    }
}
a[6]()


// 答 ： 10
// 因为var没有块级作用域，都是全局作用域i,所以当执行后都是最后一个数10
