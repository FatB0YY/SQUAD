import { cn } from '@/lib/utils'
import { Navbar } from './_components/navbar'

interface IProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = ({ children }: IProtectedLayoutProps) => {
  const gradientClass =
    'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'

  return (
    <div
      className={cn(
        'h-full w-full flex flex-col gap-y-10 items-center justify-center',
        gradientClass
      )}
    >
      <Navbar />
      {children}
    </div>
  )
}

export default ProtectedLayout
