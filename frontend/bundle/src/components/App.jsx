import React, {Component} from 'react'

import {DetailPage} from './DetailPage'


export class App extends Component {

    render() {

        return (
            <DetailPage bundle={this.props.bundle}/>
        )

    }

}