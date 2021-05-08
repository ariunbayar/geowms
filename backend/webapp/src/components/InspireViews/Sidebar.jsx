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
            style_names: props.style_names,
            url: props.url,
            defualt_url: props.defualt_url,
            geom_type: props.geom_type,
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
        this.handleAllCheck = this.handleAllCheck.bind(this)

    }

    handleOnClick(){
        this.setState({check_style:true})
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
            id_list, style_name, geom_type,zoom_stop,
            zoom_start, number_of_cache, image_format, cache_type, tile_cache_check
        }= this.state

        const values = {
            'style_name': style_name,
            'geom_type': geom_type,
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

    handleAllCheck(e){
        let id_list = this.state.id_list
        const { fields } = this.props
        if(e.target.checked)
        {
            fields.map((f_config, idx) =>
                f_config.data_types.map((data_type, idx) =>
                    data_type.data_type_configs.map((data_type_config, idx) =>
                        id_list.push(data_type_config.property_id)
                    )
                )
            )
            this.setState({id_list})
        }
        else { this.setState({id_list:[]}) }
    }

    componentDidMount(){
        const id_list = this.props.id_list
        this.setState({id_list})
    }

    componentDidUpdate(pP, pS){
        const {style_name, view_name, tile_cache_check} = this.state

        if(pS.style_name != style_name){
            this.setState({
                check_style:false,
                style_name,
            })
        }

        if(pS.tile_cache_check != tile_cache_check) {
            this.setState({
                check_style:false,
                style_name,
                tile_cache_check
            })
        }

        if (pP.view_name != this.props.view_name){
            this.setState({
                check_style:false,
                style_name: this.props.view_style_name
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
            check_style, is_loading, cache_type,
            id_list, save_is_load, view_name, style_names,
            style_name, url, defualt_url, geom_type,
            zoom_stop, zoom_start, number_of_cache, tile_cache_check,
            image_format
        } = this.state

        return (
            <div className={`card col-md-6 mb-1 bundle-view-right-scroll`} style={{left:"10px"}}>
                <div className="card-body">
                    {fid ?
                        <div>
                            {
                                geom_type
                                &&
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
                                            </div>
                                        }
                                        </div>
                                        <div className="form-row border m-1 p-2 pl-2">
                                            <div className="form-row col-md-12 text-center">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="color" className="m-2"><h5>давхаргын style тохируулах</h5></label>
                                                </div>
                                            </div>
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
                                                        style_name={style_name}
                                                        view_name={view_name}
                                                        url={url}
                                                        defualt_url={defualt_url}
                                                        geom_type={geom_type}
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
                                             <div class="custom-control custom-switch ml-1">
                                                <input
                                                id="allcheck"
                                                type="checkbox"
                                                class="custom-control-input"
                                                onChange={this.handleAllCheck}
                                                />
                                                    <label class="custom-control-label" for="allcheck"></label>
                                            </div>
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
