import React, { Component, Fragment } from 'react'
import Propties from './propertyList'

import OverLaps from './components/OverLaps'

export default class SideBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { features, check, hide, list_all, feature_id } = this.props
        return (
            <div>
                {
                    features.length > 0
                    &&
                        <OverLaps themes={list_all} feature_id={feature_id} setNotif={this.props.setNotif}/>
                }
                <form>
                    <div className="table-responsive">
                        {
                            hide
                            ?
                            features.length > 0 && check == 'байгаа'
                            ?
                                features.map((feature, idx) =>
                                    <div key={idx}>
                                        <div>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th colSpan={4} className="text-center">
                                                        <span
                                                            className="gp-text-primary" role="button"
                                                            onClick={() => this.props.handleFormLeft('feature', feature.feature_id, feature.feature_name)}
                                                        >
                                                            {feature.feature_name}
                                                        </span>
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-center">
                                                            Feature <br/>config
                                                        </th>
                                                        <th className="text-center">
                                                            Data <br/>type
                                                        </th>
                                                        <th className="text-center">
                                                            Property
                                                        </th>
                                                        <th className="text-center">
                                                            Property <br/>тайлбар
                                                        </th>
                                                    </tr>
                                                    {feature.f_configs.map((f_config, idx) =>
                                                        <Fragment key={idx}>
                                                            {
                                                                f_config.data_types.length == 0
                                                                ?
                                                                    <tr>
                                                                        <th className="text-center vertical align-middle">
                                                                            <span
                                                                                className="gp-text-primary" role="button"
                                                                                onClick={() => this.props.handleFormLeft('feature_config', f_config.feature_config_id, f_config.data_type_display_name)}
                                                                            >
                                                                                {f_config.data_type_display_name}
                                                                            </span>
                                                                        </th>
                                                                    </tr>
                                                                :
                                                                    null
                                                            }
                                                            {f_config.data_types.map((data_type, idx) =>
                                                                <Fragment key={idx}>
                                                                     <tr>
                                                                        <th rowSpan={data_type.data_type_configs.length + 3} className="text-center vertical align-middle">
                                                                            <span
                                                                                className="gp-text-primary" role="button"
                                                                                onClick={() => this.props.handleFormLeft('feature_config', f_config.feature_config_id, f_config.data_type_display_name)}
                                                                            >
                                                                                {f_config.data_type_display_name}
                                                                            </span>
                                                                        </th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th rowSpan={data_type.data_type_configs.length + 2} className="text-center vertical align-middle">
                                                                            <span
                                                                                className="gp-text-primary" role="button"
                                                                                onClick={() => this.props.handleFormLeft('data_type', data_type.data_type_id, data_type.data_type_name, f_config.feature_config_id)}
                                                                            >
                                                                                {data_type.data_type_name}
                                                                            &nbsp;
                                                                            &nbsp;
                                                                            {
                                                                                data_type.is_read_only
                                                                                ?
                                                                                    <i
                                                                                        className="fa fa-eye fa-1x"
                                                                                        aria-hidden="true"
                                                                                        title="Зөвхөн харах"
                                                                                    ></i>
                                                                                :
                                                                                    <i
                                                                                        className="fa fa-pencil fa-1x"
                                                                                        aria-hidden="true"
                                                                                        title="засаж болно"
                                                                                    ></i>
                                                                            }
                                                                            </span>
                                                                        </th>
                                                                    </tr>
                                                                    {data_type.data_type_configs.map((data_type_config, idx) =>
                                                                        <tr key={idx}>
                                                                            <th className="text-center align-middle" >
                                                                                <Propties
                                                                                    top_id={data_type_config.data_type_config_id}
                                                                                    property_name={data_type_config.property_name}
                                                                                    property_definition={data_type_config.property_definition}
                                                                                    property_id={data_type_config.property_id}
                                                                                    handleFormLef={this.props.handleFormLeft}
                                                                                    addNotif={this.props.setNotif}
                                                                                    is_read_only={data_type_config.is_read_only}
                                                                                />
                                                                            </th>
                                                                            <th>
                                                                                <ul>
                                                                                    {data_type_config.value_types.map((value_type, idx) =>
                                                                                        <li key={idx}>
                                                                                            <a>
                                                                                                <span
                                                                                                    className="gp-text-primary" role="button"
                                                                                                    onClick={() => this.props.handleFormLeft('value_type', value_type.value_type_id, value_type.value_type_name)}
                                                                                                >
                                                                                                    {value_type.value_type_name}
                                                                                                </span>
                                                                                            </a>
                                                                                            {
                                                                                                value_type.value_type_id == 'single-select'
                                                                                                ?
                                                                                                    <a
                                                                                                        type="button"
                                                                                                        onClick={() => this.props.handleFormLeft('code_list_config', data_type_config.property_id)}
                                                                                                    >
                                                                                                        <i className="fa fa-plus-circle ml-1 gp-text-primary"></i>
                                                                                                        <span className="text-danger"> Code list засах</span>
                                                                                                    </a>
                                                                                                :
                                                                                                null
                                                                                            }
                                                                                            {
                                                                                                value_type.code_lists.length > 0 &&
                                                                                                value_type.value_type_id == 'single-select'
                                                                                                ?
                                                                                                <ul style={{listStyleType: '"- "'}}>
                                                                                                    {value_type.code_lists.map((code, idx) =>
                                                                                                        <li key={idx}>
                                                                                                            <a>
                                                                                                                <span
                                                                                                                className="gp-text-primary" role="button"
                                                                                                                onClick={() => this.props.handleFormLeft('code_list', code.code_list_id, code.code_list_name)}
                                                                                                                >
                                                                                                                    {code.code_list_name}
                                                                                                                </span>
                                                                                                            </a>
                                                                                                        </li>
                                                                                                    )}
                                                                                                        <li className="text-danger">
                                                                                                            <a
                                                                                                                type="button"
                                                                                                                className="gp-text-primary"
                                                                                                                onClick={() => this.props.handleFormLeft('code_list', data_type_config.property_id)}
                                                                                                            >
                                                                                                                <i className="fa fa-plus-circle gp-text-primary"></i>
                                                                                                                &nbsp;
                                                                                                                Code list нэмэх
                                                                                                            </a>
                                                                                                        </li>
                                                                                                </ul>
                                                                                                :
                                                                                                (
                                                                                                    value_type.value_type_id == 'single-select' &&
                                                                                                    value_type.code_lists.length == 0
                                                                                                    ?
                                                                                                        <ul style={{listStyleType: '"- "'}}>
                                                                                                            <li className="text-danger">
                                                                                                                <a
                                                                                                                    type="button"
                                                                                                                    className="gp-text-primary"
                                                                                                                    onClick={() => this.props.handleFormLeft('code_list', data_type_config.property_id)}
                                                                                                                >
                                                                                                                    <i className="fa fa-plus-circle gp-text-primary"></i>
                                                                                                                    &nbsp;
                                                                                                                    Утга нэмж оруулах
                                                                                                                </a>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    :
                                                                                                        null
                                                                                                )
                                                                                            }
                                                                                        </li>
                                                                                    )}
                                                                                </ul>
                                                                            </th>
                                                                        </tr>
                                                                    )}
                                                                    <tr>
                                                                        <th colSpan="2" className="text-danger">
                                                                            <a
                                                                                type="button"
                                                                                className="gp-text-primary"
                                                                                onClick={() => this.props.handleFormLeft('data_type_config', data_type.data_type_id)}
                                                                            >
                                                                                <i className="fa fa-plus-circle gp-text-primary"></i>
                                                                                &nbsp;
                                                                                DataType нэмэх
                                                                            </a>
                                                                        </th>
                                                                    </tr>
                                                                    {/* </tr> */}
                                                                </Fragment>
                                                            )}
                                                        </Fragment>
                                                    )}
                                                    <tr>
                                                        <th colSpan="4" className="text-danger">
                                                        <a
                                                            type="button"
                                                            className="gp-text-primary"
                                                            onClick={() => this.props.handleFormLeft('feature_config', feature.feature_id)}
                                                            className="gp-text-primary" role="button"
                                                        ><h5 className="text-danger">
                                                            <i className="fa fa-plus-circle gp-text-primary"></i>
                                                            &nbsp;
                                                            Feature config нэмэх
                                                        </h5>
                                                        </a>
                                                        </th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                    </div>
                                )
                            :
                                check === ""
                                ?
                                    <h1 className="text-center">Feature сонгоно уу</h1>
                                :
                                check == 'байхгүй'
                                ?
                                    <h1 className="text-center">
                                        <i className="fa fa-exclamation-circle text-warning"></i>
                                        &nbsp;Feature-ийн мэдээлэл алга
                                    </h1>
                                :
                                null
                            :
                            null
                        }
                    </div>
                </form>
            </div>
        )
    }
}
