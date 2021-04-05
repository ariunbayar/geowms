import React, { Component } from "react"
import ImageUploader from 'react-images-upload'
import {NavLink} from "react-router-dom"
import { Formik, Form, Field, ErrorMessage} from 'formik'

import {service} from './service'
import {validationSchemaAdmin} from './validationSchema'
import ModalAlert from "@utils/Modal/ModalAlert"


export class FormTseg extends Component {

    constructor(props) {
        super(props)
        this._isMounted = false;
        this.datalist = []
        this.error_msg = []
        this.bairlal_msg = []
        this.state = {
            id: -1,
            values:{
                email: '',
                baiguulaga: '',
                alban_tushaal: '',
                utas: '',
                evdersen_baidal: '',
                nohtsol_baidal: '',
                sergeeh_sanal: '',
            },
            tsegiin_dugaar: '',
            oiroltsoo_bairlal: '',
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
            email_error_messege: false,
            tseg_dugaar_error: false,
            list:[],
            items:[],
            parse: [],
            checkError: [],
            showBox: true,
            error:{error:''},
            bairlal_error: false,
            ners:'',
            showMore: false,
            showTsegAlert: true,
            modal_alert_status: 'closed',
            timer: null,
        }
        this.handleInput = this.handleInput.bind(this)
        this.handleInputEmail = this.handleInputEmail.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleCheckGroup = this.handleCheckGroup.bind(this)
        this.handleGetAll=this.handleGetAll.bind(this)
        this.handleSearchWithTseg = this.handleSearchWithTseg.bind(this)
        this.optionVal = this.optionVal.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.checkAldaa = this.checkAldaa.bind(this)
        this.handleBoxLeave = this.handleBoxLeave.bind(this)
        this.handleBoxOver = this.handleBoxOver.bind(this)
        this.showMore = this.showMore.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
    }

    componentDidMount(){
        this._isMounted = true;
        const id = this.props.data.match.params.id
        if(id){
            this._isMounted && this.setState({id})
        }
        this._isMounted && this.handleGetAll(id)

        setTimeout(() => {
            this._isMounted && this.setState({ showBox: false, showTsegAlert: false })
        }, 2000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    showMore(){
        this.setState({showMore: !this.state.showMore})
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
        if(e.target.value.length >= 0){
            // service.searchTseg(e.target.value).then(({items, names}) => {
            //     if(items !== false){
            //         this.setState({items, tseg_dugaar_error:false , checkError:[] })
            //         const oiroltsoo_bairlal = names[0]['aimag_ner'] + ' аймгийн ' + names[0]['sum_ner'] + ' сум, '
            //         this.setState({oiroltsoo_bairlal})
            //         this.optionVal(items)
            //     }
            //     else{
            //         this.setState({ tseg_dugaar_error: true, checkError: this.state.error })
            //     }
            // })
        }
    }

    optionVal(items){
        this.datalist = []
        items.map((item, key) => {
            this.datalist.push(<option key={key} value={item.tseg}></option>)
        })
    }

    checkAldaa(){
        const error = this.state.tseg_dugaar_error
        if(error == true){
            this.setState({ tseg_dugaar_error: true, checkError: error })
        }
        else{
            this.setState({ tseg_dugaar_error:false , checkError:[] })
        }
    }

    async handleGetAll(id){
        if(id){
            this._isMounted &&  this.setState({id})
            service.tsegustsanEdit(id).then(({ form_data }) => {
                if (form_data) {
                    form_data.map((tseg) => {
                        service.searchTseg(tseg.tseg_id).then(({success, names})=>{
                            if(success){
                                this.setState({ ners: names})
                            }
                        })
                        this._isMounted && this.setState({
                            values:{
                                email:tseg.email,
                                baiguulaga:tseg.name,
                                alban_tushaal:tseg.alban_tushaal,
                                utas: tseg.utas,
                                evdersen_baidal:tseg.evdersen_baidal,
                                nohtsol_baidal:tseg.nohtsol_baidal,
                                sergeeh_sanal: tseg.sergeeh_sanal,
                            },
                            oiroltsoo_bairlal: tseg.oiroltsoo_bairlal,
                            tsegiin_dugaar: tseg.tseg_id,
                            hemjilt_hiih_bolomj: tseg.gps_hemjilt,
                            zurag_hol_prev: tseg.img_holoos,
                            zurag_oir_prev: tseg.img_oiroos,
                            zurag_baruun_prev: tseg.img_baruun,
                            zurag_zuun_prev: tseg.img_zuun,
                            zurag_hoid_prev: tseg.img_hoino,
                            zurag_omno_prev: tseg.img_omno,
                            zurag_hol: tseg.img_holoos,
                            zurag_oir: tseg.img_oiroos,
                            zurag_baruun: tseg.img_baruun,
                            zurag_zuun: tseg.img_zuun,
                            zurag_hoid: tseg.img_hoino,
                            zurag_omno: tseg.img_omno,
                            edit:true,
                            checkError:[]
                        })
                    })
                }
            })
        }
    }

    handleSubmit(values, { setStatus, setSubmitting }){
        setStatus('checking')
        setSubmitting(true)
        const form_datas = new FormData()
        this.setState({values})
        form_datas.append('id', this.state.id)
        form_datas.append('email', values.email)
        form_datas.append('baiguulaga', values.baiguulaga)
        form_datas.append('alban_tushaal', values.alban_tushaal)
        form_datas.append('utas', values.utas)
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
                setStatus('saved')
                setSubmitting(false)
                this.setState({modal_alert_status: 'open'})
                this.modalCloseTime()
            }
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

    handleInputEmail(field, e) {

        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test(e.target.value))
        {
            this.setState({emailErrorMessege:false , [field]: e.target.value})
        }
        else{
            this.setState({email_error_messege: true, checkError: this.state.error })
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

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
            this.props.data.history.push( `/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/`)
        }, 2000)
    }

