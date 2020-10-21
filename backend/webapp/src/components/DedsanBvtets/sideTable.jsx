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
        const {features, check} = this.props
        return (
            <form className={`card col-md-7`} style={{left:"10px"}}>
                <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
                <div className="card-body">
                    {
                        features.length > 0 && check == 'байгаа'
                        ?
                                features.map((feature, idx) =>
                                    <div className="table-responsive" key={idx}>
                                        <h2 className="text-center"> {feature.feature_name} </h2>
                                        <ol>
                                            {feature.f_configs.map((f_config, idx) =>
                                                <li className="mt-3" key={idx}>
                                                    <h5> {f_config.data_type_display_name} </h5>

                                                    <table className="table table-bordered">
                                                        {f_config.data_types.map((data_type, idx) =>
                                                            <thead key={idx}>
                                                                <tr>
                                                                    <th colSpan="2" className="text-center">
                                                                        {data_type.data_type_name}
                                                                    </th>
                                                                </tr>
                                                                {data_type.data_type_configs.map((data_type_config, idx) =>
                                                                    <tr key={idx}>
                                                                        <th className="text-center align-middle" >
                                                                            <Propties
                                                                                property_name={data_type_config.property_name}
                                                                                property_id={data_type_config.property_id}
                                                                                addNotif={this.addNotif}
                                                                            />
                                                                        </th>
                                                                        <th>
                                                                            <ul>
                                                                                {data_type_config.value_types.map((value_type, idx) =>
                                                                                    <li key={idx}>
                                                                                        <span>
                                                                                            {value_type.value_type_name}
                                                                                        </span>

                                                                                        {
                                                                                            value_type.code_lists.length > 0 &&
                                                                                            value_type.value_type_id == 'single-select'
                                                                                            ?
                                                                                            <ul style={{listStyleType: '"- "'}}>
                                                                                                {value_type.code_lists.map((code, idx) =>
                                                                                                    <li key={idx}>
                                                                                                        <span> {code.code_list_name}</span>
                                                                                                    </li>
                                                                                                )}
                                                                                            </ul>
                                                                                            :
                                                                                            null
                                                                                        }

                                                                                    </li>
                                                                                )}
                                                                            </ul>
                                                                        </th>
                                                                    </tr>
                                                                )}
                                                                {/* </tr> */}
                                                            </thead>
                                                        )}
                                                   </table>
                                                </li>
                                            )}
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
                    }
                </div>
            </form>
        )
    }
}