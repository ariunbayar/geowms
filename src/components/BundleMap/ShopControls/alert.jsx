import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {service} from '../service'
import { toStringHDMS } from "ol/coordinate"
import Corner from "ol/extent/Corner"
import { array } from "yup"
import { CompilationStatus } from "webpack-build-notifier/dist/types"
import OverlayPositioning from "ol/OverlayPositioning"
import { set } from "ol/transform"
import { withRouter } from 'react-router-dom';
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";
export class Alert extends Component{

    constructor(props) {
        super(props)
        this.state = {
           torf: this.props.TorF
        }
    }

    componentDidMount(){
        const { TorF } = this.props
        if(TorF){
            setTimeout(() => {
                this.setState({ torf: !TorF })
            }, 2000);
        }
    }

    componentWillReceiveProps(){
        const { TorF } = this.props
        if(TorF)
        {
            this.setState({ torf: TorF })
            setTimeout(() => {
                this.setState({ torf: !TorF })
            }, 2000);
        }
    }

    render(){
        const { TorF, msg} = this.props
        const {torf} = this.state
        return(
            <div>
                {
                    torf
                    ?
                    <div className="alert alert-danger alert-custom-css" role="alert">
                        {msg}
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}

export class AlertRoot extends Control {

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
        this.showAlert = this.showAlert.bind(this)
    }

    renderComponent(props) {
        if (!this.is_component_initialized) {
            ReactDOM.render(<Alert {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<Alert {...props}/>, this.element)
    }

    showAlert(TorF, msg) {
        this.renderComponent({TorF, msg})
    }
}