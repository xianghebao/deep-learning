var tmp =123
if(true){
    console.log(tmp)
    let tmp
}

// 答：  tmp is notdefined
// 因为let没有变量提升，但是使用let又产生了块级作用域