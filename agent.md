# Agent Guide - Soybean Admin Frontend

## 项目概述

Soybean Admin 是一个清新优雅的中后台管理系统前端模板，基于 Vue 3 + Vite + TypeScript + Naive UI + UnoCSS 构建。当前仓库是一个完整的 pnpm workspace monorepo，包含主应用及多个内部共享工具包。

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue | 3.5+ |
| 构建 | Vite | 6.2+ |
| 语言 | TypeScript | 5.8+ |
| UI | Naive UI | 2.41+ |
| 样式 | UnoCSS (preset-wind3) | 66+ |
| 状态管理 | Pinia | 3.0+ |
| 路由 | Vue Router | 4.5+ |
| 国际化 | vue-i18n | 11+ |
| 图表 | ECharts | 5.6+ |
| 工具 | @vueuse/core | 13+ |
| 代码规范 | ESLint + @soybeanjs/eslint-config | - |
| Git Hooks | simple-git-hooks + lint-staged | - |
| Node | Node.js | >=18.20.0 |
| 包管理 | pnpm | >=8.7.0 |

## Monorepo 结构

```
frontend/
├── src/                    # 主应用源码
├── build/                  # Vite 构建配置
│   ├── config/             # 构建时间、代理配置
│   └── plugins/            # Vite 插件（elegant-router, unocss, unplugin 等）
├── packages/               # 内部共享包 (workspace:*)
│   ├── axios/              # Axios 请求封装 (@sa/axios)
│   ├── hooks/              # 通用 Vue hooks (@sa/hooks)
│   ├── utils/              # 工具函数 (@sa/utils)
│   ├── color/              # 色彩处理 (@sa/color)
│   ├── materials/          # 通用组件库 (@sa/materials)
│   ├── alova/              # Alova 请求库 (备用)
│   ├── ofetch/             # Ofetch 请求库 (备用)
│   ├── uno-preset/         # UnoCSS 自定义 preset
│   └── scripts/            # CLI 工具 (@sa/scripts)
├── .env                    # 环境变量（基础）
├── .env.test               # 测试环境变量
├── .env.prod               # 生产环境变量
├── vite.config.ts          # Vite 主配置
├── uno.config.ts           # UnoCSS 配置
├── eslint.config.js        # ESLint 配置（flat config）
└── tsconfig.json           # TypeScript 配置
```

## 主应用源码结构

```
src/
├── assets/                 # 静态资源（SVG 图标、图片）
├── components/             # 组件
│   ├── advanced/           # 高级组件（表格列设置、表头操作）
│   ├── common/             # 通用组件（Provider、主题切换、菜单折叠等）
│   └── custom/             # 自定义组件（BetterScroll、SvgIcon、CountTo 等）
├── constants/              # 常量定义（app、business、reg）
├── enum/                   # 枚举
├── hooks/                  # 业务 hooks
│   ├── business/           # 业务相关（auth、captcha）
│   └── common/             # 通用（echarts、form、icon、router、table）
├── layouts/                # 布局组件
│   ├── base-layout/        # 基础布局
│   ├── blank-layout/       # 空白布局
│   └── modules/            # 布局模块（header、sider、menu、tab、theme-drawer 等）
├── locales/                # 国际化资源
│   └── langs/              # 语言包（en-us、zh-cn）
├── plugins/                # 应用插件注册（dayjs、iconify、nprogress、loading）
├── router/                 # 路由
│   ├── elegant/            # Elegant Router 自动生成的路由定义
│   ├── guard/              # 路由守卫（权限、进度条、标题）
│   └── routes/             # 内置路由（403/404/500）
├── service/                # 服务层
│   ├── api/                # API 接口定义
│   └── request/            # 请求实例（axios 封装）
├── store/                  # Pinia 状态管理
│   └── modules/            # store 模块（app、auth、route、tab、theme）
├── styles/                 # 全局样式
│   ├── css/                # 全局 CSS（reset、nprogress、transition）
│   └── scss/               # SCSS 全局变量/混入
├── theme/                  # 主题配置（颜色变量）
├── typings/                # TypeScript 类型声明
├── utils/                  # 工具函数（storage、service、icon）
├── views/                  # 页面视图
│   ├── _builtin/           # 内置页面（403、404、500、iframe、login）
│   ├── home/               # 首页
│   ├── manage/             # 系统管理（用户、角色、菜单）
│   ├── log/                # 日志（登录日志、操作日志）
│   └── access-key/         # 访问密钥管理
├── App.vue                 # 根组件
└── main.ts                 # 应用入口
```

## 路径别名

在 `vite.config.ts` 和 `tsconfig.json` 中定义：

| 别名 | 路径 | 用途 |
|------|------|------|
| `@` | `./src` | 主应用源码 |
| `~` | `./` | 项目根目录 |

## 常用脚本命令

```bash
# 开发
pnpm dev                  # 启动测试环境开发服务器 (port 9527)
pnpm dev:prod             # 启动生产模式开发服务器

# 构建
pnpm build                # 构建生产环境
pnpm build:test           # 构建测试环境
pnpm preview              # 预览构建产物 (port 9725)

# 代码质量
pnpm lint                 # ESLint 检查并自动修复
pnpm typecheck            # TypeScript 类型检查 (vue-tsc --noEmit)

# 工具脚本
pnpm gen-route            # 自动生成路由定义 (基于文件系统)
pnpm cleanup              # 清理构建产物和缓存
pnpm commit               # 交互式生成规范 commit message
pnpm release              # 发布新版本
pnpm update-pkg           # 更新依赖包
```

