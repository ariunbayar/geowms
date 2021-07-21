import React, { Component, Fragment } from "react"
import FileUpload from '@utils/Tools/FileUpload'

import {service} from './service'
import { disable } from "ol/rotationconstraint"

export default class ConfigSystem extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: true,
            icon_name: 'edit',
            values: {},
            files: [],
        }
        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getFile = this.getFile.bind(this)
    }

    componentDidMount() {
        console.log("get ywuulchihaldaa")
        service.config.qgis_plugin.get().then((values) => {
            this.setState({
                values,
            })
        })
    }

    componentDidUpdate(pP, pS) {
        const {files, is_editing} = this.state
        if (pS.files !== files) {
            if (files && is_editing) {
                this.handleSubmit()
            }
        }
    }

    handleEdit(e) {
        e.preventDefault()
        var { is_editing, icon_name } = this.state
        if ( !is_editing ) {
            icon_name = 'edit'}
        else icon_name = 'floppy-o'

        this.setState({
            is_editing: !is_editing,
            icon_name
        })
    }

    handleSubmit(values) {
        const { files} = this.state
        var blob = []
        const file = files[0]

        if (file) {
                const obj = file
                blob = new Blob([JSON.stringify(obj, null, 2)])
            }
        else blob = file
        const form_datas = new FormData()
        form_datas.append('files', blob, 'qgis_plugin.zip')
        service.config.qgisplugin
            .save(form_datas)
            .then(({success}) => {
                if (success) {
                    this.setState({ values })
                }
            })
    }

    getFile(files) {
        this.setState({ files })
    }

    render() {

        const { values } = this.state
        var { files, icon_name } = this.state
        return (
            <div className="card">
                <div className="card-header">
                    QGIS Plugin
                    <div className="card-action">
                        <a href="#" onClick={ this.handleEdit }>
                            <i className={'fa fa-' +icon_name}></i>
                        </a>
                    </div>
                </div>
                <div className="card-body">
                    <div className="form-group ">
                    <label>.zip өргөтгөлтэй файл оруулна уу</label>
                        <FileUpload
                            files={files}
                            className="d-flex justify-content-between"
                            default_text="Файлаа оруулна уу"
                            getFile={this.getFile}
                            accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
                            onChange={(e) => fileAction(e, 'files')}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

// modal fade show d-block