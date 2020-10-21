import React, { Component } from 'react'
import Propties from './propertyList'

export default class SideBar extends Component {

    constructor(props) {
        super(props)
        this.data_type_span = 0
        this.f_c_span = 0

        this.state = {
            disabled: true,
            changeText: '',
        }

        this.changeText = this.changeText.bind(this)
    }

    changeText(e){
        console.log(e.target.value)
        this.setState({ changeText: e.target.value })
    }

    render() {
        const {features, check} = this.props
        const {disabled} = this.state
        console.log(features, check)
        return (
            <form className={`card col-md-7`} style={{left:"10px"}}>
                <div className="card-body">
                    {
                        features.length > 0 && check == 'байгаа'
                        ?
                                features.map((feature, idx) =>
                                    <div className="table-responsive" key={idx}>
                                        <h1 className="text-center">{feature.feature_name}</h1>
                                        <ol>
                                            {feature.f_configs.map((f_config, idx) =>
                                                <li className="mt-3" key={idx}>
                                                    <h5>{f_config.data_type_display_name}</h5>

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
                                                                            />
                                                                        </th>
                                                                            {/* <span>
                                                                                <p> {data_type_config.property_definition}</p>
                                                                            </span> */}
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
                                                                                                        <span>{code.code_list_name}</span>
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