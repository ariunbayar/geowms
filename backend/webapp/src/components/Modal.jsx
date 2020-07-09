import React, {Component} from "react"

export default class Modal extends Component {

    render () {
        return (
            <>
            {this.props.showModal &&
                <div className="modal fade show d-block">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header" >
                                <h5 className="modal-title">{this.props.title}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <h6>{this.props.text}</h6>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.props.modalClose} className="btn gp-bg-primary text-white" data-dismiss="modal">Буцах</button>
                                <button type="button" onClick={this.props.modalAction} className="btn gp-bg-primary text-white" data-dismiss="modal">Устгах</button>

                            </div>
                        </div>
                    </div>
                </div>
            }
            </>
        );
    }
}
