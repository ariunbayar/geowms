import React, { Component } from "react"
import StyleMap from "./Map"
import { service } from './service'
import ShowStyleData from './style_data'


export class CreateStyle extends Component {
    constructor(props) {
        super(props)
        this.style_datas = []
        this.state = {
            style_color: '#800000',
            rule_name: '',
            style_size: 1,
            fill_color:  '#C0C0C0',
            wellknownname: '',
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
        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleOnClick = this.handleOnClick.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
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
            this.setState({single_select_datas: this.style_datas[0]})
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
            if (! range_number ) {
                this.setState({
                    style_size: 1, fill_color:  '#C0C0C0',
                    wellknownname: '', wellknowshape: '',
                    div_angle: '', color_opacity: 0.3,
                    dashed_line_length: 0, dashed_line_gap: 0,
                    min_range: 0, max_range: 0,
                    shape_type: '', style_color: '#800000', range_number,
                })
            }
            else {
                if (this.style_datas && this.style_datas.length>0){
                    this.style_datas[0].range_number = range_number
                    var value = this.style_datas[0]
                    this.setState({single_select_datas: value})
                }
            }
        }
    }

    handleSubmit() {
        const { style_name, style_title, style_abstract } = this.state

        if (this.style_datas && this.style_datas.length >0 ) {
            var values = this.style_datas
        }
        else {
            var values = this.state
        }

        service.createStyle(values, style_name, style_title, style_abstract).then(({success, info}) =>{
            console.log("info", success, info)
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
                shape_type, shape_types,
                fill_color, style_color,
                style_size, color_opacity,
                min_range, max_range, dashed_line_gap,
                dashed_line_length, check_style,
                check_style_name, wellknownname,
                wellknowshape, div_angle, only_clicked,
                label_check, single_select_datas, geom_type

            } = this.state
            return (
                <div className="row p-2">
                    <div className="col-md-6">
                        <div className="col-md-12">
                            <div className="col-md-12 mb-2 d-flex">
                                <label htmlFor="" className="col-md-6 my-2">Style-ийн нэр</label>
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
                                <label htmlFor="style_title" className="col-md-6 my-2">Style-ийн гарчиг</label>
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
                                    />
                                    :
                                    <ShowStyleData
                                        value={this.state}
                                        handleOnChange={this.handleOnChange}
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
                    <div className="col-md-6">
                        <button
                            type="button"
                            className='btn gp-btn-outline-primary waves-effect waves-light col-md-12 mx-3'
                            disabled={check_style}
                            onClick={this.handleSubmit}
                        >
                            Хадгалах
                        </button>
                    </div>
                </div>
            )
        }
    }
