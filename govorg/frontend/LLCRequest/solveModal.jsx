import React, { Component } from "react"
import RequestModal from './requestModal'

export default class SolveModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_modal_request_open: false,
            values: props.values,
            state: props.values.state,
        }
        this.openModalMap = this.openModalMap.bind(this)
        this.closeModalMap = this.closeModalMap.bind(this)
    }

    openModalMap() {
        this.setState({ is_modal_request_open: true })
    }

    closeModalMap() {
        this.setState({ is_modal_request_open: false })
    }


    render() {
        const { is_modal_request_open, state } = this.state
        return (
            <div>
                {
                    state == "ШИНЭ"
                    &&
                        <a
                            className="btn btn-primary btn-sm text-white text-capitalize"
                            onClick={this.openModalMap}
                        >
                            Шийдвэрлэх
                        </a>
                }
                {
                    is_modal_request_open
                    &&
                        <RequestModal
                            modalClose={this.closeModalMap}
                            values={this.state.values}
                            title={'Хүсэлт шийдвэрлэх'}
                        />
                }
            </div>
        )
    }
}
