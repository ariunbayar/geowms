import React, { Component } from "react"
import "./styles.css";
import Modal from "../Modal"
import {NavLink} from "react-router-dom"


export default class Bundle extends Component {

    constructor(props) {
        super(props)

        this.state = {
        }
    }

    render() {
        const {id, name, icon_url, wms_list} = this.props.values
        const idx=this.props.idx
        return (
            <tr>
                <td scope="col" className="text-dark">
                    {idx + 1}
                </td>

                <td>
                    <img className="img" src={icon_url}/>
                    {name}
                </td>

                <td>
                    {wms_list.map((wms, idx) =>
                        (wms.is_active ?
                            <p key={idx}>
                                <span>
                                        <i className="fa fa-check-circle" style={{color: "green"}} aria-hidden="false"></i>
                                </span>
                                <span >
                                    <a> {wms.name}</a>
                                </span>
                            </p> :

                            <p key={idx}>
                                <span>
                                    <i className="fa fa-times-circle" style={{color: "#FF4748"}}  ></i>
                                </span>
                                <span className="text-muted">
                                    <a><del> {wms.name}</del></a>
                                </span>
                            </p>
                        )
                    )}
                </td>
                <td>
                    <NavLink to={`/back/дэд-сан/${id}/засах/`}>
                            <i className="fa fa-pencil-square-o gp-text-primary" aria-hidden="true"></i>
                    </NavLink>
                </td>

                <td>
                    <a href="#" onClick={event => this.props.handleMove(event, id, 'up')}>
                        <i className="fa fa-chevron-up gp-text-primary" aria-hidden="true"></i>
                    </a>
                </td>
                <td>
                    <a href="#" onClick={event => this.props.handleMove(event, id, 'down')}>
                        <i className="fa fa-chevron-down gp-text-primary" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>
        )
    }
}
