var a = 10
var obj = {
    a: 20,
    fn() {
        // 这里的this指向调用者
        setTimeout(() => {
            console.log(this.a)
        })
    }
}

obj.fn()

// 答：20
// 因为箭头函数中的this指向最近一个非箭头函数的父级