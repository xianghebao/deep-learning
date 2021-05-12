## Vue.js 源码剖析-响应式原理、虚拟 DOM、模板编译和组件化

#### 简答题
1. 请简述 Vue 首次渲染的过程。

        new Vue()：Vue 初始化、实例成员、静态成员，调用 _init()

        this._ init()： 调用 Vue._init() 进行初始化，在 initMixin(Vue) 中注册 _init() 方法，initMixin(Vue) 将用户传入的options 与 vue 构造函数中的options 进行合并；init... 等函数给 Vue 实例挂载成员，触发 BeforeCreate 钩子函数；调用 $mount()

        vm.$mount()：入口文件的 $mount 增加编译功能，核心作用将模板编译成 render 函数，如果没有传递 render ，把 template 编译成 render 函数，如果没有 template 则将 el 中的内容作为模板。 通过 compileToFunction() 将template 编译成 render() 函数，编译完成将 render 存入 options.render 中；调用 mount 方法

        vm.$mount()：runtime 中的 $mount ，重新获取 el

        mountComponent(this, el)：

        a：判断是否有 render 选项，如果没有但是传入了 template 会发出警告（运行时版本）；

        b：触发 beforeMount() ；

        c：定义 updateComponent 函数，内部调用 vm. _update( vm. _render) ， _render 生成虚拟 DOM并返回， _update 内部调用 __ patch __ 方法将虚拟 DOM 生成真实 DOM，并且挂载到页面上，记录在 $el 中 ；

        d：创建 Watcher 实例：传入 updateComponent()，调用 get() 方法

        e：触发 mounted ，返回 Vm 实例；

        watcher.get()：创建完 Watcher 会调用一次 get 方法，get方法中调用 updateComponent() ，调用 render 、 update() 则页面渲染完成。]

2. 请简述 Vue 响应式原理
    