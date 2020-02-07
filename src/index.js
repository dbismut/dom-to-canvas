import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { WebGLContext } from './context'
import { WEBGL } from 'three/examples/jsm/WebGL'

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, { logOnDifferentValues: true })
}

const webGLSupported = WEBGL.isWebGLAvailable()

ReactDOM.render(
  <WebGLContext.Provider value={false}>
    <App />
  </WebGLContext.Provider>,

  document.getElementById('root')
)
