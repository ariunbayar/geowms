import React, { Component } from 'react'
import { service } from '../../service'

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
        }
        this.getFile = this.getFile.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setInfo = this.setInfo.bind(this)
    }

    getFile(event) {
        const { name } = this.state
        var file_value = event.target.value
        const files = event.target.files;
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
                    const type = files[i].name.split('.')[1]
                    if(type == 'shp'){
                        this.props.notif('warning', `.shx төрлийн файл хамт байх ёстойг анхаарна уу`, 'info')
                    }
                }
                else
                {
                    file_value = null
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
                file_value = null
                this.setState({ files: [] })
            }
        }
    }

    checkName(files){
        const { name } = this.state
        var check = false
        for (var i=0; i < files.length; i ++){
            const type = files[i].name.split('.')
            if (name == 'shp'){
                if (type[1] == 'shp' || type[1] == 'shx' || type[1] == 'prj' || type[1] == 'dbf' || type[1] == 'cpg'){
                    check = true
                }
                else{
                    check = false
                    return check
                }
            }
            if (name == 'geojson'){
                if (type[1] == 'geojson' || type[1] == 'gfs'){
                    check = true
                }
                else{
                    check = false
                    return check
                }
            }
            if(name == 'gml') {
                if (type[1] == 'gml' || type[1] == 'gfs'){
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

    handleSubmit(){
        const { files } = this.state
        const { fid } = this.props
        const formData = new FormData();
        this.setState({ btn_upload_is_laod: true })
        for(var i = 0; i < files.length; i ++) {
            formData.append("data", files[i], files[i].name);
        }
        service
            .sendFile(formData, fid)
            .then(({success, info, key}) => {
            if (success){
                alert(info)
                if (key){
                    alert(key)
                }
                else{
                    alert(key)
                }
                this.props.rows()
            }
            else{
                alert(info)
            }
            this.setState({ btn_upload_is_laod: false, files: [] })
            this.props.func()
        })
    }

    cancel(){
        var file_value = document.getElementById('Upload').value
        file_value = null
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

    render() {
        const { files, text, type, file_value, name } = this.state
        this.list = []
        if (files.length > 0){
            for(var i=0; i < files.length; i++){
                this.list.push(<li key={i}>{files[i].name}</li>)
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
                            <i role="button" className="fa fa-info-circle" onMouseOver={() => this.setInfo('gml')} onMouseOut={() => this.setState({ text: '' })}>
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
                            <i role="button" className="fa fa-info-circle" onMouseOver={() => this.setInfo('shp')} onMouseOut={() => this.setState({ text: '' })}>
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
                    {this.state.btn_upload_is_laod ?
                    <div className="spinner-border gp-text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>:
                    <button
                        className="btn"
                        onClick={this.handleSubmit}
                        disabled={this.list.length == 0 ? 'disabled' : ''}
                    >Файлийг илгээх</button>
                    }
                    <button
                        className="btn"
                        onClick={() => this.cancel()}
                    >Хоослох</button>
                </div>
            </div>
        )
    }
}