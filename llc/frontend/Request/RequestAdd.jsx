import React, { Component } from "react"
import filesize from 'filesize'
import { service } from "./service"
import Modal from '@utils/Modal/Modal'


export class RequestAdd extends Component {

    constructor(props) {
        super(props)
        this.list = []
        this.state = {
            values:[],
            files:[],
            modal_status:'closed',
        }
        this.removeFromList = this.removeFromList.bind(this)
    }

    handleSubmit(){
        var request_text = document.getElementById('Description').value
        const { files } = this.state
        // var form_datas = {
        //     'file': files,
        //     'description': request_text
        // }
        const form_datas = new FormData()
        form_datas.append('files', files, files.name);
        form_datas.append('request_text', request_text)
        service.SaveRequest(form_datas).then(({success, info}) => {
            if(success){
                this.modalChange(
                    'fa fa-check-circle',
                    null,
                    'success',
                    'Амжилттай хадгаллаа',
                    '',
                    false,
                    '',
                    '',
                    null,
                    this.modalClose()
                    )
            }
        })
    }


    handleGetFiles(e){
        let files = e.target.files[0]
        this.setState({files})
        // const current_files = this.state.files
        // for (var i=0; i < files.length; i ++){
        //     if (files.length == 0){
        //         this.setState({ files: files[i] })
        //     }
        //     else {
        //         this.setState({ files: current_files.concat(files[i]) })
        //     }
        // }
    }

    removeInput() {
        var file_value = document.getElementById('Upload_file')
        file_value.value = ''
    }

    removeFromList(file_name) {
        const { files } = this.state
        const isBelowThreshold = (names) => names = file_name;
        if (files.length == 1) {
            this.removeInput()
            this.setState({ files: [] })
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

    modalClose() {
        this.props.history.push('/llc/llc-request/')
    }

    modalOpen(){
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, modal_bg, icon_color, title, text, has_button, actionNameBack, actionNameDelete, modalAction, modalClose) {
        this.setState(
            {
                modal_icon,
                modal_bg,
                icon_color,
                title,
                text,
                has_button,
                actionNameBack,
                actionNameDelete,
                modalAction,
                modalClose,
            },
            () => this.modalOpen()
        )
    }
        render (){
            const {files} = this.state
            this.list = []
            // if (files.length > 0){
            //     for(var i=0; i < files.length; i++){
            //         const size = filesize(files[i].size)
            //         this.list.push(
            //             <li key={i}>
            //                 {files[i].name} - {size}
            //                 <i role="button"
            //                     className="float-right fa fa-times text-danger mt-1"
            //                     aria-hidden='true'
            //                     onClick={
            //                         (e) => this.removeFromList(e.target.parentElement.innerHTML.split(' ')[0])
            //                     }
            //                 >
            //                 </i>
            //             </li>
            //         )
            //     }
            // }
            return (
                <div className="card">
                    <div className="col-md-5">
                        <div class="card-body">
                            <form novalidate="" class="ng-untouched ng-pristine ng-valid">
                                <div className="form-group">
                                    <label for="input-1 ">БАЙГУУЛЛАГЫН НЭР</label>
                                    <input
                                        type="text"
                                        id="input-1"
                                        className="form-control"
                                        disabled='disabled'
                                        value="ОРГИЛБОЛД ХХК"/>
                                </div>
                                <div className="form-group">
                                    <label for="input-5"> Хүсэлтийн тайлбар </label>
                                    <span className='col-md-12'>
                                        <textarea
                                            id="Description"
                                            rows="3"
                                            className="form-control"
                                        >
                                        </textarea>
                                    </span>
                                </div>
                                <div className="form-group ">
                                    <label for="Files ">Файлаа оруулна уу</label>
                                    <input
                                        type="file"
                                        id="Upload_file"
                                        className="form-control-file"
                                        onChange={(e) => this.handleGetFiles(e)}
                                    />
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
                            <div className="form-group">
                                    <button
                                        type="button"
                                        className="btn btn-primary px-5 "
                                        onClick ={()=> this.handleSubmit()}
                                    >
                                        <i className="fa fa-envelope-open-o"> Хүсэлт үүсгэх</i>
                                    </button>
                            </div>
                            </form>
                        </div>
                    </div>
                    <Modal
                        modal_status={ this.state.modal_status }
                        modal_icon={ this.state.modal_icon }
                        modal_bg={ this.state.modal_bg }
                        icon_color={ this.state.icon_color }
                        title={ this.state.title }
                        text={ this.state.text }
                        has_button={ this.state.has_button }
                        actionNameBack={ this.state.actionNameBack }
                        actionNameDelete={ this.state.actionNameDelete }
                        modalAction={ this.state.modalAction }
                        modalClose={ this.state.modalClose }

                    />
                </div>
            )
        }
    }

