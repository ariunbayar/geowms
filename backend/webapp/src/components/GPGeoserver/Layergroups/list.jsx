import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from "@utils/Modal/Modal"
import {GPIcon} from "@utils/Tools"

export default class GroupList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modal_status: "closed"
        }

        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    render() {
        const { value, idx } = this.props
        return (
            <tr key={idx}>
                <td>
                    {idx}
                </td>
                <td>
                    {value}
                </td>
                <td>
                    <NavLink to={`/back/gp-geoserver/layer-groups/${value}/tile-caching/`}>
                        <GPIcon icon={"fa fa-shopping-basket text-primary"}/>
                    </NavLink>
                </td>
                <td>
                    <NavLink className="text-primary" to={`/back/gp-geoserver/layer-groups/${value}/засах/`}>
                        <GPIcon icon={"fa fa-pencil-square-o text-primary"}/>
                    </NavLink>
                </td>
                <td>
                    <a href="#" onClick={this.handleModalOpen}>
                        <GPIcon icon={"fa fa-trash-o text-danger"}/>
                    </a>
                </td>
                <Modal
                    modal_status={this.state.modal_status}
                    modal_icon='fa fa-exclamation-circle'
                    icon_color="warning"
                    title='Тохиргоог устгах'
                    text={`Та "${value}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                    has_button={true}
                    modalAction={this.props.handleRemove}
                    actionNameDelete="Тийм"
                    actionNameBack="Үгүй"
                />
            </tr>
        )
    }
}
