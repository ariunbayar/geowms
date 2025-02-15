import React, { Component, Fragment } from "react"


export default class RequestModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            status: "initial",
            modal_status: "closed",
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    componentDidMount() {
        if (this.state.status == "initial") this.handleOpen()
    }

    handleOpen() {
        this.setState({ status: "open" })
    }


    // TODO x дараад гарах үед болж магад
    handleAsk() {
        const modal = {
            modal_status: "open",
            modal_icon: "fa fa-exclamation-circle",
            modal_bg: '',
            icon_color: 'warning',
            title: 'Гарах',
            text: `Гарахдаа итгэлтэй байна уу?`,
            has_button: true,
            actionNameBack: 'Үгүй',
            actionNameDelete: 'Тийм',
            modalAction: () => this.handleClose(),
            modalClose: null
        }
        global.MODAL(modal)
    }

    handleClose() {
        this.setState({status: "closed"})
        this.props.modalClose()
    }

    handleModalOpen(){
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    render () {
        const { status } = this.state
        const className =
            "modal fade" +
            (status == "initial" ? " d-block" : "") +
            (status == "open" ? " show d-block" : "") +
            (status == "closing" ? " d-block" : "") +
            (status == "closed" ? " d-none" : "")

        const classNameBackdrop =
            "modal-backdrop fade" +
            (status == "open" ? " show" : "") +
            (status == "closed" ? " d-none" : "")
        return (
            <Fragment>
                <div className={className + " ml-3 mr-3 mb-3 mt-3 pl-3 pr-3 pb-3 pt-3 rounded text-wrap overflow-auto"} style={{height:"100vh"}}>
                    <div className="col-md-10 d-flex justify-content-center container">
                        <div className="modal-content animated row" >
                            <div className="col-md-12">
                                <div className="row mt-2" style={{background:"white"}}>
                                    <div className="col-md-11">
                                        <h5 className="text-center text-justify">{this.props.title}</h5>
                                    </div>
                                    <div className="col-md-1" onClick={() => this.handleClose()}>
                                        <button type="button" className="close float-right" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                </div>
                                {
                                    this.props.model_body
                                    &&
                                    <this.props.model_body
                                        {...this.props}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }
}
