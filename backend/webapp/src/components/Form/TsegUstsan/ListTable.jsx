import React, { Component } from "react"
import {NavLink} from "react-router-dom"

export default class ListTable extends Component {




    render() {
        const idx = this.props.idx
        const {id,email,name,alban_tushaal,utas,tseg_id} = this.props.values
        return (
            <tr>
                <td scope="col">
                    {idx+1}
                </td>
                <td scope="col">
                    {email}
                </td>
                <td>
                   {name}
                </td>
                <td>
                    {alban_tushaal}
                </td>
                <td>
                    {utas}
                </td>
                <td>
                    {tseg_id}
                </td>
                <td>
                <NavLink to={`/back/froms/tseg-ustsan/${id}/засах`}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                </NavLink>
                </td>
                <td>
                <a href="#" onClick={this.props.handleTsegDelete}>
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                </a>
            </td>
            </tr>
        )
    }
}
