import React from 'react'
import {render} from 'react-dom'

import App from './components/App'

global.MODAL = null
global.NOTIF = null

render(<App/>, document.getElementById('webapp'))
