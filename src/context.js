import { createContext, useContext } from 'react'

export const WebGLContext = createContext()

export const useWebGLSupport = () => useContext(WebGLContext)
