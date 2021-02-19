import React, { Component, Fragment } from "react"

export default class Count extends Component {

    render() {
            return (
                <div className="row justify-content-center">
                    <div className="col-md-12 text-center">
                        <label htmlFor="label" style={{fontSize: '115%'}} className="mw-100 text-wrap align-middle">{this.props.text}</label>
                    </div>
                    <div className="row text-center">
                        <div className="p-0 mt-1 mw-100">
                            {this.props.src &&
                            <img
                                src={this.props.src}
                                className="count mw-100"
                                alt="count"
                                style={{weight: '40px', height: '40px'}}
                            />
                                }
                        </div>
                        <div className="col-auto px-5" style={{fontSize: 'xx-large', wordBreak: "break-all"}}>
                            <b >{this.props.count}</b>
                        </div>
                    </div>
                </div>
            )
        }
    }
