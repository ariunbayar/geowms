import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from "../Modal"
import {GPIcon} from "@utils/Tools"


export default class GroupList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modal_status: "closed"
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
    }

    handleModalDeleteOpen(){
        this.setState({modal_status: 'open'})
    }

    handleModalDeleteClose(){
        this.setState({modal_status: 'closed'})
    }

    modalClose(){
        this.props.handleRemove()
        this.setState({modal_status: 'closed'})
    }

    render() {
        const {value, idx} = this.props
        return (
            <tr key={idx}>

                <td>
                    {idx}
                </td>
                <td>
                    {value}
                </td>
                <td>
                    <NavLink to={`/back/layer-groups/${value}/tile-caching/`} exact>
                        <GPIcon icon={"fa fa-shopping-basket"}/>
                    </NavLink>
                </td>
                <td>
                    <NavLink  className="text-primary" to={`/back/layer-groups/${value}/засах/`}>
                        <GPIcon icon={"fa fa-pencil-square-o"}/>
                    </NavLink>
                </td>
                <td>
                    <a href="#" onClick={this.handleModalDeleteOpen}>
                        <GPIcon icon={"fa fa-trash-o text-danger"}/>
                    </a>
                    <Modal
                        text={`Та "${value}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                        title="Тохиргоог устгах"
                        model_type_icon = "success"
                        status={this.state.modal_status}
                        modalClose={this.handleModalDeleteClose}
                        modalAction={() => this.modalClose()}
                    />
                </td>
            </tr>
        )
    }
}
