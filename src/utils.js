import { useRef, useEffect } from 'react'

export function debounce(callback, wait, immediate = false) {
  let timeout = null

  return function() {
    const callNow = immediate && !timeout
    const next = () => callback.apply(this, arguments)

    clearTimeout(timeout)
    timeout = setTimeout(next, wait)

    if (callNow) {
      next()
    }
  }
}

export function usePrevious(value) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
