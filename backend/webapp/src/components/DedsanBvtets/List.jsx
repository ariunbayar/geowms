import React, { Component } from 'react'
import { service } from './service'
import {Switch, Route, NavLink} from "react-router-dom"
import { CompilationStatus } from 'webpack-build-notifier/dist/types'
import SideBar from './sideTable'
import Forms from './Form'
import './style.css'
import Modal from '../../../../../src/components/Modal/DeleteModal'

export class List extends Component {

    constructor(props) {
        super(props)

        this.state = {
            list_all:[],
            feature_lists: [],
            check: '',
            form_is_laod: true,
            form_is_laod_left: true,
            model_id: null,
            model_name: null,
            code: '',
            edit_name: '',
            is_delete: false,
            modal_status: "closed",
            name: '',
            hideRight: false,
        }
        this.getAll = this.getAll.bind(this)
        this.handleForm = this.handleForm.bind(this)
        this.done = this.done.bind(this)
        this.handleFormLeft = this.handleFormLeft.bind(this)
        this.isDelete = this.isDelete.bind(this)
        this.remove = this.remove.bind(this)
        this.delete = this.delete.bind(this)
    }

    componentDidMount(){
        var haha = 'type_id'
        console.log(haha.includes('id'))
        this.getAll()
    }

    getAll(){
        console.log("this is a getAll")
        service.getall().then(({success, data }) => {
            if(success){
                this.setState({
                    list_all: data,
                })
            }
        })
    }

    getProperties(code) {
        console.log(code, "this is a code")
        this.setState({ form_is_laod: true, hideRight: true })
        service.getprop(code).then(rsp => {
            if(rsp.success){
                this.setState({
                    feature_lists: rsp.feature_lists,
                    check: rsp.check,
                    code: code,
                })
            }
        })
    }

    handleForm(model_name, model_id, edit_name){
        if (edit_name) {
            this.setState({ form_is_laod: false, model_id, edit_name, model_name, hideRight: true })
        }
        else {
            this.setState({ form_is_laod: false, model_name, model_id, edit_name: '', hideRight: true })

        }
    }

    handleFormLeft(model_name, model_id, edit_name){
        if (edit_name) {
            this.setState({ form_is_laod_left:false, model_name, edit_name, model_id })
        }
        else {
            this.setState({ form_is_laod_left:false, model_name, model_id, edit_name: '' })
        }
    }

    done(){
        console.log("tath donew")
        this.setState({form_is_laod_left: true})
    }

    isDelete(){
        this.setState({ is_delete: !this.state.is_delete })
    }

    remove(model_name, model_id, name){
        console.log(model_name, model_id, name)
        this.setState({ modal_status: "open", model_name, model_id, name })
    }

    delete(){
        const { model_name, model_id } = this.state
        service.remove(model_name, model_id).then(({success, info}) => {
            if (success) {
                console.log(info)
                this.getAll();
            }
            else {
                alert(info)
            }
            this.setState({ info, modal_status: "closed", hideRight: false })
        })
    }

    statusModal(type){
        console.log(type)
        if (type == 'open') this.setState({ modal_status: "open" })
        if (type == 'close') this.setState({ modal_status: "closed" })
        if (type == 'hide') this.setState({ hideRight: false })
    }

