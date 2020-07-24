import React, {Component, Fragment} from "react"

export default class Modal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: this.props.showModal,
        }
        this.handleClose = this.handleClose.bind(this)
        this.handleProceed = this.handleProceed.bind(this)
    }

    componentDidUpdate(prevProps){
        if(prevProps.showModal !== this.props.showModal)
        {   
            //alert(this.props.showModal)
            const showModal = this.props.showModal
            this.setState({status: showModal})
        }

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
                <div className={className} >
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header" >
                                <h5 className="modal-title">{this.props.title}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" onClick={this.props.modalClose} >&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {this.props.text}
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.props.modalClose} className="btn btn-outline-primary">Буцах</button>
                                <button type="button" onClick={this.handleProceed} className="btn gp-bg-primary text-white">Устгах</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
        // ene baigaa vyd Modal ajilsani daraa busad tsesrvv shiljij bolohgvi bsn  <div className={classNameBackdrop}></div>
    }

}
