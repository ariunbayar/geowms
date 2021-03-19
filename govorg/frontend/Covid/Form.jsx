import React, { Component } from 'react';


class Input extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: props.value
        }
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    handleOnChange(value, name) {
        this.setState({ value })
        this.props.setValue(value, name)
    }

    render() {
        const { value } = this.state
        const { name, mn_name } = this.props
        return (
            <div className="form-group">
                <label htmlFor={`id_${name}`}>{mn_name}</label>
                <input
                    className="form-control"
                    value={value}
                    id={`id_${name}`}
                    name={name}
                    onChange={(e) => this.handleOnChange(e.target.value, name)}
                />
            </div>
        )
    }
}

class Form extends Component {

    constructor(props){
        super(props)
        this.state = {
            data: props.data,
        }
        this.setValue = this.setValue.bind(this)
        this.setValueToObj = this.setValueToObj.bind(this)
    }

    setValue(value, name) {
        let obj = Object()
        obj[name] = value
        const { values } = this.state
        values.map((item, idx) => {
            if (item.name == name) {
                values[idx]['value'] = value
            }
        })
        this.setState({ values })
    }

    componentDidMount() {
        this.setValueToObj()
    }

    // setValueToObj() {
    //     const { data } = this.state
    //     const { covid_dashboard } = this.props
    //     data.map((covid_dashboard, idx) => {
    //     })
    // }

    render() {
        const { covid_dashboard } = this.props
        const { data } = this.props
        return (
            <div className="card-body">
                {covid_dashboard.map((item, idx) =>
                    <Input key={idx}
                        type="text"
                        value={item.value}
                        name={item.origin_name}
                        setValue={this.setValue}
                        mn_name={item.name}
                    />
                )}
            </div>
        );
    }
}

export default Form;
