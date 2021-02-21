/*
  将下面异步代码使用 Promise 的方法改进
  尽量用看上去像同步代码的方式
  setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
      var b = 'lagou'
      setTimeout(function () {
        var c = 'I ♥ U'
        console.log(a + b +c)
      }, 10)
    }, 10)
  }, 10)
*/
function text2(msg) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(msg)
        }, 10);
    })
}

text2('hello').then((res) => {
    return text2(res + 'lagou')
}).then((res) => {
    setTimeout(() => {
        console.log(res + 'I Love U')
    }, 10);

})
