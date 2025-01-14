import React, { Component } from "react"
import ImageUploader from 'react-images-upload'
import {service} from './service'
import { Formik, Form, Field, ErrorMessage} from 'formik'
import {validationSchemaDan} from './validationSchema'
import BackButton from "@utils/Button/BackButton"

export class DanForm extends Component {

    constructor(props) {
        super(props)
        this._isMounted = false;
        this.datalist = []
        this.error_msg = []
        this.bairlal_msg = []
        this.state = {
            values:{
                evdersen_baidal: '',
                nohtsol_baidal: '',
                sergeeh_sanal: '',
            },
            oiroltsoo_bairlal: '',
            tsegiin_dugaar: '',
            zurag_hol: '',
            zurag_oir: '',
            zurag_baruun: '',
            zurag_zuun: '',
            zurag_hoid: '',
            zurag_omno: '',
            zurag_hol_prev: '',
            zurag_oir_prev: '',
            zurag_baruun_prev: '',
            zurag_zuun_prev: '',
            zurag_hoid_prev: '',
            zurag_omno_prev: '',
            hemjilt_hiih_bolomj: false,
            tseg_dugaar_error: false,
            bairlal_error: false,
            list:[],
            items:[],
            parse: [],
            checkError: [],
            showBox: true,
            error:{error:''},
            is_dan: false,
            isLoading: true,
            showMore: false,
            showTsegAlert: true,
        }

        this.handleInput = this.handleInput.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleCheckGroup = this.handleCheckGroup.bind(this)
        this.handleSearchWithTseg = this.handleSearchWithTseg.bind(this)
        this.optionVal = this.optionVal.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleBoxLeave = this.handleBoxLeave.bind(this)
        this.handleBoxOver = this.handleBoxOver.bind(this)
        this.showMore = this.showMore.bind(this)
    }

