# Authentication

## Библиотека компонентов и CSS-фреймворки

- [Shadcn UI](https://ui.shadcn.com/) - Это набор повторно используемых компонентов, которые Вы можете копировать и вставлять в свои приложения. Это не библиотека и не npm пакет! Это именно логика компонентов.

Пример:

```typescript jsx
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
```

- [Tailwind CSS](https://tailwindcss.com/) - CSS-фреймворк

Пример:

```html
<div class="space-y-4">
  <div class="w-96 bg-white shadow rounded">w-96</div>
  <div class="w-80 bg-white shadow rounded">w-80</div>
</div>
```

## Использование React-Hook-Form с Zod для валидации форм

В проекте используется [React-Hook-Form](https://react-hook-form.com/) в сочетании с [Zod](https://zod.dev/) для валидации форм и полей. React-Hook-Form обеспечивает управление формами через хуки, а Zod предоставляет средства для определения схем данных и их проверки в реальном времени, обеспечивая надежную валидацию.

Пример:

```typescript
export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Email is required'
  }),
  password: z.string().min(6, {
    message: 'Minimum 6 characters required'
  }),
  name: z.string().min(1, {
    message: 'Name is required'
  })
})

const validatedFields = RegisterSchema.safeParse(values)
```

## Database & Prisma -> Neon.tech

В проекте используется [Prisma](https://www.prisma.io/) для работы с базой данных, а сама база данных создается на портале [Neon.tech](neon.tech): Serverless Postgres. Neon.tech предоставляет полностью управляемую серверную Postgres. Сервис разделяет хранение и вычисления для автомасштабирования, ветвления и неограниченного хранилища. [вводный урок по Prisma](https://www.youtube.com/watch?v=YoSl5sx-uUU)

Пример:

```prisma
datasource db {
  provider  = "postgresql"
  url  	    = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User{
  id String @id @default(cuid())
  name String
}

// terminal: npx prisma generate
// terminal: npx prisma db push
```

команда, которая запустит localhost:5555 studio для просмотра bd

```console
npx prisma studio
```

## Аутентификация для Web

Проект использует [Next-auth v5 (Auth.js)](https://authjs.dev/) для аутентификации и авторизации пользователей. Для интеграции Auth.js с базой данных Prisma используется [Prisma Adapter](https://authjs.dev/reference/adapter/prisma), который обеспечивает простую и надежную связь между Auth.js и Prisma, упрощая процесс аутентификации и управления пользователями.

Список `publicRoutes`, `authRoutes` и `apiAuthPrefix` находится в коревом файле routes.ts!

## Internationalization for Next.js (next-intl)

`global.d.ts` - файл содержит объявления типов для автоматической типизации использования хука useTranslations. Эти типы используются для автоматической типизации содержимого файлов с переводами, что позволяет избежать ошибок типизации и обеспечивает более надежную разработку приложения.

`i18n.ts` - next-intl создает конфигурацию один раз для каждого запроса. Здесь вы можете предоставить messages и другие параметры в зависимости от языка пользователя. Этот файл i18n.ts позволяет настроить интернационализацию в приложении, обеспечивая загрузку правильных сообщений на основе выбранной локали, а также обработку некорректных запросов к несуществующим локалям.

`middleware.ts` - промежуточное программное обеспечение соответствует языковому стандарту запроса и обрабатывает перенаправления и перезаписи соответствующим образом.

Пример:

```javascript
import { useTranslations } from 'next-intl'

export default function Index() {
  const t = useTranslations('Index')
  return <h1>{t('title')}</h1>
}
```
