import React, {Component} from 'react'
import {DetailPage} from '../DetailPage'

//alert(JSON.stringify(this.props.bundle))
export class MetaDataScreen extends Component {
    render() {
        return (
            <DetailPage bundle={this.props.bundle}/>
        )

    }

}
