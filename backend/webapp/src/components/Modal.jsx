import React, {Component, Fragment} from "react"


export default class Modal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status || 'initial',
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleProceed = this.handleProceed.bind(this)
    }

    componentDidMount() {
        if (this.state.status == 'initial') {
            this.handleOpen()
        }
    }

    componentDidUpdate(prevProps) {

        if (this.props.status != prevProps.status) {
            if (['initial', 'open'].includes(this.props.status)) {
                this.handleOpen()
            }
            if (['closing', 'closed'].includes(this.props.status)) {
                this.handleClose(null, 0)
            }
        }
    }

    handleOpen() {
        this.setState({status: 'initial'})
        setTimeout(() => {
            this.setState({status: 'open'})
        }, 0)
    }

    handleClose(callback, timeout) {
        timeout = (timeout === undefined ? 150 : timeout)
        this.setState({status: 'closing'})
        setTimeout(() => {
            this.setState({status: 'closed'})
            if (callback) {
                callback()
            }
            if (this.props.modalClose) {
                this.props.modalClose()
            }
        }, timeout)
    }

    handleProceed() {
        this.handleClose(this.props.modalAction)
    }

    render () {
        const {status} = this.state

        const className =
            "modal fade" +
            (status == 'initial' ? ' d-block' : '') +
            (status == 'open' ? ' show d-block' : '') +
            (status == 'closing' ? ' d-block' : '') +
            (status == 'closed' ? ' d-none' : '')

        const classNameBackdrop =
            "modal-backdrop fade" +
            (status == 'open' ? ' show' : '') +
            (status == 'closed' ? ' d-none' : '')

        return (
            <Fragment>
                <div className={className}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content animated" style={{border: 'none', borderRadius: "7px", background: "#ebebeb"}}>
                            <div className="col-md-12 offset-md-12 float-right my-1">
                                <button type="button" className="close mt-2 mr-2" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" onClick={() => this.handleClose()} >&times;</span>
                                </button>
                            </div>
                            <div className="d-flex justify-content-center">
                            { this.props.model_type_icon == "success" ?
                                <i className="fa fa-times-circle fa-3x my-3 animated bounceIn text-success" aria-hidden="true"></i>
                                :
                                <i className="fa fa-times-circle fa-3x my-3 animated bounceIn text-danger" aria-hidden="true"></i>
                            }
                            </div>
                            <div className="d-flex justify-content-center">
                                <h5 >{this.props.title}</h5>
                                </div>
                            <div className="modal-body text-wrap ml-2 mr-2 text-justify">
                                {this.props.text}
                            </div>
                            <div className="modal-footer" style={{border: 'none'}}>
                                <button type="button" onClick={() => this.handleClose()} className="btn btn-primary waves-effect waves-light">
                                    <i className="fa fa-times"></i>
                                    {this.props.actionNameBack ? this.props.actionName : "  БУЦАХ"}
                                </button>
                                <button
                                    type="button"
                                    onClick={this.handleProceed}
                                    className="btn btn-outline-primary waves-effect waves-light"
                                >
                                    <i className="fa fa-check-square-o"></i>
                                    {this.props.actionName ? this.props.actionName : "  УСТГАХ"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }

}
