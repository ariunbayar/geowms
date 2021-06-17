import React, { Component } from 'react'
import { service } from './service'
import SideBar from './sideTable'
import Forms from './Form'
import './style.css'

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
            name: '',
            hideRight: false,
            formLorR: '',
            top_id: '',
            feature_id: null
        }
        this.getAll = this.getAll.bind(this)
        this.handleForm = this.handleForm.bind(this)
        this.done = this.done.bind(this)
        this.handleFormLeft = this.handleFormLeft.bind(this)
        this.isDelete = this.isDelete.bind(this)
        this.remove = this.remove.bind(this)
        this.delete = this.delete.bind(this)
        this.deleteAndRemove = this.deleteAndRemove.bind(this)
    }

    componentDidMount() {
        this.getAll()
    }

    getAll() {
        const { formLorR, code, feature_id } = this.state
        service
            .getall()
            .then(({ success, data }) => {
                if(success) {
                    this.setState({
                        list_all: data,
                    })
                }
                if (formLorR == 'right') {
                    this.getProperties(code, feature_id)
                    this.setState({ hideRight: true })
                }
                if ( formLorR == 'left') this.setState({ hideRight: false })
            })
    }

    getProperties(code, feature_id) {
        this.setState({ form_is_laod: true })
        service.getprop(code).then(rsp => {
            if(rsp.success){
                this.setState({
                    feature_lists: rsp.feature_lists,
                    check: rsp.check,
                    code: code,
                    hideRight: true,
                    feature_id
                })
            }
        })
    }

    handleForm(model_name, model_id, edit_name) {
        if (edit_name) {
            this.setState({ form_is_laod: false, model_id, edit_name, model_name, hideRight: true })
        }
        else {
            this.setState({ form_is_laod: false, model_name, model_id, edit_name: '', hideRight: true })

        }
    }

    handleFormLeft(model_name, model_id, edit_name, top_id) {
        if (edit_name) {
            this.setState({ form_is_laod_left:false, model_name, edit_name, model_id, top_id })
        }
        else {
            this.setState({ form_is_laod_left:false, model_name, model_id, edit_name: '', top_id })
        }
    }

    done(){
        this.setState({form_is_laod_left: true})
    }

    isDelete(){
        this.setState({ is_delete: !this.state.is_delete })
    }

    remove(model_name, model_id, name, formLorR) {
        const modal = {
            modal_status: "open",
            modal_icon: modal_icon,
            modal_bg: modal_bg,
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
            actionNameBack: actionNameBack,
            actionNameDelete: actionNameDelete,
            modalAction: modalAction,
            modalClose: modalClose
        }
        this.props.setModal(modal)
        this.setState({ model_name, model_id, name, formLorR })
    }

    deleteAndRemove(model_name, model_id){
        service.remove(model_name, model_id).then(({ success, info }) => {
            if (success) {
                this.setState({ hideRight: false })
                this.getAll();
            }
            else {
                alert(info)
            }
            this.setState({ info, top_id: '' })
        })
        .catch(() => {
            alert("Алдаа гарсан байна")
        })
    }

    delete() {
        const { model_name, model_id, formLorR, code, top_id } = this.state
        if (formLorR == 'left') {
            this.deleteAndRemove(model_name, model_id)
        }
        if (formLorR == 'right' && top_id) {
            service.erese(model_name, model_id, top_id).then(({ success, info }) => {
                if (success) {
                    this.setState({ hideRight: true })
                    this.getProperties(code)
                }
                else {
                    alert(info)
                }
                this.setState({ info, top_id: '' })
            })
            .catch(() => {
                alert("Алдаа гарсан байна")
            })
        }
        else {
            this.deleteAndRemove(model_name, model_id)
        }
    }

    render() {
        const { list_all, form_is_laod_left, model_name, model_id, code, edit_name, is_delete, info, hideRight } = this.state
        return (
            <div className="row m-0">
                <div className="card col-md-4 right-scroll-sticky">
                    <div className="card-body">
                        <div className="icheck-danger float-right">
                            <input type="checkbox" id="active-delete" onChange={() => this.isDelete()}/>
                            <label htmlFor="active-delete">Устгах</label>
                        </div>
                        {
                            form_is_laod_left
                            ?
                                <ul>
                                    <li>
                                        <a
                                            className="gp-text-primary"
                                            type="button"
                                            className="gp-text-primary"
                                            onClick={() => this.handleForm("theme", null)}
                                        >
                                            <i className="fa fa-plus-circle gp-text-primary"></i>
                                            &nbsp;
                                            Дэд сан нэмэх
                                        </a>
                                    </li>
                                    {
                                        list_all.map((theme, idx) =>
                                            <li key={idx}>
                                                <div>
                                                    <span
                                                        role="button"
                                                        className="gp-text-primary"
                                                        onClick={() => this.handleForm('theme', theme.id, theme.name)}
                                                    >
                                                        {theme.name}
                                                    </span>
                                                    &nbsp;
                                                    {
                                                        is_delete
                                                        &&
                                                            <i
                                                                className="fa fa-trash text-danger fa-1x"
                                                                role="button"
                                                                onClick={() => this.remove('theme', theme.id, theme.name)}
                                                            >
                                                            </i>
                                                    }
                                                </div>
                                                <ul>
                                                    {
                                                        theme.package.map((packages, idx) =>
                                                            <li key={idx}>
                                                                <div>
                                                                    <span
                                                                        role="button"
                                                                        className="gp-text-primary"
                                                                        onClick={() => this.handleForm('package', packages.id, packages.name )}
                                                                    >
                                                                        {packages.name}
                                                                    </span>
                                                                    &nbsp;
                                                                    {
                                                                        is_delete
                                                                        &&
                                                                            <i
                                                                                className="fa fa-trash text-danger fa-1x"
                                                                                role="button"
                                                                                onClick={() => this.remove('package', packages.id, packages.name)}
                                                                            >
                                                                            </i>
                                                                    }
                                                                </div>
                                                                <ul>
                                                                    {
                                                                        packages.features.map((feature, idx) =>
                                                                            <li key={idx}>
                                                                                <a onClick={() => this.getProperties(feature.code, feature.id)}>
                                                                                    <i className="fa fa-table"></i> &nbsp;
                                                                                    <span role="button" className="hidden-xs gp-text-primary">{feature.name}</span>
                                                                                </a>
                                                                                &nbsp;
                                                                                {
                                                                                    is_delete &&
                                                                                    <i
                                                                                        className="fa fa-trash text-danger fa-1x"
                                                                                        role="button"
                                                                                        onClick={() => this.remove('feature', feature.id, feature.name)}
                                                                                    >
                                                                                    </i>
                                                                                }
                                                                            </li>
                                                                        )
                                                                    }
                                                                    <li>
                                                                        <a
                                                                            type="button"
                                                                            className="gp-text-primary" onClick={() => this.handleForm('feature', packages.id)}
                                                                        >
                                                                            <i className="fa fa-plus-circle gp-text-primary"></i>
                                                                            &nbsp;
                                                                            Давхрага нэмэх
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                        </li>
                                                    )}
                                                    <li>
                                                        <a type="button" className="gp-text-primary" onClick={() => this.handleForm('package', theme.id)}>
                                                            <i className="fa fa-plus-circle gp-text-primary"></i>
                                                            &nbsp;
                                                            Багц нэмэх
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                        )
                                    }
                                </ul>
                            :
                                <div>
                                    <a className="btn gp-outline-primary" onClick={() => this.done()}><i className="fa fa-angle-double-left"></i> Болсон</a>
                                    <Forms
                                        setModal={this.props.setModal}
                                        model_name={model_name}
                                        model_id={model_id}
                                        refresh={() => this.getProperties(code)}
                                        handleFormLeft={this.handleFormLeft}
                                        code={code}
                                        done={() => this.done()}
                                        edit_name={edit_name}
                                        remove={this.delete}
                                        type="right"
                                        top_id={this.state.top_id}
                                    />
                                </div>
                        }


                    </div>
                </div>
                <div className="card col-md-8" style={{left:"10px"}}>
                    <div className="card-body">
                        {
                            this.state.form_is_laod
                            ?
                                <SideBar
                                    setNotif={this.props.setNotif}
                                    features={this.state.feature_lists}
                                    check={this.state.check}
                                    feature_id={this.state.feature_id}
                                    handleFormLeft={this.handleFormLeft}
                                    handleForm={() => this.handleForm()}
                                    hide={hideRight}
                                    list_all={list_all}
                                />
                            :
                                <Forms
                                    setModal={this.props.setModal}
                                    model_name={model_name}
                                    model_id={model_id}
                                    refresh={this.getAll}
                                    done={() => this.done()}
                                    edit_name={edit_name}
                                    remove={(...values) => this.delete(...values)}
                                    type="left"
                                />
                        }
                    </div>
                </div>
            </div>
        )
    }
}
