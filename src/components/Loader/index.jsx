import React, { Component } from 'react'
import './style.css'

export default class Loader extends Component {

    render() {
        const is_loading = this.props.is_loading
        return (
            <>
                {is_loading ?
                    <span className="text-center loader">
                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                        <br/>Түр хүлээнэ үү...
                    </span>
                    :null
                }
            </>
        )
    }
}
