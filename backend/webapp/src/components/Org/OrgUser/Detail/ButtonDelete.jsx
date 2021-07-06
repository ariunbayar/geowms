import React, { Component, Fragment } from "react"


export class ButtonDelete extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modal_status: 'closed',
        }
    }

    componentDidUpdate(pP, pS) {
        if (pP.status !== this.props.status) {
            if (this.props.status == 'success') {
                const modal = {
                    modal_status: 'open',
                    modal_icon: `fa fa-check-circle`,
                    modal_bg: '',
                    icon_color: 'success',
                    title: 'Ажилттай',
                    text: 'Албан хаагчийн төлөв чөлөөлөгдсөн боллоо!',
                    has_button: false,
                    actionNameBack: '',
                    actionNameDelete: '',
                    modalAction: null,
                    modalClose: this.props.onSuccess
                }
                global.MODAL(modal)
            }
            if (this.props.status == 'fail') {
                const modal = {
                    modal_status: 'open',
                    modal_icon: `fa fa-times-circle`,
                    icon_color: 'danger',
                    modal_bg: '',
                    title: 'Устгах боломжгүй хэрэглэгч байна!',
                    text: 'Хэрэглэгч худалдан авалт хийсэн байна.',
                    has_button: false,
                    actionNameBack: '',
                    actionNameDelete: '',
                    modalAction: null,
                    modalClose: null,
                }
                global.MODAL(modal)
            }
        }
    }

    render() {

        return (
            <Fragment>
                <span
                    onClick={() => {
                        const modal = {
                            modal_status: 'open',
                            modal_icon: `fa fa-exclamation-circle`,
                            icon_color: 'warning',
                            modal_bg: '',
                            title: 'Албан хаагчийг устгах',
                            text: `${`Та "${this.props.employee_name}" нэртэй албан хаагчийн төлөв чөлөөлөгдсөн болно. Та устгахдаа итгэлтэй байна уу?`}`,
                            has_button: true,
                            actionNameDelete: 'Тийм',
                            actionNameBack: 'Үгүй',
                            modalAction: this.props.onClick,
                            modalClose: null
                        }
                        global.MODAL(modal)
                    }
                    }
                    className="btn btn-danger waves-effect waves-light m-1"
                >
                    <i className="fa fa fa-trash-o"></i> Устгах
                </span>
            </Fragment>
        )
    }
}
