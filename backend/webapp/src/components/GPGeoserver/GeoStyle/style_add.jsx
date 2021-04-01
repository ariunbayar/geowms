import React, { Component } from "react"
import StyleMap from "./Map"
import { service } from './service'


export class CreateStyle extends Component {
    constructor(props) {
        super(props)
        this.style_datas = []
        this.state = {
            style_color: '#800000',
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
            had_chosen: '',
            style_name: '',
            style_title: '',
            style_abstract: '',
            check_style: true,
            min_range: 0,
            max_range: 0,
            shape_type: '',
            shape_types: [
                {"name": 'Point', 'geo_name':'PointSymbolizer'},
                {"name": 'LineString', 'geo_name':'LineSymbolizer'},
                {"name": 'Polygon', 'geo_name':'PolygonSymbolizer'}
            ],
            only_clicked: false,
            prev_style_name: '',
        }
        this.handleValues = this.handleValues.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleOnClick = this.handleOnClick.bind(this)
    }

    handleValues(e) {
        const {
            style_size, style_color, fill_color, wellknownname,
            wellknowshape, div_angle, color_opacity, dashed_line_length, dashed_line_gap
        } = this.state
        this.style_datas.push({
            'range_number': e.target.value,
            'style_color': style_color,
            'style_size': style_size,
            'fill_color':  fill_color,
            'wellknownname': wellknownname,
            'wellknowshape': wellknowshape,
            'div_angle': div_angle,
            'color_opacity': color_opacity,
            'dashed_line_length': dashed_line_length,
            'dashed_line_gap': dashed_line_gap
        })
        this.setState({had_chosen: e.target.value})
    }

    handleOnChange(e) {
        this.setState({[e.target.name]:e.target.value})
    }

