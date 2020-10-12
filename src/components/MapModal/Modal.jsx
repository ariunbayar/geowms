import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'

class ModalComponent extends Component{

    constructor(props) {

        super(props)

        this.state = {
        }

    }
    handleAction(){
        this.props.handleClose()
        this.props.content()
    }

    render() {
        const { content, is_complete } = this.props
        const { payload } = this.state
        return (
            <div>
                <div className="show d-block modal modal-dialog modal-dialog-centered" style={{top: "100px"}}>
                <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content animated" style={{border: 'none', borderRadius: "7px"}}>
                            <div className="col-md-12 offset-md-12 float-right my-1">
                                <button type="button" className="close mt-2 mr-2" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" onClick={this.props.handleClose} >&times;</span>
                                </button>
                            </div>
                            <div className="d-flex justify-content-center">
                            { this.props.model_type_icon == "success" ?
                                <i className="fa fa-times-circle fa-3x animated bounceIn text-danger" aria-hidden="true"></i>
                                :
                                <i className="fa fa-times-circle fa-3x animated bounceIn text-success" aria-hidden="true"></i>
                            }
                            </div>
                            <div className="d-flex justify-content-center my-3">
                                <h5 >{this.props.title}</h5>
                                </div>
                            {this.props.text &&
                                <div className="modal-body text-wrap ml-2 mr-2 text-justify">
                                    {this.props.text}
                                </div>
                            }
                            <div className="modal-footer" style={{border: 'none'}}>
                                <button type="button" onClick={this.props.handleClose} className="btn btn-primary waves-effect waves-light">
                                    <i className="fa fa-times"></i>
                                    {this.props.actionNameBack ? this.props.actionNameBack : "  БУЦАХ"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => this.handleAction()}
                                    className="btn btn-outline-primary waves-effect waves-light"
                                >
                                    <i className="fa fa-check-square-o"></i>
                                    {this.props.actionName ? this.props.actionName : "  УСТГАХ"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='modal-backdrop fade show'></div>
            </div>
        )
    }
}

export class Modal extends Control {

    constructor(opt_options) {

      const options = opt_options || {}
        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = false

        this.element.className = 'modal fade show'

        this.renderComponent = this.renderComponent.bind(this)
        this.toggleControl = this.toggleControl.bind(this)

    }

    toggleControl(is_visible) {
        this.element.classList.toggle('d-block', is_visible)
    }

    renderComponent(props) {

        props.handleClose = () => this.toggleControl(false)

        if (!this.is_component_initialized) {
            ReactDOM.render(<ModalComponent {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<ModalComponent {...props}/>, this.element)
    }

    showModal(content, is_complete, actionName, title, text, model_type_icon, actionNameBack) {
        this.toggleControl(true)
        this.renderComponent({content, is_complete, actionName, title, text, model_type_icon, actionNameBack})
    }

}

