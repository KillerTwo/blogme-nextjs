这是一个基于Next.js 15和shadcn/ui的现代博客项目前端.

## Getting Started

运行开发服务:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

在浏览器打开 [http://localhost:3000](http://localhost:3000) 查看页面.



## 登录认证
项目里提供了以下认证方式的实现：
- 混合cookies方式
测试页面app/testclient和app/testserver
- HttpOnly Cookies方式 （现在使用方式）
测试页面app/testclient1和app/testserver1
- 使用JWT + localstorage方式
测试页面app/testclient2和app/testserver2
- 使用Next Auth V5认证框架方式 （由于Next Auth版本和Next.js版本不兼容，暂不能使用）
测试页面app/testclient3和app/testserver3