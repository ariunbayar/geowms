import React, { Component } from "react"

import {service} from './service'
import {ConfigForm} from './configForm'
import ConfigFormTree from './ConfigFormTree'
import Modal from "../Modal"

export class Config extends Component {

    constructor(props) {

        super(props)
        this.state = {
            config_list: [],
            formDisabled: true,
            title: null,
            is_form_open: true,
            config:[],
            showModal: false,
            modalTitle: null,
            modalText: null,
            modalId: null,
        }

        this.handleEdit = this.handleEdit.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleFormCancel = this.handleFormCancel.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleListUpdated = this.handleListUpdated.bind(this);

    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {

        service.getAll().then(({config_list}) => {
            if(config_list){ this.setState({config_list}) }
        })

    }
    handleChange(event) {
        this.setState({title: event.target.value});
    }


    handleEdit(config) {
        this.setState({is_form_open:false, config})

    }

    modalClose() {
        this.setState({showModal: false})
    }

    handleRemove(){
        const id = this.state.modalId
        service.remove(id).then(({success}) => {
            if(success){
                this.handleListUpdated()
            }
        })
        this.modalClose()

    }

    modalTrue(id, text) {
        this.setState({showModal: true, modalText: text, modalTitle: "Та итгэлтэй байна уу? ", modalId: id})
    }
    
    handleAdd() {

        this.setState({is_form_open: false, config: []})
    }

    handleFormCancel() {
        this.setState({is_form_open: true})
    }

    render() {
        const {formDisabled, config_list, is_form_open, config, showModal, modalText, modalTitle} = this.state
        return (
            <div className="container my-4 container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <Modal 
                    showModal={showModal} 
                    modalClose={() => this.modalClose()}
                    modalAction={() => this.handleRemove()}
                    text={modalText}
                    title={modalTitle}
                    >
                </Modal>
                <div className="col-md-12">

                    {is_form_open ?
                    <>
                        <div className="text-right">
                            <button className="btn gp-bg-primary" onClick={this.handleAdd} >
                                    Нэмэх
                            </button>
                        </div>
                        

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Нэр</th>
                                    <th scope="col">Утга</th>
                                    <th scope="col">Шинэчлэгдсэн хугацаа</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {config_list.map((config) =>
                                    <ConfigFormTree values={config} 
                                        key={config.id} 
                                        handleRemove={() => this.modalTrue(config.id, config.name)}
                                        handleEdit={() => this.handleEdit(config)}
                                    ></ConfigFormTree>
                                )}
                            </tbody>
                        </table>
                    </> :
                    <ConfigForm
                        handleCancel={this.handleFormCancel}
                        handleUpdated={this.handleListUpdated}
                        config={config}
                    >
                    </ConfigForm>
                    }
                </div> 
            </div>
        )
    }
}
