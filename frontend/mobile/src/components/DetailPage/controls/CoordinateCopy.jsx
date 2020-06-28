import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {CLASS_CONTROL, CLASS_HIDDEN} from 'ol/css.js'


class CopyInput extends Component {

    constructor(props) {
        super(props)
        this.handleCoordinateSet = this.handleCoordinateSet.bind(this)
    }

    componentDidMount() {
        this.handleCoordinateSet()
    }

    componentDidUpdate(prevProps) {
        this.handleCoordinateSet()
    }

    handleCoordinateSet() {
        const input = ReactDOM.findDOMNode(this)
        input.focus()
        input.select()
    }

    render() {

        return (
            <input type="text"
                className="form-control"
                onChange={() => {}}
                onBlur={this.props.handleBlur}
                value={this.props.coordinate}
            />
        )

    }

}


export class CoordinateCopy extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = false

        const cssClasses = `coordinate-copy-control ${CLASS_CONTROL} ${CLASS_HIDDEN}`
        this.element.className = cssClasses

        this.render = this.render.bind(this)
        this.toggleControl = this.toggleControl.bind(this)

    }

    toggleControl(is_visible) {
        this.element.classList.toggle(CLASS_HIDDEN, !is_visible)
    }

    renderComponent(props) {

        props.handleBlur = () => this.toggleControl(false)

        if (!this.is_component_initialized) {
            ReactDOM.render(<CopyInput {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<CopyInput {...props}/>, this.element)
    }

    setCoordinate(coordinate) {
        this.renderComponent({coordinate})
        this.toggleControl(true)
    }

}
