import React from 'react'
import {render} from 'react-dom'

import {App} from './components/App'

const open_layer = JSON.parse(document.getElementById('open-layer-app-data').innerHTML)

render(<App open_layer={open_layer}/>, document.getElementById('open-layer-app'))
