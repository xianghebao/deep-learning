/*
尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
*/
/**
 *  自定义MyPromise
 *  1. resolve
 *  2. reject
 *  3. then
 *  3.1. 处理异步方法多次调用then
 *  3.2. 改进then链式调用
 *  3.3. then方法处理promise返回自身
 *  3.4. 处理异常
 *  3.5. 处理异步方法链式调用
 *  3.6. 处理then调用普通值，空值等情况
 *  4. all 如果一个调用失败，则返回reject;如果所有输入的promise的resolve都回调结束后，按调用顺序返回结果.
 *  5. race 方法返回一个promise，一旦迭代器中的某一个promise解决或者拒绝，返回的promise就会解决或拒绝.
 *  6. resolve方法 返回一个以给定值解析后的Promise 对象。如果这个值是一个 promise ，那么将返回这个 promise ；
 *  如果这个值是thenable（即带有"then" 方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；
 *  否则返回的promise将以此值完成。此函数将类promise对象的多层嵌套展平
 *
 *  7. reject方法 返回一个带有拒绝原因的Promise对象
 *  8. finally方法
 *  9. catch方法
 *
 * **/

const PENDING = 'pending'; //等待状态
const ONFULFILLED = 'fulfilled'; //完成状态
const ONREJECTED = 'rejected'; //失败状态

class MyPromise {

    status = PENDING //初始化状态
    successData = undefined //执行成功的数据
    failedReason = undefined //执行失败的原因
    successCallback = [] //修改类型为数组，用于保存多个成功回调方法
    failedCallback = [] //修改类型为数组，用于保存多个失败回调方法


