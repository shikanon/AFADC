# React + TypeScript + Vite

这个模板提供了一个最小化的设置，用于在 Vite 中使用 HMR 和一些 ESLint 规则来运行 React。

目前有两个官方插件可用：

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) 使用 [Babel](https://babeljs.io/) 实现快速刷新
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) 使用 [SWC](https://swc.rs/) 实现快速刷新

## 扩展 ESLint 配置

如果您正在开发生产应用程序，我们建议更新配置以启用类型感知的 lint 规则：

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // 其他配置...

      // 移除 tseslint.configs.recommended 并替换为此
      ...tseslint.configs.recommendedTypeChecked,
      // 或者，使用此配置以获得更严格的规则
      ...tseslint.configs.strictTypeChecked,
      // 可选，添加此配置以获得样式规则
      ...tseslint.configs.stylisticTypeChecked,

      // 其他配置...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // 其他选项...
    },
  },
])
```

您还可以安装 [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) 和 [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) 以获得 React 特定的 lint 规则：

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // 其他配置...
      // 启用 React 的 lint 规则
      reactX.configs['recommended-typescript'],
      // 启用 React DOM 的 lint 规则
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // 其他选项...
    },
  },
])
```

## 项目运行方法

### 安装依赖
```bash
npm install
```

### 开发模式运行
```bash
npm run dev
```

开发服务器将启动在 http://localhost:5173/

### 构建项目
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

### 预览构建结果
```bash
npm run preview
```

## 注意事项

- 当前项目需要 Node.js 20.19+ 或 22.12+ 版本
- 如果使用 Node.js 20.17.0，Vite 会显示警告但项目仍可正常运行
- 建议升级 Node.js 版本以获得最佳兼容性
