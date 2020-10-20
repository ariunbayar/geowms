import React, { Component } from 'react'

export default class SideBar extends Component {

    constructor(props) {
        super(props)
        this.data_type_span = 0
        this.f_c_span = 0
        this.close= this.close.bind(this)
    }

    close(){
        this.props.handleClose()
    }

    render() {
        const {show_side, features} = this.props
        return (
            <div className={`col-md-12 border border-danger position-fixed table-responsive ` + (show_side ? 'display-block' : 'd-none')} style={{zIndex:'1030', backgroundColor:'white'}}>
                {
                    this.props.show_side
                    ?
                    <button className="btn btn-danger float-right" onClick={() => this.close()}> X </button>
                    :
                    null
                }
                {
                    features.length !== 0 && features[0].feature_names.length > 0
                    ?
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    {features[0].feature_names.map((value, idx) =>
                                        <th
                                            key={idx}
                                            colSpan="10"
                                        >
                                            {value.feature_name}
                                        </th>
                                    )}
                                </tr>
                                <tr>
                                    {features[0].feature_configs_name.map((value, idx) =>
                                        <th
                                            key={idx}
                                            colSpan={
                                                features[0].data_type_names.map(val => {
                                                    if(val.data_type_id != value.data_type_id){
                                                        if(this.f_c_span > 0){
                                                            return this.f_c_span
                                                        }
                                                        this.f_c_span = 1
                                                    }
                                                    else{
                                                        this.f_c_span ++
                                                    }
                                                    if(this.f_c_span > 0){
                                                        return Math.max(this.f_c_span)
                                                }
                                            })
                                        }
                                        >
                                            {value.data_type_display_name} : {value.data_type_id}
                                        </th>
                                    )}
                                </tr>
                                <tr>
                                    {features[0].data_type_names.map((value, idx) =>
                                        <th
                                            key={idx}
                                            colSpan={
                                                features[0].property_names.map(val => {
                                                    console.log(val.data_type_id , value.data_type_id)
                                                    if(val.data_type_id != value.data_type_id){
                                                        this.data_type_span = 1
                                                    }
                                                    else
                                                    {
                                                        this.data_type_span ++
                                                    }
                                                    if(features[0].property_names.length == this.data_type_span){
                                                        return this.data_type_span
                                                    }
                                            })}
                                        >
                                            {value.data_type_name} : {value.data_type_id}
                                        </th>
                                    )}
                                </tr>
                                <tr>
                                    {features[0].property_names.map((value, idx) =>
                                        <th
                                            key={idx}
                                        >
                                            {value.property_name} : {value.data_type_id}
                                        </th>
                                    )}
                                </tr>
                            </thead>
                        </table>
                    :
                    <h3>Хоосон байна</h3>
                }
            </div>
        )
    }

}

