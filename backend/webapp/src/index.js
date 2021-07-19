import React from 'react'
import {render} from 'react-dom'

import App from './components/App'

global.MODAL = null
global.NOTIF = null

const user = JSON.parse(document.getElementById('user-data').innerHTML)
render(<App user={user}/>, document.getElementById('webapp'))
