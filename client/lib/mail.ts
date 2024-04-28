/**
 * sendTwoFactorTokenEmail - отправляет на почту письмо с 2FA Code
 * sendPasswordResetEmail - отправляет ссылку на восстановление пароля
 * sendVerificationEmail - отправляет ссылку на подтверждение почты
 */

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code ${token}</p>`
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset password</p>`
    })
  } catch (error) {
    console.error('Error:', error)
    return { error }
  }
}

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
