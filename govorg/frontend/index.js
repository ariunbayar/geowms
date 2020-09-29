import React from 'react'
import {render} from 'react-dom'
import {App} from './App'

const org = JSON.parse(document.getElementById('org-app-data').innerHTML)
render(<App org={org}/>, document.getElementById('org-app'))