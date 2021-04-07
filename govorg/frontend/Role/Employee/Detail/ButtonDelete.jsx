import React, { Component, Fragment } from "react"

import Modal from "@utils/Modal/Modal"


export class ButtonDelete extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modal_status: 'closed',
        }
        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.modalClose = this.modalClose.bind(this)
    }

    handleButtonClick() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalClose() {
        this.setState({ modal_status: 'closed' })
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
                    modal_status={this.state.modal_status}
                    modal_icon={'fa fa-exclamation-circle'}
                    icon_color={'warning'}
                    has_button={true}
                    title="Албан хаагчийг устгах"
                    text={`Та "${this.props.employee_name}" нэртэй албан хаагчийг устгахдаа итгэлтэй байна уу?`}
                    actionNameDelete="Устгах"
                    modalAction={ this.props.onClick }
                />
            </Fragment>
        )
    }
}
