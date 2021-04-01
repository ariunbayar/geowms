import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {CLASS_CONTROL, CLASS_HIDDEN} from 'ol/css.js'


class Zoom_In extends Component {

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
            <input
                type="text"
                className="form-control col-md-12 text-center border border-primary"
                onChange={() => {}}
                onBlur={this.props.handleBlur}
                value={this.props.coordinate}
            />
        )

    }

}


export class ZoomControl extends Control {

    constructor() {

        super({
            element: document.createElement('div'),
        })

        const cssClasses = `coordinate-copy-control ${CLASS_CONTROL} ${CLASS_HIDDEN}`
        this.element.className = cssClasses
        this.element.style.right = '0'
        this.element.style.margin = '10px'
        this.element.style.width = 'auto'

        this.renderComponent = this.renderComponent.bind(this)

    }

    renderComponent(props) {

        if (!this.is_component_initialized) {
            ReactDOM.render(<Zoom_In {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<Zoom_In {...props}/>, this.element)
    }

    setCoordinate(coordinate) {
        this.renderComponent({coordinate})
    }

}
