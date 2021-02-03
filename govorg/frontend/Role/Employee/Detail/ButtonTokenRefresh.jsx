import React, { Component, Fragment } from "react"

import Modal from "@utils/Modal/Modal"
import ModalAlert from "@utils/Modal/ModalAlert"


export class ButtonTokenRefresh extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modal_status_confirm: 'closed',
        }
        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.modalClose = this.modalClose.bind(this)
    }

    handleButtonClick() {
        this.setState({ modal_status_confirm: 'open' }, () => {
            this.setState({ modal_status_confirm: 'initial' })
        })
    }

    modalClose() {
        this.setState({ modal_status_confirm: 'closed' })
    }

    render() {

        return (
            <Fragment>
                <span
                    onClick={ this.handleButtonClick }
                    className="btn btn-primary waves-effect waves-light m-1"
                >
                    <i className="fa fa-refresh"></i> Токен шинэчлэх
                </span>

                <Modal
                    text="Токенийг шинэчилсэнээр уг URL-ээр одоо ашиглаж байгаа газрууд ажиллахгүй болохыг анхаарна уу!"
                    title="Токен шинэчлэх"
                    model_type_icon="warning"
                    actionNameDelete="Шинэчлэх"
                    status={ this.state.modal_status_confirm }
                    modalAction={ this.props.onClick }
                    modalClose={ this.modalClose }
                />

                <ModalAlert
                    status={ this.props.status == 'success' ? 'open' : 'closed' }
                    title={ this.props.status_info }
                    model_type_icon="success"
                />

                <ModalAlert
                    status={ this.props.status == 'fail' ? 'open' : 'closed' }
                    title={ this.props.status_info }
                    model_type_icon="danger"
                />

            </Fragment>
        )
    }
}