    /***
     * @Description  MyPromise构造函数接收一个执行器参数
     * “执行器函数”接受两个函数——resolve 和 reject ——作为其参数。当异步任务顺利完成且返回结果值时，会调用 resolve 函数；
     * 而当异步任务失败且返回失败原因（通常是一个错误对象）时，会调用reject 函数。
     * @param executor
     */
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }

    }

    /***
     * @Description 原型方法resolve. Promise处于非等待状态，状态不可变更,
     * 等待状态可以变成已完成状态
     * @param value
     */
    resolve = (value) => {
        if (this.status != PENDING) {
            return
        }
        this.status = ONFULFILLED
        this.successData = value //保存成功的数据
        while (this.successCallback.length) {//循环取出队列头部元素，执行成功回调
            this.successCallback.shift()(value)
        }
    }


    /***
     * @Description 原型方法reject. Promise处于非等待状态，状态不可变更,
     * 等待状态可以变成失败状态
     * @param reason
     */
    reject = (reason) => {
        if (this.status != PENDING) {
            return
        }
        this.status = ONREJECTED
        this.failedReason = reason //保存失败的原因
        while (this.failedCallback.length) {//循环取出队列头部元素，执行失败回调
            this.failedCallback.shift()(reason)
        }
    }

    /**
     * @description Promise必须有then方法，用于访问当前的值和错误原因
     * 改进then方法，处理多个then链式调用
     *
     * **/
    then(successCallback, failedCallback) {
        successCallback = successCallback ? successCallback : value => value
        failedCallback = failedCallback ? failedCallback : reason => {
            throw reason
        }

        const promise2 = new MyPromise((resolve, reject) => {
            if (this.status == ONFULFILLED) {//状态为成功，则通过回调方法返回成功的结果
                setTimeout(() => {//设置setTimeout是为了方便可以拿到promise2对象
                    try {
                        const s = successCallback(this.successData)
                        resolvePromiseChain(promise2, s, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }

                }, 0)
            } else if (this.status == ONREJECTED) {//状态为失败，则通过回调方法返回失败的原因
                setTimeout(() => {
                    try {
                        const f = failedCallback(this.failedReason)
                        resolvePromiseChain(promise2, f, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }

                }, 0)
            } else {//链式调用
                this.successCallback.push(() => {
                    setTimeout(() => {//处理异步回调
                        try {
                            const s = successCallback(this.successData)
                            resolvePromiseChain(promise2, s, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })

                this.failedCallback.push(() => {
                    setTimeout(() => {
                        try {
                            const f = failedCallback(this.failedReason)
                            resolvePromiseChain(promise2, f, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }
        })
        return promise2
    }

    /***
     * @Description finally是Promise原型方法
     * @param callback 回调会在当前promise运行完毕后被调用，无论当前promise的状态是完成(fulfilled)还是失败(rejected)
     * @returns {MyPromise}
     */
    finally(callback) {
        return this.then(data => {
            return new MyPromise.resolve(callback()).then(data)
        }, reason => {
            return new MyPromise.resolve(callback()).then(() => {
                throw reason
            })
        })
    }

    /***
     * @description catch是Promise原型方法。
     * 添加一个拒绝(rejection) 回调到当前 promise, 返回一个新的promise。
     * 当这个回调函数被调用，新 promise 将以它的返回值来resolve，
     * 否则如果当前promise 进入fulfilled状态，则以当前promise的完成结果作为新promise的完成结果.
     *
     * catch()是对上一个.then()返回的promise进行处理，不过第一个promise的报错也顺延到了catch中，
     * 而then的第二个参数形式，只能捕获第一个promise的报错，如果当前then的resolve函数处理中有报错是捕获不到的。
     * 换句话说catch方法可以捕捉整个promise的失败异常，但是then方法如果注册了失败回调并执行了，catch方法就捕捉不到这个失败了。
     *
     * @param callback
     * @returns {MyPromise}
     */
    catch(callback) {
        return this.then(undefined, callback)
    }

    /***
     * @description all方法 如果一个调用失败，则返回reject;
     * 如果所有输入的promise的resolve都回调结束后，按调用顺序返回结果.
     * @param array
     * @returns {MyPromise}
     */
    static all(array) {
        let index = 0
        let result = []

        return new MyPromise((resolve, reject) => {
            function add(key, value) {
                result[key] = value
                index++
                if (index == array.length) {
                    resolve(result)
                }
            }

            for (let i = 0; i < array.length; i++) {
                if (array[i] instanceof MyPromise) {
                    array[i].then(value => {
                        add(i, value)
                    }, reason => {//如有一个调用失败，则处理失败结果
                        reject(reason)
                    })
                } else {
                    add(i, array[i])
                }
            }
        })
    }


    /***
     * @Description race方法返回一个promise，一旦迭代器中的某一个promise解决或者拒绝，返回的promise就会解决或拒绝
     * @param array
     * @returns {MyPromise}
     */
    static race(array) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < array.length; i++) {
                if (array[i] instanceof MyPromise) {
                    array[i].then(value => {////如有一个调用成功，则返回
                        resolve(value)
                    }, reason => {//如有一个调用失败，则返回
                        reject(reason)
                    })
                } else {
                    resolve(array[i])
                }
            }
        })
    }

    /***
     * @Desciption resolve返回一个状态由给定value决定的Promise对象
     * @param value值是thenable(即，带有then方法的对象)，返回的Promise对象的最终状态由then方法执行决定
     * ；否则的话(该value为空，基本类型或者不带then方法的对象),返回的Promise对象状态为fulfilled，并且将该value传递给对应的then方法。
     * @returns {MyPromise}
     */
    static resolve(value) {
        if (value instanceof MyPromise) {
            return value
        } else {
            return new MyPromise((resolve, reject) => resolve(value))
        }
    }

    /***
     * @Description reject方法返回一个状态为失败的Promise对象，并将给定的失败信息传递给对应的处理方法
     * @param reason 失败信息
     * @returns {MyPromise}
     */
    static reject(reason) {
        return new MyPromise((resolve, reject) => reject(reason))
    }
}

/***
 * @description 处理多个then链式调用的情况
 * @param promise
 * @param x
 * @param resolve
 * @param reject
 * @returns {*}
 */
function resolvePromiseChain(promise, x, resolve, reject) {
    if (promise == x) {//promise调用自身，则返回失败信息
        return reject(new TypeError('Chaining cycle detected for promise'))
    } else if (x instanceof MyPromise) {
        x.then(resolve, reject)
    } else {
        resolve(x)
    }
}

module.exports = MyPromise

