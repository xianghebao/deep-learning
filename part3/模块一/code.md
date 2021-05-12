 ## 一 简答题
 1. 当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。
```
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```
答：
```
给 data 新增加的成员并不是响应式数据；

Vue 的 data 中的成员实现响应式数据，是在创建 Vue 实例，将传入构造函数的 data 存放在实例的 data中，然后遍历data 成员，利用 Object.defineProperty 它们转换成 getter/setter 并定义在 Vue 实例上（这是方便于在实例中使用 this.<成员名> 的操作来触发真正的响应式变化）

然后调用 observer 实现对 data数据劫持。observer对每个成员通过Object.defineProperty将该成员转化为getter/setter并定义在该成员上，真正的响应式就发生在这里。又因为Vue使用的是观察者模式，因此在data 的成员的 getter 中会收集该成员的所有观察者（收集依赖），在 setter 中发发送通知以触发观察者的 update 方法。

经过以上对传入 Vue 构造函数的 data 的加工，就实现了对 data 成员变成了响应式数据。而之后给 data 动态新增的成员，并没有经过以上步骤，所以不是响应式数据。

若要将新增成员设置成响应式数据可使用 Vue 官方提供的 Vue.observable(object) 方法：this.dog = Vue.observable({ name: 'Trump' })。

Vue.observable 原理如上述的使用 observer 的过程，实际就是对 observe 进行了封装。
```

2. 请简述 Diff 算法的执行过程

```
diff 是找 同级别 的 子节点 依次比较，然后再找下一级别的节点比较。
oldStartVnode / newStartVnode (旧开始节点 / 新开始节点)
oldEndVnode / newEndVnode (旧结束节点 / 新结束节点)

如果 oldStartVnode 和 newStartVnode 是 sameVnode (key 和 sel 相同)，调用 patchVnode() 对比和更新节点，把 旧开始 和 新开始 索引往后移动 oldStartIdx++ / newStartIdx++，进入下一个循环；若不同，则进入下一个判断

如果首尾标记节点对比都不通过,用当前标记的 newStartVnode 的 key 在 旧节点 数组中找相同节点。

同级对比循环结束时会有两种情况 旧节点的所有子节点先遍历完(oldStartIdx > oldEndIdx)、新节点的所有子节点先遍历完 (newStartIdx > newEndIdx)，此时需要对新旧节点数组进行后续处理：
```

## 二 编程题

1. 模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。

```
一、vue-router是什么
​ vue-router就是WebApp的链接路径管理系统。vue的单页面应用是基于路由和组件的，路由用于设定访问路径，并将路径和组件映射起来。传统的页面应用，是用一些超链接来实现页面切换和跳转的。在vue-router单页面应用中，则是路径之间的切换，也就是组件的切换。路由模块的本质 就是建立起url和页面之间的映射关系。

```

```
二. hash路由实现原理
Hash 模式是基于锚点，通过锚点值作为路由地址；以及 onhashchange 事件，地址发生变化时触发onhashchange
Hash 模式路由与 history 模式路由类似
不同点在于 router-link 组件内的 a 标签 href 地址前添加 '/#'；href: '/#' + this.to
a 标签不需要添加事件阻止默认行为和记录历史，因为锚点并不会触发 a 标签的默认行为，而且会自动修改 url
hash值发生变化的时候会触发 onhashchange 事件，监听该事件，把保存路由的响应式数据修改为对应地址，渲染对应的组件； window.addEventListener('hashchange ', () => { this.data.current = window.location.hash.substr(1) })

let _Vue = null

export default class VueRouter {
  static install(Vue) {
    // 1、判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    //  2、把Vue构造函数记录到全局变量
    _Vue = Vue
    //  3、把创建Vue实例时候传入的router对象注入到Vue实例上
    // 使用混入，注意this指向，在外面this指向VueRouter，使用混入this指向Vue
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {// vue实例执行；组件不执行，组件的$options不存在router属性
          _Vue.prototype.$router = this.$options.router // 把入口文件中new Vue()是传入的router挂载到$router
          this.$options.router.init() // 入口实例化Vue的时候传入了实例化的VueRouter，此时router挂载到vue的$options属性上
        }
      }
    })
  }

  constructor(options) {
    this.options = options // 记录构造函数传入的选项
    this.routeMap = {} // 把路由规则解析存储到routeMap，键：路由地址，值：路由组件，将来router-view组件会根据当前路由地址到routeMap对象找到对应的组件渲染到浏览器
    // data是一个响应式对象，存储当前的路由地址，路由变化时自动加载组件
    this.data = _Vue.observable({ // vue提供的创建响应式对象方法
      current: window.location.hash.substr(1) || '/' // 存储当前的路由地址，默认是‘/’
    })
  }

  init() {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }

  createRouteMap() {
    // 遍历所有路由规则，把路由规则解析为键值对形式，存储到routeMap对象
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  initComponents(Vue) { // 传入Vue构造函数是为了减少对外部的依赖
    Vue.component('router-link', {
      props: {
        to: String
      },
      render(h) {
        // h 函数为我们创建虚拟DOM
        // 参数一：选择器；参数二：DOM元素设置属性；参数三：标签之间的内容，内容有很多所以用数组
        return h('a', {
          attrs: {
            href: '/#' + this.to
          },
        }, [this.$slots.default]) // 通过this.$slots.default获取默认插槽的内容
      },
    })
    const self = this
    Vue.component('router-view', {
      render(h) {
        // render 函数里的this不是指向Vue实例
        // 获取当前路由地址对应的路由组件，调用 h 函数把组件转为虚拟DOM返回
        // 获取当前路由对应的组件，data是响应式的，当当前地址改变后将更新对应的页面
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }

  initEvent() {
    // 浏览器前进 后退
    window.addEventListener('hashchange', () => {
      this.data.current = window.location.hash.substr(1)
    })
  }
}

```

```
三 .在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。
1. v-html 指令
原理：v-html 实现和 v-text 基本一样，不同在于 v-html 把变量赋值到 innerHTML
compiler.js 核心代码

htmlUpdater(node, value, key) {
  console.log(node, value, key)
  node.innerHTML = value
  new Watcher(this.vm, key, (newValue) => {
    node.innerHTML = newValue
  })
}

2. 在 vue.js 文件中变量 methods，把事件注入到 vue 实例
在 compiler.js 文件判断指令处添加'@'的判断，在 update 函数判断attrName是否含有 'on:'，如果有就把后面的事件行为提取拼接为对应的函数名调用

class Vue {
  constructor(options) {
    this.$methods = options.methods || {}
    this._injectionMethods(this.$methods)
  }

  // 代理数据
  // .....

  // 把methods注入vue实例
  _injectionMethods(methods) {
    Object.keys(methods).forEach(fnName => {
      this[fnName] = this.$methods[fnName]
    })
  }
}

剩下的后面补全 。。  
```
