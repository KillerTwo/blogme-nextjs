'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [isLogging, setIsLogging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setIsLogging(true)
    setError(null)

    try {
      // 获取回调URL：优先使用 callbackUrl，其次使用 redirect，最后默认跳转到首页
      const callbackUrl = searchParams.get('callbackUrl') || searchParams.get('redirect') || '/'

      const result = await signIn('credentials', {
        username,
        password,
        redirect: false, // 先不自动跳转，由我们手动控制
        callbackUrl,
      })

      console.log('登录结果:', result)

      if (result?.error) {
        // 登录失败
        setError('用户名或密码错误')
        console.error('登录失败:', result.error)
      } else if (result?.ok) {
        // 登录成功，跳转到目标页面
        console.log('登录成功，跳转到:', callbackUrl)
        router.push(callbackUrl)
        router.refresh() // 刷新页面以更新session状态
      }
    } catch (error) {
      console.error('登录错误:', error)
      setError('登录过程中发生错误')
    } finally {
      setIsLogging(false)
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-2 border-white/50">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-8 md:p-10">
            <FieldGroup>
              <div className="flex flex-col items-center gap-3 text-center mb-2">
                {/* 图标装饰 */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  欢迎回来
                </h1>
                <p className="text-muted-foreground text-balance text-sm">
                  登录您的账号以继续
                </p>
              </div>
              {error && (
                <div className="rounded-lg bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 p-3 text-sm text-red-800 flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                  邮箱/账号
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="输入您的邮箱或账号"
                  required
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  onChange={(v) => setUsername(v.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                    密码
                  </FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm text-purple-600 hover:text-purple-700 underline-offset-2 hover:underline font-medium"
                  >
                    忘记密码?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="输入您的密码"
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  onChange={(v) => setPassword(v.target.value)}
                />
              </Field>
              <Field>
                <Button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLogging}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isLogging ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      登录中...
                    </span>
                  ) : '登 录'}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or 使用第三方登录
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  className="hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Apple</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Meta</span>
                </Button>
              </Field>
              <FieldDescription className="text-center text-gray-600 dark:text-gray-400">
                还没有账号? <a href="#" className="text-purple-600 hover:text-purple-700 font-medium hover:underline">立即注册</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          {/* 右侧装饰区域 */}
          <div className="relative hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 text-white overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>

            {/* 内容 */}
            <div className="relative z-10 text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">开启你的创作之旅</h2>
              <p className="text-white/90 text-lg leading-relaxed max-w-md">
                分享你的想法，记录精彩瞬间。<br />
                与志同道合的朋友一起，探索无限可能。
              </p>
              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-sm text-white/80">活跃用户</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-sm text-white/80">优质文章</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-gray-600 dark:text-gray-400">
        点击"登录"表示您同意我们的{" "}
        <a href="#" className="text-purple-600 hover:text-purple-700 underline">服务条款</a>{" "}
        和{" "}
        <a href="#" className="text-purple-600 hover:text-purple-700 underline">隐私政策</a>
      </FieldDescription>
    </div>
  )
}
