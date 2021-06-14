import React, { Component } from 'react';

export default class SelectField extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { title_name,
                defualt_value,
                defualt_text, op_key,
                name_key, className, data_list
        } = this.props
        return (
            <div className={`form-group ${className}`} >
                <label className=''>
                    {title_name ? title_name : ''}
                </label>
                <select
                    value={defualt_value}
                    className={'form-control col-md-12'}
                    onChange={(e) => this.props.handleSelectField(title_name, e)}
                >
                {
                    name_key
                    ?
                        data_list.map((data, idx) =>
                            <optgroup
                                key={idx}
                                label={data[name_key]}
                                value={defualt_text}
                            >
                            {
                                    OptionComp (data[op_key], defualt_text)
                            }
                            </optgroup>
                        )
                    :
                        OptionComp (data_list, defualt_text)
                }
                </select>

            </div>
        );
    }
}


function OptionComp (options_data, defualt_text){
    const options =
        (options_data && options_data.length >0)
        &&
            options_data.map((row, idx) =>
                <option
                    key={idx}
                    name={row.name}
                    value={row.code}

                >
                    {row.name}
                </option>
            )
    return options
}
