import React from 'react'
import {render} from 'react-dom'
import {App} from './App'

const llc = JSON.parse(document.getElementById('llc-app-data').innerHTML)
render(<App llc={llc}/>, document.getElementById('llc-app'))