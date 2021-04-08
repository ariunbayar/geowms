import React, { Component } from 'react';

import PropertyMatch from './PropertyMatch';
import SelectFeature from './SelectFeature'

import BackButton from "@utils/Button/BackButton"

import { service } from '../service';

class MssqlForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            table_names: [],
            selected_value: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.getTableNames = this.getTableNames.bind(this)
    }

    componentDidMount() {
        const { id }  = this.props.match.params
        this.getTableNames(id)
    }

    getTableNames(connection_id) {
        service
            .mssql_config
            .getTableNames(connection_id)
            .then(({ success, table_names }) => {
                if (success) {
                    this.setState({ table_names })
                }
            })
    }

    handleChange(e) {
        const selected_value = e.target.value
        this.setState({ selected_value })
    }

    render() {
        const { table_names, selected_value, id } = this.state
        return (
            <div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="table_name">Хүснэгтийн нэр</label>
                        <select
                            className="custom-select"
                            id="table_name"
                            onChange={this.handleChange}
                            value={selected_value}
                        >
                            <option value=""> -- Хүснэгтийн нэр сонгоно уу -- </option>
                            {
                                table_names.length > 0
                                &&
                                    table_names.map((item, idx) =>
                                        <option key={idx} value={item.table_name}>{item.table_name}</option>
                                    )
                            }
                        </select>
                    </div>
                    <div className="input-group col-md-6">
                        <SelectFeature />
                    </div>
                </div>
                <PropertyMatch
                    selected_value={selected_value}
                    connection_id={id}
                />
                <BackButton {...this.props} name={'Буцах'} navlink_url={`/back/another-base/`}></BackButton>
            </div>
        );
    }
}

export default MssqlForm;