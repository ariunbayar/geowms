import React, { Component, Fragment } from "react"

import ReactDOM from 'react-dom'
import {Control} from 'ol/control'

class NewInput extends Component{
    constructor(props){
        super(props)
        this.input_data = {}
        this.state = {
            input_value: '',
        }
    }

    handleOnChange(input_value) {
        const { idx, ix, field, length, origin_name } = this.props
        this.setState({ input_value })
        this.props.getValues(input_value, idx, origin_name)
    }

    render() {
        const { idx, ix, field, length, choices, value, disabled, type, is_detail } = this.props
        const { input_value } = this.state
        return (
            <div className="form-group animated slideInLeft">
                <dt>{field}</dt>
                {
                    is_detail
                    ?
                        <dd>{value}</dd>
                    :
                        type == 'date' && choices == null
                        ?
                            <input
                                type={type}
                                maxLength={length}
                                className="form-control"
                                disabled={disabled}
                                value={input_value}
                                onChange={(e) => this.handleOnChange(e.target.value)}
                            />
                        :
                        length > 1900 && choices == null
                        ?
                            <textarea
                                className="form-control"
                                rows="3"
                                onChange={(e) => this.handleOnChange(e.target.value)}
                                maxLength={length}
                                disabled={disabled}
                                placeholder={value}
                                value={value}
                            >
                            </textarea>
                        : length < 1900 && choices == null ?
                            <input
                                type='text'
                                maxLength={length}
                                className="form-control"
                                disabled={disabled}
                                value={value}
                                onChange={(e) => this.handleOnChange(e.target.value)}
                                placeholder={field + ` оруулна уу`}
                            />
                        : choices !== null ?
                            <select className="form-control"
                                disabled={disabled}
                                onChange={(e) => this.handleOnChange(e.target.value)}>
                                <option key={idx} value=''>--- Сонгоно уу ---</option>
                                {choices.map((choice, idx) =>
                                    <option key={idx} value={choice[0]}>{choice[1]}</option>
                                )}
                            </select>
                        : null
                    }
            </div>
        )
    }
}

class ListComponent extends Component {

    constructor(props) {

        super(props)
        this.state = {
            values: {}
        }
        this.getValues = this.getValues.bind(this)
    }

    getValues(value, idx, origin_name) {
        const { values } = this.state
        values[origin_name] = value
        this.setState({ values })
    }

    componentDidMount() {
    }

    render() {
        const { fields, is_detail, title } = this.props
        const { values } = this.state
        return (
                <div>
                    <div className="row text-center">
                        <div className="col-md-10">
                            <h6>{title}</h6>
                        </div>
                        <div className="col-md-2">
                            <button type="button" className="close">
                                <span aria-hidden="true" onClick={() => this.props.handleClose()}>&times;</span>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-auto" style={{maxHeight: "calc( 50vh - 70px - 15px)"}}>
                        {fields.map((field, idx) =>
                            <NewInput key={idx}
                                is_detail={is_detail}
                                field={field.name}
                                length={field.length}
                                disabled={field.disabled}
                                idx={idx}
                                origin_name={field.origin_name}
                                getValues={this.getValues}
                                value={field.value}
                                choices={field.choices}
                                type={field.type}
                            />
                        )}
                    </div>
                    {
                        !is_detail
                        ?
                            <div className="pb-2">
                                <button className="btn btn-primary btn-block" onClick={() => this.props.saveErguulPlace(values)}>
                                    Хадгалах
                                </button>
                            </div>
                        :
                            <div className="pb-2"></div>
                    }
                </div>
        )
    }
}

export class showForm extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = false
        const cssClasses = `col-md-3 card`

        this.element.className = cssClasses
        this.element.style.display = 'none'
        this.element.style.height = 'auto'
        this.renderComponent = this.renderComponent.bind(this)
        this.toggleControl = this.toggleControl.bind(this)
    }

    toggleControl(is_visible) {
        if (is_visible) {
            this.element.style.display = 'block'
        }
        else {
            this.element.style.display = 'none'
        }

    }

    renderComponent(props) {
        props.handleClose = () => {
            this.toggleControl(false)
        }

        if (!this.is_component_initialized) {
            ReactDOM.render(<ListComponent {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<ListComponent {...props}/>, this.element)
    }

    showForm(islaod, fields, title, saveErguulPlace, is_detail=false) {
        this.toggleControl(islaod)
        this.renderComponent({fields, title, is_detail, saveErguulPlace})
    }

}
