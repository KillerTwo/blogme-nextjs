import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 md:p-10">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900" />

      {/* 装饰性圆形元素 */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      {/* Logo 或品牌名称 */}
      <div className="relative z-10 mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          MyXIdeal Blog
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          探索思想，分享智慧
        </p>
      </div>

      {/* 登录表单容器 */}
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
