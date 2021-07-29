import React, { Component } from "react"
import Loader from "@utils/Loader"
import SelectField from '@utils/Tools/Form/select_field'
import FileUpload from '@utils/Tools/FileUpload'

import { LLCMap } from '../LLCMap'
import UsedTools from './select_tools'

export default class RequestDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_loading: false,
        }
        this.handleLoaderActive = this.handleLoaderActive.bind(this)
    }

    handleLoaderActive(status) {
        this.setState({ is_loading: status })
    }

    render() {
        const { vector_datas, id, aimag_geom, } = this.props
        return (
            <div className="row p-3">
                <Loader is_loading={this.state.is_loading} text={"Хүсэлт илгээж байна. Түр хүлээнэ үү !!!"}/>
                <div className="col-md-5">
                    <Form
                        {...this.props}
                        enableLoader={this.handleLoaderActive}
                    />
                </div>
                {
                    id
                    &&
                        <div className="col-md-7">
                            <Map
                                vector_datas={vector_datas}
                                height="80vh"
                                aimag_geom={aimag_geom}
                            />
                        </div>
                }
            </div>
        )
    }
}

class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { vector_datas, aimag_geom, height } = this.props
        return (
            <LLCMap
                vector_datas={vector_datas}
                height={height}
                aimag_geom={aimag_geom}
            />
        )
    }
}

