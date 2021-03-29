import React, { PureComponent } from 'react';

class Select extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            main_values: props.main_values,
            options: props.options,
        }
    }

    render() {
        const { name, mn_name, className, children } = this.props
        const { value, main_values, options } = this.state

        let select_options = Array()
        if (children.length > 0) {
            select_options = children
        }
        else {
            select_options = options
        }

        return (
            <select
                name={name}
                id={`id_${name}`}
                style={{ fontSize: '0.8rem' }}
                className={className ? className : ' custom-select'}
                onChange={(e) => this.props.handleOnChangeSelect(e.target.value, name)}
            >
                <option value="">--- {mn_name} сонгоно уу ---</option>
                {
                    options.map((item, idx) =>
                        <option key={idx} value={item.code_list_id}>{item.code_list_name}</option>
                    )
                }
            </select>
        );
    }
}

export default Select;