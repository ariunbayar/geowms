import React, { Component, Fragment } from 'react'
import { service } from './service'
import ModalAlert from '../ModalAlert'
import './styles.css'
import StyleMap from './Map'
import Loader from "@utils/Loader"


export default class SideBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            id_list: [],
            save_is_load: false,
            modal_alert_check: 'closed',
            title: '',
            model_type_icon: 'success',
            view_name: '',
            style_state: 'create_style',
            style_color: '#800000',
            style_size: 1,
            fill_color:  '#C0C0C0',
            style_name: props.view_style_name,
            check_style: false,
            style_names: props.style_names,
            url: props.url,
            defualt_url: props.defualt_url,
            geom_type: props.geom_type,
            wellknownname: '',
            wellknowshape: '',
            div_angle: '',
            color_opacity: 0.3,
            dashed_line_length: 0,
            dashed_line_gap: 0,
            style_title: '',
            style_abstract: '',
            check_style_name: '',
            is_loading: props.property_loading,
            zoom_stop: 0,
            zoom_start: 0,
            cache_type: 'seed',
            number_of_cache: 2,
            image_format: 'png',
            tile_cache_check: false
        }

        this.handleInput = this.handleInput.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleOnClick = this.handleOnClick.bind(this)

    }

    handleOnClick(){
        const {style_state, style_name} = this.state
        if (style_state == 'create_style'){
            if(! style_name){
                this.setState({check_style_name: 'Style-ийн нэр хоосон байна'})
            }
            else{
                this.setState({is_loading:true})
                service.checkStyleName(style_name).then(({success})=>
                {
                    if(success){
                        this.setState({is_loading: false, check_style:true})
                    }
                    else{
                        this.setState({is_loading:false, check_style_name: 'Style-ийн нэр давхцаж байна'})
                    }
                })
            }
        }
        else{
            this.setState({check_style:true})
        }
    }

    handleOnChange(e){
        this.setState({[e.target.name]:e.target.value})
    }
    handleInput(e){
        let id_list = this.state.id_list
        const value = parseInt(e.target.value)
        if (e.target.checked) {
            id_list.push(value)
        } else {
            id_list = id_list.filter((oid) => oid != value)
        }
        this.setState({id_list})
    }

    handleSave(){
        const fid = this.props.fid
        const tid = this.props.tid
        const {
            id_list, style_state, style_color, style_size,
            fill_color, style_name, geom_type, wellknownname,
            wellknowshape, div_angle, color_opacity, dashed_line_length,
            dashed_line_gap,  style_title, style_abstract,zoom_stop,
            zoom_start, number_of_cache, image_format, cache_type, tile_cache_check
        }= this.state

        const values = {
            'style_state': style_state, 'style_color': style_color,
            'style_size': style_size, 'fill_color': fill_color, 'style_name': style_name,
            'geom_type': geom_type, 'wellknownname': wellknownname, 'wellknowshape': wellknowshape,
            'div_angle': div_angle, 'color_opacity': color_opacity, 'dashed_line_length': dashed_line_length,
            'dashed_line_gap': dashed_line_gap, 'style_title': style_title, 'style_abstract': style_abstract,
            'tile_cache_check': tile_cache_check,
            'cache_values': {
                'zoom_stop': zoom_stop, 'zoom_start':zoom_start, 'number_of_cache': number_of_cache, 'cache_type': cache_type,
                'image_format': image_format
            }
        }

        this.setState({save_is_load: true})

        service.setPropertyFields(fid, id_list, tid, values).then(({success, info}) => {
            if(success){
                this.setState({save_is_load: false, modal_alert_check: 'open', title: info, model_type_icon: 'success'})
                this.props.getAll()
                this.modalCloseTime()
            }
            else{
                this.setState({save_is_load: false, modal_alert_check: 'open', title: info, model_type_icon: 'danger'})
                this.modalCloseTime()
            }
        })
    }

    componentDidMount(){
        const id_list = this.props.id_list
        this.setState({id_list})
    }

    componentDidUpdate(pP, pS){
        const {style_color, style_size, fill_color, style_name, style_state, view_name, dashed_line_gap, dashed_line_length, color_opacity, wellknownname, tile_cache_check} = this.state
        if((pS.style_color != style_color) || pS.style_size != style_size
            || pS.fill_color != fill_color || pS.style_name != style_name ||
            pS.dashed_line_gap != dashed_line_gap || pS.dashed_line_length != dashed_line_length ||
            pS.color_opacity != color_opacity || pS.wellknownname != wellknownname || pS.tile_cache_check != tile_cache_check
        ){
            this.setState({
                check_style:false, style_size, fill_color,
                style_color, style_name, color_opacity, wellknownname,
                dashed_line_gap, dashed_line_length, check_style_name: '',
                tile_cache_check
            })
        }
        if (pS.style_state != style_state || pP.view_name != this.props.view_name){
            this.setState({
                check_style:false, style_size: 1,
                fill_color: '#C0C0C0', style_color: '#800000',
                color_opacity: 0.3, style_title: '',
                wellknownname: '', dashed_line_gap: 0, style_abstract: '',
                style_name: this.props.view_style_name, check_style_name: ''
            })
        }

        if(pP.fields !== this.props.fields){
            const fields = this.props.fields
            this.setState({fields})
        }

        if(pP.id_list !== this.props.id_list){
            const id_list = this.props.id_list
            this.setState({id_list})
        }

        if(pP.view_name !== this.props.view_name){
            const view_name = this.props.view_name
            this.setState({view_name})
        }

        if(pP.style_names!== this.props.style_names){
            this.setState({style_names:this.props.style_names})
        }

        if(pP.url !== this.props.url){
            this.setState({url:this.props.url})
        }

        if(pP.view_style_name !== this.props.view_style_name){
            this.setState({style_name:this.props.view_style_name})
        }

        if(pP.geom_type !== this.props.geom_type){
            this.setState({geom_type:this.props.geom_type})
        }

        if(pP.defualt_url !== this.props.defualt_url){
            this.setState({defualt_url:this.props.defualt_url})
        }

        if(pP.property_loading !== this.props.property_loading){
            this.setState({is_loading:this.props.property_loading})
        }

        if(pP.fid !== this.props.fid){
            this.setState({ tile_cache_check: false})
        }

        if(pP.cache_values !== this.props.cache_values){
            if (this.props.cache_values){
                if (this.props.cache_values.length>0) {
                    const cache_values = this.props.cache_values[0]
                    this.setState({
                        zoom_stop: cache_values.zoom_stop,
                        zoom_start: cache_values.zoom_start,
                        cache_type: cache_values.cache_type,
                        number_of_cache: cache_values.number_of_cache,
                        image_format: cache_values.image_format,
                    })
                }
                else{
                    this.setState({
                        zoom_stop: 0,
                        zoom_start: 0,
                        cache_type: 'seed',
                        number_of_cache: 0,
                        image_format: 'png',
                    })
                }
            }
        }
    }

    handleModalAlert(){
        this.setState({modal_alert_check: 'closed'})
        clearTimeout(this.state.timer)
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_check: 'closed'})
        }, 2000)
    }

    render() {
        const {fields, fid, fname} = this.props
        const {
            style_color, style_size, style_state,
            check_style, fill_color,
            id_list, save_is_load, view_name, style_names,
            style_name, url, defualt_url, geom_type,
            wellknownname, wellknowshape, div_angle,
            color_opacity, dashed_line_length, dashed_line_gap,
            style_title, style_abstract, is_loading,
            zoom_stop, zoom_start, number_of_cache, tile_cache_check,
            image_format, cache_type
        } = this.state

        return (
            <div className={`card col-md-6 mb-1 bundle-view-right-scroll`} style={{left:"10px"}}>
                <div className="card-body">
                    {fid ?
                        <div>
                            {geom_type &&
                            <fieldset>
                                <div className="form-row border m-1 p-1">
                                    <div className="form-row col-md-12  text-center">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="" className="m-2"><h5>tilecache тохируулах</h5></label>
                                            <input type="checkbox" checked={tile_cache_check} onChange={(e) => this.setState({ tile_cache_check: !tile_cache_check})}/>
                                        </div>
                                    </div>
                                    {
                                        tile_cache_check
                                        &&
                                        <div className="form-row col-md-12">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="" className="m-2">Зургийн формат</label>
                                                <select
                                                    className="form-control form-control-sm"
                                                    value={image_format}
                                                    onChange={(e) => this.setState({ image_format: e.target.value })}
                                                >
                                                    <option value="jpeg">jpeg</option>
                                                    <option value="png">png</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                    <label htmlFor="" className="m-2">Томруулах эхний утга</label>
                                                    <input
                                                        type="number"
                                                        name='zoom_start'
                                                        className={'form-control col-4' + (zoom_start > 21 ? ' is-invalid' : '')}
                                                        value= {zoom_start}
                                                        onChange={(e) => this.handleOnChange(e)}
                                                    />
                                                    {
                                                        zoom_start > 21
                                                        &&
                                                        <label className="text-danger">
                                                            Томруулах эхний утга нь хамгийн ихдээ 21 байна
                                                        </label>
                                                    }
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="" className="m-2">Томруулах сүүлчийн утга</label>
                                                <input
                                                    type="number"
                                                    name='zoom_stop'
                                                    className={'form-control col-4' + (zoom_stop > 21 ? ' is-invalid' : '')}
                                                    value= {zoom_stop}
                                                    onChange={(e) => this.handleOnChange(e)}
                                                />
                                                {
                                                    zoom_stop > 21
                                                    &&
                                                    <label className="text-danger">
                                                        Томруулах сүүлчийн утга нь хамгийн ихдээ 21 байна
                                                    </label>
                                                }
                                            </div>
                                            <div className="form-group col-md-4">
                                            <label htmlFor="color" className="m-2">Үйлдлийн төрөл</label>
                                            <select
                                                className="form-control form-control-sm"
                                                value={cache_type}
                                                onChange={(e) => this.setState({ cache_type: e.target.value })}
                                            >
                                                <option value="seed">seed</option>
                                                <option value="reseed">reseed</option>
                                                <option value="truncate">Truncate</option>
                                            </select>
                                            </div>
                                            <div className="form-group col-md-4 mr-2">
                                                <label htmlFor="number_of_cache" className="m-2">Хэрэглэх таскуудын тоо</label>
                                                <input
                                                    type="number"
                                                    name='number_of_cache'
                                                    className={'form-control col-4' + (zoom_stop > 100 ? ' is-invalid' : '')}
                                                    value= {number_of_cache}
                                                    onChange={(e) => this.handleOnChange(e)}
                                                />
                                                 {
                                                    number_of_cache > 100
                                                    &&
                                                    <label className="text-danger">
                                                    Хэрэглэх таскын тоо хамгийн ихдээ 100 байна
                                                    </label>
                                                }
                                            </div>
                                        </div>}
                                </div>
                                <div className="form-row border m-1 p-2 pl-2">
                                    <div className="form-row col-md-12 text-center">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="color" className="m-2"><h5>давхаргын style тохируулах</h5></label>
                                            </div>
                                        </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="state">Style-ийн төлөв</label>
                                            <select
                                                className="form-control form-control-sm"
                                                onChange={(e) => this.setState({ style_state: e.target.value })}
                                                value={style_state}
                                            >
                                                <option value="create_style">Style үүсгэх</option>
                                                <option value="update_style">Үүссэн style-с сонгох</option>
                                            </select>
                                        </div>
                                    </div>
                                    {style_state == 'create_style' ?
                                        <div className="form-row col-md-12">
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="color" className="m-2">Style-ийн нэр</label>
                                                    <input
                                                        type="text"
                                                        name='style_name'
                                                        className="form-control"
                                                        value= {style_name}
                                                        onChange={(e) => this.handleOnChange(e)}
                                                    />
                                                    {
                                                        this.state.check_style_name
                                                        &&
                                                        <label className="text-danger">
                                                            {this.state.check_style_name}
                                                        </label>
                                                    }
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="color" className="m-2">Style-ийн гарчиг</label>
                                                    <input
                                                        type="text"
                                                        name='style_title'
                                                        className="form-control"
                                                        value= {style_title}
                                                        onChange={(e) => this.handleOnChange(e)}
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="color" className="m-2">Товч тайлбар</label>
                                                    <input
                                                        type="text"
                                                        name='style_abstract'
                                                        className="form-control"
                                                        value= {style_abstract}
                                                        onChange={(e) => this.handleOnChange(e)}
                                                    />
                                                </div>
                                            {
                                                geom_type == 'Point' || geom_type == 'Polygon' || geom_type == 'MultiPoint'?
                                                    <div className="form-row col-md-12">
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="color" className="m-2">Дүрсийн дүүргэлтийн өнгө</label>
                                                            <input
                                                                type="color"
                                                                name='fill_color'
                                                                className="form-control col-4"
                                                                value= {fill_color}
                                                                onChange={(e) => this.handleOnChange(e)}
                                                            />
                                                        </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="color" className="m-2">Хүрээний өнгө</label>
                                                        <input
                                                            type="color"
                                                            name='style_color'
                                                            className="form-control col-4"
                                                            value= {style_color}
                                                            onChange={(e) => this.handleOnChange(e)}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
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
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="color" className="m-2">Өнгөний уусгалт</label>
                                                        <input
                                                            type="number"
                                                            name='color_opacity'
                                                            className="form-control col-4"
                                                            value= {color_opacity}
                                                            onChange={(e) => this.handleOnChange(e)}
                                                        />
                                                    </div>
                                                    {geom_type == 'Point' || geom_type =='MultiPoint'?
                                                    <div className='form-group col-md-4'>
                                                        <label htmlFor="state">Дүрсний сонголт</label>
                                                            <select className="form-control form-control-sm"
                                                                onChange={(e) => this.setState({ wellknownname: e.target.value })}>
                                                                <option value="">-----------</option>
                                                                <option value="square">Дөрвөлжин</option>
                                                                <option value="triangle">Гурвалжин</option>
                                                                <option value="star"> Од</option>
                                                                <option value="x"> Хэрээс</option>
                                                            </select>
                                                    </div>
                                                    :
                                                ''
                                                    }
                                                </div>
                                                :
                                                <div className="form-row col-md-12">
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="color" className="m-2">Өргөн</label>
                                                        <input
                                                            type="number"
                                                            name='style_size'
                                                            className="form-control col-4"
                                                            value= {style_size}
                                                            onChange={(e) => this.handleOnChange(e)}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="color" className="m-2">Өнгө</label>
                                                        <input
                                                            type="color"
                                                            name='style_color'
                                                            className="form-control col-4"
                                                            value= {style_color}
                                                            onChange={(e) => this.handleOnChange(e)}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="color" className="m-2">Зураас хоорондох зай</label>
                                                        <input
                                                            type="number"
                                                            name='dashed_line_gap'
                                                            className="form-control col-4"
                                                            value= {dashed_line_gap}
                                                            onChange={(e) => this.handleOnChange(e)}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="color" className="m-2">Зураасын урт</label>
                                                            <input
                                                                type="number"
                                                                name='dashed_line_length'
                                                                className="form-control col-4"
                                                                value= {dashed_line_length}
                                                                onChange={(e) => this.handleOnChange(e)}
                                                            />
                                                    </div>
                                                    <div className="form-group col-md-4">
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
                                        :

                                        <div className="form-group col-md-6">
                                            <label htmlFor="id_geoserver_user">Style-ийн нэр</label>
                                            <select
                                                className="form-control form-control-sm"
                                                value={style_name ? style_name : ''}
                                                onChange={(e) => this.setState({ style_name: e.target.value })}
                                            >
                                                <option value={style_name}>{style_name ? style_name : ''}</option>
                                                {
                                                    style_names.map((name, idx) =>
                                                        <option value={name} key={idx}>{name}</option>
                                                )}
                                            </select>
                                        </div>
                                    }
                                    <div className="form-group col-md-12">
                                        <button
                                            type="button"
                                            className='btn btn-primary'
                                            onClick={this.handleOnClick}
                                        >
                                            Style-ийг шалгах
                                        </button>
                                    </div>
                                    {
                                        check_style &&
                                        <div className="form-row col-md-12">
                                            <div className="form-group col-md-12">
                                                <StyleMap
                                                    style_state={style_state}
                                                    style_color={style_color}
                                                    style_size={style_size}
                                                    fill_color={fill_color}
                                                    style_name={style_name}
                                                    view_name={view_name}
                                                    url={url}
                                                    defualt_url={defualt_url}
                                                    geom_type={geom_type}
                                                    wellknownname={wellknownname}
                                                    wellknowshape={wellknowshape}
                                                    div_angle={div_angle}
                                                    color_opacity={color_opacity}
                                                    dashed_line_length={dashed_line_length}
                                                    dashed_line_gap={dashed_line_gap}
                                                />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </fieldset>
                            }
                            <table className="table table-bordered m-1">
                                <thead>
                                    <tr>
                                        <th colSpan={4} className="text-center">
                                            <h4 className="text-center">{fname}</h4>
                                            {view_name && <h4 className="text-center"><small>View name: {view_name}</small></h4>}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className="text-center" style={{width: "15%"}}>
                                            Data <br/>type
                                        </th>
                                        <th className="text-center" style={{width: "15%"}}>
                                            View
                                        </th>
                                        <th className="text-center" style={{width: "70%"}}>
                                            Property
                                        </th>
                                    </tr>
                                    {fields.map((f_config, idx) =>
                                        <>
                                            {f_config.data_types.map((data_type, idx) =>
                                                <>
                                                    <tr key={idx}>
                                                        <th rowSpan={data_type.data_type_configs.length +1}
                                                            className="text-wrap align-middle text-justify m-2"
                                                        >
                                                            <span className="text-center align-middle">({data_type.data_type_name_eng})</span><br/>
                                                            <span className="text-center align-middle">{data_type.data_type_name}</span><br/>
                                                            <span className="text-justify text-muted align-middle"><small>{data_type.data_type_definition}</small></span>
                                                        </th>
                                                    </tr>
                                                    {data_type.data_type_configs.map((data_type_config, idx) =>
                                                        <>
                                                            <tr key={idx}>
                                                                <th>
                                                                    <div className="icheck-primary">
                                                                        <input
                                                                            id={data_type_config.property_name}
                                                                            type="checkbox"
                                                                            checked={id_list.indexOf(data_type_config.property_id) > -1}
                                                                            onChange={this.handleInput}
                                                                            value={data_type_config.property_id}
                                                                        />
                                                                        <label htmlFor={data_type_config.property_name}></label>
                                                                    </div>
                                                                </th>
                                                                <th>
                                                                    <label
                                                                        htmlFor={data_type_config.property_name}
                                                                        data-toggle="tooltip" data-placement="right" title={data_type_config.property_definition}
                                                                    >
                                                                    {data_type_config.property_name}<br/>
                                                                    (
                                                                    {data_type_config.value_types.map((value_type, idx) =>
                                                                        <span key={idx}>{value_type.value_type_name}</span>
                                                                    )}
                                                                    )
                                                                    </label>
                                                                </th>
                                                            </tr>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </thead>
                            </table>
                            {save_is_load ?
                                <a className="btn btn-block gp-btn-primary text-white">Уншиж байна</a>:
                                <a onClick={this.handleSave} className="btn btn-block gp-btn-primary text-white">View үүсгэх</a>
                            }
                        </div>
                        :
                        <div>
                            <h4 className="text-center">Property Хоосон байна</h4>
                        </div>
                    }
                    <ModalAlert
                        title={this.state.title}
                        model_type_icon ={this.state.model_type_icon}
                        status={this.state.modal_alert_check}
                        modalAction={() => this.handleModalAlert()}
                    />
                    <Loader is_loading={is_loading}/>
                </div>
            </div>
        )
    }
}
