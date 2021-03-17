import React, { PureComponent } from 'react';

class Inputs extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            value: props.value
        }
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    handleOnChange(value, name) {
        this.setState({ value })
        this.props.sendValue(value, name)
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

    render() {
        const { name, type, mn_name, placeholder, className } = this.props
        return (
            <div className="form-group">
                <label htmlFor={`id_${name}`}>
                    {mn_name}
                </label>
                <input
                    className={className ? className : 'form-control '}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    onChange={(e) => this.handleOnChange(e.target.value, name)}
                />
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
