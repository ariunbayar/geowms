import React, { Component } from "react"
import StyleMap from "./Map"
import { service } from './service'
import ShowStyleData from './style_data'
import Modal from "@utils/Modal/Modal"


export class CreateStyle extends Component {
    constructor(props) {
        super(props)
        this.style_datas = []
        this.file_content = {}
        this.state = {
            style_color: '#800000',
            rule_name: '',
            style_size: 1,
            fill_color:  '#C0C0C0',
            wellknownname: 'circle',
            wellknowshape: '',
            div_angle: '',
            color_opacity: 0.3,
            dashed_line_length: 0,
            dashed_line_gap: 0,
            check_style_name: '',
            range_number: '',
            had_chosen: 0,
            style_name: '',
            style_title: '',
            style_abstract: '',
            check_style: true,
            min_range: 0,
            max_range: 0,
            geom_type: 'Point',
            shape_type: 'PointSymbolizer',
            label_check: false,
            shape_types: [
                {"name": 'Point', 'geo_name':'PointSymbolizer'},
                {"name": 'LineString', 'geo_name':'LineSymbolizer'},
                {"name": 'Polygon', 'geo_name':'PolygonSymbolizer'}
            ],
            only_clicked: false,
            prev_style_name: '',
            single_select_datas: [],
            data_state: true,
            modal_status: 'closed',
            modal_icon: 'fa fa-check-circle',
            icon_color: 'success',
            modal_text: '',
            sld_file: '',
            check_style_content: true,
            desing_file_content: [],
            old_style_name: ''
        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleOnClick = this.handleOnClick.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.ReadFileContent = this.ReadFileContent.bind(this)
        this.handleStyleDetial = this.handleStyleDetial.bind(this)
        this.handleSetStyleValues = this.handleSetStyleValues.bind(this)
        this.handleSetXml = this.handleSetXml.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.modalChange = this.modalChange.bind(this)
    }

    componentDidMount() {
        const style_name = this.props.match.params.style_name
        if(style_name) {
            this.handleStyleDetial(style_name)
        }
    }

    handleStyleDetial(style_name) {
        this.setState({is_loading: true})
        service.getStyleDetail(style_name).then(({style_content, check_style_content, simple_details}) => {
            if (! check_style_content) {
                if (style_content) {
                    this.handleSetStyleValues(style_content)
                }
            }
            else {
                this.handleSetXml(style_content, simple_details)
            }
        })
    }

    handleSetXml(style_content, simple_details) {
        if (simple_details && Object.keys(simple_details).length > 0) {
            this.setState({
                check_style_content: false,
                desing_file_content: style_content,
                style_name: simple_details.style_name,
                style_title: simple_details.style_title,
                style_abstract: simple_details.style_abstract,
                old_style_name: simple_details.old_style_name
            })
        }
        else
        {
            this.modalChange(
                'fa fa-times-circle',
                null,
                'danger',
                'Буруу форматтай файл байна',
                '',
                false,
                '',
                '',
                null,
                null,
            )

        }

    }

    handleSetStyleValues(style_content) {
        var shape_rules = style_content.shape_rules
        const { shape_types } = this.state
        var old_style_name = this.props.match.params.style_name
        var len_of_rules = Object.keys(shape_rules).length
        if (shape_rules && len_of_rules > 0) {
            shape_rules.map((data, idx) => {
                this.style_datas.push({
                    'index_of_range': idx+1,
                    'range_number': len_of_rules,
                    'min_range': data.min_range,
                    'max_range': data.max_range,
                    'style_color': data.style_color,
                    'style_size': data.style_size,
                    'fill_color':  data.fill_color,
                    'wellknownname': data.wellknownname,
                    'color_opacity': data.color_opacity,
                    'dashed_line_length': data.dashed_line_length,
                    'dashed_line_gap': data.dashed_line_gap,
                    'shape_types': shape_types,
                    'shape_type': data.shape_type,
                    'rule_name': data.rule_name,
                })
            })
            var  single_select_datas = this.style_datas[0]
            this.setState({
                style_name: style_content.style_name,
                style_title: style_content.style_title,
                style_abstract: style_content.style_abstract,
                geom_type: style_content.geom_type,
                range_number: len_of_rules,
                single_select_datas,
                old_style_name,
                check_style_content: true,
                had_chosen: 1
            })
        }
        else{
            this.setState({
                style_name: style_content.style_name,
                style_title: style_content.style_title,
                style_abstract: style_content.style_abstract,
                geom_type: style_content.geom_type,
                min_range: style_content.min_range,
                max_range: style_content.max_range,
                style_color: style_content.style_color,
                style_size: style_content.style_size,
                fill_color:  style_content.fill_color,
                wellknownname: style_content.wellknownname,
                color_opacity: style_content.color_opacity,
                dashed_line_length: style_content.dashed_line_length,
                dashed_line_gap: style_content.dashed_line_gap,
                shape_type: style_content.shape_type,
                rule_name: style_content.rule_name,
                old_style_name,
                check_style_content: true
            })
        }
    }

    ReadFileContent(e) {
        var file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = () => {
            var file_content = []
            file_content = reader.result
            this.setState({sld_file: file_content})
        }
    }

    handleOnChange(e) {
        const {
            style_size, style_color, fill_color, wellknownname,
            wellknowshape, div_angle, color_opacity, dashed_line_length, dashed_line_gap,
            min_range, max_range, had_chosen, shape_types, shape_type, rule_name
        } = this.state
        var input_name = e.target.name;
        var input_value = e.target.value;

        if (input_name == 'style_name') {
            input_value = input_value.replace(/ /g,"_");
        }

        if(input_name == 'range_number') {
            if (input_value > 0) {
                for(var i=1; i <= input_value; i++) {
                    this.style_datas.push({
                        'index_of_range': i,
                        'range_number': input_value,
                        'min_range': min_range,
                        'max_range': max_range,
                        'style_color': style_color,
                        'style_size': style_size,
                        'fill_color':  fill_color,
                        'wellknownname': wellknownname,
                        'wellknowshape': wellknowshape,
                        'div_angle': div_angle,
                        'color_opacity': color_opacity,
                        'dashed_line_length': dashed_line_length,
                        'dashed_line_gap': dashed_line_gap,
                        'shape_types': shape_types,
                        'shape_type': shape_type,
                        'rule_name': rule_name
                    })
                }
            }
            this.setState({single_select_datas: this.style_datas[0], data_state: false})
        }

        if (input_name != 'range_number' && input_name != 'had_chosen') {
            var datas_length = this.style_datas.length
            if(datas_length > 0) {
                if (had_chosen > 0) {
                    var value = obj => obj.index_of_range == had_chosen
                    var index_of = this.style_datas.findIndex(value)
                    this.style_datas[index_of][input_name] = input_value

                    if (input_name == 'shape_type') {
                        this.style_datas.map((data,idx) => {
                            data.shape_type = input_value
                        })
                    }
                    if (input_name == 'wellknownname') {
                        this.style_datas.map((data,idx) => {
                            data.wellknownname = input_value
                        })
                    }
                }
            }
            if (input_name == 'shape_type') {
                var field_of_data = obj => obj.geo_name == input_value
                var index_of = shape_types.findIndex(field_of_data)
                var geom_type = shape_types[index_of].name
                this.setState({geom_type})
            }
        }
        this.setState({[input_name]: input_value})
    }

    componentDidUpdate(pP, pS) {
        const {
            style_color, style_size,
            fill_color, style_name,
            dashed_line_gap, dashed_line_length,
            color_opacity, wellknownname,
            had_chosen, shape_type, check_style,
            min_range, max_range, range_number, check_style_content, sld_file
        } = this.state

        if(
            pS.style_color != style_color || pS.style_size != style_size
            || pS.fill_color != fill_color || pS.style_name != style_name ||
            pS.dashed_line_gap != dashed_line_gap || pS.dashed_line_length != dashed_line_length ||
            pS.color_opacity != color_opacity || pS.wellknownname != wellknownname
            || pS.shape_type !== shape_type || pS.check_style != check_style
        ){
            this.setState({
                style_size, fill_color,
                style_color, style_name, color_opacity, wellknownname,
                dashed_line_gap, dashed_line_length,
                min_range,max_range, shape_type, check_style: false,
                only_clicked: false
            })
        }

        if(pS.had_chosen !== had_chosen){
            if (had_chosen) {
                if (had_chosen > 0) {
                    var value = this.style_datas[had_chosen-1]
                }
                else {
                    var value = this.style_datas[0]
                }
                this.setState({
                    style_color: value.style_color,
                    style_size: value.style_size, fill_color: value.fill_color,
                    wellknownname: value.wellknownname, wellknowshape: value.wellknowshape,
                    div_angle: value.div_angle, color_opacity: value.color_opacity,
                    dashed_line_length: value.dashed_line_length, dashed_line_gap: value.dashed_line_gap,
                    min_range: value.min_range, max_range: value.max_range,
                    shape_type: value.shape_type, single_select_datas: value
                })
            }
        }

        if(pS.range_number !== range_number){
            if (! range_number || range_number < 1) {
                this.setState({
                    style_size: 1, fill_color:  '#C0C0C0',
                    wellknownname: '', wellknowshape: '',
                    div_angle: '', color_opacity: 0.3,
                    dashed_line_length: 0, dashed_line_gap: 0,
                    min_range: 0, max_range: 0,
                    shape_type: '', style_color: '#800000', range_number,
                    data_state: true, geom_type: 'Point', shape_type: 'PointSymbolizer',
                })
            }
            else {
                if (this.style_datas && this.style_datas.length>0){
                    this.style_datas[0].range_number = range_number
                    var value = this.style_datas[0]
                    this.setState({single_select_datas: value, data_state: false})
                }
            }
        }
        if(pS.check_style_content !== check_style_content){
            this.setState({check_style_content})
        }
        if (pS.sld_file != sld_file) {
            this.setState({sld_file, desing_file_content: [], style_name: '', style_title: '', style_abstract: '', check_style_name: ''})
            service.convertSldToJson(sld_file).then(({style_content, check_style_content, simple_details}) => {
                if (! check_style_content) {
                    if (style_content) {
                        this.handleSetStyleValues(style_content)
                    }
                }
                else {
                    this.handleSetXml(style_content, simple_details)
                }
            })

        }
    }


    handleSubmit() {
        const { style_name, style_title, style_abstract, desing_file_content, old_style_name}= this.state
        var  style_update = this.props.match.params.style_name
        var values = this.state
        if (desing_file_content && desing_file_content.length >0) {
            var values = desing_file_content
        }
        else if (this.style_datas && this.style_datas.length > 0 ) {
            var values = this.style_datas
        }
        service.createStyle(values, style_name, style_title, style_abstract, style_update, old_style_name).then(({success, info}) =>{
            if (success) {
                this.modalChange(
                    'fa fa-check-circle',
                    null,
                    'success',
                    info,
                    '',
                    false,
                    '',
                    '',
                    null,
                    () => this.props.history.push("/back/gp-geoserver/style/"),
                )
            }
            else {
                this.modalChange(
                    'fa fa-times-circle',
                    null,
                    'danger',
                    info,
                    '',
                    false,
                    '',
                    '',
                    null,
                    null,
                )
            }
        })
    }

    handleOnClick() {
        const { style_name, prev_style_name, check_style_name} = this.state
            if(! style_name){
                this.setState({check_style_name: 'Style-ийн нэр хоосон байна', check_style: true, only_clicked: false})
            }
            else{
                if (style_name != prev_style_name) {
                    var  style_update = this.props.match.params.style_name
                    this.setState({is_loading:true, prev_style_name: style_name})
                    service.checkStyleName(style_name, style_update).then(({success, info})=>
                    {
                        if(success){
                            this.setState({is_loading: false, check_style: false, only_clicked: true, check_style_name: ''})
                        }
                        else{
                            this.setState({is_loading:false, check_style_name: info, check_style: true, only_clicked: false})
                        }
                    })
                }
                else if (check_style_name) {
                    this.setState({check_style: true, only_clicked: false})
                }
                else {
                    this.setState({check_style: false, only_clicked: true})
                }
            }
        }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, modal_bg, icon_color, title, text, has_button, actionNameBack, actionNameDelete, modalAction, modalClose) {
        this.setState(
            {
                modal_icon,
                modal_bg,
                icon_color,
                title,
                text,
                has_button,
                actionNameBack,
                actionNameDelete,
                modalAction,
                modalClose,
            },
            () => this.handleModalOpen()
        )
    }

