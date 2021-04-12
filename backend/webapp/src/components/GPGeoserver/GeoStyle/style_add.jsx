import React, { Component } from "react"
import StyleMap from "./Map"
import { service } from './service'
import ShowStyleData from './style_data'
import Modal from "@utils/Modal/Modal"
import { modes } from "codemirror"


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
            sld_file: {}
        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleOnClick = this.handleOnClick.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.ReadFileContent = this.ReadFileContent.bind(this)
    }

    ReadFileContent(e) {
        var file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = () => {
            var file_content = []
            file_content = reader.result
            service.convertSldToJson(file_content).then((style_content) => {
                if (style_content) {
                    var style_content = style_content.style_content[0]
                    var shape_rules = style_content.shape_rules
                    const { shape_types } = this.state
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
                                'rule_name': data.rule_name
                            })
                        })
                    }
                    else{

                    }
                    var  single_select_datas = this.style_datas[0]
                    this.setState({
                        style_name: style_content.style_name,
                        style_title: style_content.style_title,
                        style_abstract: style_content.style_abstract,
                        geom_type: style_content.geom_type,
                        range_number: len_of_rules,
                        single_select_datas
                    })
                }
            })
        }
    }

    handleOnChange(e) {
        const {
            style_size, style_color, fill_color, wellknownname,
            wellknowshape, div_angle, color_opacity, dashed_line_length, dashed_line_gap,
            min_range, max_range, had_chosen, shape_types, shape_type, rule_name
        } = this.state
        var input_name = e.target.name
        if(input_name == 'range_number') {
            if (e.target.value > 0) {
                for(var i=1; i <= e.target.value; i++) {
                    this.style_datas.push({
                        'index_of_range': i,
                        'range_number': e.target.value,
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
                    this.style_datas[index_of][input_name] = e.target.value

                    if (input_name == 'shape_type') {
                        this.style_datas.map((data,idx) => {
                            data.shape_type = e.target.value
                        })
                    }
                    if (input_name == 'wellknownname') {
                        this.style_datas.map((data,idx) => {
                            data.wellknownname = e.target.value
                        })
                    }
                }
            }
            if (input_name == 'shape_type') {
                var field_of_data = obj => obj.geo_name == e.target.value
                var index_of = shape_types.findIndex(field_of_data)
                var geom_type = shape_types[index_of].name
                this.setState({geom_type})
            }
        }
        this.setState({[e.target.name]:e.target.value})
    }

    componentDidUpdate(pP, pS) {
        const {
            style_color, style_size,
            fill_color, style_name,
            dashed_line_gap, dashed_line_length,
            color_opacity, wellknownname,
            had_chosen, shape_type, check_style,
            min_range, max_range, range_number
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
    }

    handleSubmit() {
        const { style_name, style_title, style_abstract, modal_status, icon_color, modal_text, modal_icon}= this.state

        if (this.style_datas && this.style_datas.length >0 ) {
            var values = this.style_datas
        }
        else {
            var values = this.state
        }

        service.createStyle(values, style_name, style_title, style_abstract).then(({success, info}) =>{
            if (success) {
                this.setState({modal_status: 'open', modal_text: info})
            }
            else {
                this.setState({modal_status: 'open', modal_text: info, modal_icon: 'fa fa-times-circle', icon_color: 'danger'})
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
                    this.setState({is_loading:true, prev_style_name: style_name})
                    service.checkStyleName(style_name).then(({success})=>
                    {
                        if(success){
                            this.setState({is_loading: false, check_style: false, only_clicked: true, check_style_name: ''})
                        }
                        else{
                            this.setState({is_loading:false, check_style_name: 'Style-ийн нэр давхцаж байна', check_style: true, only_clicked: false})
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
                data_state, modal_status, modal_icon, icon_color,
                modal_text, sld_file

            } = this.state
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
                    </div>
                    <div className="col-md-6">
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
                    </div>
                    <div className="col-md-6 px-4">
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
                        modal_status={modal_status}
                        modal_icon={modal_icon}
                        icon_color={icon_color}
                        title='STYLE ХАДГАЛАХ'
                        text={modal_text}
                        modalAction={this.modalAction}
                    />
                </div>
            )
        }
    }
