import React, {Component} from 'react'

import {Purchase} from './Purchase'


export class App extends Component {

    render() {
        return (
            <Purchase purchase={this.props.purchase}/>
        )
    }
}