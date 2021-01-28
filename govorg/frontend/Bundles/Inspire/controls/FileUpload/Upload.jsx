import React, { Component } from 'react'
import { service } from '../../service'
import filesize from 'filesize'
import {FormDetail} from './Form'

export class Upload extends Component {
    constructor(props){
        super(props)
        this.list = []
        this.send = null

        this.state = {
            btn_upload_is_laod: false,
            file_path_shp: null,
            files: [],
            name: '',
            type: '',
            not_cancel: false,
            is_upload_button: true,
            initial_values: {
                order_at:'',
                order_no:'',
            },
        }

        this.getFile = this.getFile.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setInfo = this.setInfo.bind(this)
        this.setType = this.setType.bind(this)
        this.cancel = this.cancel.bind(this)
        this.removeFromList = this.removeFromList.bind(this)
    }

    getFile(event) {
        const { name } = this.state
        const files = event.target.files;
        var file_value = document.getElementById('Upload')
        const state_files = this.state.files
        if (files.length == 1){
            const check = this.checkName(files)
            for (var i=0; i < files.length; i ++){
                if (check){
                    if (files.length == 0){
                        this.setState({ files: files[i] })
                    }
                    else {
                        this.setState({ files: state_files.concat(files[i]) })
                    }
                    const type = files[i].name.split('.')
                    const urt = type.length - 1
                    if(type[urt] == 'shp'){
                        this.props.notif('warning', `.shx төрлийн файл хамт байх ёстойг анхаарна уу`, 'info')
                    }
                }
                else
                {
                    file_value.value = ''
                    this.setState({ files: [] })
                }
            }
        }
        if (files.length > 1){
            const check = this.checkName(files)
            if (check) {
                this.setState({ files: files })
            }
            else {
                this.props.notif('danger', `өөр төрлийн файл орсон байна. Зөвхөн ${name == 'gml' ? ' .gml болон .gfs' : name == 'geojson' ? ' .geojson болон .gfs' : name == 'shp' ? ' .shp, .shx, .prj, .dbf болон .cpg' : 'буруу'} байна.`, 'info')
                file_value.value = ''
                this.setState({ files: [] })
            }
        }
    }

    checkName(files){
        const { name } = this.state
        var check = false
        for (var i=0; i < files.length; i ++){
            const type = files[i].name.split('.')
            const urt = type.length - 1
            if (name == 'shp'){
                if (type[urt] == 'shp' || type[urt] == 'shx' || type[urt] == 'prj' || type[urt] == 'dbf' || type[urt] == 'cpg'){
                    check = true
                }
                else{
                    check = false
                    return check
                }
            }
            if (name == 'geojson'){
                if (type[urt] == 'geojson' || type[urt] == 'gfs'){
                    check = true
                }
                else{
                    check = false
                    return check
                }
            }
            if(name == 'gml') {
                if (type[urt] == 'gml' || type[urt] == 'gfs'){
                    check = true
                }
                else{
                    check = false
                    return check
                }
            }
        }
        return check
    }

    handleSubmit(values, setErrors) {
        const { files, name, is_upload_button } = this.state
        if (is_upload_button){
            this.setState({ is_upload_button: false })
        }
        else{
            const { fid, tid, pid } = this.props
            const formData = new FormData();
            this.setState({ btn_upload_is_laod: true, not_cancel: true, is_upload_button: true })
            for(var i = 0; i < files.length; i ++) {
                formData.append("data", files[i], files[i].name);
            }
            formData.append("order_at", values.order_at)
            formData.append("order_no", values.order_no)
            service
                .sendFile(formData, fid, tid, name, pid)
                .then(({success, info, errors}) => {
                    if (success) {
                        alert(info)
                        this.props.refreshRequestCount()
                        this.cancel()
                        this.setState({ is_upload_button: false, files: [], not_cancel: false })
                        this.props.func()
                    }
                    else {
                        if (info) alert(info)
                        if(errors) {
                            setErrors(errors)
                            this.setState({ is_upload_button: false })
                        }
                    }
                })
                .catch((error) => {
                    this.setState({ is_upload_button: false, not_cancel: false })
                })
        }
    }

    cancel(){
        var file_value = document.getElementById('Upload')
        file_value.value = ''
        this.setState({ files: [] })
    }

    setInfo(type){
        if (type == 'gml') {
            const text = '.GML файл оруулах'
            this.setState({ text, type })
        }
        if (type == 'shp') {
            const text = '.shp файл оруулах'
            this.setState({ text, type })
        }
        if (type == 'geojson') {
            const text = '.geojson файл оруулах'
            this.setState({ text, type })
        }
    }

    setType(name){
        if (name == 'gml') {
            this.setState({ name, files: [] })
        }
        if (name == 'shp') {
            this.setState({ name, files: []})
        }
        if (name == 'geojson') {
            this.setState({ name, files: [] })
        }
    }

