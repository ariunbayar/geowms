import React, { Component, Fragment } from "react"

import Modal from "@utils/Modal/Modal"


export class ButtonDelete extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modal_status: 'closed',
        }
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.modalChange = this.modalChange.bind(this)
    }

    componentDidUpdate(pP, pS) {
        if (pP.status !== this.props.status) {
            var status = this.props.status
            var modal_icon
            var icon_color
            var title
            var text
            var modalClose
            if (status == 'success') {
                modal_icon = 'fa fa-check-circle'
                icon_color = 'success'
                text = 'Албан хаагчийн төлөв чөлөөлөгдсөн боллоо!'
                modalClose = this.props.onSuccess
            }
            if (status == 'fail') {
                modal_icon = 'fa fa-times-circle'
                icon_color = 'danger'
                title = 'Устгах боломжгүй хэрэглэгч байна!'
                text = 'Хэрэглэгч худалдан авалт хийсэн байна.'
                modalClose = null
            }
            this.modalChange(
                modal_icon,
                null,
                icon_color,
                title,
                text,
                false,
                '',
                '',
                null,
                modalClose,
            )
        }
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, modal_bg, icon_color, title, text, has_button, actionNameBack, actionNameDelete, modalAction, modalClose) {
        this.setState(
            {
                modal_icon,
                modal_bg,
                icon_color,
                title,
                text,
                has_button,
                actionNameBack,
                actionNameDelete,
                modalAction,
                modalClose,
            },
            () => this.handleModalOpen()
        )
    }

    render() {

        return (
            <Fragment>
                <span
                    onClick={() =>
                        this.modalChange(
                            'fa fa-exclamation-circle',
                            null,
                            'danger',
                            'Албан хаагчийг устгах',
                            `${`Та "${this.props.employee_name}" нэртэй албан хаагчийн төлөв чөлөөлөгдсөн болно. Та устгахдаа итгэлтэй байна уу?`}`,
                            true,
                            '',
                            'Тийм',
                            () => this.props.onClick(),
                            null,
                        )
                    }
                    className="btn btn-danger waves-effect waves-light m-1"
                >
                    <i className="fa fa fa-trash-o"></i> Устгах
                </span>

                <Modal
                    modal_status={ this.state.modal_status }
                    modal_icon={ this.state.modal_icon }
                    modal_bg={ this.state.modal_bg }
                    icon_color={ this.state.icon_color }
                    title={ this.state.title }
                    text={ this.state.text }
                    has_button={ this.state.has_button }
                    actionNameBack={ this.state.actionNameBack }
                    actionNameDelete={ this.state.actionNameDelete }
                    modalAction={ this.state.modalAction }
                    modalClose={ this.state.modalClose }
                />

            </Fragment>
        )
    }
}
