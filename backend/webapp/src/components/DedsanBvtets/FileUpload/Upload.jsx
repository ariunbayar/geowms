import React, { Component } from 'react'
import { service } from '../service'

export class Upload extends Component {
    constructor(props){
        super(props)
        this.list = []
        this.send = null
        this.state = {
            btn_upload_is_laod: false,
            file_path_shp: null,
            files: [],
        }
        this.getFile = this.getFile.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    getFile(event) {
        const files = event.target.files;
        const state_files = this.state.files
        if (files.length == 1){
            for (var i=0; i < files.length; i ++){
                if (files.length == 0){
                    this.setState({ files: files[i] })
                }
                else {
                    this.setState({ files: state_files.concat(files[i]) })
                }
            }
        }
        if (files.length > 1){
            this.setState({ files: files })
        }
    }

    handleSubmit(){
        const { files } = this.state
        const formData = new FormData();
        this.setState({ btn_upload_is_laod: true })
        for(var i = 0; i < files.length; i ++) {
            formData.append("data", files[i], files[i].name);
        }
        service
            .send(formData)
            .then(({success, info, key}) => {
            if (success){
                alert(info)
                if (key){
                    alert(key)
                }
                else{
                    alert(key)
                }
            }
            else{
                alert(info)
            }
            this.setState({ btn_upload_is_laod: false, files: [] })
        })
    }

    cancel(){
        this.setState({ files: [] })
    }

    render() {
        const { files } = this.state
        this.list = []
        if (files.length > 0){
            for(var i=0; i < files.length; i++){
                console.log(this.list)
                this.list.push(<li key={i}>{files[i].name}</li>)
            }
        }
        return (
            <div className={`card col-md-6 border border-danger `} style={{height: 'auto'}}>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card-header text-uppercase">Файлаа оруулна уу.</div>
                            <div className="card-body">
                            <div className="custom-file">
                                <input
                                    type="file"
                                    className="custom-file-input"
                                    id="inputGroupFile01"
                                    onChange={(e) => this.getFile(e)}
                                    multiple
                                ></input>
                                <label className="custom-file-label" htmlFor="inputGroupFile01">Файл оруулах</label>
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
                </div>
            </div>
        )
    }
}