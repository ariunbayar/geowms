import React, { Component, Fragment } from "react"


export class ButtonDelete extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    handleButtonClick() {
        console.log(this.state.modal_status);
        const modal = {
            modal_status: 'open',
            modal_icon: `fa fa-exclamation-circle`,
            icon_color: 'warning',
            modal_bg: '',
            title: 'Албан хаагчийг чөлөөлөх',
            text: `${`Та "${this.props.employee_name}" нэртэй албан хаагчийн төлөв чөлөөлөгдсөн болно. Та чөлөөлөх итгэлтэй байна уу?`}`,
            has_button: true,
            actionNameDelete: 'Тийм',
            actionNameBack: 'Үгүй',
            modalAction: this.props.onClick,
            modalClose: null
        }
        global.MODAL(modal)
    }

    render() {

        return (
            <Fragment>
                <span
                    onClick={() => this.handleButtonClick()}
                    className="btn btn-danger waves-effect waves-light m-1"
                >
                    <i className="fa fa fa-trash-o"></i> Чөлөөлөх
                </span>
            </Fragment>
        )
    }
}
