import React from 'react'
import { App } from './App'
import { render } from 'react-dom'

const org = JSON.parse(document.getElementById('org-app-data').innerHTML)
render(<App org={org}/>, document.getElementById('org-app'))
