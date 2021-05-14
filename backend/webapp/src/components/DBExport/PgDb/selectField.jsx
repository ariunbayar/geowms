import React, { Component } from 'react';

export default class SelectField extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const {title_name, data_list, defualt_value} = this.props
        return (
            <div className="form-group col-md-3">
                <label className=''>
                    {title_name}
                </label>
                <select
                    value={defualt_value}
                    className={'form-control col-md-12'}
                    onChange={(e) => this.props.setSelect(title_name, e)}
                >
                    <option value=''>---{title_name}-ийн нэр сонгоно уу---</option>
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
