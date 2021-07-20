import React, { Component } from 'react';

import { QPay } from '../../../QPay/Qpay';

import { service } from '../../../service'

class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gen_qpay: false
        }
    }

    handleOpen() {
        const gen_qpay = true
        this.handleModal(
            '',
            '',
            '',
            <QPay
                purchase_id={this.props.payment_id}
                qpay_open={gen_qpay}
                handleClose={(is_success) => this.handleClose(is_success)}
                history={this.props.history}
            />,
            false
        )
        this.setState({ gen_qpay })
    }

    makeFile() {
        if (!this.props.items.export_file) {
            service.downloadPurchase(this.props.payment_id)
        }
    }

    handleClose(is_success) {
        if (is_success) {
            this.handleModal(
                'fa fa-check-circle',
                'success',
                "Худалдан авалтын мэдээлэл",
                'Төлөлт амжилттай хийгдлээ. Татах линкийг таны баталгаажуулсан цахим хаягаар илгээх болно.',
                false,
                null,
                '',
                () => this.makeFile(),
            )
            this.props.getDetails()
        }
        this.setState({ gen_qpay: false })
    }

    handleModal(modal_icon, icon_color, title, text, has_button, modalAction, actionNameDelete, modalClose=null) {
        const modal = {
            modal_status: "open",
            modal_icon: modal_icon,
            modal_bg: "",
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
            actionNameBack: "Буцах",
            actionNameDelete: actionNameDelete,
            modalAction: modalAction,
            modalClose: modalClose
        }
        global.MODAL(modal)
    }

    render() {

        const { items } = this.props

        return (
            <div>
                {
                    !items.is_success
                    ?
                        <div className="btn gp-btn-primary" onClick={() => this.handleOpen()}>
                            Төлбөр төлөх
                        </div>
                    :
                        null
                }
            </div>
        );
    }
}

export default index;