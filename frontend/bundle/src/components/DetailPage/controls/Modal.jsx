import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {CLASS_CONTROL, CLASS_UNSELECTABLE} from 'ol/css.js'


class ModalComponent extends Component{
    render() {
        return (
                <div className="modal-dialog">
                    <div className="modal-content">
                          <div className="modal-header">
                                <h5 className="modal-title">Дэлгэрэнгүй мэдээлэл</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                          </div>
                          <div className="modal-body">
                                <p>Дата</p>
                          </div>
                          <div className="modal-footer">
                                <button type="button" className="btn btn-primary">Хадгалах</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Буцах</button>
                          </div>
                    </div>
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

        const cssClasses = 'modal-body show'
        this.element.className =cssClasses
        this.element.style.display = 'none'

        ReactDOM.render(<ModalComponent/>, this.element)

    }
}

