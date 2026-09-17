# 小小扫雷

为 1GP Game Platform 制作的独立 Vite 网页游戏。三档难度，首击及周围八格安全，空白区域自动展开，插旗、计时、胜负判断与重新开始。无需账号、外部资源或环境变量。

## 开发与构建

使用 Node.js 24。

```sh
npm ci
npm run dev
npm run build
npm run preview
```

`npm run build` 先运行扫雷规则测试，再生成 `dist/` 静态产物。根目录包含 index.html、package.json、package-lock.json；没有 API、自定义 Vercel 配置或子模块，可直接通过平台提交 GitHub 仓库链接发布。

## 操作

点击翻开；右键插旗。手机使用“插旗模式”。键盘 Tab/方向键选择格子，Enter/空格翻开，F 插旗。翻开所有安全格即可获胜，插旗数不能超过地雷数。切换难度会开始新局。
