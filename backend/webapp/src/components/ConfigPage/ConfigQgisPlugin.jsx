import React, { Component, Fragment } from "react"
import FileUpload from '@utils/Tools/FileUpload'
import {service} from './service'

export default class ConfigSystem extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: true,
            icon_name: 'edit',
            values: {},
            file_uploaded: false,
            file_name: '',
            files: [],
        }
        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getFile = this.getFile.bind(this)
    }

    componentDidMount() {
        service.config.qgis_plugin.get().then(({files}) => {
            this.setState({
                files
            })
        })
    }

    componentDidUpdate(pP, pS) {
        const {file_uploaded, is_editing, icon_name} = this.state
        if (pS.file_uploaded !== file_uploaded) {
            if (!is_editing) this.handleSubmit()
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
        const file = files[0]
        var form_datas = new FormData()
        if (file.size>0) {
        form_datas.append('files', file, file.name)
        service.config.qgis_plugin
            .save(form_datas)
            .then(({success}) => {
                if (success) {
                    this.setState({ values })
                }
            })
        }
        else file
    }

    getFile(files) {
        var {is_editing, icon_name} = this.state
        this.setState({ files, file_uploaded: true })
    }

    render() {

        var { files, icon_name, is_editing } = this.state
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
                    <div className="form-group">
                        <FileUpload
                            files={files}
                            className="d-flex justify-content-between ps-2 "
                            default_text="Файлаа оруулна уу"
                            getFile={this.getFile}
                            accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
                            onChange={(e) => fileAction(e, 'files')}
                            disabled={is_editing ? true : ''}
                            className_2={is_editing ? "change_bg" : ''}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
