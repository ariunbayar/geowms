import React, { Component, Fragment } from "react"
import Loader from "@utils/Loader"
export default class ModelSendData extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status || "initial",
            is_loading: false,
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleIsload = this.handleIsload.bind(this)
        this.handleProceed = this.handleProceed.bind(this)
    }

    componentDidMount() {
        if (this.state.status == "initial") {
            this.handleOpen()
        }
    }

    handleIsload(status) {
        this.setState({ is_loading: status })
    }

    componentDidUpdate(prevProps) {
        if (this.props.status != prevProps.status) {
            if (["initial", "open"].includes(cthis.props.status)) {
                this.handleOpen()
            }
            if (["closing", "closed"].includes(this.props.status)) {
                this.handleClose()
            }
        }
    }

    handleProceed(type, values) {
        this.props.modalAction(type, values)
    }

    handleOpen() {
        this.setState({ status: "initial" })
        setTimeout(() => {
            this.setState({ status: "open" })
        }, 0)
    }

    handleClose(callback) {
        this.setState({ status: "closing" })
        setTimeout(() => {
            this.setState({ status: "closed" })
            this.props.closeRequestMap()
        }, 150)
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
                <div className={className + " ml-3 pl-4 mt-4 pt-4 rounded text-wrap position-fixed"}  tabIndex="-1"  role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="col-md-8 d-flex justify-content-center container align-center align-self-center">
                        <div className="col-md-12">
                            <div className="modal-content animated row" >
                                <div className="col-md-12">
                                    <Loader is_loading={this.state.is_loading}/>
                                    <div className="row mt-2" style={{background:"white"}} onClick={() => this.handleClose()} >
                                        <div className="col-md-11">
                                            <h5 className="text-center text-justify">Хүсэлт илгээх</h5>
                                        </div>
                                        <div className="col-md-1">
                                            <button type="button" className="close float-right" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="row">
                                        {
                                            this.props.body
                                            ?
                                                <this.props.body
                                                    values={this.props}
                                                    handleIsload={this.handleIsload}
                                                    closeRequestMap={this.props.closeRequestMap}
                                                />
                                            :
                                                null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }
}
