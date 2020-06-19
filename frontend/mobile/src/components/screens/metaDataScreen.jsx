import React, {Component} from 'react'
import {DetailPage} from '../DetailPage'

//alert(JSON.stringify(this.props.bundle))
export class MetaDataScreen extends Component {
    render() {
        return (
            <div style={{overflow: "hidden"}}>
                <DetailPage bundle={this.props.bundle}></DetailPage>
            </div>
        )

    }

}
