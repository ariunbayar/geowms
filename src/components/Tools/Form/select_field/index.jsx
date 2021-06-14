import React, { Component } from 'react';



// <SelectField
//     title_name='feature'
//     data_list={selected_features}                       //сонголтын жагсаалт
//     default_value={feature_name}
//     name_key                                           // data_list датанаас грүппын нэрийг агуулсан key
//     op_key                                            // data_list датанаас сонголтын агуулсан key
//     className={"comd-4"}                             // Класс өгч болно
//     default_text={'feature-ийн нэр сонгоно уу'}     // select input - ийг сонгоогүй үед харагдах анхны утга
//     handleSelectField={this.handleChange}          // сонголт буцаах функц
// />


// --------------------------------------------------------
{/* <SelectField
        title_name='feature'
        data_list={selected_features}
        default_value={feature_name}
        className={"col-md-4"}
        default_text={'feature-ийн нэр сонгоно уу'}
        handleSelectField={this.handleChange}
    /> */}
// ----------------------------------------------------

export default class SelectField extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { title_name,
                default_value,
                default_text, op_key,
                name_key, className, data_list
        } = this.props
        return (
            <div className={`form-group ${className ? className : "col-md-4"}`} >
                <label className=''>
                    {title_name ? title_name : ''}
                </label>
                <select
                    value={default_value}
                    className={'form-control col-md-12'}
                    onChange={(e) => this.props.handleSelectField(title_name, e)}
                >
                    <option value=''>---{default_text ? default_text : ''} ---</option>
                    {
                    name_key
                    ?
                        data_list.map((data, idx) =>
                            <optgroup
                                key={idx}
                                label={ data[name_key] }
                                value={default_text}
                            >
                            {
                                    OptionComp (data[op_key])
                            }
                            </optgroup>
                        )
                    :
                        OptionComp (data_list)
                }
                </select>

            </div>
        );
    }
}


function OptionComp (options_data){
    const options =
        (options_data && options_data.length >0)
        &&
            options_data.map((row, idx) =>
                <option
                    key={idx}
                    name={row.name}
                    value={row.code}

                >
                    {row.name}
                </option>
            )
    return options
}
