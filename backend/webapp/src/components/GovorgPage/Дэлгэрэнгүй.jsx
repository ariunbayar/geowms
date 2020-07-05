import React, { Component } from "react"
import {NavLink} from "react-router-dom"


export class Дэлгэрэнгүй extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        const {name} = {name: 'lskjdflksd'}

        return (
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <NavLink className="btn btn-outline-primary" exact to={'/back/байгууллага/'}>
                            <i className="fa fa-angle-double-left"></i> Буцах
                        </NavLink>
                    </div>
                </div>
                <div className="row">

                    <div className="col-md-12 mb-4">
                        <strong>{name}</strong>
                    </div>

                </div>
            </div>
        )

    }

}
