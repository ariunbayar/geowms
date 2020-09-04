import React, { Component } from "react"
import ImageUploader from 'react-images-upload'
import {service} from '../service'
import { Formik, Form, Field, ErrorMessage} from 'formik'
import {validationSchemaDan} from './validationSchema'
export class DanForm extends Component {

    constructor(props) {
        super(props)

        this.datalist = []
        this.error_msg = []
        this.state = {
            id: -1,
            values:{
                oiroltsoo_bairlal: '',
                evdersen_baidal: '',
                nohtsol_baidal: '',
                sergeeh_sanal: '',
            },
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
            list:[],
            items:[],
            parse: [],
            checkError: [],
            showBox: true,
            error:{error:''},
            is_dan: false,
        }

        this.handleInput = this.handleInput.bind(this)
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
        this.checkUser = this.checkUser.bind(this)
    }

    componentDidMount(){
        const id = this.props.match.params.id
        if(id){
            this.setState({id})
        }
        this.handleGetAll(id)
        this.checkUser()
        setTimeout(() => {
            this.setState({ showBox: false })
        }, 1500);
    }

    handleSearchWithTseg(field, e) {
        this.setState({ [field]: e.target.value })
        if(e.target.value == ''){
            this.error_msg = []
            this.error_msg.push(<div className="invalid-feedback">Хоосон байна.</div>)
            if(this.error_msg.length > 0){
                this.setState({ checkError: this.state.error })
            }   
        }
        if(e.target.value.length > 2){
            this.error_msg = []
            service.searchTseg(e.target.value).then(items => {
                
                if(items.items !== false){
                    this.setState({items: items.items, tseg_dugaar_error:false , checkError:[] })
                    this.optionVal(items.items)
                }
                else{
                    this.setState({ tseg_dugaar_error: true, checkError: this.state.error  })
                }
            })
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
        if(!error){
            this.setState({ tseg_dugaar_error: true, checkError: error })
        }
        else{
            this.setState({ tseg_dugaar_error:false , checkError:[] })
        }
    }

    handleGetAll(id){
        if(id){
            this.setState({id:id})
            service.tsegustsanEdit(id).then(({ form_data }) => {
                if (form_data) {
                    form_data.map((tseg) => {
                        this.setState({
                            values:{
                                oiroltsoo_bairlal:tseg.oiroltsoo_bairlal,
                                evdersen_baidal:tseg.evdersen_baidal,
                                nohtsol_baidal:tseg.nohtsol_baidal,
                                sergeeh_sanal: tseg.sergeeh_sanal,
                            },
                            tsegiin_dugaar:tseg.tseg_id,
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

    checkUser(){
        service.checkDan().then(success => {
            this.setState({ is_dan: success.success })
        })
    }

    handleSubmit(values, { setStatus, setSubmitting }){
        setStatus('checking')
        setSubmitting(true)
        const form_datas = new FormData() 
        this.setState({values})
        const is_dan = this.state.is_dan
        if (is_dan == true) {
            form_datas.append('is_dan', this.state.is_dan)
        }
        form_datas.append('id', this.state.id)
        form_datas.append('tsegiin_dugaar', this.state.tsegiin_dugaar)
        form_datas.append('oiroltsoo_bairlal', values.oiroltsoo_bairlal)
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
                this.props.history.push( `/back/froms/tseg-ustsan/`)
            }
        })
    }

    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
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

    handleBoxOver (e){
        this.setState({ showBox: true })
    } 
    handleBoxLeave(e){
        this.setState({ showBox: false })
    }

    render() {
        const{id,zurag_hol_prev, zurag_oir_prev, zurag_baruun_prev, zurag_zuun_prev, zurag_hoid_prev, zurag_omno_prev, tseg_dugaar_error} = this.state
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
                    const checkError = this.state.checkError
                    const has_error = Object.keys(errors).length > 0
                    const error_bn = Object.keys(checkError).length > 0
                    return (
                    <Form>
                        <div className="row container  my-4">
                        <div className="col-md-12 mb-4">
                            <a href="#" className="btn gp-outline-primary" onClick={this.props.history.goBack}>
                                <i className="fa fa-angle-double-left"></i> Буцах
                            </a>
                        </div>
                        <h4>Цэгийн мэдээлэл</h4>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th style={{width: "5%"}} scope="row">1.</th>
                                    <th style={{width: "15%"}}>Цэгийн дугаар:</th>
                                    <td colSpan="4" scope="rowgroup">
                                        <input 
                                            name="tsegiin_dugaar" 
                                            type="number" 
                                            id="tsegiin_dugaar"
                                            list="tsegList"
                                            className={'form-control' + (tseg_dugaar_error || this.error_msg.length > 0 ? ' is-invalid' : '')} 
                                            onChange={(e) => this.handleSearchWithTseg('tsegiin_dugaar', e)}
                                            value = {this.state.tsegiin_dugaar}
                                        />
                                        {tseg_dugaar_error? <div className="invalid-feedback">Уучлаарай ийм нэртэй "Цэгийн дугаар алга" Дахин шалгана уу.</div> : null}
                                        {this.error_msg}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: "5%"}} scope="row">2.</th>
                                    <th style={{width: "15%"}}>Ойролцоо байрлал:</th>
                                    <td colSpan="4" scope="rowgroup">
                                        <Field 
                                            name="oiroltsoo_bairlal" 
                                            type="text" 
                                            id="oiroltsoo_bairlal"
                                            className={'form-control' + 
                                                (errors.oiroltsoo_bairlal && 
                                                    touched.oiroltsoo_bairlal ? ' is-invalid' : '')} 
                                        />
                                        <ErrorMessage name="oiroltsoo_bairlal" component="div" className="invalid-feedback" />
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
                                            <option>--- Сонгоно уу ---</option>
                                            <option>Эвдэрсэн</option>
                                            <option>Төв гэмтсэн</option>
                                            <option>Хазайсан</option>
                                            <option>Дарагдсан</option>
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
                                            onMouseOver={(e) => this.handleBoxOver(e)}
                                            onMouseLeave={(e) => this.handleBoxLeave(e)}
                                            className="float-right"
                                        >
                                        <i className="fa fa-exclamation-circle float-right">
                                            <div
                                                className={`p-3 mb-2 bg-secondary text-white rounded `+
                                                    `position-absolute d-none ${this.state.showBox ? " d-block" : ""}`}
                                            >
                                                300x300 байх шаардлагатай .jpg .png байх ёстой
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
                                            imgExtension={['.jepg', '.png']}
                                            maxFileSize={5242880}
                                            singleImage={true}
                                            label=''
                                            fileSizeError='Хэт их байна'
                                            fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                        />
                                        {
                                            id >= 0 ? 
                                            zurag_hol_prev ?
                                            <center><img src={zurag_hol_prev} width="150px" height="100px"/></center>:
                                            <center><label className="text-danger">Зураг байхгүй байна.</label></center>
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
                                            maxFileSize={5242880}
                                            singleImage={true}
                                            label=''
                                            fileSizeError='Хэт их байна'
                                            fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                        />
                                        {
                                            id >= 0 
                                            ? 
                                            zurag_oir_prev ?
                                            <center><img src={zurag_oir_prev} width="150px" height="100px"/></center>:
                                            <center><label className="text-danger">Зураг байхгүй байна.</label></center>
                                            :
                                            null
                                        }
                                    </th>
                                </tr>
                                <tr>
                                    <th style={{width: "5%"}} scope="row"></th>
                                    <th className="text-center" colSpan="2" scope="rowgroup">Баруун</th>
                                    <th className="text-center" colSpan="2" scope="rowgroup">Зүүн</th>
                                </tr>
                                <tr>
                                    <th style={{width: "5%"}} scope="row"></th>
                                    <th colSpan="2" scope="rowgroup">
                                        <ImageUploader
                                            withPreview={true}
                                            withIcon={false}
                                            buttonText='Зураг оруулах'
                                            onChange={(e) =>this.onDrop(e, 'zurag_baruun')}
                                            imgExtension={['.jpg', '.png']}
                                            maxFileSize={5242880}
                                            singleImage={true}
                                            label=''
                                            fileSizeError='Хэт их байна'
                                            fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                        />
                                        {
                                            id >= 0 
                                            ? 
                                            zurag_baruun_prev ?
                                            <center><img src={zurag_baruun_prev} width="150px" height="100px"/></center>:
                                            <center><label className="text-danger">Зураг байхгүй байна.</label></center>
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
                                            maxFileSize={5242880}
                                            singleImage={true}
                                            label=''
                                            fileSizeError='Хэт их байна'
                                            fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                        />
                                        {
                                            id >= 0 
                                            ? 
                                            zurag_zuun_prev ?
                                            <center><img src={zurag_zuun_prev} width="150px" height="100px"/></center>:
                                            <center><label className="text-danger">Зураг байхгүй байна.</label></center>
                                            :
                                            null
                                        }
                                        
                                    </th>
                                </tr>
                                <tr>
                                    <th style={{width: "5%"}} scope="row"></th>
                                    <th className="text-center" colSpan="2" scope="rowgroup">Хойно</th>
                                    <th className="text-center" colSpan="2" scope="rowgroup">Өмнө</th>
                                </tr>
                                <tr>
                                    <th style={{width: "5%"}} scope="row"></th>
                                    <th colSpan="2" scope="rowgroup">
                                        <ImageUploader
                                            withPreview={true}
                                            withIcon={false}
                                            buttonText='Зураг оруулах'
                                            onChange={(e) =>this.onDrop(e, 'zurag_hoid')}
                                            imgExtension={['.jpg', '.png']}
                                            maxFileSize={5242880}
                                            singleImage={true}
                                            label=''
                                            fileSizeError='Хэт их байна'
                                            fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                        />
                                        {
                                            id >= 0 
                                            ? 
                                            zurag_hoid_prev ?
                                            <center><img src={zurag_hoid_prev} width="150px" height="100px"/></center>:
                                            <center><label className="text-danger">Зураг байхгүй байна.</label></center>
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
                                            maxFileSize={5242880}
                                            singleImage={true}
                                            label=''
                                            fileSizeError='Хэт их байна'
                                            fileTypeError='энэ зураг буруу байна. Зөвхөн .jpeg, .png өргөтгөлтэй зураг'
                                        />
                                        {
                                            id >= 0 
                                            ? 
                                            zurag_omno_prev ?
                                            <center><img src={zurag_omno_prev} width="150px" height="100px"/></center>:
                                            <center><label className="text-danger">Зураг байхгүй байна.</label></center>
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
                                            id="sergeeh_sanal"
                                            type="textarea"
                                        >
                                            <option>--- Сонгоно уу ---</option>
                                            <option>Шаардлагагүй</option>
                                            <option>Сэргээх</option>
                                            <option>Шилжүүлэх</option>
                                            <option>Шинээр байгуулах</option>
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
                                                checked={this.state.hemjilt_hiih_bolomj ? true : false}
                                                onChange={(e) => this.handleCheckGroup('hemjilt_hiih_bolomj', e, true)}
                                                value={this.state.hemjilt_hiih_bolomj}
                                            ></input>
                                            <label>Тийм</label>
                                        </div>
                                    </td>
                                    <td colSpan="2" scope="rowgroup">
                                        <div className="col-md-12">
                                            <input 
                                                type="checkbox" 
                                                checked={this.state.hemjilt_hiih_bolomj ? false : true}
                                                onChange={(e) => this.handleCheckGroup('hemjilt_hiih_bolomj', e, false)}
                                                value={this.state.hemjilt_hiih_bolomj}
                                            ></input>
                                            <label>Үгүй</label>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                        <button type="submit" className="btn gp-btn-primary" onClick={this.checkAldaa}
                            disabled={isSubmitting || has_error || error_bn}>
                            {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                            {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                            {!isSubmitting && (id == -1)?'Нэмэх': 'засах'}
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