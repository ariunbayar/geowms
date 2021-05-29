import React, { Component, Fragment } from "react"
import { service } from "./service"
import RequestDetail from './DirectModal'
import Modal from '@utils/Modal/Modal'


class SendModal extends Component{
    constructor(props) {
        super(props)
        this.state = {
            files:[],
            project_name: '',
            object_type: '',
            object_count: '',
            hurungu_oruulalt: '',
            zahialagch: '',
            vector_datas: []
        }
    }
    componentDidMount(){
        const values = this.props.values
        const {id} = values.field
        service.handleRequestData(id).then(({ vector_datas, form_field}) =>{
            form_field=form_field[0]
            console.log(form_field);
            if (form_field){
                this.setState({
                    vector_datas,
                    files :form_field['file_path'],
                    zahialagch :form_field['client_org'],
                    project_name : form_field['project_name'],
                    object_type : form_field['object_type'],
                    object_count : form_field['object_quantum'],
                    hurungu_oruulalt : form_field['investment_status'],
                })
            }
        })
    }

    render (){
        const {id} = this.props.values.field
        const {
            files, project_name,
            object_type, object_count,
            hurungu_oruulalt, zahialagch,
            vector_datas,
        } = this.state
        return (
            <div className="col-md-12">
                <div className="row mt-2" style={{background:"white"}}>
                    <RequestDetail
                        id={id}
                        project_name={project_name}
                        object_type={object_type}
                        object_count={object_count}
                        hurungu_oruulalt={hurungu_oruulalt}
                        zahialagch={zahialagch}
                        files={files}
                        vector_datas={vector_datas}
                        closeRequestMap={this.props.closeRequestMap}
                        info='Хүсэлт илгээх'
                    />
                    </div>
                </div>
        )
    }
}

export default class RequestModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            values: props.values,
            icon : this.props.icon,
            modal_status:'closed'
        }
        this.openRequestModal = this.openRequestModal.bind(this)
        this.closeRequestMap = this.closeRequestMap.bind(this)
    }

    openRequestModal(){
        this.setState({modal_status:'open'})
    }

    closeRequestMap() {
        this.setState({ modal_status: 'closed' })
    }

    render() {
       const {values, modal_status} = this.state
        return (
            <div className="col-md-12">
                <a
                    className="fa fa-paper-plane-o text-primary mt-2 ml-2"
                    onClick={this.openRequestModal}
                >
                </a>
                <Modal
                    body={SendModal}
                    field ={values}
                    modal_status={modal_status}
                    modal_dialog={true}
                    modal_bg= 'white'
                    title='Хүсэлт Илгээх'
                    closeRequestMap={this.closeRequestMap}
                ></Modal>
             </div>
        )
    }
}