    removeFromList(file_name) {
        const { files } = this.state
        const isBelowThreshold = (names) => names = file_name;
        var file_value = document.getElementById('Upload')
        if (files.length == 1) {
            this.setState({ files: [] })
            file_value.value = ''
        }
        else {
            if(files.every(isBelowThreshold)){
                var array = files.filter((item) => {
                    return item.name !== file_name
                })
                this.setState({ files: array })
            }
        }
    }

    render() {
        const { files, text, type, name, not_cancel, is_upload_button, initial_values } = this.state
        this.list = []
        if (files.length > 0){
            for(var i=0; i < files.length; i++){
                const size = filesize(files[i].size)
                this.list.push(
                    <li key={i}>
                        {files[i].name} - {size}
                        <i role="button"
                            className="float-right fa fa-times text-danger mt-1"
                            aria-hidden='true'
                            onClick={
                                (e) => this.removeFromList(e.target.parentElement.innerHTML.split(' ')[0])
                            }
                        >
                        </i>
                    </li>
                )
            }
        }
        return (
            <div className={`row`} style={{height: 'auto'}}>
                <div className="col-lg-4">
                    <div>
                        <div className="custom-control custom-switch">
                            <input
                                    type='radio'
                                    id="gml"
                                    name="types"
                                    className="custom-control-input"
                                    value="gml"
                                    onChange={() => this.setType('gml')}
                                />
                            <label className="custom-control-label" htmlFor="gml">GML</label>
                            &nbsp;
                            <i role="button"
                                className="fa fa-info-circle"
                                onMouseOver={() => this.setInfo('gml')}
                                onMouseOut={() => this.setState({ text: '' })}
                            >
                                    {
                                        type == 'gml' && text !== ''
                                        ? <b className="position-absolute card card-body" style={{zIndex: '1050'}}>{text}</b>
                                        : null
                                    }
                            </i>
                        </div>
                    </div>
                    <div>
                        <div className="custom-control custom-switch">
                            <input
                                type='radio'
                                id="SHP"
                                className="custom-control-input"
                                name="types"
                                value="SHP"
                                onChange={() => this.setType("shp")}
                            />
                            <label className="custom-control-label" htmlFor="SHP">SHP</label>
                            &nbsp;
                            <i role="button"
                                className="fa fa-info-circle"
                                onMouseOver={() => this.setInfo('shp')}
                                onMouseOut={() => this.setState({ text: '' })}
                            >
                                    {
                                        type == 'shp' && text !== ''
                                        ? <b className="position-absolute card card-body" style={{zIndex: '1050'}}>{text}</b>
                                        : null
                                    }
                            </i>
                        </div>
                    </div>
                    <div>
                        <div className="custom-control custom-switch">
                            <input
                                type='radio'
                                id="geoJSON"
                                className="custom-control-input"
                                name="types"
                                value="geoJSON"
                                onChange={() => this.setType("geojson")}
                            />
                            <label className="custom-control-label" htmlFor="geoJSON">geoJSON</label>
                            &nbsp;
                            <i role="button" className="fa fa-info-circle" onMouseOver={() => this.setInfo('geojson')} onMouseOut={() => this.setState({ text: '' })}>
                                    {
                                        type == 'geojson' && text !== ''
                                        ? <b className="position-absolute card card-body" style={{zIndex: '1050'}}>{text}</b>
                                        : null
                                    }
                            </i>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    {
                        is_upload_button
                        ?
                            <div className="custom-file">
                                <input
                                    type="file"
                                    className="custom-file-input"
                                    id="Upload"
                                    onChange={(e) => this.getFile(e)}
                                    multiple
                                    disabled={name == '' ? 'disabled' : ''}
                                />
                                <label className="custom-file-label" htmlFor="Upload">Файл оруулах</label>
                                {
                                    this.list.length > 0
                                    ?
                                        <ul>
                                            {this.list}
                                        </ul>
                                    :
                                        null
                                }
                            </div>
                        :
                            <FormDetail sendSubmit={this.handleSubmit} values={initial_values} />
                    }
                    {
                        is_upload_button
                        ?
                            <div className="mt-2">
                                {
                                    this.state.btn_upload_is_laod
                                    ?
                                        <span className="mt-2 gp-text-primary"><i className="spinner-border" role="status"></i>&nbsp;&nbsp;Уншиж байна ...</span>
                                    :
                                        <button
                                            className="btn gp-btn-primary"
                                            onClick={this.handleSubmit}
                                            disabled={this.list.length == 0 ? 'disabled' : ''}
                                        >
                                            {
                                                this.list.length > 0
                                                ?
                                                    'Тушаал оруулах'
                                                :
                                                    'Файлыг илгээх'
                                            }
                                        </button>
                                }
                                <button
                                    className="btn btn-secondary float-right"
                                    onClick={() => this.cancel()}
                                    disabled={not_cancel ? 'disabled' : ''}
                                >Хоослох
                                </button>
                            </div>
                        :
                            null
                    }
                </div>
            </div>
        )
    }
}
