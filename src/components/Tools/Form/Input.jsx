import React, { PureComponent } from 'react';
import Select from './help_components/select'

class Inputs extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            value: props.value,
            children: [],
        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleOnChangeSelect = this.handleOnChangeSelect.bind(this)
    }

    handleOnChange(value, name) {
        this.props.sendValue(value, name)
        this.setState({ value })
        /*
            getValue(value, name) {
                const { values } = this.state
                values.map((item, idx) => {
                    if (item.name == name) {
                        values[idx]['value'] = value
                    }
                })
                this.setState({ values })
            }
        */
    }

    handleOnChangeSelect(value, name) {
        const { options } = this.props
        let children = Array()
        options.map((item, idx) => {
            if (item.children && item.code_list_id == value)
            {
                children = item.children
            }
        })
        this.setState({ value, ...children })
        this.props.sendValue(value, name)
    }

    render() {
        const { name, type, mn_name, placeholder, className, options, main_values } = this.props
        const { value, children } = this.state
        return (
            <div className="form-group">
                <label htmlFor={`id_${name}`}>
                    {mn_name}
                </label>
                {
                    type == 'select'
                    ?
                        <div>
                            {
                                children.length > 0
                                ?
                                    <Select
                                        {...this.props}
                                        handleOnChangeSelect={this.handleOnChangeSelect}
                                        value={value}
                                    />
                                :
                                    <Select
                                        {...this.props}
                                        children={children}
                                        handleOnChangeSelect={this.handleOnChangeSelect}
                                        value={value}
                                    />
                            }
                        </div>
                    :
                    type == 'textarea'
                    ?
                        <textarea
                            className={className ? className : ' form-control'}
                            name={name}
                            id={`id_${name}`}
                            cols="30"
                            rows="10"
                            onChange={(e) => this.handleOnChange(e.target.value, name)}
                        >
                        </textarea>
                    :
                        <input
                            className={className ? className : ' form-control'}
                            type={type}
                            name={name}
                            placeholder={placeholder}
                            onChange={(e) => this.handleOnChange(e.target.value, name)}
                        />
                }
            </div>
        );
    }
}

export default Inputs;

/*
    <GPInput
        mn_name={field.name}
        name={field.mn_name}
        placeholder={field.placeholder}
        type={field.type}
        className={'custom-select'} // className gej uguhgv bsn ch bolno uguugv uyd form-control gej bgaa
        sendValue={this.getValue}
    />
*/
