# AGENTS.md

## 仓库结构

- pnpm workspace monorepo：根目录是 Vue 3 主应用，`packages/*` 是内部包（`@sa/axios`、`@sa/hooks`、`@sa/utils`、`@sa/materials`、`@sa/uno-preset`、`@sa/scripts` 等）。
- 内部包直接从 `src` 导出 TypeScript 源码，没有构建步骤；修改后主应用立即生效。
- 必须使用 pnpm。`pnpm-lock.yaml` + `pnpm-workspace.yaml` 是依赖事实来源；GitHub Actions 使用 `pnpm install --frozen-lockfile`、`pnpm build`，产物在 `dist/`。

## 常用命令

```bash
pnpm install          # 拉取代码后必须先执行
pnpm dev              # vite --mode test，端口 9527
pnpm dev:prod         # vite --mode prod
pnpm build            # 生产构建，产物在 dist/（不是 build/）
pnpm build:test       # 测试环境构建
pnpm preview          # 预览 dist/，端口 9725
pnpm typecheck        # vue-tsc --noEmit --skipLibCheck
pnpm lint             # eslint . --fix，自动修改
pnpm gen-route        # 交互式创建 src/views 页面骨架
```

- 没有测试脚本或测试框架；验证改动优先跑 `pnpm typecheck` 和 `pnpm lint`。
- pre-commit 依次执行 `pnpm typecheck && pnpm lint-staged`，commit-msg 用 `pnpm sa git-commit-verify`；提交信息可用 `pnpm commit` 生成。

## 开发环境

- `pnpm dev` 使用 `.env` + `.env.test`。前端 9527，默认把 `/proxy-default` 代理到 `VITE_SERVICE_BASE_URL`（`.env.test` 中为 `http://localhost:9528/`，即 NestJS 后端）。
- 开发时看到代理 `ECONNREFUSED` 通常表示后端 9528 未启动，不是前端配置错误。
- `.env` 是跟踪的共享默认配置（图标前缀、存储前缀等），CI 构建也依赖它，不要删除；本地敏感覆盖写入 `.env.local`（已忽略）。`.env.test`、`.env.prod` 也已跟踪。
- 其他后端地址写在 `VITE_OTHER_SERVICE_BASE_URL`（json5），对应代理前缀为 `/proxy-<key>`；逻辑在 `src/utils/service.ts`。

## 已踩过的坑

- Node 23/24 + Windows 下，`unconfig` 7.0 会因原生 TypeScript import 抛出 `ERR_UNSUPPORTED_ESM_URL_SCHEME`（`Received protocol 'e:'`）。`pnpm-workspace.yaml` 用 `overrides: unconfig: 7.5.0` 固定版本修复，不要移除。
- pnpm 11 不再读取 `package.json` 的 `pnpm` 字段；依赖 override 必须写在 `pnpm-workspace.yaml`。
- `build/plugins/unocss.ts` 直接引用 `@iconify/utils/lib/loader/node-loaders`，因此 `@iconify/utils` 必须作为 devDependency 安装在根目录。缺失时 Vite 加载配置会报 `ERR_MODULE_NOT_FOUND`，执行 `pnpm install` 即可。
- pnpm 11 不再把 `.npmrc` 的 `shamefully-hoist` 依赖提升到根 `node_modules`。源码直接 import 的包必须在对应 `package.json` 显式声明：根目录的 `axios`、`@unocss/preset-wind3`，`packages/uno-preset` 的 `@unocss/core` / `@unocss/preset-uno`，以及 ESLint 按名称加载的 `prettier-plugin-json-sort` / `prettier-plugin-jsdoc`。缺失会导致 `vue-tsc` 或 `pnpm lint` 报 `Cannot find package`。
- Vite 配置源码在 `build/`，构建产物在 `dist/`；不要把 `build/` 当产物目录。

## 路由与页面

- 路由由 `@elegant-router/vue` 基于 `src/views` 文件结构生成。新增页面后在 `pnpm dev`（或 build）期间会自动重写 `src/router/elegant/routes.ts`、`imports.ts`、`transform.ts` 和 `src/typings/elegant-router.d.ts`；这些都是生成文件，不要手改。
- `pnpm gen-route` 只负责交互式创建视图文件和目录，路由要等 elegant-router 重新生成后才出现。
- 路由默认 meta 生成逻辑在 `build/plugins/router.ts`；标题国际化 key 为 `route.<route-name>`，加到 `src/locales/langs/zh-cn.ts` 和 `en-us.ts`。
- 首页/登录等内置路由在 `src/router/routes/`，守卫在 `src/router/guard/`。

## 约定

- Naive UI 组件和 `unplugin-icons` 组件自动导入，`src/typings/components.d.ts` 由插件生成，不要手改。
- 本地 SVG 图标放 `src/assets/svg-icon/`，通过 `icon-local-*` 使用；图标前缀来自 `.env` 的 `VITE_ICON_PREFIX` / `VITE_ICON_LOCAL_PREFIX`。
- API 写在 `src/service/api/`，统一使用 `@/service/request` 的 `request`；后端响应约定为 `{ code, data, message }`，成功码由 `VITE_SERVICE_SUCCESS_CODE` 控制。
- API 类型放在 `src/typings/api.d.ts` 或 `src/typings/api/**`；状态管理使用 Pinia setup store，ID 统一由 `SetupStoreId` 枚举提供。
- SCSS 全局文件 `src/styles/scss/global.scss` 已通过 Vite 自动注入，无需在每个文件重复 `@use`。
- 编辑器约定：2 空格、LF、UTF-8；ESLint 关闭了 Prettier，保存时只执行 ESLint 修复。