    componentDidMount(){
        this._isMounted = true;
        setTimeout(() => {
            this._isMounted && this.setState({ showBox: false })
            this._isMounted && this.setState({ showTsegAlert: false })
        }, 3000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleSearchWithTseg(field, e) {
        this.setState({ [field]: e.target.value })
        if(e.target.value.length == 0){
            this.error_msg = []
            this.error_msg.push(<div className="invalid-feedback">Хоосон байна.</div>)
            if(this.error_msg.length > 0){
                this.setState({ checkError: this.state.error })
            }
        }
        else{
            this.error_msg = []
        }
        if(e.target.value.length >= 1){
            const error = this.state.error
            this.error_msg = []
            this.setState({ checkError: error })
            // service.searchTseg(e.target.value).then(({items, names}) => {
            //     if(items !== false){
            //         this.setState({items, tseg_dugaar_error:false , checkError:[] })
            //         const oiroltsoo_bairlal = names[0]['aimag_ner'] + ' аймгийн ' + names[0]['sum_ner'] + ' сум, '
            //         this.setState({oiroltsoo_bairlal})
            //         this.optionVal(items)
            //     }
            //     else{
            //         this.setState({ tseg_dugaar_error: true, checkError: error })
            //     }
            // })
            // .catch(error => {
            //     console.log("Алдаа гарсан байна. " ,error.text)
            //     this.props.history.push('/profile/api/')
            // })
        }
    }

    optionVal(items){
        this.datalist = []
        items.map((item, key) => {
            this.datalist.push(<option key={key} value={item.tseg}></option>)
        })
    }


    showMore(){
        this.setState({showMore: !this.state.showMore})
    }

    handleSubmit(values, { setStatus, setSubmitting }){
        setStatus('checking')
        setSubmitting(true)
        const form_datas = new FormData()
        this.setState({values})
        form_datas.append('tsegiin_dugaar', this.state.tsegiin_dugaar)
        form_datas.append('oiroltsoo_bairlal', this.state.oiroltsoo_bairlal)
        form_datas.append('evdersen_baidal', values.evdersen_baidal)
        form_datas.append('nohtsol_baidal', values.nohtsol_baidal)
        form_datas.append('hemjilt_hiih_bolomj', this.state.hemjilt_hiih_bolomj)
        form_datas.append('sergeeh_sanal', values.sergeeh_sanal)
        form_datas.append('zurag_hol', this.state.zurag_hol)
        form_datas.append('zurag_oir', this.state.zurag_oir)
        form_datas.append('zurag_baruun', this.state.zurag_baruun)
        form_datas.append('zurag_zuun', this.state.zurag_zuun)
        form_datas.append('zurag_hoid', this.state.zurag_hoid)
        form_datas.append('zurag_omno', this.state.zurag_omno)
        service.tsegUstsan(form_datas).then(({success}) => {
            if (success) {
                setTimeout(() => {
                    setStatus('saved')
                    setSubmitting(false)
                }, 1000)
                this.props.setButton(true)
            }
            if(!success){
                setStatus('failed')
                setSubmitting(false)
            }
        })
        .catch(() => {
            //TODO
            alert('Алдаа гарсан байна')
        })
    }

    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
        if(e.target.value.length == 0){
            this.setState({ bairlal_error: true })
        }
        else{
            this.setState({ bairlal_error: false })
        }
    }

    handleCheck(field, e) {
        if (e.target.checked) {
            this.setState({ [field]: true })
        }
        else{
            this.setState({ [field]: false })
        }
    }

    onDrop([icon], name) {
        if(icon){
            let reader = new FileReader();
            reader.onload = (upload) => {
                this.setState({
                    [name]: btoa(upload.target.result)
                })
            }
            reader.readAsBinaryString(icon)
        }
    }

    handleCheckGroup(field, e, check) {
        this.setState({ [field]: check })
    }

    handleBoxOver (field, e){
        if(field == 'evdersen_baidal'){
            this.setState({ showTsegAlert: true})
        }
        if(field == 'zurag'){
            this.setState({ showBox: true })
        }
    }
    handleBoxLeave(field, e){
        if(field == 'evdersen_baidal'){
            this.setState({ showTsegAlert: false})
        }
        if(field == 'zurag'){
            this.setState({ showBox: false })
        }
    }

    render() {
        const{id, zurag_hol_prev, zurag_oir_prev,
            zurag_baruun_prev, zurag_zuun_prev, zurag_hoid_prev,
            zurag_omno_prev, tseg_dugaar_error, oiroltsoo_bairlal,
            bairlal_error, showMore
        } = this.state
        return (
            <Formik
                initialValues={this.state.values}
                enableReinitialize
                validationSchema={validationSchemaDan}
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
                    if(isSubmitting == true){
                        if(this.state.tseg_dugaar_error == ''){
                            this.error_msg = []
                            this.error_msg.push(<div></div>)
                        }
                        if(this.state.oiroltsoo_bairlal == ''){
                            this.bairlal_msg = []
                            this.bairlal_msg.push(<div></div>)
                        }
                    }
                    if(this.state.oiroltsoo_bairlal != ''){
                        this.bairlal_msg = []
                    }
                    const checkError = this.state.checkError
                    const has_error = Object.keys(errors).length > 0
                    const error_bn = Object.keys(checkError).length > 0
                    return (
                        <Form>
                            <div className="container">
                                <div>
                                    <div className="col-md-12 mb-4 my-3">
                                        <button
                                            className="btn gp-outline-primary"
                                            onClick={() => {
                                                this.props.setButton(true)
                                            }}
                                        >
                                            <i className="fa fa-angle-double-left"></i> Буцах
                                        </button>
                                        <div className="float-right h4">Цэгийн мэдээлэл</div>
                                    </div>
                                </div>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th style={{width: "5%"}} scope="row">1.</th>
                                            <th style={{width: "15%"}}>Цэгийн дугаар:
                                            <br/>
                                            </th>
                                            <td colSpan="4" scope="rowgroup">
                                                <div className="input-group">
                                                    <input
                                                        name="tsegiin_dugaar"
                                                        type="text"
                                                        id="tsegiin_dugaar"
                                                        list="tsegList"
                                                        className={'form-control ' + (tseg_dugaar_error || this.error_msg.length > 0 ? 'is-invalid' : '')}
                                                        onChange={(e) => this.handleSearchWithTseg('tsegiin_dugaar', e)}
                                                    />
                                                    <div
                                                        type="button"
                                                        onMouseOver={(e) => this.handleBoxOver('evdersen_baidal',e)}
                                                        onMouseLeave={(e) => this.handleBoxLeave('evdersen_baidal',e)}
                                                        className="d-flex justify-content-center"
                                                    >
                                                    <span className="mb-1 input-group-addon fa-stack fa-lg">
                                                        <i className="fa fa-square fa-stack-2x"  style={{color: `${this.state.showTsegAlert ? "#1969c3" : `#034ea2`}`}} aria-hidden="true"></i>
                                                        <i className="fa fa-exclamation fa-stack-1x fa-inverse" style={{color:'white'}}></i>
                                                        <i className="fa">
                                                        <div className={`alert alert-dark rounded position-absolute d-none`+
                                                                    `${this.state.showTsegAlert ? " d-block" : ""}`}
                                                                    role="alert"
                                                        >
                                                            <p className="alert-heading h6">Санамж!</p>
                                                            <p className="small">Бүртгэлтэй Цэгийн дугаарыг хийх ёстойг анхаарна уу</p>
                                                        </div>
                                                        </i>
                                                    </span>
                                                    </div>
                                                    {this.error_msg}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{width: "5%"}} scope="row">2.</th>
                                            <th style={{width: "15%"}}>Ойролцоо байрлал:</th>
                                            <td colSpan="4" scope="rowgroup">
                                                <input
                                                    name="oiroltsoo_bairlal"
                                                    type="text"
                                                    id="oiroltsoo_bairlal"
                                                    className={'form-control' + (bairlal_error || this.bairlal_msg.length > 0 ? ' is-invalid' : '')}
                                                    onChange = {(e) => this.handleInput('oiroltsoo_bairlal', e)}
                                                    value = {oiroltsoo_bairlal}
                                                />
                                                {bairlal_error ? <div className="invalid-feedback">Хоосон байна.</div> : null}
                                                {this.bairlal_msg}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{width: "5%"}} scope="row">3.</th>
                                            <th style={{width: "15%"}}>Эвдэрсэн байдал:</th>
                                            <td colSpan="4" scope="rowgroup">
                                                <Field
                                                    as = "select"
                                                    name="evdersen_baidal"
                                                    type="text"
                                                    id="evdersen_baidal"
                                                    className={'form-control' +
                                                        (errors.evdersen_baidal &&
                                                            touched.evdersen_baidal ? ' is-invalid' : '')}
                                                >
                                                    <option value="">--- Сонгоно уу ---</option>
                                                    <option value="Эвдэрсэн">Эвдэрсэн</option>
                                                    <option value="Төв гэмтсэн">Төв гэмтсэн</option>
                                                    <option value="Хазайсан">Хазайсан</option>
                                                    <option value="Дарагдсан">Дарагдсан</option>
                                                    <option value="Бусад">Бусад</option>
                                                </Field>
                                                <ErrorMessage name="evdersen_baidal" component="div" className="invalid-feedback" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{width: "5%"}} scope="row">4.</th>
                                            <th style={{width: "15%"}}>Нөхцөл/шалтгаан:</th>
                                            <td colSpan="4" scope="rowgroup">
                                                <Field
                                                    className={'form-control ' +
                                                        (errors.nohtsol_baidal &&
                                                            touched.nohtsol_baidal ? ' is-invalid' : '')}
                                                    component="textarea"
                                                    name='nohtsol_baidal'
                                                    id="nohtsol_baidal"
                                                    type="textarea"
                                                />
                                                <ErrorMessage name="nohtsol_baidal" component="div" className="invalid-feedback"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{width: "5%"}} scope="row">5.</th>
                                            <th
                                                className="text-center"
                                                colSpan="4"
                                                scope="rowgroup"
                                                style={{width: "15%"}}
                                            >
                                                Орчны фото зураг:
                                                <div
                                                    type="button"
                                                    onMouseOver={(e) => this.handleBoxOver('zurag', e)}
                                                    onMouseLeave={(e) => this.handleBoxLeave('zurag', e)}
                                                    className="float-right"
                                                >
                                                <i className="fa fa-exclamation-circle float-right">
                                                    <div className={`alert alert-dark rounded position-absolute d-none`+
                                                                `${this.state.showBox ? " d-block" : ""}`}
                                                                role="alert"
                                                                style={{zIndex:'1'}}
                                                    >
                                                        <h6 className="alert-heading">Санамж!</h6>
                                                        <p>Зургийн хэмжээ "1MB" байна. ".jpg" ".jpeg" болон ".png" байх ёстой</p>
                                                    </div>
                                                </i>
                                                </div>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th style={{width: "0%"}} scope="row"></th>
                                            <th className="text-center" colSpan="2" scope="rowgroup">холоос</th>
                                            <th className="text-center" colSpan="2" scope="rowgroup">ойроос</th>
                                        </tr>
                                        <tr>
                                            <th style={{width: "5%"}} scope="row"></th>
                                            <th colSpan="2" scope="rowgroup" style={{width: "50%"}}>
                                                <ImageUploader
                                                    withPreview={true}
                                                    withIcon={false}
                                                    buttonText='Зураг оруулах'
                                                    onChange={(e) =>this.onDrop(e, 'zurag_hol')}
                                                    imgExtension={['.jepg', '.jpg', '.png']}
                                                    maxFileSize={1529173}
                                                    singleImage={true}
                                                    label=''
                                                    fileSizeError='Хэт их байна "1MB" зураг'
                                                    fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                                />
                                            </th>
                                            <th colSpan="2" scope="rowgroup">
                                                <ImageUploader
                                                    withPreview={true}
                                                    withIcon={false}
                                                    buttonText='Зураг оруулах'
                                                    onChange={(e) =>this.onDrop(e, 'zurag_oir')}
                                                    imgExtension={['.jepg', '.jpg', '.png']}
                                                    maxFileSize={1529173}
                                                    singleImage={true}
                                                    label=''
                                                    fileSizeError='Хэт их байна "1MB" зураг'
                                                    fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                                />
                                            </th>
                                        </tr>
                                        <tr>
                                            <th style={{width: "5%"}} scope="row"></th>
                                            <td colSpan="4" scope="rowgroup">
                                            <button type="button" className="btn gp-btn-primary btn-block" onClick={(e) => this.showMore(e)}>
                                                {showMore
                                                ?
                                                <div><i className="fa fa-caret-up" aria-hidden="true"></i> <b>Хаах</b></div>
                                                :
                                                <div><i className="fa fa-caret-down" aria-hidden="true"></i> <b>Илүү олон</b></div>
                                                }
                                            </button>
                                            </td>
                                        </tr>
                                        <tr className={showMore ? 'd-show' : "d-none"}>
                                            <th style={{width: "5%"}} scope="row"></th>
                                            <th className="text-center" colSpan="2" scope="rowgroup">Баруун</th>
                                            <th className="text-center" colSpan="2" scope="rowgroup">Зүүн</th>
                                        </tr>
                                        <tr className={showMore ? 'd-show' : "d-none"}>
                                            <th style={{width: "5%"}} scope="row"></th>
                                            <th colSpan="2" scope="rowgroup">
                                                <ImageUploader
                                                    withPreview={true}
                                                    withIcon={false}
                                                    buttonText='Зураг оруулах'
                                                    onChange={(e) =>this.onDrop(e, 'zurag_baruun')}
                                                    imgExtension={['.jepg', '.jpg', '.png']}
                                                    maxFileSize={1529173}
                                                    singleImage={true}
                                                    label=''
                                                    fileSizeError='Хэт их байна "1MB" зураг'
                                                    fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                                />
                                            </th>
                                            <th colSpan="2" scope="rowgroup">
                                                <ImageUploader
                                                    withPreview={true}
                                                    withIcon={false}
                                                    buttonText='Зураг оруулах'
                                                    onChange={(e) =>this.onDrop(e, 'zurag_zuun')}
                                                    imgExtension={['.jepg', '.jpg', '.png']}
                                                    maxFileSize={1529173}
                                                    singleImage={true}
                                                    label=''
                                                    fileSizeError='Хэт их байна "1MB" зураг'
                                                    fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                                />
                                            </th>
                                        </tr>
                                        <tr className={showMore ? 'd-show' : "d-none"}>
                                            <th style={{width: "5%"}} scope="row"></th>
                                            <th className="text-center" colSpan="2" scope="rowgroup">Хойно</th>
                                            <th className="text-center" colSpan="2" scope="rowgroup">Өмнө</th>
                                        </tr>
                                        <tr className={showMore ? 'd-show' : "d-none"}>
                                            <th style={{width: "5%"}} scope="row"></th>
                                            <th colSpan="2" scope="rowgroup">
                                                <ImageUploader
                                                    withPreview={true}
                                                    withIcon={false}
                                                    buttonText='Зураг оруулах'
                                                    onChange={(e) =>this.onDrop(e, 'zurag_hoid')}
                                                    imgExtension={['.jepg', '.jpg', '.png']}
                                                    maxFileSize={1529173}
                                                    singleImage={true}
                                                    label=''
                                                    fileSizeError='Хэт их байна "1MB" зураг'
                                                    fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                                />
                                            </th>
                                            <th colSpan="2" scope="rowgroup">
                                                <ImageUploader
                                                    withPreview={true}
                                                    withIcon={false}
                                                    buttonText='Зураг оруулах'
                                                    onChange={(e) =>this.onDrop(e, 'zurag_omno')}
                                                    imgExtension={['.jepg', '.jpg', '.png']}
                                                    maxFileSize={1529173}
                                                    singleImage={true}
                                                    label=''
                                                    fileSizeError='Хэт их байна "1MB" зураг'
                                                    fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                                />
                                            </th>
                                        </tr>
                                        <tr>
                                            <th style={{width: "5%"}} scope="row">6.</th>
                                            <th style={{width: "15%"}}>Сэргээх талаар таны санал:</th>
                                            <td colSpan="4" scope="rowgroup">
                                                <Field
                                                    className={'form-control ' +
                                                        (errors.sergeeh_sanal &&
                                                            touched.sergeeh_sanal ? ' is-invalid' : '')}
                                                    as="select"
                                                    name='sergeeh_sanal'
                                                    id="sergeeh_sanal"
                                                    type="textarea"
                                                >
                                                    <option value="">--- Сонгоно уу ---</option>
                                                    <option value="Шаардлагагүй">Шаардлагагүй</option>
                                                    <option value="Сэргээх">Сэргээх</option>
                                                    <option value="Шилжүүлэх">Шилжүүлэх</option>
                                                    <option value="Шинээр байгуулах">Шинээр байгуулах</option>
                                                </Field>
                                                <ErrorMessage name="sergeeh_sanal" component="div" className="invalid-feedback"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{width: "5%"}} scope="row">7.</th>
                                            <th style={{width: "15%"}}>GPS-ийн хэмжилт хийх боломжтой эсэх:</th>
                                            <td colSpan="2" scope="rowgroup">
                                                <div className="col-md-12">
                                                    <input
                                                        type="checkbox"
                                                        id="hemjilt_hiih_bolomj1"
                                                        checked={this.state.hemjilt_hiih_bolomj ? true : false}
                                                        onChange={(e) => this.handleCheckGroup('hemjilt_hiih_bolomj', e, true)}
                                                    ></input>
                                                    <label htmlFor="hemjilt_hiih_bolomj1">Тийм</label>
                                                    <br/>
                                                    <br/>
                                                    <input
                                                        type="checkbox"
                                                        id="hemjilt_hiih_bolomj2"
                                                        checked={this.state.hemjilt_hiih_bolomj ? false : true}
                                                        onChange={(e) => this.handleCheckGroup('hemjilt_hiih_bolomj', e, false)}
                                                    >
                                                    </input>
                                                    <label htmlFor="hemjilt_hiih_bolomj2">Үгүй</label>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div>
                                <button type="submit" className="btn gp-btn-primary m-2" disabled={isSubmitting || has_error}>
                                    {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                    {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                    {!isSubmitting && 'Нэмэх' }
                                </button>
                                </div>
                                <datalist id="tsegList">
                                    {this.datalist}
                                </datalist>
                            </div>
                    </Form>
                )}
            }
            </Formik>
        )
    }
}