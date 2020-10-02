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
                        <div className="modal-content animated jackInTheBox" style={{border: 'none', borderRadius: "7px", background: "#ebebeb"}}>
                            <div className="col-md-12 offset-md-12 float-right my-1">
                                <button type="button" className="close mt-2 mr-2" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" onClick={() => this.handleClose()} >&times;</span>
                                </button>
                            </div>
                            <div className="d-flex justify-content-center">
                            {this.props.model_type_icon ?
                            <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="exclamation-circle" role="img" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512" class="svg-inline--fa fa-exclamation-circle fa-w-16 fa-fw fa-2x">
                            <path fill="green" d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 
                            216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 
                            0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 
                            340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z" class=""></path>
                            </svg>
                            :
                            <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="exclamation-circle" role="img" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512" class="svg-inline--fa fa-exclamation-circle fa-w-16 fa-fw fa-2x">
                            <path fill="red" d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 
                            216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 
                            0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 
                            340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z" class=""></path>
                            </svg>
                            }
                            </div>
                            <div className="d-flex justify-content-center my-3">
                                <h5 >{this.props.title}</h5>
                                </div>
                            <div className="modal-body text-wrap ml-2 mr-2 text-justify my-(-1)">
                                {this.props.text}
                            </div>
                            <div className="modal-footer" style={{border: 'none'}}>
                                <button type="button" onClick={() => this.handleClose()} className="btn btn-primary waves-effect waves-light">
                                    <i class="fa fa-times"></i>
                                    {this.props.actionName ? this.props.actionName : "  БУЦАХ"}
                                </button>
                                <button
                                    type="button"
                                    onClick={this.handleProceed}
                                    class="btn btn-outline-primary waves-effect waves-light"
                                >
                                    <i class="fa fa-check-square-o"></i>
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