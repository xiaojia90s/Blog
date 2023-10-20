# 其他

### xftp

前端打包通过 xftp 发布到服务器可能出现背景图片可能不显示、乱码等问题，大概率需要设置一下连接项的编码格式。会话 -> 右键属性 -> 选项 -> 编码。

### 链接

使用 `windows.open` 打开外链，可能出现乱码，打不开，报错，但是浏览器直接访问外链又可以，此时在打开外链的项目中的 index.html 加入 `<meta name="referrer" content="no-referrer" />`或者 `window.open('url','noopener=yes,noreferrer=yes')` [参考链接](https://www.jianshu.com/p/43545ad341d8)

### axios 拦截器取消 token

<details>
    <summary>v 0.22 前</summary>

```js
// v 0.22 前
import axios from "axios";
import Router from "@/router";

const CancelToken = axios.CancelToken;
const pending = [];

const service = axios.create({
  withCredentials: true,
  timeout: 60 * 1000,
});

service.interceptors.request.use(
  config => {
    config.cancelToken = new CancelToken(function executor(c) {
      pending.push(c);
    });
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // 如果是取消的，直接return
    if (error.toString().indexOf("Cancel") > -1) {
      return Promise.reject(error); //有效防止多次重定向
    }

    switch (error.response.status) {
      case 401:
        Router.replace({ path: "/login" });
        while (!!pending.length) {
          pending[pending.length - 1]();
          pending.pop();
        }
        break;
      default:
        break;
    }
    return Promise.reject(error);
  }
);
```

</details>

<details>
    <summary>v 0.22 后</summary>

```js
// v 0.22 后
import axios from "axios";
const controller = new AbortController(); //主要代码

const service = axios.create({
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    config.signal = controller.signal; //主要代码
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.toString().indexOf("Cancel") > -1) {
      return Promise.reject(error); //有效防止多次重定向
    }

    switch (error?.response?.status) {
      case 401:
        controller.abort(); //主要代码
        break;
      default:
        break;
    }

    return Promise.reject(error);
  }
);
```

</details>


### 修改 `node_modules` 包，打包共享问题 [参考链接1](https://www.yuque.com/r/goto?url=https%3A%2F%2Fdev.to%2Fthamara%2Fwhat-if-i-need-to-make-a-change-to-nodemodules-o8e) [参考链接2](https://thamara.dev/posts/what-if-i-need-to-make-a-change-in-node-modules/)
- 安装npm `npm i patch-package -D`
- 添加脚本 `"scripts": { "postinstall": "patch-package" }`
- 修改 node_modules 之后，执行命令，如: `npx patch-package cesium`

  ```bash
  (npx | yarn) patch-package [packageName]
  ```

### npm包本地调试方式 link / yalc
[链接1](https://www.bilibili.com/read/cv17617145/)|[链接2](https://blog.51cto.com/u_15524602/5069168)
---|---

### pnpm node包管理
1. windows 使用超级管理权限`iwr https://get.pnpm.io/install.ps1 -useb | iex`（可能需要pnpm setup）
2. 安装成功后记得去配置node的环境变量（在path中找），把 `C:\Program Files\nodejs\`
替换成你安装的pnpm的默认路径，例如 `C:\Users\86185\AppData\Local\pnpm\nodejs\`
3. 配置成功。通过 `pnpm env use --global 版本号/lts` 可以实现node管理了