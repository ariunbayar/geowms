import React, { Component } from "react"
import {NavLink} from "react-router-dom"


export class ItemCreate extends Component {

    render() {
        const {className} = this.props
        return (
            <div className={className}>
                <div className="card shadow-sm text-center">
                    <div className="card-body">

                        <NavLink
                            className="btn btn-outline-primary btn-lg mt-3 mb-2 stretched-link"
                            to={"/back/суурь-давхарга/үүсгэх/"}
                        >
                            <i className="fa fa-plus"></i> Суурь давхарга
                        </NavLink>

                    </div>
                </div>
            </div>
        )
    }
}
