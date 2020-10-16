import React, { Component } from "react"
import {service} from './service'
import {validationSchema} from './validationSchema'
import {HureeEdit} from './HureeEdit'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import Maps from '../Components/map/Map'
import ModalAlert from '../Components/helpers/ModalAlert'

export class Forms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            values: {
                id: 0,
                dugaar: '',
                date: '',
                too_shirheg: '',
                burtgegch: '',
            },
            aimagname: '',
            sumname: '',
            modal_alert_status: "closed",
            timer: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.hureeRemove = this.hureeRemove.bind(this)
        this.hureeAdd = this.hureeAdd.bind(this)
        this.handleRefresh = this.handleRefresh.bind(this)
        this.handleXY = this.handleXY.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
    }

    hureeRemove(id){
        const tuuh_id = this.props.match.params.id
        service.hureeCount(id, 'remove', tuuh_id).then(({success}) => {
            if (success) {
                setTimeout(() => {
                    this.handleRefresh()
                }, 1000)
            }
        })

    }

    handleXY(values, info){
        info.map(e=>this.setState({aimagname:e.aimag, sumname:e.sum}))
    }

    hureeAdd(){
        const tuuh_id = this.props.match.params.id
        service.hureeCount(1, 'add', tuuh_id).then(({success}) => {
            if (success) {
                setTimeout(() => {
                    this.handleRefresh()
                }, 1000)
            }
        })
    }
    componentDidMount(){
        const id = this.props.match.params.id
        if(id) this.handleRefresh()

    }
    handleRefresh(){
        const id = this.props.match.params.id
        service.about(id).then(({tuuh_soyl}) => {
            if(tuuh_soyl){
                tuuh_soyl.map((tuuh) =>
                    this.setState({
                        values:{
                            dugaar: tuuh['dugaar'],date: tuuh['date'],
                            too_shirheg: tuuh['too_shirheg'],
                            burtgegch: tuuh['burtgegch'],
                            id :id
                        },
                        aimagname: tuuh['aimagname'],
                        sumname: tuuh['sumname'],
                    })
                )
            }
        })
    }
    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
    }

    handleSubmit(values, { setStatus, setSubmitting }) {
        setStatus('checking')
        setSubmitting(true)
        this.setState({values})
        const id = this.props.match.params.id

        if(id){
            const form_datas = this.state.values
            service.update(form_datas, this.state.aimagname, this.state.sumname).then(({success}) => {
                if (success) {
                    setStatus('saved')
                    this.setState({modal_alert_status: "open"})
                    this.modalCloseTime()
                }
            })
        }
        else{
            const form_datas = this.state.values
            service.create(form_datas,  this.state.aimagname, this.state.sumname).then(({success}) => {
                if (success) {
                    setStatus('saved')
                    this.setState({modal_alert_status: "open"})
                    this.modalCloseTime()
                }
            })
        }
    }

    modalClose() {
        clearTimeout(this.state.timer)
        this.setState({modal_alert_status: "closed"})
        this.props.history.push( `/gov/tuuhen-ov/`)
    }

    modalCloseTime() {
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
            this.props.history.push( `/gov/tuuhen-ov/`)
        }, 2000)
    }

    render() {
        const huree_components = []
        const huree_len = this.state.values.too_shirheg
        const tuuh_id = this.props.match.params.id

        for(var i=1; i<=huree_len; i++)
        {
            huree_components.push(<a><HureeEdit huree_id={i} hureeRemove={this.hureeRemove} ></HureeEdit><br></br></a>)
        }
        return (
            <Formik
                enableReinitialize
                initialValues={this.state.values}
                validationSchema={validationSchema}
                onSubmit={this.handleSubmit}
            >
            {({
                errors,
                status,
                touched,
                isSubmitting,
                setFieldValue,
                handleBlur,
                values,
                isValid,
                dirty,
            }) => {
            const has_error = Object.keys(errors).length > 0
            return (
                <Form>
                     <Maps handleXY={this.handleXY} coordinatCheck={false} />
                        <div className='card'>
                            <div className='card-body row'>
                                <div className='col-md-9 my-4'>
                                    <div className="col-md-12 mb-4 my-4">
                                        <a href="#" className="btn gp-outline-primary" onClick={this.props.history.goBack}>
                                            <i className="fa fa-angle-double-left"></i> Буцах
                                        </a>
                                    </div>
                                    <div className="row container  my-4">
                                        <h4>2015 ОНЫ ТҮҮХ, СОЁЛЫН ҮЛ ХӨДЛӨХ ДУРСГАЛЫН ҮЗЛЭГ, ТООЛЛОГЫН ХЭЭРИЙН БҮРТГЭЛИЙН МАЯГТ №1</h4>
                                    </div>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th style={{width: "20%"}} scope="row">Дурсгалт газрын бүртгэлийн дугаар</th>
                                                <td colSpan="2" scope="rowgroup"  >
                                                    <Field
                                                        className={'form-control ' + (errors.dugaar ? 'is-invalid' : '')}
                                                        name='dugaar'
                                                        id="id_dugaar"
                                                        type="text"
                                                    />
                                                    <ErrorMessage name="dugaar" component="div" className="invalid-feedback"/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th style={{width: "20%"}} scope="row">Он,сар,өдөр</th>
                                                <td>
                                                    <Field
                                                        className={'form-control ' + (errors.date ? 'is-invalid' : '')}
                                                        name='date'
                                                        id="id_date"
                                                        type="date"
                                                    />
                                                    <ErrorMessage name="date" component="div" className="invalid-feedback"/>
                                                </td>
                                                <th style={{width: "20%"}}>Бүртгэл хийсэн он сар, өдрийг бичнэ.</th>
                                            </tr>
                                            <tr>
                                                <th scope="row">Аймаг, Нийслэл</th>
                                                <td scope="row">
                                                    <input
                                                        className='form-control'
                                                        name='aimagname'
                                                        id="id_aimagname"
                                                        value={this.state.aimagname}
                                                        disabled={true}
                                                        type="text"
                                                    />
                                                </td>
                                                <th rowSpan="2" scope="rowgroup">Тухайн дурсгал оршиж буй аймаг,<br></br> сумын нэрийг бичнэ.</th>
                                            </tr>
                                            <tr>
                                                <th scope="row">Сум, Дүүрэг</th>
                                                <td>
                                                    <input
                                                        className='form-control'
                                                        name='sumname'
                                                        value={this.state.sumname}
                                                        disabled={true}
                                                        id="id_sumname"
                                                        type="text"
                                                    />
                                                </td>
                                            </tr>

                                            <tr>
                                                <th scope="row">Хамрах хүруу тоо ширхэг</th>
                                                {tuuh_id ?
                                                <td>
                                                        <button type="button" className="btn btn-outline-success btn-sm btn-round btn-block waves-effect waves-light m-1"  onClick={this.hureeAdd}>Хамрах хүрээ нэмэх</button>
                                                        <br></br>
                                                        <hr className="my-2"></hr>
                                                        {huree_components}
                                                </td>:
                                                <td>
                                                        <Field
                                                            className={'form-control ' + (errors.too_shirheg ? 'is-invalid' : '')}
                                                            name='too_shirheg'
                                                            id="id_too_shirheg"
                                                            type="number"
                                                        />
                                                        <ErrorMessage name="too_shirheg" component="div" className="invalid-feedback"/>
                                                </td>
                                                }
                                                <th>Тоо ширхэг.</th>
                                            </tr>
                                            <tr>
                                                <th scope="row">Бүртгэгч</th>
                                                <td>
                                                    <Field
                                                        className={'form-control ' + (errors.burtgegch ? 'is-invalid' : '')}
                                                        name='burtgegch'
                                                        id="id_burtgegch"
                                                        type="text"
                                                    />
                                                    <ErrorMessage name="burtgegch" component="div" className="invalid-feedback"/>
                                                </td>
                                                <th>Бүргэлийг оруулсан хүн.</th>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="span3 my-3">
                                        {has_error
                                            ?
                                                <p></p>
                                            :
                                            status == 'saved' && !dirty &&
                                                <p>Амжилттай нэмэгдлээ</p>
                                        }
                                        <div>
                                            <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting || has_error}>
                                                {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                                {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                                {!isSubmitting && 'Нэмэх' }
                                            </button>
                                        </div>
                                        <ModalAlert
                                            modalAction={() => this.modalClose()}
                                            status={this.state.modal_alert_status}
                                            title="Амжилттай нэмлээ"
                                            model_type_icon = "success"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                    )
                }}
            </Formik>
        )

    }

}