export class Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            form_checked: false,
            id: props.id,
            file_name: '',
            file_state: false,
            selected_tools: [],
            info: false,
            desc_info: false,
            state: props.state,
            disabled: false,
            nationwide: '',
            hide_file: false,
            investment_status: [
                {id: 1, name: "Төсөл, хөтөлбөрийн"},
                {id: 2, name: "Орон нутгийн"},
                {id: 3, name: "Улсын төсвийн"},
                {id: 4, name: "Хувийн"},
            ],

            mergejilten: props.mergejilten,
            emp_fields: props.emp_fields,
            info: props.info,
            desc_info: props.desc_info,
            aimag_name: props.aimag_name,
            zahialagch: props.zahialagch,
            project_name: props.project_name,
            desc: props.desc,
            object_type: props.object_type,
            object_count: props.object_count,
            hurungu_oruulalt: props.hurungu_oruulalt,
            tool_datas: props.tool_datas,

        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.getMergejilten = this.getMergejilten.bind(this)
        this.getValueCheckbox = this.getValueCheckbox.bind(this)
        this.validationForm = this.validationForm.bind(this)
        this.getFile = this.getFile.bind(this)
        this.handleSelectModel = this.handleSelectModel.bind(this)
    }

    componentDidMount() {
        const { info } = this.props
        if(info) {
            this.setState({ disabled: true })
        }
    }

    componentDidUpdate(pP, pS) {
        const { state, geo_id } = this.props
        if (pP.state != state) {
            if(state == "ИЛГЭЭСЭН") {
                this.setState({ disabled: true })
            }
        }

        if (pP.mergejilten !== this.props.mergejilten ||
            pP.emp_fields !== this.props.emp_fields ||
            pP.info !== this.props.info ||
            pP.desc_info !== this.props.desc_info ||
            pP.aimag_name !== this.props.aimag_name ||
            pP.zahialagch !== this.props.zahialagch ||
            pP.project_name !== this.props.project_name ||
            pP.desc !== this.props.desc ||
            pP.object_type !== this.props.object_type ||
            pP.object_count !== this.props.object_count ||
            pP.hurungu_oruulalt !== this.props.hurungu_oruulalt ||
            pP.tool_datas !== this.props.tool_datas
        ) {
            this.setState({
                mergejilten: this.props.mergejilten,
                emp_fields: this.props.emp_fields,
                info: this.props.info,
                desc_info: this.props.desc_info,
                aimag_name: this.props.aimag_name,
                zahialagch: this.props.zahialagch,
                project_name: this.props.project_name,
                desc: this.props.desc,
                object_type: this.props.object_type,
                object_count: this.props.object_count,
                hurungu_oruulalt: this.props.hurungu_oruulalt,
                tool_datas: this.props.tool_datas,
                selected_tools: this.props.selected_tools,
                files: this.props.files,
            })
        }

        if(pP.geo_id !== geo_id) {
            if(geo_id == '496') {
                this.setState({ form_checked: true })
            }
            else {
                this.setState({ form_checked: false })
            }
        }
    }

    getValueCheckbox(e) {
        const { geo_id } = this.props
        const checked = e.target.checked
        if (checked == true) {
            this.setState({
                nationwide: '496',
                form_checked: true
            })
        }
        else {
            this.setState({
                nationwide: geo_id,
                form_checked: false
            })
        }
    }

    getFile(files) {
        const { id } = this.props
        var { file_name, file_state } = this.state
        const file = files[0]
        if(files && files.length > 0)
            file_name = file.name
            if (id) {
                file_state = true
            }

        this.setState({ files, file_name, file_state })
    }

    validationForm() {
        var forms = document.getElementsByClassName('form-control')
        for (var i = 0; i < forms.length; i++) {
            let form = forms[i]
            if(form.value == '') {
                form.classList.add('is-invalid')
            }
            else {
                form.classList.remove('is-invalid')
                form.classList.add('is-valid')
            }
        }
    }

    handleOnChange(e, selection) {
        let set_state_obj = Object()
        var name = ''
        var { file_name, file_state } = this.state
        if (!selection) {
            name = e.target.name
            const { id } = this.props
            var value = ''
            if (name == 'files') {
                if (id) {
                    file_state = true
                }
                value = e.target.files[0]
                file_name = value.name
                set_state_obj['file_name'] = file_name
            }
            else {
                value = e.target.value
            }
        }
        else {
            name = e
            value = selection['id']
        }

        set_state_obj[name] = value
        set_state_obj['file_name'] = file_name
        set_state_obj[file_state] = file_state

        this.validationForm()
        this.setState({ ...set_state_obj })
    }

    getMergejilten(state_name, selection, e) {
        this.setState({mergejilten: selection.user_id})
    }

    handleSelectModel(selected_tools) {
        this.setState({ selected_tools })
    }

    render() {
        const {
            mergejilten, emp_fields, info, desc_info, aimag_name,
            zahialagch, project_name, desc, object_type, object_count,
            hurungu_oruulalt, selected_tools
        } = this.state
        var { investment_status, hide_file, disabled } = this.state
        var default_mergejilten = ''
        if (mergejilten) default_mergejilten = mergejilten
        else if (emp_fields && 0 <= emp_fields.length) { default_mergejilten = emp_fields[0]?.user_id || 'Байхгүй'}

        if (info && hurungu_oruulalt) {
            investment_status = [ investment_status[hurungu_oruulalt-1] ]
        }

        return (
            <div>
                <form className="form-row">
                    {
                        (aimag_name && !info)
                        &&
                            <>
                                <div className="col-md-12 d-flex justify-content-between">
                                    <label htmlFor="" className="col-md-6 float-left px-0">Өгөгдлийн хамрах хүрээ</label>
                                    <div className="col-md-6 d-flex justify-content-end align-items-center mb-1">
                                        <input
                                            className={'form-check-label mr-1'}
                                            type="checkbox"
                                            id="check"
                                            checked={this.state.form_checked}
                                            onChange={(e) => this.getValueCheckbox(e)}
                                        />
                                        <label htmlFor="check" className="my-auto">Улсын хэмжээнд</label>
                                    </div>
                                </div>
                                <input
                                        className={'form-control col-md-12 mb-3  ml-1'}
                                        type="text"
                                        disabled={true}
                                        value={aimag_name || ''}
                                    />
                            </>
                    }
                    <div className="form-group col-md-12">
                        <label htmlFor='zahialagch'>Захиалагч байгууллага</label>
                        <input
                            type="text"
                            name='zahialagch'
                            id="zahialagch"
                            className="form-control"
                            disabled={disabled}
                            disabled={this.props.disabled}
                            value={zahialagch || ''}
                            onChange={(e) => {this.handleOnChange(e)}}
                        />
                    </div>
                    <div className="form-group col-md-12 m-0">
                        <label htmlFor='project_name'>Төслийн нэр</label>
                        <input
                            type="text"
                            id="project_name"
                            name='project_name'
                            className="form-control"
                            disabled={disabled}
                            disabled={this.props.disabled}
                            value={project_name || ''}
                            onChange={(e) => {this.handleOnChange(e)}}
                        />
                    </div>
                    <div className="form-group col-md-6 my-4 col-sm-6">
                        <label htmlFor='object_type'>Обьектийн төрөл</label>
                        <textarea
                            type="text"
                            name="object_type"
                            id="object_type"
                            className="form-control"
                            disabled={disabled}
                            disabled={this.props.disabled}
                            value={object_type || ''}
                            onChange={(e) => {this.handleOnChange(e)}}
                        />
                    </div>
                    <div className="form-group col-md-6 col-sm-6 my-4">
                        <label htmlFor="object_count">Обьектийн тоо хэмжээ</label>
                        <textarea
                            type="text"
                            name="object_count"
                            id="object_count"
                            className="form-control"
                            disabled={disabled}
                            disabled={this.props.disabled}
                            value={object_count || ''}
                            onChange={(e) => {this.handleOnChange(e)}}
                        />
                    </div>
                    <div className="form-group col-md-12 ">
                        <SelectField
                            state_name= "hurungu_oruulalt"
                            label="Хөрөнгө оруулалтын байдал"
                            option_name="name"
                            option_key="id"
                            className="col-md-12 px-0 mx-0"
                            data_list={investment_status}
                            default_value={hurungu_oruulalt}
                            default_text={"----   хөрөнгө оруулалтын байдлыг сонгоно уу  ----"}
                            handleSelectField={this.handleOnChange}
                            disabled={disabled}
                        />
                    </div>
                    {
                        (info || disabled) &&
                            <div className="form-group col-md-12">
                                {
                                    (emp_fields) &&
                                        <SelectField
                                            display_mode={true}
                                            name_key='org_name'
                                            opt_key='employees'
                                            option_name_2='mail'
                                            option_key="user_id"
                                            data_list={emp_fields}
                                            option_name="first_name"
                                            label="Мэргэжилтэн сонгох"
                                            className="col-md-12 px-0 mx-0"
                                            state_name= "choose_proffessional"
                                            bracket_option={1}
                                            default_value={default_mergejilten}
                                            disabled={(!info && disabled) && true}
                                            handleSelectField={this.getMergejilten}
                                            default_text={"----   Илгээх мэргэжилтэнээ сонгоно уу  ----"}
                                        />
                                }
                        </div>
                    }
                    {
                        desc_info
                        &&
                            <div className="form-group col-md-12">
                                <label htmlFor='description-id'>Тайлбар</label>
                                <textarea
                                    type="text"
                                    name="description"
                                    id="description-id"
                                    className="form-control"
                                    value={desc || ''}
                                    disabled={this.state.disabled}
                                />
                            </div>
                    }
                    <UsedTools
                        values={this.props}
                        selected_tools={selected_tools}
                        handleSelectModel={this.handleSelectModel}
                    />
                    {
                        (!info && !hide_file)
                        ?
                            <div className="form-group col-md-12 ml-2">
                                <label >Орон зайн мэдээлэл</label>
                                <FileUpload
                                    {...this.props}
                                    className="mt-2"
                                    default_text="Файл оруулна уу"
                                    getFile={this.getFile}
                                    info_text='Файл оруулсан байх ёстой'
                                    accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
                                />
                            </div>
                        :
                            null
                    }
                </form>
                {
                    this.props.submitClass
                    &&
                        <this.props.submitClass
                            valid_request = {document.getElementsByClassName('is-valid')}
                            nationwide = {this.state.nationwide}
                            values={this.props}
                            {...this.state}
                            mergejilten={default_mergejilten}
                            enableLoader={this.props.enableLoader}
                            file_name={this.state.file_name}
                            handleLoaderActive={this.handleLoaderActive}
                        />
                }
            </div>
        )
    }
}
