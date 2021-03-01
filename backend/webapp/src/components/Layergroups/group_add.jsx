import React, { Component } from "react"
import {Switch, Route, NavLink} from "react-router-dom"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import { service } from './service'
import ModelSelectLayer from "./ModelSelect"
import ModalAlert from "../ModalAlert"


const validationSchema = Yup.object().shape({
    name: Yup.string()
    .required('Нэр оруулна уу !'),
    title: Yup.string(),
    abstract: Yup.string(),
})


export class GroupAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            form_values: {
                name: '',
                title: '',
                abstract: '',
                layers: '',
                minx: '',
                maxx: '',
                miny: '',
                maxy:'',
                projection:''
            },
            errors: '',
            layer_list: [],
            layer_detail: [],
            select_layer_status: false,
            modal_alert_status: 'closed',
            model_alert_text: '',
            model_alert_icon: 'success'
        }
        this.getDetialAll = this.getDetialAll.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.handleSelectedLayers = this.handleSelectedLayers.bind(this)
        this.removeLayer = this.removeLayer.bind(this)
        this.handleMoveUp = this.handleMoveUp.bind(this)
        this.handleMoveDown = this.handleMoveDown.bind(this)
        this.handleSwap = this.handleSwap.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)

    }

    componentDidMount() {
        const group_name = this.props.match.params.group_name
        if (group_name) {
            this.getDetialAll(group_name)
        }
        else {
            service.getLayers().then(({layer_list})=> {
                this.setState({layer_detail:layer_list})
            })
        }

    }

    getDetialAll(group_name) {
        service.getGroupDetial(group_name).then(({detial_list, layer_list}) => {
            var bound = detial_list.bounds
            if( detial_list ) {
                this.setState({
                    form_values: {
                        name: detial_list.name,
                        title: detial_list.title,
                        abstract: detial_list.abstractTxt,
                        minx: bound.minx,
                        maxx: bound.maxx,
                        miny: bound.miny,
                        maxy: bound.maxy,
                        projection: bound.crs
                    },
                    layer_list
                })
            }
        })
    }

    modalClose(){
        this.setState({select_layer_status: false})
    }

    handleSelectedLayers(value) {
        var joined = this.state.layer_list.concat(value)
        this.setState({ layer_list: joined, select_layer_status: false})
    }

    removeLayer(e, value) {
        var array = [...this.state.layer_list]
        for (let [i, layer] of array.entries()) {
           if (layer.layer_name == value.layer_name) {
                array.splice(i, 1);
           }
        }
        this.setState({layer_list: array})
    }
    handleMoveUp(e, index) {
        var arr = [...this.state.layer_list]
        if (index > 0) {
            this.handleSwap(arr, index, index - 1);
        }
    }

    handleMoveDown(e, index) {
        var arr = [...this.state.layer_list]
        if (index < arr.length - 1) {
            this.handleSwap(arr, index, index + 1);
        }
    }
    handleSwap(obj, prop1, prop2) {
        var tmp = obj[prop1];
        obj[prop1] = obj[prop2];
        obj[prop2] = tmp;
        this.setState({layer_list: obj})
    }

    handleSubmit(values, { setStatus, setSubmitting, setErrors }) {
        const { layer_list } = this.state
        service
            .createLayerGroup(values, layer_list)
            .then(({ success, info }) => {
                if (success) {
                    this.setState({modal_alert_status: "open", model_alert_text: info, model_alert_icon: 'success'})
                    setStatus('saved')
                    this.props.history.push("/back/layer-groups/")
                } else {
                    this.setState({modal_alert_status: "open", model_alert_text: info, model_alert_icon: 'danger'})
                }
                setSubmitting(false)
                this.modalCloseTime()
            })

    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
        }, 2000)
    }

    render() {
        const {
                form_values, layer_list, layer_detail,
                select_layer_status, modal_alert_status, model_alert_text, model_alert_icon
            } = this.state
        const group_name = this.props.match.params.group_name
        return (
            <div className="ml-3">
                <div className="row">
                    <div className="col-md-4">
                        <Formik
                            enableReinitialize
                            initialValues={
                                form_values
                            }
                            validationSchema={validationSchema}
                            onSubmit={this.handleSubmit}
                        >
                        {({
                            errors,
                            isSubmitting,
                        }) => {
                            const has_error = Object.keys(errors).length > 0
                            return (
                                <Form>
                                    <div className="form-row col-md-8">
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                    <label htmlFor="" >Нэр</label>
                                                    <Field
                                                        className='form-control'
                                                        name="name"
                                                        id="name"
                                                        type="text"
                                                        placeholder="Нэр"
                                                     />
                                                    <ErrorMessage name="name" component="div" className="text-danger"/>
                                            </div>
                                            <div className="form-group col-md-12">
                                                    <label htmlFor="title">Гарчиг</label>
                                                    <Field
                                                        className={'form-control '}
                                                        name='title'
                                                        id="title"
                                                        type="text"
                                                        placeholder="Гарчиг"
                                                    />
                                            </div>
                                            <div className="form-group col-md-12 mb-2">
                                                    <label htmlFor="abstract">Товч тайлбар</label>
                                                    <Field
                                                        className={'form-control'}
                                                        name='abstract'
                                                        id="abstract"
                                                        as='textarea'
                                                        placeholder="Товч тайлбар"
                                                    />
                                            </div>
                                            {
                                            group_name &&
                                            <div>
                                                <div className="form-row col-md-12 my-2">
                                                    <label htmlFor="bbox" className="col-md-12">Bounding box</label>
                                                    <label htmlFor="bbox" className="col-md-12">
                                                        <a className="">Minx</a>
                                                        <a className="ml-5 pl-2">Maxx</a>
                                                        <a className="ml-5 pl-2">Miny</a>
                                                        <a className="ml-5 pl-2">Maxy</a>
                                                    </label>
                                                    <Field
                                                        type="number"
                                                        name='minx'
                                                        id='minx'
                                                        placeholder="minx"
                                                        className="form-control col-3"
                                                    />
                                                    <Field
                                                        type="number"
                                                        name='miny'
                                                        id='minx'
                                                        placeholder="miny"
                                                        className="form-control col-3"
                                                    />
                                                    <Field
                                                        type="number"
                                                        name='maxx'
                                                        id='maxx'
                                                        placeholder="maxx"
                                                        className="form-control col-3"
                                                    />
                                                    <Field
                                                        type="number"
                                                        name='maxy'
                                                        id='maxx'
                                                        placeholder="maxy"
                                                        className="form-control col-3"
                                                    />
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="id_name">Projection</label>
                                                    <Field
                                                        className={'form-control col-4'}
                                                        name='projection'
                                                        id="projection"
                                                        type="text"
                                                        placeholder="projection"
                                                    />
                                                </div>
                                            </div>
                                            }
                                            <div className="form-group col-md-12">
                                                <label htmlFor="id_name">Давхаргууд</label>
                                                <table className="table table_wrapper_table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col"> № </th>
                                                            <th scope="col">Давхарга</th>
                                                            <th scope="col">Төрөл</th>
                                                            <th scope="col">Style</th>
                                                            <th scope="col">Эрэмбэ</th>
                                                            <th scope="col">Хасах</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            layer_list.length >0 ? layer_list.map((value, idx) =>
                                                            <tr key={idx}>
                                                                <td>{idx+1}</td>
                                                                <td>{value.layer_name}</td>
                                                                <td>{value.type}</td>
                                                                <td>{value.style_name}</td>
                                                                <td className="text-center">
                                                                <a href="#">
                                                                    <i className="fa fa-arrow-up text-primary mr-2" aria-hidden="true"  onClick={(e) => this.handleMoveUp(e, idx)}></i>
                                                                    <i className="fa fa-arrow-down text-primary" aria-hidden="true"  onClick={(e) => this.handleMoveDown(e, idx)}></i>
                                                                </a>
                                                                </td>
                                                                <td className="text-center">
                                                                    <a href="#" onClick={(e) => this.removeLayer(e, value)}>
                                                                        <i className="fa fa-minus-circle text-danger" aria-hidden="true"></i>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            ): null
                                                        }
                                                    </tbody>
                                                </table>
                                                { !group_name &&
                                                    <div className="form-group col-md-12">
                                                        <a href="#" onClick={(e) => this.setState({ select_layer_status: true})}>
                                                            <i className="fa fa-plus-circle text-success mr-2 mt-2" aria-hidden="true"></i>
                                                            Давхарга нэмэх
                                                        </a>
                                                    </div>
                                                }

                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting}>
                                                {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                                {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                                {!isSubmitting && 'Хадгалах' }
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                                )}}
                        </Formik>
                    </div>
                    {select_layer_status &&
                            <ModelSelectLayer
                                modalClose={this.modalClose}
                                modalAction={this.handleSelectedLayers}
                                layer_list = {layer_detail}
                                title="Илгээсэн хүсэлт"
                            />
                    }
                </div>
                <ModalAlert
                    modalAction = {() => this.modalClose()}
                    status = {modal_alert_status}
                    title = {model_alert_text}
                    model_type_icon = {model_alert_icon}
                />
            </div>
        )

    }

}