    render() {
        const { list_all, form_is_laod_left, model_name, model_id, code, edit_name, is_delete, info } = this.state
        console.log(is_delete)
        return (
            <div className="row m-0">
                <div className="card col-md-5">
                    <div className="card-body">
                    <label className="float-right" htmlFor="Delete">Устгах
                        <input type="checkbox" id="Delete" onChange={() => this.isDelete()}/>
                    </label>
                        {form_is_laod_left ?
                            <ul>
                            {list_all.map((theme, idx) =>
                                <li key={idx}>
                                        <span>
                                            <a href="#" onClick={() => this.handleForm('theme', theme.id, theme.name)}
                                            >
                                                {theme.name}
                                            </a>
                                            &nbsp;
                                            {is_delete &&
                                                <i
                                                    className="fa fa-trash text-danger fa-1x"
                                                    role="button"
                                                    onClick={() => this.remove('theme', theme.id, theme.name)}
                                                ></i>
                                            }
                                        </span>
                                    <ul>
                                        {theme.package.map((packages, idx) =>
                                            <li key={idx}>
                                                    <span>
                                                        <a href="#" onClick={() => this.handleForm('package', packages.id, packages.name )}
                                                        >
                                                            {packages.name}
                                                        </a>
                                                        {is_delete &&
                                                            <i
                                                                className="fa fa-trash text-danger fa-1x"
                                                                role="button"
                                                                onClick={() => this.remove('package', packages.id, packages.name)}
                                                            ></i>
                                                        }
                                                    </span>
                                                <ul>
                                                    {packages.features.map((feature, idx) =>
                                                        <li key={idx}>
                                                            <a onClick={() => this.getProperties(feature.code)}>
                                                                <i className="fa fa-table"></i> &nbsp;
                                                                <span role="button" className="hidden-xs gp-text-primary" > {feature.name} </span>
                                                            </a>
                                                            {is_delete &&
                                                                <i
                                                                    className="fa fa-trash text-danger fa-1x"
                                                                    role="button"
                                                                    onClick={() => this.remove('feature', feature.id, feature.name)}
                                                                ></i>
                                                            }
                                                        </li>
                                                    )}
                                                    <li><a type="button" className="gp-text-primary" onClick={() => this.handleForm('feature', packages.id)}><i className="fa fa-plus-circle gp-text-primary"></i> Давхрага нэмэх</a></li>
                                                </ul>
                                            </li>
                                        )}
                                        <li><a type="button" className="gp-text-primary" onClick={() => this.handleForm('package', theme.id)}><i className="fa fa-plus-circle gp-text-primary"></i> Багц нэмэх</a></li>
                                    </ul>
                                </li>
                            )}
                            <li><a href="#" type="button" className="gp-text-primary" onClick={() => this.handleForm("theme", null)}><i className="fa fa-plus-circle gp-text-primary"></i> Дэд сан нэмэх</a></li>
                            </ul>
                            :
                            <div>
                                <a className="btn gp-outline-primary" onClick={() => this.done()}><i className="fa fa-angle-double-left"></i> Болсон</a>
                                <Forms
                                    model_name={model_name}
                                    model_id={model_id}
                                    refresh={() => this.getProperties(code)}
                                    handleFormLeft={this.handleFormLeft}
                                    code={code}
                                    done={() => this.done()}
                                    edit_name={edit_name}
                                    remove={this.remove}
                                ></Forms>
                            </div>
                        }


                    </div>
                </div>
                <Modal
                    modalAction={() => this.delete()}
                    title={'Устгах'}
                    text={`Та "${this.state.name}" нэртэй "${this.state.model_name}"-г устгахдаа итгэлтэй байна уу?`}
                    model_type_icon = "success"
                    status={this.state.modal_status}
                    modalClose={() => this.statusModal('close')}
                    actionName='Устгах'
                    actionNameBack='Болих'
                />
                <div className={`card col-md-7`} style={{left:"10px"}}>
                    <div className="card-body">
                        {this.state.form_is_laod ?
                        <SideBar
                            features={this.state.feature_lists}
                            check={this.state.check}
                            handleFormLeft={this.handleFormLeft}
                            handleForm={() => this.handleForm()}
                        />:
                        <div>
                            <a onClick={() => this.handleFormLeft(1)}>asdasdasdas</a>
                            <Forms
                                model_name={model_name}
                                model_id={model_id}
                                refresh={this.getAll}
                                done={() => this.done()}
                                edit_name={edit_name}
                                remove={this.remove}
                                statusModal={this.statusModal}
                            ></Forms>
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

}