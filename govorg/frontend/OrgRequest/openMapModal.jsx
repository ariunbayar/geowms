import React, { Component } from "react"
import RequestModal from './requestModal'

export default class OpenMapModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_modal_request_open: false,
            title: props.button_name || 'Шийдвэрлэх',
            values: props.values,
            state: props.values.state,
        }
        this.openModalMapMap = this.openModalMapMap.bind(this)
        this.closeModalMap = this.closeModalMap.bind(this)
    }

    componentDidMount() {
        const { values } = this.state
        const { group } = values
        if (group) {
            this.values = group
            this.setState({ title: 'Олноор шийдвэрлэх' })
        }
    }

    openModalMapMap() {
        this.setState({ is_modal_request_open: true })
    }

    closeModalMap() {
        this.setState({ is_modal_request_open: false })
    }

    render() {
        const { is_modal_request_open, title, values, state } = this.state
        const { button_name } = this.props
        if (!button_name && !this.values) {
            this.values = [values]
        } else if (button_name && !this.values) {
            this.values = [values]
        }
        return (
            <div>
                {
                    title == "Шийдвэрлэх"
                    ?
                        this.values.map((items, idx ) =>
                            items.state == "ШИНЭ"
                            ?
                                <a
                                    className="btn btn-primary btn-sm text-white text-capitalize"
                                    onClick={this.openModalMapMap}
                                >
                                    {title}
                                </a>
                            :
                                null

                        )
                    :
                        this.values.map((items, idx ) =>
                            items.state != "ШИНЭ"
                            ?
                                <i
                                    className="fa fa-eye"
                                    onClick={this.openModalMapMap}
                                >
                                </i>
                            :
                            null
                        )
                    }
                    {is_modal_request_open &&
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