    render() {
            const {
                range_number,
                had_chosen, style_name,
                style_title, style_abstract,
                fill_color, style_color,
                style_size, color_opacity,dashed_line_gap,
                dashed_line_length, check_style,
                check_style_name, wellknownname,
                wellknowshape, div_angle, only_clicked,
                single_select_datas, geom_type,
                data_state, check_style_content, desing_file_content

            } = this.state
            var style_update = this.props.match.params.style_name
            return (
                <div className="row p-2">
                    <div className="col-md-6">
                        <div className="col-md-12">
                            <div className="col-md-12 mb-2 d-flex">
                                <label htmlFor="" className="col-md-6 my-2">Нэр</label>
                                <input
                                    name='style_name'
                                    id="style_name"
                                    type="text"
                                    className="form-control col-md-6"
                                    value={style_name}
                                    onChange={(e) => this.handleOnChange(e)}
                                    >
                                </input>
                            </div>
                            {
                                check_style_name
                                &&
                                <label className="text-danger col-md-12 text-center d-inline-block">
                                    {check_style_name}
                                </label>
                            }
                            <div className="col-md-12 mb-2 d-flex">
                                <label htmlFor="style_title" className="col-md-6 my-2">Гарчиг</label>
                                <input
                                    name='style_title'
                                    id='style_title'
                                    type="text"
                                    value={style_title}
                                    className="form-control col-md-6 mt-2"
                                    onChange={(e) => this.handleOnChange(e)}
                                >
                                </input>
                            </div>
                            <div className="col-md-12 mb-2 d-flex">
                                <label htmlFor="style_abstract" className="col-md-6 my-2">Товч тайлбар</label>
                                <textarea
                                    name='style_abstract'
                                    id='style_abstract'
                                    type="text"
                                    value={style_abstract}
                                    className="form-control col-md-6 mt-2"
                                    onChange={(e) => this.handleOnChange(e)}
                                >
                                </textarea>
                            </div>
                            {
                                ! style_update
                                &&
                                <div className="col-md-12 mb-2 d-flex">
                                    <label htmlFor="sld_file" className="col-md-6 my-2">Sld file оруулах</label>
                                    <input
                                        name='sld_file'
                                        id='sld_file'
                                        type="file"
                                        className="form-control mt-2"
                                        onChange={(e) => this.ReadFileContent(e)}
                                    />
                                </div>
                            }
                            {
                            check_style_content
                            ?
                            <div>
                                <div className="col-md-12 d-flex">
                                    <div className="col-md-6">
                                        <label htmlFor="range_number">Scale-ийн тоо</label>
                                        <input
                                            className="form-control"
                                            name="range_number"
                                            type="number"
                                            onChange={(e) => this.handleOnChange(e)}
                                            value={range_number}
                                        />
                                    </div>
                                    {
                                        (range_number && range_number >0)
                                        &&
                                        <div className="col-md-6 d-inline-block">
                                            <label htmlFor="range_number"></label>
                                            <select
                                                className="form-control mt-2"
                                                name="had_chosen"
                                                onChange={(e) => this.handleOnChange(e)}
                                                value={had_chosen}
                                            >
                                                <option className="col-md-12" value={0}></option>
                                            {
                                                (() => {
                                                    const rows = [];
                                                    for (let i = 1; i <= range_number; i++) {
                                                    rows.push(<option key={i} className="col-md-12">{i}</option>);
                                                    }
                                                    return rows;
                                                })()
                                                }
                                            </select>
                                        </div>
                                    }
                                </div>
                                <div className="col-md-12 px-0">
                                    {
                                        (range_number && range_number>0)
                                        ?
                                        <ShowStyleData
                                            value={single_select_datas}
                                            handleOnChange={this.handleOnChange}
                                            had_chosen={had_chosen}
                                            data_state = {data_state}
                                        />
                                        :
                                        <ShowStyleData
                                            value={this.state}
                                            handleOnChange={this.handleOnChange}
                                            data_state = {data_state}
                                        />
                                    }
                                    <div className="col-md-12 my-4">
                                        <button
                                            type="button"
                                            className='btn btn-warning col-md-6 mx-3'
                                            disabled={check_style}
                                            onClick={this.handleOnClick}
                                        >
                                            Style шалгах
                                        </button>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="col-md-12 d-flex">
                                <div className="col-md-12">
                                    <textarea
                                        name='desing_file_content'
                                        id='desing_file_content'
                                        type="text"
                                        value={desing_file_content}
                                        className="form-control col-md-12 mt-2 overflow-auto"
                                        style = {{height: '80vh'}}
                                        onChange={(e) => this.handleOnChange(e)}
                                    >
                                    </textarea>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                    <div className="col-md-6">
                        {
                            check_style_content
                            &&
                            <StyleMap
                                style_color={style_color}
                                style_size={style_size}
                                fill_color={fill_color}
                                geom_type={geom_type}
                                check_style={check_style}
                                wellknownname={wellknownname}
                                wellknowshape={wellknowshape}
                                div_angle={div_angle}
                                color_opacity={color_opacity}
                                dashed_line_length={dashed_line_length}
                                dashed_line_gap={dashed_line_gap}
                                only_clicked={only_clicked}
                                style_datas={this.style_datas}
                            />
                        }
                    </div>
                    <div className="col-md-6 px-4 mt-2">
                        <button
                            type="button"
                            className='btn gp-btn-outline-primary waves-effect waves-light col-md-12 mx-3'
                            disabled={check_style}
                            onClick={this.handleSubmit}
                        >
                            Хадгалах
                        </button>
                    </div>
                    <Modal
                        modal_status={ this.state.modal_status }
                        modal_icon={ this.state.modal_icon }
                        modal_bg={ this.state.modal_bg }
                        icon_color={ this.state.icon_color }
                        title={ this.state.title }
                        text={ this.state.text }
                        has_button={ this.state.has_button }
                        actionNameBack={ this.state.actionNameBack }
                        actionNameDelete={ this.state.actionNameDelete }
                        modalAction={ this.state.modalAction }
                        modalClose={ this.state.modalClose }
                    />
                </div>
            )
        }
    }
