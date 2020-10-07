import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {service} from '../../service'
import { toStringHDMS } from "ol/coordinate"
import Corner from "ol/extent/Corner"
import { array } from "yup"
import { CompilationStatus } from "webpack-build-notifier/dist/types"
import OverlayPositioning from "ol/OverlayPositioning"
import { set } from "ol/transform"
import { withRouter } from 'react-router-dom';
import { identityTransform } from "ol/proj"

export class Point extends Component{

    constructor(props) {
        super(props)

        this.state = {

        }

    }

    componentDidMount(){

    }

    componentDidUpdate(pP, pS){
    }

    render(){
        return(
            <div className="root">
               <h1>MAP</h1>
            </div>
        )
    }
}

export class PointButton extends Control {

    constructor(opt_options) {
        const options = opt_options || {}
        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = true
        this.is_cart = false

        this.element.className = 'd-block'

        this.renderComponent = this.renderComponent.bind(this)
        this.showModal = this.showModal.bind(this)
    }

    renderComponent(props) {
        if (!this.is_component_initialized) {
            ReactDOM.render(<Point {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<Point {...props}/>, this.element)
    }

    showModal(test) {
        console.log("Point")
        this.renderComponent({test})
    }
}