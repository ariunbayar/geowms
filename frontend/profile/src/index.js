import React from 'react'
import {render} from 'react-dom'

import {App} from './components/App'

const history = JSON.parse(document.getElementById('profile-app-data').innerHTML)

render(<App history={history}/>, document.getElementById('profile-app'))

