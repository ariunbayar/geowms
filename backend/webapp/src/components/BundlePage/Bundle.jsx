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
        const {idx, values} = this.props
        return (
            <tr
                key={idx}
                draggable
                onDrop={event => this.props.onDrop(event, values, idx)}
                onDragOver={event => this.props.onDragOver(event, values, idx)}
                onDrag={(event) => this.props.onDrag(event, values, idx)}
            >
                <td scope="col" className="text-dark">
                    {idx + 1}
                </td>

                <td>
                    <NavLink to={`/back/дэд-сан/${id}/засах/`}>
                        <img className="img" src={icon_url}/>
                        {name}
                    </NavLink>
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
            </tr>
        )
    }
}
