import React, { Component } from 'react'
import './style.css'


export default class Loader extends Component {

    render() {

        if (this.props.is_loading) {
            return (
                <div className="loader text-center">
                    <div>
                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                        <br/>
                        Түр хүлээнэ үү...
                    </div>
                </div>
            )
        }

        return null
    }
}
