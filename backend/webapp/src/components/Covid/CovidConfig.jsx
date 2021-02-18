import React, { Component, Fragment } from "react"
import { Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import ImageUploader from 'react-images-upload'

import {service} from './service'
import { set } from "ol/transform"


const validationSchema = Yup.object().shape({
    batlagdsan_tohioldol: Yup.string(),
    edgersen_humuusiin_too: Yup.string(),
    emchlegdej_bui_humuus_too: Yup.string(),
    tusgaarlagdsan_humuusiin_too: Yup.string(),
    medeellin_eh_survalj: Yup.string(),
    emiin_sangiin_too: Yup.string(),
    emlegiin_too: Yup.string(),
    niit_eruul_mend_baiguullaga_too: Yup.string(),
    title: Yup.string(),
})

export default class CovidConfig extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: false,
            initial_values: {
                batlagdsan_tohioldol:'',
                edgersen_humuusiin_too:'',
                emchlegdej_bui_humuus_too:'',
                tusgaarlagdsan_humuusiin_too:'',
                medeellin_eh_survalj:'',
                emiin_sangiin_too:'',
                emlegiin_too:'',
                niit_eruul_mend_baiguullaga_too:'',
                title:'',
            },
            emy_logo:'',
            gzbgzzg_logo:'',
            values: {},
            line_chart_datas: [],
        }

        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.arrayRemove = this.arrayRemove.bind(this)
        this.arrayOnChange = this.arrayOnChange.bind(this)
        this.arrayOnChangeDatas = this.arrayOnChangeDatas.bind(this)
        this.arrayAdd = this.arrayAdd.bind(this)
        this.onDrop = this.onDrop.bind(this)
    }

    arrayRemove(idx){

        const {line_chart_datas} = this.state
        line_chart_datas.splice(idx, 1);
        this.setState(line_chart_datas)
    }

    arrayAdd(){
        const {line_chart_datas} = this.state
        line_chart_datas.push({"label": 'Нэр', "datas": 1})
        this.setState(line_chart_datas)
    }

    arrayOnChange(idx, value){
        const {line_chart_datas} = this.state
        line_chart_datas[idx].label = value
        this.setState(line_chart_datas)
    }

    arrayOnChangeDatas(idx, value){
        const {line_chart_datas} = this.state
        line_chart_datas[idx].datas = value
        this.setState(line_chart_datas)
    }

    componentDidMount() {
        service.config.covid.get().then((values) => {
            this.setState({
                initial_values: values,
                values,
                line_chart_datas: values['line_chart_datas'],
                emy_logo: values['emy_logo'],
                gzbgzzg_logo: values['gzbgzzg_logo'],
            })
        })
    }

    handleEdit(e) {
        e.preventDefault()

        const { is_editing } = this.state

        this.setState({
            is_editing: !is_editing,
        })
    }

    handleSubmit(values, { setStatus, setValues }) {
        const { emy_logo, gzbgzzg_logo, line_chart_datas } = this.state
        setStatus('saving')
        let value = values
        value['emy_logo'] = emy_logo
        value['gzbgzzg_logo'] = gzbgzzg_logo
        service.config.covid
            .save(value, line_chart_datas)
            .then(({ success }) => {

                if (success) {
                    setStatus('save_success')
                    this.setState({ values })
                } else {
                    return Promise.reject()
                }

            })
            .catch(() => {
                setValues(this.state.values)
                setStatus('save_error')
            })
            .finally(() => {
                this.setState({ is_editing: false })
            })
    }

    onDrop([icon], name) {
        if(icon){
            let reader = new FileReader();
            reader.onload = (upload) => {
                this.setState({[name]: btoa(upload.target.result)})
            }
            reader.readAsBinaryString(icon)
        }
    }

    render() {

        const {
            is_editing,
            initial_values,
            gzbgzzg_logo,
            emy_logo,
            line_chart_datas
        } = this.state

        return (
            <div className="card">

                <div className="card-header">
                    Covid
                    <div className="card-action">
                        <a href="#" onClick={ this.handleEdit }>
                            <i className="fa fa-edit"></i>
                        </a>
                    </div>
                </div>
                <div className="card-body">
                    <Formik
                        initialValues={ initial_values }
                        initialStatus={ 'initial' }
                        enableReinitialize
                        validationSchema={ validationSchema }
                        onSubmit={ this.handleSubmit }
                    >
                        {({
                            errors,
                            status,
                            touched,
                            isSubmitting,
                            setFieldValue,
                            setStatus,
                            setValues,
                            handleBlur,
                            values,
                            isValid,
                            dirty,
                        }) => {
                            return (
                                <Form>
                                    <fieldset disabled={ !is_editing }>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="title">Гарчиг</label>
                                                <Field
                                                    name="title"
                                                    id="id_title"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="emy_logo">ЕМЯ logo</label>
                                                <ImageUploader
                                                    withPreview={true}
                                                    withIcon={false}
                                                    buttonText='Зураг оруулах'
                                                    onChange={(e) =>this.onDrop(e, 'emy_logo')}
                                                    imgExtension={['.jpeg', '.png']}
                                                    maxFileSize={2250000}
                                                    singleImage={true}
                                                    label=''
                                                />
                                                <p>Өмнөх зураг</p><br/>
                                               <img className="shadow p-3 mb-5 bg-white rounded" src={"data:image/png;base64," + emy_logo} style={{height: '150px'}}/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="gzbgzzg_logo">ГЗБГЗЗГ logo</label>
                                                <ImageUploader
                                                    withPreview={true}
                                                    withIcon={false}
                                                    buttonText='Зураг оруулах'
                                                    onChange={(e) =>this.onDrop(e, 'gzbgzzg_logo')}
                                                    imgExtension={['.jpeg', '.png']}
                                                    maxFileSize={2250000}
                                                    singleImage={true}
                                                    label=''
                                                />
                                                <p>Өмнөх зураг</p><br/>
                                               <img className="shadow p-3 mb-5 bg-white rounded" src={"data:image/png;base64," +  gzbgzzg_logo} style={{height: '150px'}}/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="batlagdsan_tohioldol">Батлагдсан тохиолдол</label>
                                                <Field
                                                    name="batlagdsan_tohioldol"
                                                    id="id_batlagdsan_tohioldol"
                                                    type="number"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="edgersen_humuusiin_too">Эдгэрсэн хүмүүсийн тоо</label>
                                                <Field
                                                    name="edgersen_humuusiin_too"
                                                    id="id_edgersen_humuusiin_too"
                                                    type="number"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="emchlegdej_bui_humuus_too">Эмчлэгдэж буй хүмүүсийн тоо</label>
                                                <Field
                                                    name="emchlegdej_bui_humuus_too"
                                                    id="id_emchlegdej_bui_humuus_too"
                                                    type="number"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="tusgaarlagdsan_humuusiin_too">Тусгаарлагдаж буй хүмүүсийн тоо</label>
                                                <Field
                                                    name="tusgaarlagdsan_humuusiin_too"
                                                    id="id_tusgaarlagdsan_humuusiin_too"
                                                    type="number"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="medeellin_eh_survalj">Мэдээллийн эх сурвалж</label>
                                                <Field
                                                    name="medeellin_eh_survalj"
                                                    id="id_medeellin_eh_survalj"
                                                    as='textarea'
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="emiin_sangiin_too">Эмийн сангийн тоо</label>
                                                <Field
                                                    name="emiin_sangiin_too"
                                                    id="id_emiin_sangiin_too"
                                                    type="number"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="emlegiin_too">Эмнэлгийн тоо</label>
                                                <Field
                                                    name="emlegiin_too"
                                                    id="id_emlegiin_too"
                                                    type="number"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="niit_eruul_mend_baiguullaga_too">Нийт эрүүл мэндийн байгуулагын тоо</label>
                                                <Field
                                                    name="niit_eruul_mend_baiguullaga_too"
                                                    id="id_niit_eruul_mend_baiguullaga_too"
                                                    type="number"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <h5 className="text-center align-center">Line graph утга</h5>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>№</th>
                                                        <th>Нэр</th>
                                                        <th>Тоо</th>
                                                        <th>Хасах</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {line_chart_datas.map((values, idx) =>
                                                        <tr key={idx}>
                                                            <td>{idx + 1}</td>
                                                            <td>
                                                                <input
                                                                    onChange={(e) => this.arrayOnChange(idx, e.target.value)}
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={values.label}
                                                                ></input>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    onChange={(e) => this.arrayOnChangeDatas(idx, e.target.value)}
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={values.datas}
                                                                ></input>
                                                            </td>
                                                            <td>
                                                                <a onClick={() => this.arrayRemove(idx)} className="btn btn-outline-primary ">
                                                                    Хасах
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                                    <a className="text-center" onClick={this.arrayAdd} className="btn btn-outline-primary ">
                                                        Нэмэх
                                                    </a>
                                            </table>
                                        </div>
                                        { is_editing &&
                                            <button
                                                type="submit"
                                                className="btn gp-btn-primary"
                                                disabled={ status == 'saving' }
                                            >
                                                {status == 'saving' &&
                                                    <Fragment>
                                                        <i className="fa fa-circle-o-notch fa-spin"></i> {}
                                                        Түр хүлээнэ үү...
                                                    </Fragment>
                                                }
                                                {status != 'saving' && 'Хадгалах' }
                                            </button>
                                        }
                                    </fieldset>
                                    { !is_editing && status == 'save_success' &&
                                        <div className="alert alert-icon-success alert-dismissible" role="alert">
                                            <button type="button" className="close" onClick={ () => setStatus('initial') }>×</button>
                                            <div className="alert-icon icon-part-success">
                                                <i className="icon-check"></i>
                                            </div>
                                            <div className="alert-message">
                                                <span>Амжилттай хадгаллаа!</span>
                                            </div>
                                        </div>
                                    }
                                    { !is_editing && status == 'save_error' &&
                                        <div className="alert alert-icon-warning alert-dismissible" role="alert">
                                            <button type="button" className="close" onClick={ () => setStatus('initial') }>×</button>
                                            <div className="alert-icon icon-part-warning">
                                                <i className="icon-check"></i>
                                            </div>
                                            <div className="alert-message">
                                                <span>Хадгалахад алдаа гарлаа!</span>
                                            </div>
                                        </div>
                                    }
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        )
    }
}
