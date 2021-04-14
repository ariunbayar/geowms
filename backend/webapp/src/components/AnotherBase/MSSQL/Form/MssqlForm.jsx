import React, { Component } from 'react';

import PropertyMatch from './PropertyMatch';
import SelectFeature from './SelectFeature'

import BackButton from "@utils/Button/BackButton"
import Loader from "@utils/Loader"
import Modal from "@utils/Modal/Modal"

import { service } from '../../service';

class MssqlForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            table_id: props.match.params.table_id,
            table_names: [],
            selected_value: '',
            is_loading: true,
            modal_status: 'closed',
            feature_code: '',
            ano_db_table: {},
        }
        this.handleChange = this.handleChange.bind(this)
        this.getTableNames = this.getTableNames.bind(this)
        this.setLoading = this.setLoading.bind(this)
        this.setModal = this.setModal.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.getFeatureCode = this.getFeatureCode.bind(this)
    }

    componentDidMount() {
        const { id, table_id }  = this.props.match.params
        this.getTableNames(id, table_id)
    }

    getTableNames(connection_id, table_id) {
        let ano_table_id
        if (table_id) ano_table_id = table_id
        if (!table_id) ano_table_id = -1

        service
            .mssql_config
            .getTableNames(connection_id, ano_table_id)
            .then(({ success, table_names, ano_db_table }) => {
                if (success) {
                    if (Object.keys(ano_db_table).length > 0) {
                        this.setState({ selected_value: ano_db_table.table_name, table_names, is_loading: false, ano_db_table })
                    }
                    else {
                        this.setState({ table_names, is_loading: false, ano_db_table })
                    }
                }
            })
            .catch(() => {
                alert("Холболтонд алдаа гарсан байна")
                this.setState({ is_loading: false })
            })
    }

    handleChange(e) {
        const selected_value = e.target.value
        this.setState({ selected_value })
    }

    setLoading(is_loading) {
        this.setState({ is_loading })
    }

    setModal(modalAction, text, title, modal_icon, icon_color, has_button, actionNameDelete, modalClose) {
        this.setState({
            modalAction,
            text,
            title,
            modal_icon,
            icon_color,
            has_button,
            actionNameDelete,
            modalClose
        })
        this.handleModalOpen()
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    getFeatureCode(feature_code) {
        this.setState({ feature_code })
    }

    render() {
        const { table_names, selected_value, id, is_loading, feature_code, ano_db_table, table_id } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <Loader
                        is_loading={is_loading}
                        text={'Уншиж байна'}
                    />
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="table_name">Хүснэгтийн нэр</label>
                            <select
                                className="custom-select"
                                id="table_name"
                                onChange={this.handleChange}
                                value={selected_value}
                                disabled={table_id ? true : false}
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
                        <div className="input-group col-md-12">
                            <SelectFeature
                                {...this.props}
                                setLoading={this.setLoading}
                                sendFeatureCode={this.getFeatureCode}
                            />
                        </div>
                    </div>
                    <hr />
                    <PropertyMatch
                        ano_db_table={ano_db_table}
                        {...this.props}
                        selected_value={selected_value}
                        connection_id={id}
                        setLoading={this.setLoading}
                        setModal={this.setModal}
                        feature_code={feature_code}
                    />
                    <Modal
                        modal_status={this.state.modal_status}
                        modalAction={this.state.modalAction}
                        text={this.state.text}
                        title={this.state.title}
                        modal_icon={this.state.modal_icon}
                        icon_color={this.state.icon_color}
                        has_button={this.state.has_button}
                        actionNameDelete={this.state.actionNameDelete}
                        modalClose={this.state.modalClose}
                    />
                    <BackButton
                        {...this.props}
                        name={'Буцах'}
                        navlink_url={`/back/another-base/connection/mssql/${id}/tables/`}
                    />
                </div>
            </div>
        );
    }
}

export default MssqlForm;
