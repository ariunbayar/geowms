import React, { Component } from 'react';

export default class SelectField extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const {title_name, defualt_value, defualt_text, data_list} = this.props
        return (
            <div className="form-group col-md-4">
                <label className=''>
                    {title_name ? title_name : ''}
                </label>
                <select
                    value={defualt_value}
                    className={'form-control col-md-12'}
                    onChange={(e) => this.props.handleSelectField(title_name, e.target.value)}
                >
                    <option value=''>---{defualt_text ? defualt_text : ''} ---</option>
                    {
                        (data_list && data_list.length >0)
                        &&
                        data_list.map((row, idx) =>
                            <option
                                key={idx}
                                value={row.code}
                            >
                                {row.name}
                            </option>
                        )
                    }
                </select>

            </div>
        );
    }
}
