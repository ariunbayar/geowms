import React, { Component } from "react"
import {NavLink} from "react-router-dom"


export default class Data extends Component {

    render() {

        const values = this.props.values
        return (
            <tr>
                {
                    Object.keys(values).map((key) => {
                        return(
                            <td key={key}> {values[key]} </td>
                        )

                    })
                }
            </tr>
        )
    }
}
