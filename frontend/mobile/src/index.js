import React from 'react'
import {render} from 'react-dom'

import {App} from './components/App'

const bundle = JSON.parse(document.getElementById('mobile-app-data').innerHTML)

render(<App bundle={bundle}/>, document.getElementById('mobile-app'))
