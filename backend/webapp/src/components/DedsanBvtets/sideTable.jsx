import React, { Component } from 'react'
import Propties from './propertyList'
import {Notif} from '../../../../../src/components/Notification'

export default class SideBar extends Component {

    constructor(props) {
        super(props)
        this.data_type_span = 0
        this.f_c_span = 0
        this.too = 0
        this.state = {
            show: false,
        }
        this.addNotif = this.addNotif.bind(this)
    }

    addNotif(style, msg, icon){
        this.too ++
        this.setState({ show: true, style: style, msg: msg, icon: icon })
        const time = setInterval(() => {
            this.too --
            this.setState({ show: true })
            clearInterval(time)
        }, 2000);
    }


    render() {
        const {features, check, hide} = this.props
        return (
            <form>
                <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
                <div>
                    {
                        hide
                        ?
                        features.length > 0 && check == 'байгаа'
                        ?
                                features.map((feature, idx) =>
                                    <div className="table-responsive" key={idx}>
                                        <h2 className="text-center">
                                            <a
                                                href="#"
                                                onClick={() => this.props.handleFormLeft('feature', feature.feature_id, feature.feature_name)}
                                            >
                                                {feature.feature_name}
                                            </a>
                                        </h2>
                                        <ol>
                                            {feature.f_configs.map((f_config, idx) =>
                                                <li className="mt-3" key={idx}>
                                                    <h5>
                                                        <a
                                                            href="#"
                                                            onClick={() => this.props.handleFormLeft('feature_config', f_config.feature_config_id, f_config.data_type_display_name)}
                                                        >
                                                            {f_config.data_type_display_name}
                                                        </a>
                                                    </h5>

                                                    <table className="table table-bordered">
                                                        {f_config.data_types.map((data_type, idx) =>
                                                            <thead key={idx}>
                                                                <tr>
                                                                    <th colSpan="2" className="text-center">
                                                                        <a
                                                                            href="#"
                                                                            onClick={() => this.props.handleFormLeft('data_type', data_type.data_type_id, data_type.data_type_name)}
                                                                        >
                                                                            {data_type.data_type_name} = {data_type.data_type_id}
                                                                        </a>
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
                                                                    </th>
                                                                </tr>
                                                                {data_type.data_type_configs.map((data_type_config, idx) =>
                                                                    <tr key={idx}>
                                                                        <th className="text-center align-middle" >
                                                                            <Propties
                                                                                property_name={data_type_config.property_name}
                                                                                property_id={data_type_config.property_id}
                                                                                handleFormLef={this.props.handleFormLeft}
                                                                                addNotif={this.addNotif}
                                                                                is_read_only={data_type_config.is_read_only}
                                                                            />
                                                                        </th>
                                                                        <th>
                                                                            <ul>
                                                                                {data_type_config.value_types.map((value_type, idx) =>
                                                                                    <li key={idx}>
                                                                                        <span>
                                                                                            <a
                                                                                                href="#"
                                                                                                onClick={() => this.props.handleFormLeft('value_type', value_type.value_type_id, value_type.value_type_name)}
                                                                                            >
                                                                                                {value_type.value_type_name}
                                                                                            </a>
                                                                                        </span>
                                                                                        {
                                                                                            value_type.value_type_id == 'single-select'
                                                                                            ?
                                                                                                <a
                                                                                                    type="button"
                                                                                                    className="gp-text-primary"
                                                                                                    onClick={() => this.props.handleFormLeft('code_list_config', data_type_config.property_id)}
                                                                                                >
                                                                                                    <i className="fa fa-pencil-square-o mt-2 col-1 text-info"></i>
                                                                                                    code list zaswar
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
                                                                                                        <span>
                                                                                                            <a
                                                                                                               href="#"
                                                                                                               onClick={() => this.props.handleFormLeft('code_list', code.code_list_id, code.code_list_name)}
                                                                                                            >
                                                                                                                {code.code_list_name}
                                                                                                            </a>
                                                                                                        </span>
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
                                                                                                            code list nemeh
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
                                                                                                                utga nemj oruulah
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
                                                                            property nemeh
                                                                        </a>
                                                                    </th>
                                                                </tr>
                                                                {/* </tr> */}
                                                            </thead>
                                                        )}
                                                   </table>
                                                </li>
                                            )}
                                            <li>
                                                <a
                                                    type="button"
                                                    className="gp-text-primary"
                                                    onClick={() => this.props.handleFormLeft('feature_config', feature.feature_id)}
                                                    href="#"
                                                ><h5 className="text-danger">
                                                    <i className="fa fa-plus-circle gp-text-primary"></i>
                                                    &nbsp;
                                                    f config nemeh
                                                </h5>
                                                </a>
                                            </li>
                                        </ol>
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
        )
    }
}