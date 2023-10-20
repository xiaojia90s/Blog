import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "./",
  title: "菜的抠jio的二狗子",
  description: "二狗子的个人博客",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      { text: "归纳", link: "/src/vue-doc" },
    ],

    sidebar: [
      {
        text: "目录",
        items: [
          // { text: "Markdown 示例", link: "/markdown-examples" },
          // { text: "Runtime API 示例", link: "/api-examples" },
          { text: "框架类", link: "/src/vue-doc" },
          { text: "地图类", link: "/src/map-doc" },
          { text: "其他", link: "/src/other-doc" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