## 开发服务器

- 开发端口：`9527`
- 预览端口：`9725`
- 开发环境默认启用 HTTP 代理（`VITE_HTTP_PROXY=Y`）
- 代理配置位于 `build/config/proxy.ts`

## 环境变量

环境变量通过 `.env.*` 文件定义，并在代码中通过 `import.meta.env` 访问。核心变量：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `VITE_BASE_URL` | `/` | 应用基础 URL |
| `VITE_APP_TITLE` | `SoybeanAdmin` | 应用标题 |
| `VITE_AUTH_ROUTE_MODE` | `dynamic` | 路由权限模式（static / dynamic） |
| `VITE_ROUTE_HOME` | `home` | 静态路由模式下的首页 |
| `VITE_ROUTER_HISTORY_MODE` | `history` | 路由模式（hash / history / memory） |
| `VITE_HTTP_PROXY` | `Y` | 开发环境是否启用代理 |
| `VITE_SERVICE_BASE_URL` | - | 后端服务基础 URL |
| `VITE_SERVICE_SUCCESS_CODE` | `200` | 后端成功响应码 |
| `VITE_SERVICE_LOGOUT_CODES` | `8888,8889` | 登出响应码 |
| `VITE_SERVICE_EXPIRED_TOKEN_CODES` | `401` | Token 过期响应码 |
| `VITE_STORAGE_PREFIX` | `SOY_` | 本地存储 key 前缀 |

## 核心模块说明

### 路由系统
- 使用 `@elegant-router/vue` 自动基于文件系统生成路由
- 运行 `pnpm gen-route` 重新生成路由定义
- 路由定义文件：`src/router/elegant/routes.ts`（自动生成，勿手动修改）
- 路由守卫：`src/router/guard/`（路由权限校验、标题设置、进度条）
- 支持静态路由和动态路由两种模式（通过 `VITE_AUTH_ROUTE_MODE` 切换）

### 状态管理
- 使用 Pinia（Composition API 风格 setup store）
- Store 模块：
  - `app` - 应用全局状态
  - `auth` - 认证状态（token、用户信息、登录/登出逻辑）
  - `route` - 动态路由
  - `tab` - 多标签页
  - `theme` - 主题（颜色、布局、暗黑模式）
- Store ID 通过 `SetupStoreId` 枚举统一管理

### 请求层
- 基础请求封装：`packages/axios/`（内部包 `@sa/axios`）
- 主请求实例：`src/service/request/index.ts`
- 支持 Token 刷新、登出响应码处理、错误消息统一处理
- API 接口按业务模块拆分在 `src/service/api/`

### 国际化
- 语言包：`src/locales/langs/`
- 支持中文（zh-cn）和英文（en-us）
- Naive UI 组件国际化集成

### 样式
- UnoCSS 原子化 CSS（`preset-wind3` 兼容 Tailwind 语法）
- SCSS 全局变量注入（`@/styles/scss/global.scss` 自动注入每个 SCSS 文件）
- 主题色变量：`src/theme/vars.ts`
- 自定义 UnoCSS preset：`packages/uno-preset/`

## 代码规范

### ESLint
- 使用 `@soybeanjs/eslint-config` 预设
- 额外配置：
  - `vue/multi-word-component-names` 忽略 `index`、`App`、`Register` 等
  - `vue/component-name-in-template-casing` 使用 PascalCase
  - `unocss/order-attributify` 关闭
- 执行 `pnpm lint` 自动修复

### Git Hooks
- `pre-commit`：执行 `pnpm typecheck && pnpm lint-staged`
- `commit-msg`：执行 commit message 规范校验
- `lint-staged`：所有文件执行 `eslint --fix`

### 编辑器配置
- 缩进：2 空格
- 换行：LF
- 编码：UTF-8

## 新增页面的步骤

1. 在 `src/views/` 下创建页面目录和 `.vue` 文件
2. 运行 `pnpm gen-route` 自动生成路由定义
3. 如需自定义路由元信息（菜单排序、图标、标题），修改生成后的路由文件对应条目
4. 在 `src/locales/langs/` 中添加对应路由标题的国际化 key（格式：`route.<route-name>`）
5. 如需调用后端 API，在 `src/service/api/` 新建接口文件

## 新增 API 接口

1. 在 `src/service/api/` 下创建或修改业务模块的接口文件
2. 使用 `request` 实例（来自 `@/service/request`）发起请求
3. 请求成功的后端响应需满足 `{ code, data, message }` 结构
4. 在 `src/typings/api/` 添加对应的类型声明

## Store 使用规范

- 使用 Composition API 风格的 `defineStore`（setup 函数）
- Store ID 使用 `SetupStoreId` 枚举值
- 重置 store 时调用 `$reset()`，清理副作用
- 跨 store 调用时注意避免循环依赖

## 注意事项

- `src/router/elegant/routes.ts` 是自动生成的文件，手动修改会被覆盖
- `packages/` 目录下的内部包通过 `workspace:*` 引用，修改后无需重新发布
- Naive UI 组件已通过 `unplugin-vue-components` 自动导入，无需手动 import
- 图标通过 `@iconify/vue` 或本地 SVG（`src/assets/svg-icon/`）使用
- 全局注册的 Naive UI 实例挂载在 `window` 上：`$message`、`$dialog`、`$notification`、`$loadingBar`
