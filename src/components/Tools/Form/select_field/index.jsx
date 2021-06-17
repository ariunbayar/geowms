import React, { Component } from 'react';

// <SelectField
//     state_name='feature'
//     data_list={selected_features}                       //сонголтын жагсаалт
//     default_value={feature_name}
//     name_key                                           // data_list датанаас грүппын нэрийг агуулсан key
//     opt_key                                            // data_list датанаас тухайн грүппийн сонголтын агуулсан key
//     option_name                                        // сонголтын нэр
//     option_key                                        // сонголтын value
//     className={"comd-4"}                             // Класс өгч болно
//     default_text={'feature-ийн нэр сонгоно уу'}     // select input - ийг сонгоогүй үед харагдах анхны утга
//     handleSelectField={this.handleChange}          // сонголт буцаах функц
// />

// Opthroup эсвэл option хэлбэрээр ашиглаж болно
// Хэрэв Optgroup хэлбэрээр ашиглавал name_key, opt_key , option_name , option_key заавал байна
// Option хэлбэрээр ашиглавал option_name , option_key заавал байна


// --------------------------------------------------------

{/* <SelectField
    state_name='package'
    option_name = "name"
    option_key = "code"
    data_list={selected_packages}
    default_value={package_name}
    className={"col-md-4"}
    default_text={'package-ийн нэр сонгоно уу'}
    handleSelectField={this.handleChange}
/> */}

// ----------------------------------------------------

export default class SelectField extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected_value: ''
        }
        this.dataSelection = this.dataSelection.bind(this)
    }

    dataSelection(e){
        const selection_value = e.target.value
        const { data_list,
                state_name, name_key,
                opt_key, option_key
        } = this.props

        data_list.map((row, idx) => {
            if (name_key){
                row[opt_key].map((data, idx) => {
                    if(selection_value == data[option_key]){
                        this.props.handleSelectField(state_name, e, row[opt_key])
                    }
                })
            }
            else {
                if (selection_value == row[option_key]){
                    this.props.handleSelectField(state_name, e, row)
                }
            }
        })
        this.setState({ selected_value: selection_value })
    }

    render() {
        const { default_value, label,
                default_text, option_key, option_name,
                opt_key, name_key, className, data_list,
                option_text
        } = this.props
        const state = this.state
        let title = label ? label : ''
        return (
            <div className={`form-group ${className ? className : "col-md-4"}`} >
                <label id={title}>
                    {title}
                </label>
                <select
                    value={state.selected_value ? state.selected_value : default_value}
                    className={'form-control'}
                    onChange={(e) => this.dataSelection(e)}
                >
                    <option value=''>---{default_text ? default_text : ''} ---</option>
                    {
                    name_key
                    ?
                        data_list.map((data, idx) =>
                            <optgroup
                                key={idx}
                                label={ data[name_key] }
                                value={default_value}
                            >
                            {
                                    OptionComp (data[opt_key], option_key, option_name, option_text)
                            }
                            </optgroup>
                        )
                    :
                        OptionComp (data_list, option_key, option_name, option_text)
                }
                </select>

            </div>
        );
    }
}


function OptionComp (options_data,  option_key, option_name, option_text){
    const options =
        (options_data && options_data.length >0)
        &&
            options_data.map((row, idx) =>
                <option
                    key={idx}
                    name={row[option_name]}
                    value={row[option_key]}

                >
                    {option_text ? row[option_text] : row[option_name]}
                </option>
            )
    return options
}
