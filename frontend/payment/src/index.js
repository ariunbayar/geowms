import React from 'react'
import {render} from 'react-dom'

import {App} from './components/App'

const purchase = JSON.parse(document.getElementById('payment-app-data').innerHTML)

render(<App purchase={purchase}/>, document.getElementById('payment-app'))