    componentDidUpdate(pP, pS) {
        const {
            style_color, style_size,
            fill_color, style_name,
            dashed_line_gap, dashed_line_length,
            color_opacity, wellknownname,
            had_chosen, shape_type, check_style,
            min_range, max_range,
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
            this.setState({
                check_style:false, style_color: '#800000',
                style_size: 1, fill_color:  '#C0C0C0',
                wellknownname: '', wellknowshape: '',
                div_angle: '', color_opacity: 0.3,
                dashed_line_length: 0, dashed_line_gap: 0,
                min_range: 0, max_range: 0,
                shape_type: '', only_clicked: false
            })
        }
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
                style_datas,

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
                                    <label htmlFor="range_number">Range-ийн тоо</label>
                                    <input
                                        className="form-control"
                                        name="range_number"
                                        type="number"
                                        onChange={(e) => this.handleOnChange(e)}
                                        value={range_number}
                                    />
                                </div>
                                <div className="col-md-6 mb-2 px-0 mx-0">
                                    <label htmlFor="had_chosen">Утга авах range</label>
                                    <select
                                        className="form-control"
                                        onChange={(e) => this.handleValues(e)}
                                        value={had_chosen}
                                    >
                                        <option className="col-md-12">-------------------------------</option>
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
                            </div>
                                <div className="col-md-12 px-0">
                                    {
                                        had_chosen
                                        &&
                                        <div className="col-md-12 px-0">
                                            <div className="row col-md-12 text-center">
                                                <div className="text-center col-md-12">Range <a style={{color: '#0b5394'}}>{had_chosen}</a>-ийн утгууд</div>
                                            </div>
                                            <div className="col-md-12 d-flex my-2">
                                                <div className="col-md-6">
                                                    <label htmlFor="">Min range</label>
                                                    <input
                                                        name='min_range'
                                                        id='id_min_range'
                                                        className="form-control col-12"
                                                        type="number"
                                                        value={min_range}
                                                        onChange={(e) => this.handleOnChange(e)}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-2 mx-0 px-0">
                                                    <label htmlFor="">Max range</label>
                                                    <input
                                                        className="form-control col-12"
                                                        name="max_range"
                                                        id="max_range"
                                                        type="number"
                                                        value={max_range}
                                                        onChange={(e) => this.handleOnChange(e)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className="col-md-6 mx-3 my-2">
                                        <label htmlFor="">Style-ийн төрөл</label>
                                        <select
                                            className="form-control"
                                            name="shape_type"
                                            value={shape_type}
                                            onChange={(e) => this.handleOnChange(e)}
                                        >
                                            <option value="">--------------------------</option>
                                            {shape_types.map((value, idy) =>
                                                <option value={value.geo_name}>{value.name}</option>
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                    {
                                        shape_type == 'PointSymbolizer' || shape_type == 'PolygonSymbolizer' ?
                                        <div className="col-md-12">
                                            <div className="col-md-4 d-inline-block">
                                                <label htmlFor="color" className="m-2">Дүрсийн дүүргэлтийн өнгө</label>
                                                <input
                                                    type="color"
                                                    name='fill_color'
                                                    className="form-control col-4"
                                                    value= {fill_color}
                                                    onChange={(e) => this.handleOnChange(e)}
                                                />
                                            </div>
                                            <div className="col-md-4 d-inline-block">
                                                <label htmlFor="color" className="m-2">Хүрээний өнгө</label>
                                                <input
                                                    type="color"
                                                    name='style_color'
                                                    className="form-control col-4"
                                                    value= {style_color}
                                                    onChange={(e) => this.handleOnChange(e)}
                                                />
                                            </div>
                                            <div className="col-md-4 d-inline-block">
                                                <label htmlFor="id_geoserver_user">Хүрээний өргөн</label>
                                                <input
                                                    name="style_size"
                                                    type="number"
                                                    className="form-control col-4"
                                                    id="style_size"
                                                    value = {style_size}
                                                    onChange={(e) => this.handleOnChange(e)}
                                                />
                                            </div>
                                            <div className="col-md-4 d-inline-block">
                                                <label htmlFor="color" className="m-2">Өнгөний уусгалт</label>
                                                <input
                                                    type="number"
                                                    name='color_opacity'
                                                    className="form-control col-4"
                                                    value= {color_opacity}
                                                    onChange={(e) => this.handleOnChange(e)}
                                                />
                                            </div>
                                        {
                                            shape_type == 'PointSymbolizer' &&
                                            <div className='col-md-4 d-inline-block'>
                                                <label htmlFor="wellknownname">Дүрсний сонголт</label>
                                                <select
                                                    className="form-control form-control-sm"
                                                    name="wellknownname"
                                                    onChange={(e) => this.handleOnChange(e)}
                                                >
                                                    <option value="">-----------</option>
                                                    <option value="square">Дөрвөлжин</option>
                                                    <option value="triangle">Гурвалжин</option>
                                                    <option value="star"> Од</option>
                                                    <option value="x"> Хэрээс</option>
                                                </select>
                                            </div>
                                        }
                                        </div>
                                        :
                                        <div className="col-md-12">
                                            <div className="col-md-4 d-inline-block">
                                                <label htmlFor="color" className="m-2">Өргөн</label>
                                                <input
                                                    type="number"
                                                    name='style_size'
                                                    className="form-control col-4"
                                                    value= {style_size}
                                                    onChange={(e) => this.handleOnChange(e)}
                                                />
                                            </div>
                                            <div className="col-md-4 d-inline-block">
                                                <label htmlFor="color" className="m-2">Өнгө</label>
                                                <input
                                                    type="color"
                                                    name='style_color'
                                                    className="form-control col-4"
                                                    value= {style_color}
                                                    onChange={(e) => this.handleOnChange(e)}
                                                />
                                            </div>
                                            <div className="col-md-4 d-inline-block">
                                                <label htmlFor="color" className="m-0 p-0">Зураас хоорондох зай</label>
                                                <input
                                                    type="number"
                                                    name='dashed_line_gap'
                                                    className="form-control col-4"
                                                    value= {dashed_line_gap}
                                                    onChange={(e) => this.handleOnChange(e)}
                                                />
                                            </div>
                                            <div className="col-md-4 d-inline-block">
                                                <label htmlFor="color" className="m-2">Зураасын урт</label>
                                                    <input
                                                        type="number"
                                                        name='dashed_line_length'
                                                        className="form-control col-4"
                                                        value= {dashed_line_length}
                                                        onChange={(e) => this.handleOnChange(e)}
                                                    />
                                            </div>
                                            <div className="col-md-4 d-inline-block">
                                                <label htmlFor="color" className="m-2">Өнгөний уусгалт</label>
                                                <input
                                                    type="number"
                                                    name='color_opacity'
                                                    className="form-control col-4"
                                                    value= {color_opacity}
                                                    onChange={(e) => this.handleOnChange(e)}
                                                />
                                            </div>
                                        </div>
                                        }
                                    </div>
                                    <div className="col-md-12 my-4">
                                        <button
                                            type="button"
                                            className='btn btn-primary col-md-6 mx-3'
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
                            geom_type={shape_type}
                            check_style={check_style}
                            wellknownname={wellknownname}
                            wellknowshape={wellknowshape}
                            div_angle={div_angle}
                            color_opacity={color_opacity}
                            dashed_line_length={dashed_line_length}
                            dashed_line_gap={dashed_line_gap}
                            only_clicked={only_clicked}
                            style_datas={style_datas}
                        />
                    </div>
                </div>
            )
        }
    }
