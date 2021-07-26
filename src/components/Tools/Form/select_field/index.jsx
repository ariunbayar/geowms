import React, { Component } from 'react';

// <SelectField
//     state_name='feature'
//     data_list={selected_features}                  //сонголтын жагсаалт
//     default_value={feature_name}
//     name_key                                       // data_list датанаас грүппын нэрийг агуулсан key
//     opt_key                                        // data_list датанаас тухайн грүппийн сонголтын агуулсан key
//     option_name                                    // сонголтын нэр
//     option_key                                     // сонголтын value
//     errors                                         // validition алдаануудыг харуулна
//     className={"comd-4"}                           // Класс өгч болно
//     bracket_option={ }                             // текстийн хаалтыг сонгох
//     default_text={'feature-ийн нэр сонгоно уу'}    // select input - ийг сонгоогүй үед харагдах анхны утга
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
    errors = {"feild_name": "TODO", "errors": ['error1, 'error2']}
    data_list={selected_packages}
    default_value={package_name}
    className={"col-md-4"}
    bracket_option={ }
    default_text={'package-ийн нэр сонгоно уу'}
    handleSelectField={this.handleChange}
/> */}

// ----------------------------------------------------

export default class SelectField extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected_value: '',
            bracket_options:[
                {open: '(', close: ')'},
                {open:"'", close: "'"},
                {open:"/", close:"/"}
            ]
        }
        this.dataSelection = this.dataSelection.bind(this)
    }

    dataSelection(e) {
        const selection_value = e.target.value
        const { data_list,
                state_name, name_key,
                opt_key, option_key,
                bracket_options
        } = this.props

        data_list.map((row, idx) => {
            if (name_key) {
                row[opt_key].map((data, idx) => {
                    if(selection_value == data[option_key]) {
                        this.props.handleSelectField(state_name, bracket_options, data, e)
                    }
                })
            }
            else {
                if (selection_value == row[option_key]) {
                    this.props.handleSelectField(state_name, bracket_options,row, e)
                }
            }
        })
        this.setState({ selected_value: selection_value })
    }

    render() {
        const { default_value, label, errors, state_name,
                default_text, option_key, option_name,
                opt_key, name_key, className, data_list,
                option_text, disabled, option_name_2, display_mode,
                bracket_option,
        } = this.props
        const state = this.state
        var { bracket_options } = this.state
        let title = label ? label : ''
        return (
            <div className={`form-group ${className ? className : "col-md-4"}`} >
                <label id={title}>
                    {title}
                </label>
                <select
                    value={state.selected_value ? state.selected_value : default_value}
                    className={`custom-select  ${! default_value && 'border-danger'}`}
                    onChange={(e) => this.dataSelection(e)}
                    disabled={disabled}
                >
                    <option value=''>---{default_text ? default_text : ''} ---</option>
                    {
                        name_key
                        ?
                            data_list.map((data, idx) =>
                                <optgroup
                                    key={idx}
                                    label={data[name_key]}
                                    value={default_value}
                                >
                                    {OptionComp (data[opt_key], option_key, option_name, option_name_2, option_text, display_mode, bracket_option, bracket_options)}
                                </optgroup>
                            )
                        :
                            OptionComp (data_list, option_key, option_name, option_name_2, option_text, display_mode, bracket_option, bracket_options)
                    }
                </select>
                {/* TODO Алдааны message өгөхөд ашиглана */}
                {
                    errors &&
                        errors.map((row) =>
                            row['field_name'] === state_name
                            &&
                                row['errors'].map((error, idx) =>
                                    <div key={idx} className='form-group-row'>
                                        <small className="text-danger">
                                            {error}
                                        </small>
                                    </div>
                                )
                        )
                }
            </div>
        );
    }
}


function OptionComp (options_data,  option_key, option_name, option_name_2, option_text, display_mode, bracket_option, bracket_options) {
    var option_data = option_name
    if (option_text) option_data = option_text
    const options =
        (options_data && options_data.length > 0)
        &&
            options_data.map((row, idx) =>
                <option
                    key={idx}
                    name={row[option_name]}
                    value={row[option_key]}
                    bracket_options={bracket_options[bracket_option]}
                >
                    {
                        display_mode
                        ?
                            row[option_data]  + bracket_options[bracket_option].open + row[option_name_2] + bracket_options[bracket_option].close
                        :
                            row[option_data]
                    }
                </option>
            )
    return options
}