    modalClose(){
        clearTimeout(this.state.timer)
        this.setState({modal_alert_status: "closed"})
        this.props.data.history.push( `/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/`)
    }

    render() {
        const{id,zurag_hol_prev, zurag_oir_prev, zurag_baruun_prev,
            zurag_zuun_prev, zurag_hoid_prev, zurag_omno_prev,
            tseg_dugaar_error, oiroltsoo_bairlal, bairlal_error,
            showMore
        } = this.state
        return (
            <Formik
                initialValues={this.state.values}
                enableReinitialize
                validationSchema={validationSchemaAdmin}
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
                        <div className="container p-3 card">
                            <div className="card-body">
                                <div className="row ml-3">
                                    <div className="col-md-12 mb-4 mt-4">
                                        <NavLink to={`/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/`} className='btn gp-outline-primary '>
                                                <i className="fa fa-angle-double-left"></i> Буцах
                                        </NavLink>
                                    </div>
                                    <h4>Таны мэдээлэл</h4>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th style={{width: "5%"}} scope="row">1.</th>
                                            <th style={{width: "15%"}}>Имэйл хаяг</th>
                                        <td>
                                                <Field
                                                    name="email"
                                                    type="text"
                                                    id="id_email"
                                                    className={'form-control' +
                                                        (errors.email &&
                                                            touched.email ? ' is-invalid' : '')}
                                                />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th style={{width: "5%"}} scope="row">2.</th>
                                                <th style={{width: "15%"}}>Албан байгууллага</th>
                                                <td>
                                                    <Field
                                                        name="baiguulaga"
                                                        type="text"
                                                        id="id_baiguulaga"
                                                        className={'form-control' +
                                                            (errors.baiguulaga &&
                                                                touched.baiguulaga ? ' is-invalid' : '')}
                                                    />
                                                    <ErrorMessage name="baiguulaga" component="div" className="invalid-feedback" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th style={{width: "5%"}} scope="row">2.</th>
                                                <th style={{width: "15%"}}>Албан тушаал</th>
                                                <td>
                                                    <Field
                                                        name="alban_tushaal"
                                                        type="text"
                                                        id='id_alban_tushaal'
                                                        className={'form-control' +
                                                            (errors.alban_tushaal &&
                                                                touched.alban_tushaal ? ' is-invalid' : '')}
                                                    />
                                                    <ErrorMessage name="alban_tushaal" component="div" className="invalid-feedback" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th style={{width: "5%"}} scope="row">2.</th>
                                                <th style={{width: "15%"}}>Утасны дугаар</th>
                                                <td>
                                                    <Field
                                                        name="utas"
                                                        type="text"
                                                        id="id_utas"
                                                        className={'form-control' +
                                                            (errors.alban_tushaal &&
                                                                touched.alban_tushaal ? ' is-invalid' : '')}
                                                    />
                                                    <ErrorMessage name="utas" component="div" className="invalid-feedback" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h4>Устсан цэгт тэмдэгтийн мэдээлэл</h4>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th style={{width: "5%"}} scope="row">1.</th>
                                                <th style={{width: "15%"}}>Цэгийн дугаар:</th>
                                                <td colSpan="4" scope="rowgroup">
                                                    <div className="input-group">
                                                        <input
                                                            name="tsegiin_dugaar"
                                                            type="text"
                                                            id="tsegiin_dugaar"
                                                            autoComplete="off"
                                                            list="tsegList"
                                                            className={'form-control' + (tseg_dugaar_error || this.error_msg.length > 0 ? ' is-invalid' : '')}
                                                            onChange={(e) => this.handleSearchWithTseg('tsegiin_dugaar', e)}
                                                            value = {this.state.tsegiin_dugaar}
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
                                                        {tseg_dugaar_error? <div className="invalid-feedback">Уучлаарай ийм нэртэй "Цэгийн дугаар алга" Дахин шалгана уу.</div> : null}
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
                                                        id="id_evdersen_baidal"
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
                                                    <ErrorMessage name="oiroltsoo_bairlal" component="div" className="invalid-feedback" />
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
                                                        id="id_nohtsol_baidal"
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
                                                        onMouseOver={(e) => this.handleBoxOver('zurag',e)}
                                                        onMouseLeave={(e) => this.handleBoxLeave('zurag',e)}
                                                        className="float-right"
                                                    >
                                                    <i className="fa fa-exclamation-circle float-right">
                                                        <div className={`alert alert-dark rounded position-absolute d-none`+
                                                                    `${this.state.showBox ? " d-block" : ""}`}
                                                                    style={{zIndex:'1'}}
                                                                    role="alert"
                                                        >
                                                            <h6 className="alert-heading">Санамж!</h6>
                                                            <p> Зургийн хэмжээ "1MB" байна. ".jpeg" болон ".png" байх ёстой</p>
                                                        </div>
                                                    </i>
                                                    </div>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className="text-center" colSpan="2" scope="rowgroup">холоос</th>
                                                <th className="text-center" colSpan="2" scope="rowgroup">ойроос</th>
                                            </tr>
                                            <tr>
                                                <th colSpan="2" scope="rowgroup" style={{width: "50%"}}>
                                                    <ImageUploader
                                                        withPreview={true}
                                                        withIcon={false}
                                                        buttonText='Зураг оруулах'
                                                        onChange={(e) =>this.onDrop(e, 'zurag_hol')}
                                                        imgExtension={['.jepg', '.png']}
                                                        maxFileSize={1529173}
                                                        singleImage={true}
                                                        label=''
                                                        fileSizeError='Хэт их байна "1MB" зураг'
                                                        fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                                    />
                                                    {
                                                        id >= 0 ?
                                                            zurag_hol_prev ?
                                                                <center><img src={zurag_hol_prev} width="150px" height="100px"/></center>
                                                            :
                                                            <center><label className="text-primary">Зураг байхгүй байна.</label></center>
                                                        :
                                                        null
                                                    }
                                                </th>
                                                <th colSpan="2" scope="rowgroup">
                                                    <ImageUploader
                                                        withPreview={true}
                                                        withIcon={false}
                                                        buttonText='Зураг оруулах'
                                                        onChange={(e) =>this.onDrop(e, 'zurag_oir')}
                                                        imgExtension={['.jpg', '.png']}
                                                        maxFileSize={1529173}
                                                        singleImage={true}
                                                        label=''
                                                        fileSizeError='Хэт их байна "1MB" зураг'
                                                        fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                                    />
                                                    {
                                                        id >= 0
                                                        ?
                                                        zurag_oir_prev ?
                                                        <center><img src={zurag_oir_prev} width="150px" height="100px"/></center>:
                                                        <center><label className="text-primary">Зураг байхгүй байна.</label></center>
                                                        :
                                                        null
                                                    }
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
                                                <th className="text-center" colSpan="2" scope="rowgroup">Баруун</th>
                                                <th className="text-center" colSpan="2" scope="rowgroup">Зүүн</th>
                                            </tr>
                                            <tr className={showMore ? 'd-show' : "d-none"}>
                                                <th colSpan="2" scope="rowgroup">
                                                    <ImageUploader
                                                        withPreview={true}
                                                        withIcon={false}
                                                        buttonText='Зураг оруулах'
                                                        onChange={(e) =>this.onDrop(e, 'zurag_baruun')}
                                                        imgExtension={['.jpg', '.png']}
                                                        maxFileSize={1529173}
                                                        singleImage={true}
                                                        label=''
                                                        fileSizeError='Хэт их байна "1MB" зураг'
                                                        fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                                    />
                                                    {
                                                        id >= 0
                                                        ?
                                                        zurag_baruun_prev ?
                                                        <center><img src={zurag_baruun_prev} width="150px" height="100px"/></center>:
                                                        <center><label className="text-primary">Зураг байхгүй байна.</label></center>
                                                        :
                                                        null
                                                    }
                                                </th>
                                                <th colSpan="2" scope="rowgroup">
                                                    <ImageUploader
                                                        withPreview={true}
                                                        withIcon={false}
                                                        buttonText='Зураг оруулах'
                                                        onChange={(e) =>this.onDrop(e, 'zurag_zuun')}
                                                        imgExtension={['.jpg', '.png']}
                                                        maxFileSize={5529173}
                                                        singleImage={true}
                                                        label=''
                                                        fileSizeError='Хэт их байна "1MB" зураг'
                                                        fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                                    />
                                                    {
                                                        id >= 0
                                                        ?
                                                        zurag_zuun_prev ?
                                                        <center><img src={zurag_zuun_prev} width="150px" height="100px"/></center>:
                                                        <center><label className="text-primary">Зураг байхгүй байна.</label></center>
                                                        :
                                                        null
                                                    }
                                                </th>
                                            </tr>
                                            <tr className={showMore ? 'd-show' : "d-none"}>
                                                <th className="text-center" colSpan="2" scope="rowgroup">Хойно</th>
                                                <th className="text-center" colSpan="2" scope="rowgroup">Өмнө</th>
                                            </tr>
                                            <tr className={showMore ? 'd-show' : "d-none"}>
                                                <th colSpan="2" scope="rowgroup">
                                                    <ImageUploader
                                                        withPreview={true}
                                                        withIcon={false}
                                                        buttonText='Зураг оруулах'
                                                        onChange={(e) =>this.onDrop(e, 'zurag_hoid')}
                                                        imgExtension={['.jpg', '.png']}
                                                        maxFileSize={5529173}
                                                        singleImage={true}
                                                        label=''
                                                        fileSizeError='Хэт их байна "1MB" зураг'
                                                        fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                                    />
                                                    {
                                                        id >= 0
                                                        ?
                                                        zurag_hoid_prev ?
                                                        <center><img src={zurag_hoid_prev} width="150px" height="100px"/></center>:
                                                        <center><label className="text-primary">Зураг байхгүй байна.</label></center>
                                                        :
                                                        null
                                                    }
                                                </th>
                                                <th colSpan="2" scope="rowgroup">
                                                    <ImageUploader
                                                        withPreview={true}
                                                        withIcon={false}
                                                        buttonText='Зураг оруулах'
                                                        onChange={(e) =>this.onDrop(e, 'zurag_omno')}
                                                        imgExtension={['.jpg', '.png']}
                                                        maxFileSize={1529173}
                                                        singleImage={true}
                                                        label=''
                                                        fileSizeError='Хэт их байна "1MB" зураг'
                                                        fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                                    />
                                                    {
                                                        id >= 0
                                                        ?
                                                        zurag_omno_prev ?
                                                        <center><img src={zurag_omno_prev} width="150px" height="100px"/></center>:
                                                        <center><label className="text-primary">Зураг байхгүй байна.</label></center>
                                                        :
                                                        null
                                                    }
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
                                                        id="id_sergeeh_sanal"
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
                                                            value={this.state.hemjilt_hiih_bolomj}
                                                        ></input>
                                                        <label htmlFor="hemjilt_hiih_bolomj1">Тийм</label>
                                                        <br/>
                                                        <br/>
                                                        <input
                                                            type="checkbox"
                                                            id="hemjilt_hiih_bolomj2"
                                                            checked={this.state.hemjilt_hiih_bolomj ? false : true}
                                                            onChange={(e) => this.handleCheckGroup('hemjilt_hiih_bolomj', e, false)}
                                                            value={this.state.hemjilt_hiih_bolomj}
                                                        ></input>
                                                        <label htmlFor="hemjilt_hiih_bolomj2">Үгүй</label>
                                                    </div>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                    <div>
                                    <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting || has_error}>
                                                {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                                {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                                {!isSubmitting && 'Нэмэх' }
                                    </button>
                                    </div>
                                    <datalist id="tsegList">
                                        {this.datalist}
                                    </datalist>
                            </div>
                        </div>
                        <ModalAlert
                            modalAction={() => this.modalClose()}
                            status={this.state.modal_alert_status}
                            title="Амжилттай нэмлээ"
                            model_type_icon = "success"
                        />
                    </div>
                    </Form>
                )}
            }
            </Formik>
        )
    }
}
