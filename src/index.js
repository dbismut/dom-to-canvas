import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, { logOnDifferentValues: true })
}

ReactDOM.render(<App />, document.getElementById('root'))
