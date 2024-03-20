# Authentication

## Setup .env file

```js
DATABASE_URL=

AUTH_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

RESEND_API_KEY=

NEXTAUTH_URL=
NEXTAUTH_URL=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

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

`schemas/index.ts` - файл содержит схемы для управления валидацией форм через zod.

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

`auth.ts` - файл содержит экспорт основного конфига (NextAuth) авторизации.

`middleware.ts` - файл содержит экспорт основного конфига (NextAuth) авторизации.

Список `publicRoutes`, `authRoutes` и `apiAuthPrefix` находится в коревом файле routes.ts!

`lib/tokens.ts` - файл содержит генерацию различных токенов.

Все route по умолчанию private.

Алгоритм авторизации находится в `docs/диаграммы/авторизация.svg|png`

## Internationalization for Next.js (next-intl)

`global.d.ts` - файл содержит объявления типов для автоматической типизации использования хука useTranslations. Эти типы используются для автоматической типизации содержимого файлов с переводами, что позволяет избежать ошибок типизации и обеспечивает более надежную разработку приложения.

`i18n.ts` - next-intl создает конфигурацию один раз для каждого запроса. Здесь вы можете предоставить messages и другие параметры в зависимости от языка пользователя. Этот файл i18n.ts позволяет настроить интернационализацию в приложении, обеспечивая загрузку правильных сообщений на основе выбранной локали, а также обработку некорректных запросов к несуществующим локалям.

`middleware.ts` - промежуточное программное обеспечение соответствует языковому стандарту запроса и обрабатывает перенаправления и перезаписи соответствующим образом.

`messages/en.json|ru.json` - json-файл содержит переводы.

Пример:

```javascript
import { useTranslations } from 'next-intl'

export default function Index() {
  const t = useTranslations('Index')
  return <h1>{t('title')}</h1>
}
```

## Почта Resend для Next.js

Почта Resend - это библиотека для отправки электронной почты в приложениях, построенных на Next.js, с использованием фреймворка NestJS. Она облегчает отправку электронных писем, предоставляя удобный интерфейс для взаимодействия с SMTP-серверами.

Функциональности:

- Отправка электронной почты через SMTP-серверы.
- Легкая интеграция с Next.js и NestJS приложениями.
- Конфигурируемые параметры отправки почты.

Пример:

```typescript
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Confirm your email',
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    })
  } catch (error) {
    console.error('Error:', error)
    return { error }
  }
}
```

`lib/mail.ts` - файл содержит шаблоны электронных писем, а также отправку писем на указанный электронный адрес.

## Загрузка файлов для Next.js - UploadThing. UploadThing для Next.js

UploadThing - это библиотека для обработки и загрузки файлов в приложениях, построенных на Next.js. Она предоставляет удобные средства для загрузки файлов на сервер и обработки их в вашем приложении.

Функциональности:

- Загрузка файлов на сервер.
- Обработка загруженных файлов в вашем приложении Next.js.
- Легкая интеграция с API Next.js.

Пример

```typescript
export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  messageFile: f(['image', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
} satisfies FileRouter

<FileUpload
 endpoint='serverImage'
 value={field.value}
 onChange={field.onChange}
/>
```

Главная логика содержится в `app/api/uploadthing/core.ts`
