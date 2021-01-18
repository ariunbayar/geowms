import React, { Component } from 'react'

export default class Loader extends Component {

    render() {
        return (
            <div>
                {this.state.is_loading ? <span className="text-center d-block text-sp" style={{position:"fixed", top:"50%", left:"50%"}}> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </span> :null}
            </div>
        )
    }
}
