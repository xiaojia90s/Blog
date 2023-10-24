# 框架
## Vue
### 表单问题
ElementUI 表单校验 number 类型的浮点数，因为 v-model 返回的是字符串，加修饰符 .number 后无法输入小数点，故需要手写自定义校验规则。

```vue
const fn = (rule, value, callback) { 
    if (!value) { 
        return callback(new Error("xxxx")); 
    } 
    let reg = /^\d*(\.?\d+)$/; 
    if (!reg.test(value)) { 
        return callback(new Error("xxx")) 
    } 
    return callback(); 
}
```

### 路由
1. 动态路由加载的时候，刷新后会出现 404，404 的路由组件务必要放在最后。![An image](./img/404-image.png){ width=50% height=auto }
2. 懒加载 + 异步（请求）会导致通过 ref 方式获取数据有问题（第一次 undefined，更新后还是拿不到，人才公园 SwiperImg 组件）。
   - 解决办法，正常引入组件或者更改逻辑使用 emit。
3. this.$router.replace({ path: "/home" }); // 首次登录会报错。原因：多次重定向，login -> / -> /baseData -> /home，加上 catch 强制忽略掉, 具体参考：[stackoverflow](https://stackoverflow.com/questions/62223195/vue-router-uncaught-in-promise-error-redirected-from-login-to-via-a?rq=1)   
解决办法：
    - ```this.$router.replace({ path: "/home" }).catch(_ => {});```
    - ```this.$router.push({ path: "/home", replace: true })```
    - ```router-link```
4. 路由重复 push/replace 报错 ```NavigationDuplicated:Avoided redundant navigation！```
```router.js
import VueRouter from "vue-router";
Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch((err) => err);
};

```

## React

### react-native 初识：令人深刻的环境配置

准备环境：react-native版本 `0.72.2`，node版本 `16.14.0`, JDK `11.0.21`[下载地址](https://www.oracle.com/java/technologies/downloads/#java11)，这里JDK安装不做赘述，网上搜索下有很多文章。

1. 安装 Android Studio [地址](https://developer.android.com/studio?hl=zh-cn)，一路`next`。
2. 安装 the Android SDK，`New Project`，我选择`No Activity`，进去之后，找到`File`->`Close Project`，回到主界面
![main](/src/img/rn/main.jpg)
3. 进入到 `Android SDK` 之后，在`SDK Platforms`找到`Android 13.0("Tiramisu")`，操作如图所示![platform](/src/img/rn/sdk-platforms.jpg)
4. 进入到 `SDK Tools`，在`Android SDK Build-Tools 34`中勾选`33.0.0`。点击Apply，等待安装。
PS：查看自己的`Android SDK Location`目录，如果没有`tools`这个目录的，可以进行以下操作![tools](/src/img/rn/tools.jpg)
5. 配置环境变量 `ANDROID_HOME`，路径为 `Android SDK Location`。之后在`path`中加入`%ANDROID_HOME%\platform-tools`、`%ANDROID_HOME%\emulator`、`%ANDROID_HOME%\tools`、`%ANDROID_HOME%\tools\bin`。我看官方文档只是添加了`platform-tools`，没实践，怕有坑。

::: warning
如果您之前安装了全局 `react-native-cli` 软件包，请将其删除，因为它可能会导致意外问题: `npm uninstall -g react-native-cli @react-native-community/cli`
:::

6. `npx react-native@0.72.2 init AwesomeProject`