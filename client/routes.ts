/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * ---
 * Массив маршрутов, доступных для общего пользования
 * Эти маршруты не требуют аутентификации
 * @type {string[]}
 */
export const publicRoutes = ['/', '/auth/new-verification', '/api/uploadthing']

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users /servers
 * ---
 * Массив маршрутов, которые используются для аутентификации
 * Эти маршруты будут перенаправлять зарегистрированных пользователей на `DEFAULT_LOGIN_REDIRECT`
 * @type {string[]}
 */
// возможно нужно убрать "/auth" после добавления callback в пути
export const authRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/auth/reset',
  '/auth/new-password'
]

/**
 * the prefix for API authentication routes.
 * Routes that start with this prefix are used for API
 * authentication purposes.
 * ---
 * Префикс для маршрутов аутентификации по API.
 * Маршруты, начинающиеся с этого префикса, используются для целей аутентификации по API.
 *
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth'

/**
 * The default redirect path after logging in
 * ---
 * Путь перенаправления по умолчанию после входа в систему
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/servers'
