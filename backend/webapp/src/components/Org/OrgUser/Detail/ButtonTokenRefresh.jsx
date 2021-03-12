import React, { Component, Fragment } from "react"

import Modal from "@utils/Modal/Modal"


export class ButtonTokenRefresh extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modal_status: 'closed',
            status_token_refresh: props.status
        }
        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.status_token_refresh != this.props.status) {
            if (this.props.status == 'success') {
                this.modalChange('fa fa-check-circle', "success", 'Токенийг амжилттай шинэчиллээ!', '', false)
            }
            else if (this.props.status == 'fail') {
                this.modalChange('fa fa-times-circle', "danger", 'Токен шинэчлэхэд алдаа гарлаа!', '', false)
            }
            this.setState({status_token_refresh: this.props.status})
        }
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, icon_color, title, text, has_button) {
        this.setState({
            modal_icon,
            icon_color,
            title,
            text,
            has_button,
        })
        this.handleModalOpen()

    }

    handleButtonClick() {
        this.modalChange(
            'fa fa-exclamation-circle',
            "warning",
            'Токен шинэчлэх',
            'Токенийг шинэчилсэнээр уг URL-ээр одоо ашиглаж байгаа газрууд ажиллахгүй болохыг анхаарна уу!',
            true
        )
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
                    modal_status={this.state.modal_status}
                    modal_icon={this.state.modal_icon}
                    icon_color={this.state.icon_color}
                    title={this.state.title}
                    has_button={this.state.has_button}
                    text={this.state.text}
                    modalAction={this.props.onClick}
                    actionNameDelete="Шинэчлэх"
                />

            </Fragment>
        )
    }
}
