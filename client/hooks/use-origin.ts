import { useEffect, useState } from 'react'

/**
 * Данный хук позволяет получить URL-адрес текущего происхождения,
 * но возвращает null, если доступ к нему осуществляется до момента монтирования компонента.
 */
export const useOrigin = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : null

  if (!mounted) {
    return null
  }

  return origin
}
