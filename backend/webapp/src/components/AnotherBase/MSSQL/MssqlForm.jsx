import React, { Component } from 'react';

import PropertyMatch from './PropertyMatch';

class MssqlForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            table_names: [
                'BUILDING_ALS3',
                'BUILDING_BGD',
                'BUILDING_BZD',
                'BUILDING_CHD',
                'BUILDING_HUD',
                'BUILDING_SBD',
                'BUILDING_SHD'
            ],
            selected_value: '',
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        const selected_value = e.target.value
        this.setState({ selected_value })
    }

    render() {
        const { table_names, selected_value } = this.state
        return (
            <div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="table_name">Хүснэгтийн нэр</label>
                        <select
                            className="custom-select"
                            id="table_name"
                            onChange={this.handleChange}
                            value={selected_value}
                        >
                            <option value=""> -- Хүснэгтийн нэр сонгоно уу -- </option>
                            {
                                table_names.map((item, idx) =>
                                    <option key={idx} value={item}>{item}</option>
                                )
                            }
                        </select>
                    </div>
                </div>
                <PropertyMatch
                    selected_value={selected_value}
                />
            </div>
        );
    }
}

export default MssqlForm;