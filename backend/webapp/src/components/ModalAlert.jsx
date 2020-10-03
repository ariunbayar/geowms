import React, {Component, Fragment} from "react"


export default class ModalAlert extends Component {

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

    handleClose(callback) {
        this.setState({status: 'closing'})
        setTimeout(() => {
            this.setState({status: 'closed'})
            if (callback) {
                callback()
            } else {
                this.props.modalClose()
            }
        }, 200)
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
                <div className={className} onClick={() => this.handleClose()}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content animated jackInTheBox" style={{border: 'none', borderRadius: "7px", background: "#ebebeb"}}>
                            <div className="d-flex justify-content-center">
                                {this.props.model_type_icon == "danger"?
                                <i class="fa fa-times-circle fa-3x my-3 animated bounceIn text-danger" aria-hidden="true"></i>
                                :
                                this.props.model_type_icon == "primary" ?
                                <i class="fa fa-check-circle fa-3x my-3 animated bounceIn gp-text-primary" aria-hidden="true"></i>
                                :
                                this.props.model_type_icon == "warning" ?
                                <i class="fa fa-exclamation-circle fa-3x my-3 animated bounceIn text-warning" aria-hidden="true"></i>
                                :
                                <i class="fa fa-check-circle fa-3x my-3 animated bounceIn text-success" aria-hidden="true"></i>
                            }
                            </div>
                            <div className="d-flex justify-content-center my-1">
                                <h6 className="text-dark">{this.props.title}</h6>
                                </div>
                            <div className="modal-body text-wrap ml-2 mr-2 my-3 text-justify">
                                <a className="text-dark">{this.props.text}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }

}