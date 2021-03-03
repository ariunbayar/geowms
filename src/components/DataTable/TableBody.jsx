import React, { Component } from "react"
import {GPIcon} from "@utils/Tools"



export class TableBody extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { idx, талбарууд, values, хувьсах_талбарууд, нэмэлт_талбарууд } = this.props
        return (
            <tr>
                <td style={{width: "40px"}}>{idx}</td>
                {талбарууд.map((item, idx) =>
                    item.has_action
                    ?
                    хувьсах_талбарууд.map((хувьс, index) =>
                        хувьс.field == item.field
                        &&
                        <td key={idx}>
                            {
                                хувьс.component
                                ?
                                <хувьс.component values={values} {...хувьс.props}/>
                                :
                                хувьс.action_type
                                ?
                                <span className={хувьс.action(values[item.field])}>
                                    {
                                    хувьс.text
                                    ?
                                    хувьс.text
                                    :
                                    values[item.field]
                                    }
                                </span>
                                :
                                <a role="button" className="text-primary" onClick={() => хувьс.action(values)}>
                                    {values[item.field]}
                                </a>
                            }
                        </td>
                    )
                    :
                    <td key={idx}>{values[item.field]}</td>
                )}
                {нэмэлт_талбарууд.map((item, idx) =>
                    <td key={idx} style={{width: item.width ? item.width: null}}>
                        {item.component
                        ?
                        <item.component values={values} {...item.props}/>
                        :
                        <a role="button" onClick={() => item.action(values)}>
                            {
                            item.text
                            ?
                            item.text
                            :
                            <GPIcon icon={item.icon}></GPIcon>
                            }
                        </a>
                        }
                    </td>
                )}
            </tr>
        )
    }

}
