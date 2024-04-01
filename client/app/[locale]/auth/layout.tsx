import { cn } from '@/lib/utils'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const gradientClass =
    'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'

  return (
    <div
      className={cn('h-full flex items-center justify-center', gradientClass)}
    >
      {children}
    </div>
  )
}

export default AuthLayout
