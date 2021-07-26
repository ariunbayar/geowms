import React from 'react'
import {render} from 'react-dom'

import {App} from './components/App'

// GLOBAL VARIABLES
window.map = null; // MAIN MAP OBJECT
global.MODAL = null
global.NOTIF = null

const bundle = JSON.parse(document.getElementById('bundle-app-data').innerHTML)

render(<App bundle={bundle}/>, document.getElementById('bundle-app'))
