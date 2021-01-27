import React, { Component, Fragment } from "react"

import Modal from "@utils/Modal/Modal"
import ModalAlert from "../../../../../backend/webapp/src/components/ModalAlert"


export class ButtonDelete extends Component {

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
                    className="btn btn-danger waves-effect waves-light m-1"
                >
                    <i className="fa fa fa-trash-o"></i> Устгах
                </span>

                <Modal
                    text={`Та "${this.props.employee_name}" нэртэй албан хаагчийг устгахдаа итгэлтэй байна уу?`}
                    title="Албан хаагчийг устгах"
                    model_type_icon="warning"
                    actionName="Устгах"
                    status={ this.state.modal_status_confirm }
                    modalAction={ this.props.onClick }
                    modalClose={ this.modalClose }
                />

                <ModalAlert
                    status={ this.props.status == 'success' ? 'open' : 'closed' }
                    title="Албан хаагчийг амжилттай устгалаа!"
                    model_type_icon="success"
                    modalAction={ this.props.onSuccess }
                />

                <ModalAlert
                    status={ this.props.status == 'fail' ? 'open' : 'closed' }
                    title="Устгахад алдаа гарлаа!"
                    model_type_icon="danger"
                />

            </Fragment>
        )
    }
}
