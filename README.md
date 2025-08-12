# Next Admin Monorepo

这是一个使用 pnpm + Turborepo 搭建的 monorepo 项目。

## 项目结构

```
next-admin/
├── apps/
│   ├── client/          # 前端应用 (React 19 + Vite 7)
│   │   ├── src/
│   │   │   ├── App.tsx  # 主应用组件（包含后端连接测试）
│   │   │   ├── main.tsx # 应用入口
│   │   │   ├── index.css
│   │   │   ├── App.css
│   │   │   ├── vite-env.d.ts # TypeScript声明
│   │   │   └── assets/
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── eslint.config.js
│   └── server/          # 后端应用 (NestJS)
│       ├── src/
│       │   ├── main.ts      # 应用入口（已配置CORS）
│       │   ├── app.module.ts
│       │   ├── app.controller.ts # 包含健康检查接口
│       │   └── app.service.ts
│       ├── test/
│       ├── package.json
│       ├── tsconfig.json
│       ├── nest-cli.json
│       └── .eslintrc.js
├── .vscode/
│   └── tasks.json       # VS Code任务配置
├── package.json         # 根目录配置
├── turbo.json          # Turborepo 配置
├── pnpm-workspace.yaml # pnpm 工作区配置
├── .npmrc              # pnpm 配置
├── .gitignore
├── prettier.config.js
└── README.md
```

## 开发环境

- Node.js >= 18
- pnpm >= 8

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
# 同时启动前后端开发服务器（推荐）
pnpm dev

# 或者分别启动
pnpm --filter client dev    # 前端 (http://localhost:3000)
pnpm --filter server dev    # 后端 (http://localhost:3001)
```

### 3. 构建项目

```bash
# 构建所有应用
pnpm build

# 构建特定应用
pnpm --filter client build
pnpm --filter server build
```

## 可用脚本

- `pnpm dev` - 启动所有应用的开发服务器
- `pnpm build` - 构建所有应用
- `pnpm lint` - 运行所有应用的代码检查
- `pnpm format` - 格式化代码
- `pnpm clean` - 清理构建文件

## 技术栈

### 前端 (apps/client)

- React 19
- Vite 7
- TypeScript
- ESLint + Prettier

### 后端 (apps/server)

- NestJS
- TypeScript
- Jest (测试)
- ESLint + Prettier

### 工具链

- pnpm (包管理器)
- Turborepo (构建系统)
- TypeScript (类型检查)
- ESLint + Prettier (代码规范)

## 端口配置

- 前端: http://localhost:3000
- 后端: http://localhost:3001

## 功能特性

✅ **已完成:**

- [x] 基础项目结构搭建
- [x] 前端 React 19 + Vite 7 配置
- [x] 后端 NestJS 配置
- [x] TypeScript 支持
- [x] ESLint + Prettier 代码规范
- [x] Turborepo 构建系统
- [x] 前后端 CORS 配置
- [x] 开发环境热重载
- [x] 前后端连接测试
- [x] VS Code 任务配置

## API 接口

后端提供以下接口：

- `GET /` - Hello World 测试接口
- `GET /health` - 健康检查接口

前端已集成后端连接测试，启动后可在页面看到连接状态。

## 下一步

1. ✅ ~~安装项目依赖: `pnpm install`~~
2. 根据需要添加第三方依赖包
3. 配置数据库连接 (后端)
4. 设置路由和状态管理 (前端)
5. 添加共享的 packages (如果需要)

## 开发提示

- 使用 `pnpm dev` 一键启动所有服务
- 前端支持热重载，修改代码后自动刷新
- 后端支持热重载，修改代码后自动重启
- 在 VS Code 中可使用 Ctrl+Shift+P 然后搜索 "Tasks" 来运行预配置的任务
