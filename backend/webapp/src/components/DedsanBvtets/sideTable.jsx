import React, { Component } from 'react'
import Propties from './propertyList'
import {Notif} from '@utils/Notification'
import { service } from './service'

export default class SideBar extends Component {

    constructor(props) {
        super(props)
        this.data_type_span = 0
        this.f_c_span = 0
        this.too = 0
        this.state = {
            show: false,
            feature_ids: []
        }
        this.addNotif = this.addNotif.bind(this)
        this.getOverlapsFeatures = this.getOverlapsFeatures.bind(this)
        this.setOverlapsFeatures = this.setOverlapsFeatures.bind(this)
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

    componentDidUpdate(pp){
        if(pp.feature_id !== this.props.feature_id){
            this.getOverlapsFeatures(this.props.feature_id)
        }
    }
    getOverlapsFeatures(feature_id){
        service.getOverlapsFeature(feature_id).then(({success, feature_ids}) => {
            if(success){
                this.setState({ feature_ids })
            }
        })
    }

    setOverlapsFeatures(feature_id, overlap_feature_id, state){
        service.setOverlapsFeature(feature_id, overlap_feature_id, state).then(({success, info}) => {
            if(success){
                this.addNotif('success', info, 'times')
                this.getOverlapsFeatures(feature_id)
            }else{
                this.addNotif('danger', info, 'check')
            }
        })
    }


    render() {
        const {features, check, hide, list_all, feature_id} = this.props
        return (
            <div>
                {features.length > 0 &&
                <>
                    <div className="row mt-5 border ml-1 mr-0 mb-5 ">
                        <div className="col-12">
                            <h4 className="text-center">Үл давхцах давхаргууд</h4>
                            <hr></hr>
                        </div>
                        <div className="col-md-6 height-feature-select card-body">
                            {list_all.map((theme, idx) =>
                                theme.package.map((packages, idx) =>
                                    packages.features.map((feature, idx) =>
                                        this.state.feature_ids.indexOf(feature.id) < 0 && feature_id != feature.id &&
                                        <div
                                            className="row list-card"
                                            onClick={() => this.setOverlapsFeatures(feature_id , feature.id, "create")}
                                        >
                                            <div className="col-10">
                                                <a>
                                                    <i className="fa fa-table"></i> &nbsp;
                                                    <span role="button" className="hidden-xs gp-text-primary" > {feature.name}</span>
                                                </a>
                                            </div>
                                            <div className="col-2">
                                                <a type="button" className="gp-text-primary">
                                                    <i className="fa fa-plus-circle gp-text-primary fa-2x"></i>
                                                </a>
                                            </div>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                        <div className="col-md-6 height-feature-select card-body">
                            {list_all.map((theme, idx) =>
                                theme.package.map((packages, idx) =>
                                    packages.features.map((feature, idx) => (
                                        this.state.feature_ids.indexOf(feature.id) > -1 && feature_id != feature.id &&
                                        <div
                                            className="row list-card"
                                            onClick={() => this.setOverlapsFeatures(feature_id , feature.id, "remove")}
                                        >
                                            <div className="col-11">
                                                <a>
                                                    <i className="fa fa-table"></i> &nbsp;
                                                    <span role="button" className="hidden-xs gp-text-primary" > {feature.name}</span>
                                                </a>
                                            </div>
                                            <div className="col-1">
                                                <a type="button" className="gp-text-primary" >
                                                    <i className="fa fa-minus gp-text-primary fa-2x"></i>
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                )
                            )}
                        </div>
                    </div>
                </>
                }
                <form>
                    <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
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
                                                            <th colspan={4} className="text-center">
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
                                                                <>
                                                                    <>
                                                                    {f_config.data_types.map((data_type, idx) =>
                                                                        <>
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
                                                                                            addNotif={this.addNotif}
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
                                                                                                                className="gp-text-primary"
                                                                                                                onClick={() => this.props.handleFormLeft('code_list_config', data_type_config.property_id)}
                                                                                                            >
                                                                                                                <i className="fa fa-plus-circle mt-2 col-1 gp-text-primary"></i>
                                                                                                                <span className="gp-text-primary">Code list засах</span>
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
                                                                                        Property нэмэх
                                                                                    </a>
                                                                                </th>
                                                                            </tr>
                                                                            {/* </tr> */}
                                                                        </>
                                                                    )}
                                                                </>
                                                            </>
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
