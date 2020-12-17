import React, {Component, Fragment} from "react"


export default class  ShowModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status || 'initial',
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleShow = this.handleShow.bind(this)
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
            if (['showing'].includes(this.props.status)) {
                this.handleShow()
            }
            if (['closing', 'closed'].includes(this.props.status)) {
                this.handleClose()
            }
        }
    }

    handleOpen() {
        this.setState({status: 'initial'})
        setTimeout(() => {
            this.setState({status: 'open'})
        }, 0)
    }

    handleShow(callback) {
        this.setState({status: 'showing'})
        setTimeout(() => {
            this.setState({status: 'closed'})
            if (callback) {
                callback()
            } else {
                this.props.modalShow()
            }
        }, 150)
    }

    handleClose(callback) {
        this.setState({status: 'closing'})
        setTimeout(() => {
            this.setState({status: 'closed'})
            if (callback) {
                callback()
            } else {
                this.props.modalClose()
            }
        }, 150)
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
                        <div className="modal-content animated" style={{border: 'none', borderRadius: "7px"}}>
                            <div className="col-md-12 offset-md-12 float-right my-1">
                                <button type="button" className="close mt-2 mr-2" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" onClick={() => this.handleClose()} >&times;</span>
                                </button>
                            </div>
                            <div className="d-flex justify-content-center my-3">
                                <h5 >{this.props.title}</h5>
                            </div>
                            <div className="modal-body text-wrap ml-2 mr-2 text-center">
                                {this.props.text}
                            </div>
                            <div className="modal-footer" style={{border: 'none'}}>
                                <button type="button" onClick={() => this.handleShow()} className="btn btn-primary waves-effect waves-light">
                                    {this.props.actionNameBack ? this.props.actionNameBack : 'Үргэлжлүүлэх'}
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
