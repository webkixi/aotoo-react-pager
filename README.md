# @aotoo/pager路由

## Pager方法

我们使用`Pager`来构建SPA页面，仿小程序页面生命周期

```js
function template(state, props) {
  return <div>{state.file}</div>
}

const page = Pager({
  // page的模板方法
  template,

  // 可以通过setData方法修改此处参数
  data: {
    file: 'readme.md',
  },

  // 页面开始的方法
  // 接收上一个页面传递的数据
  onLoad(param){
    let file = param.file
    let $file = this.getData().file
    if (file && file !== $file) {
      this.setData({ file })
    }
  },

  // 页面显示时调用
  // 每个页面都会调用onLoad和onShow方法，
  // 当使用navigateTo方法跳转页面时, back回来此页面时会调用onShow的方法
  onShow(){},

  // 页面卸载时
  onUnload(){},

  // 页面dom元素全部加载完成时
  onReady(){}
})

ReactDOM.render(<page.UI />, document.getElementById('root'))

```

## Pager.pages

该方法用于定义路由表，默认会自动渲染结构到 `#root` 容器

### 语法

```js
Pager.pages([
  item,
  item,
  ...
], options)
```

### items

路由表数组

`item.url`  
{String}  
路由地址，该条路由的ID，必须指定唯一值，地址栏的hash部分将显示该值

`item.content`  
{Function}  
指定路由子页内容，支持全量引入(require)，支持按需引入(import)  

### options

`options.root`  
{String}  
默认为`root`，指定路由容器

`options.sep`  
{String}  
默认为`#`，置为空则转为内存路由

`options.header`  
{[JSX|Function]}  
配置路由页面的头部，支持JSX，或者item组件配置  

`options.footer`  
{[JSX|Function]}  
配置路由页面的底部，支持JSX，或者item组件配置  

`options.menus`  
{[JSX|Function]}  
配置路由页面的菜单部分，支持JSX  

`options.select`  
{[String]}  
默认菜单项，默认显示页面，填写路由子线配置的`url`属性，该属性支持query方式传递参数给进入页面，不填写则默认第一条路由数据作为首页

`options.beforeNav`  
{Function}  
全局路由守卫，手动拦截/放行所有路由  

`options.goback`  
{Function}  
全局路由守卫，返回后执行该回调

`options.unLoad`  
{Function}  
路由卸载时，触发此方法

### 定义SPA路由表示例

```js
const nav = Pager.nav

Pager.pages([
  {url: '/index/a', content: import('./_subpages/a')},
  {url: '/index/b', content: import('./_subpages/b')},
  {url: '/index/c', content: require('./_subpages/c')},
], {
  header: ()=> <div className="nav-header">...</div>,
  footer: <div className="nav-footer">...</div>
  menus: function(){
    return <Menus />
  },
  select: '/index/a',
})

// 菜单栏
function Menus(props){
  let methodClick = function(e){
    let target = e.target; let dataset = target.dataset;
    let url = dataset.url
    nav.redirectTo({url})  // 参考路由方法
  }
  return (
    <>
      <div className="menu-item" data-url='/index/a' onClick={methodClick}>菜单1</div>
      <div className="menu-item" data-url='/index/b' onClick={methodClick}>菜单2</div>
      <div className="menu-item" data-url='/index/c' onClick={methodClick}>菜单3</div>
    </>
  )
}
```

**子页面**  

```js
// ./_subpages/a.js

function template(state, props) {
  return (
    <View>
      <Text>{state.title}</Text>
    </View>
  )
}

export default function(Pager) {
  return Pager({
    template,

    data: {
      title: '这是a页面'
    },
    
    onLoad(param){ // param为页面传递参数
      // 页面加载时
    },

    onUnload(){
      // 页面卸载时
    },

    onReady(){
      // 页面dom已被渲染完成时
      this.setData({
        title: '为a页面设置新的内容'
      })
    }
  })
}
```

## Pager.nav

`Pager.nav`是一个对象，包含下面路由方法，路由方法的设计参考自小程序

- navigateTo
- navigateBack
- redirectTo
- redirectBack
- reLaunch

```js
const nav = Pager.nav

nav.navigateTo(...)
nav.relaunch(...)
...
```

### reLaunch

关闭所有页面，打开到应用内的某个页面  

参数
Object object  

| 属性 | 类型 |  默认值 |  必填 |  说明 |
| :----: | :----: |  :----: |  :----:  |  :----  |
| url | string |  |  是  | 跳转的应用内页面路径  |
| beforeNav | function |  |  否  | 跳转前动作  |
| success | function |  | 否 | 未实现，暂无使用场景 |
| fail | function | | 否 | 未实现，暂无使用场景 |
| complete | function |  | 否 | 未实现，暂无使用场景 |
| events | object |  | 否 | 未实现，暂无使用场景 |

#### url

需要跳转的应用内页面的路径 (代码包路径), 路径后可以带参数。参数与路径之间使用 ? 分隔，参数键与参数值用 = 相连，不同参数用 & 分隔；如 'path?key=value&key2=value2'

#### beforeNav(to, from, next)

跳转前方法，该方法可阻止跳转
`to`  
{Object}  
将要跳转的目的页面的配置  

`from`  
{Object}  
当前页面的配置  

`next`  
{Function}  
`next(param)`: param将被合并到to的参数中，允许修改将要跳转页面页面参数
允许跳转  

```js
onClick(e, param, inst){
  nav.redirectTo({
    url: '/index/a?file=' + file,
    beforeNav(to, from, next) {
      if (满足条件) {
        next()
      }
    }
  })
}
```

### navigateTo  

保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层

配置参考 reLaunch

### navigateBack

关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。  

配置参考 reLaunch

### redirectTo

关闭当前页面，跳转到应用内的某个页面。  

配置参考 reLaunch

### redirectBack

关闭当前页面，返回上一页面  

配置参考 reLaunch
