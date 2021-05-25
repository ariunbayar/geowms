import React, { Component } from "react"
import RequestModal from './requestModal'

export default class OpenMapModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_modal_request_open: false,
        }
        this.openModalMapMap = this.openModalMapMap.bind(this)
        this.closeModalMap = this.closeModalMap.bind(this)
    }

    openModalMapMap() {
        this.setState({ is_modal_request_open: true })
    }

    closeModalMap() {
        this.setState({ is_modal_request_open: false })
    }


    render() {
        const { is_modal_request_open } = this.state
        return (
            <div>
                <a
                    className="btn btn-primary btn-sm text-white text-capitalize"
                    onClick={this.openModalMapMap}
                >
                    Шийдвэрлэх
                </a>
                {
                    is_modal_request_open
                    &&
                        <RequestModal
                            hide_btn={this.props.hide_btn}
                            modalClose={this.closeModalMap}
                            refreshData={this.props.refreshData}
                            values={this.values}
                        />
                }
            </div>
        )
    }
}
