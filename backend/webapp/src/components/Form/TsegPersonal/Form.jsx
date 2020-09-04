import React, { Component, Fragment } from "react"
import ImageUploader from 'react-images-upload'
import {service} from '../service'
import {validationSchema} from './validationSchema'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import BundleMap from '../../map/BundleMap'
import { coordinateRelationship } from "ol/extent"

export class Forms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: '',
            values:{
                tesgiin_ner: '',
                toviin_dugaar: '',
             
                suljeenii_torol: '',
                
               
               
                sudalga_or_shine: '',
                hors_shinj_baidal: '',
                date: '',
                hotolson: '',
                alban_tushaal: '',
                alban_baiguullga: '',
                center_typ: '',
                pid: '',
            },

            utmx: '',
            utmy: '',
            latlongx: "",
            latlongy: '',
            trapetsiin_dugaar: '',
            sum_name: '',
            barishil_tuhai: '',

            real_sum: '',
            aimag_name: '',
            sum_ners: '',
            file_path1: null,
            file_path11: null,
            file_path1_error: false,
            file_path2: null,
            file_path22: null,
            file_path2_error: false,
            tseg_oiroos_img_url: '',
            tseg_holoos_img_url: '',
            tseg_holoos_img_url_zurag: '',
            tseg_oiroos_img_url_zurag: '',
            bairshil_tseg_oiroos_img_url: '',
            bairshil_tseg_holoos_img_url: '',
            bairshil_tseg_holoos_img_url_zurag: '',
            bairshil_tseg_oiroos_img_url_zurag: '',
            name_error: false,
            id_error: false,

        }
        this.onDrop = this.onDrop.bind(this)
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.tsegUpdate = this.tsegUpdate.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleXY = this.handleXY.bind(this)
    }
    componentDidMount(){
        const id = this.props.match.params.id
        if(id) {
            this.setState({id})
            this.tsegUpdate(id)
        }
    }

    handleXY(values, info){
        info.map(e=>this.setState({
            utmx:e.E,
            utmy:e.N,
            trapetsiin_dugaar: e.vseg,
            sum_name:e.sum,
        }))
        this.setState({
            latlongy:values[0],
            latlongx:values[1],
            aimag_name:info[0]['aimag'],

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
    
    onChangeHandler(e, name){
        const file = e.target.files[0]
        var re = /^[a-z A-Z 0-9]+[a-z A-Z 0-9]+[a-z A-Z 0-9]+[a-z A-Z 0-9]+[0-9]+[0-9]+[0-9]+[a-z A-Z 0-9]+[.]+[0-9]+[0-9]+[a-z A-Z 0-9]+$/
        this.setState({[name+'_error']: false, [name]: file })
        if(file['name'].length === 12)
        {
            if(re.test(file['name']) )
            {
                
                this.setState({[name+'_error']: false, [name]: data })
            }
            else{
                this.setState({[name+'_error']: true})
            }
        }
        else{
            this.setState({[name+'_error']: true})
        }
    }

    
    handleSubmit(values, { setStatus, setSubmitting }) {

        setStatus('checking')
        setSubmitting(true)
        const form_datas = new FormData() 
        this.setState({values})
        form_datas.append('file1', this.state.file_path1)
        form_datas.append('file2', this.state.file_path2)
        form_datas.append('tesgiin_ner', this.state.tesgiin_ner)
        form_datas.append('idx', this.state.id)
        form_datas.append('toviin_dugaar', this.state.toviin_dugaar)
        form_datas.append('trapetsiin_dugaar', this.state.values.trapetsiin_dugaar)
        form_datas.append('center_typ', this.state.values.center_typ)
        form_datas.append('pid', this.state.values.pid)
        form_datas.append('suljeenii_torol', this.state.values.suljeenii_torol)
        form_datas.append('aimag_name', this.state.aimag_name)
        form_datas.append('sum_name', this.state.values.sum_name)
        form_datas.append('utmx', this.state.values.utmx)
        form_datas.append('utmy', this.state.values.utmy)
        form_datas.append('latlongx', this.state.values.latlongx)
        form_datas.append('latlongy', this.state.values.latlongy)
        form_datas.append('tseg_oiroos_img_url', this.state.tseg_oiroos_img_url)
        form_datas.append('tseg_holoos_img_url', this.state.tseg_holoos_img_url)
        form_datas.append('barishil_tuhai', this.state.values.barishil_tuhai)
        form_datas.append('bairshil_tseg_oiroos_img_url', this.state.bairshil_tseg_oiroos_img_url)
        form_datas.append('bairshil_tseg_holoos_img_url', this.state.bairshil_tseg_holoos_img_url)
        form_datas.append('sudalga_or_shine', this.state.values.sudalga_or_shine)
        form_datas.append('hors_shinj_baidal', this.state.values.hors_shinj_baidal)
        form_datas.append('date', this.state.values.date)
        form_datas.append('hotolson', this.state.values.hotolson)
        form_datas.append('alban_tushaal', this.state.values.alban_tushaal)
        form_datas.append('alban_baiguullga', this.state.values.alban_baiguullga)
        const id = this.props.match.params.id
        service.tsegPersonal(form_datas).then(({success, name, ids}) => {
            if (success) {
                setTimeout(() => {
                    setStatus('saved')
                    setSubmitting(false)
                    this.props.history.push('/back/froms/tseg-personal/')
                }, 1000)
            }
            else{
                setSubmitting(false)
            }

            if(name){
                alert('Энэхүү цэг мэдээллийн санд байна.')
                this.setState({name_error:true})
            }
            else{
                this.setState({name_error:false})
            }

            if(ids){
                alert('Энэхүү төвийн дугаар мэдээллийн санд байна.')
                this.setState({id_error:true})
            }
            else{
                this.setState({id_error:false})
            }

        })
    }
    tsegUpdate(id){
        service.updateTseg(id).then(({tseg_display}) =>{
            if(tseg_display){
                tseg_display.map((item, idx) =>
                    this.setState({ 
                        values : {
                            tesgiin_ner: item.point_name,
                            pid: item.pid,
                            center_typ: item.center_typ,
                            
                            trapetsiin_dugaar: item.sheet1,
                            toviin_dugaar: item.objectid,
                            latlongx: item.sheet2,
                            latlongy: item.sheet3,
                            suljeenii_torol: item.point_type,
                            utmx: item.utmx,
                            utmy: item.utmy,
                            latlongx: item.latlongx,
                            latlongy: item.latlongy,
                            barishil_tuhai: item.barishil_tuhai,
                            sudalga_or_shine: item.sudalga_or_shine,
                            hors_shinj_baidal: item.hors_shinj_baidal,
                            date: item.date,
                            hotolson: item.hotolson,
                            alban_tushaal: item.alban_tushaal,
                            alban_baiguullga: item.alban_baiguullga,
                        },
                        sum_name: item.sum,
                        aimag_name: item.aimag,
                        tseg_oiroos_img_url_zurag: item.tseg_oiroos_img_url,
                        tseg_holoos_img_url_zurag: item.tseg_holoos_img_url,
                
                        bairshil_tseg_oiroos_img_url_zurag: item.bairshil_tseg_oiroos_img_url,
                        bairshil_tseg_holoos_img_url_zurag: item.bairshil_tseg_holoos_img_url,
            
                        file_path11: item.file_path1,
                        file_path22: item.file_path2,
                        
                    })
                )
            }
        })
    }

    render() {
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
            console.log("EROROROORR", errors)
            console.log(this.state.values)
            return (
                <Form>
                    <div className="row container  my-1">
                        <div className="float-left">
                            <BundleMap
                            handleXY={this.handleXY}
                            />
                        </div>
                        <div className="col-md-12 mb-4">
                            <a href="#" className="btn gp-outline-primary" onClick={this.props.history.goBack}>
                                <i className="fa fa-angle-double-left"></i> Буцах
                            </a>
                        </div>
                        <h4>Цэгийн хувийн хэрэг</h4>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th style={{width: "5%"}} scope="row">1</th>
                                    <th style={{width: "15%"}}>Цэгийн нэр</th>
                                    <td>
                                        <Field
                                            className={'form-control ' + (errors.tesgiin_ner ? 'is-invalid' : '')}
                                            name='tesgiin_ner'
                                            id="id_tesgiin_ner"
                                            type="text"
                                        />
                                        <ErrorMessage name="tesgiin_ner" component="div" className="invalid-feedback"/>
                                            {this.state.name_error ? <a className='text-danger'>Давхцаж байна.</a> : null}
                                    </td>
                                    <th style={{width: "5%"}} scope="row">2</th>
                                    <th>Төвийн дугаар</th>
                                    <td>
                                        <Field
                                            className={'form-control ' + (errors.toviin_dugaar ? 'is-invalid' : '')}
                                            name='toviin_dugaar'
                                            id="id_toviin_dugaar"
                                            type="number"
                                        />
                                        {this.state.id_error ? <a className='text-danger'>Давхцаж байна.</a>  : null}
                                        <ErrorMessage name="toviin_dugaar" component="div" className="invalid-feedback"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: "5%"}} scope="row">3</th>
                                    <th>Трапецийн дугаар(1:100000)</th>
                                    <td>
                                        <input
                                            className={'form-control ' + (errors.trapetsiin_dugaar ? 'is-invalid' : '')}
                                            name='trapetsiin_dugaar'
                                            id="id_trapetsiin_dugaar"
                                            disabled={true}
                                            type="text"
                                            value={this.state.trapetsiin_dugaar}
                                        />
                                       
                                    </td>
                                    <th style={{width: "5%"}} scope="row">4</th>
                                    <th>Сүлжээний төрөл</th>
                                    <td>
                                        <Fragment>
                                            <Field name="suljeenii_torol" as="select" className="form-control"
                                            className={'form-control ' + (errors.suljeenii_torol ? 'is-invalid' : '')}>
                                                
                                                <option>...</option>
                                                <option>GPS</option>
                                                <option>GPS1</option>
                                                <option>GPS2</option>
                                                <option>GPS3</option>
                                                <option>GPS4</option>
                                                <option>GPS5</option>
                                                <option>GPS6</option>
                                            </Field>
                                            <ErrorMessage name="suljeenii_torol" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                    </td>
                                </tr>

                                <tr>
                                    <th style={{width: "5%"}} scope="row">5</th>
                                    <th>Аймаг</th>
                                    <td colSpan="1" scope="rowgroup">
                                    <input
                                            className={'form-control '}
                                            name='aimag_name'
                                            id="aimag_name"
                                            disabled={true}
                                            type="text"
                                            value={this.state.aimag_name}
                                        />      

                                    </td>
                                    <th>Сум</th>
                                    <td colSpan="2" scope="rowgroup">
                                        <input
                                            className={'form-control '}
                                            name='sum_name'
                                            id="sum_name"
                                            type="text"
                                            disabled={true}
                                            value={this.state.sum_name || ''}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <th rowSpan="4" scope="rowgroup" style={{width: "5%"}} scope="row">6</th>
                                    <th rowSpan="4" scope="rowgroup">Солбилцол WGS-84 /UTM/</th>
                                    <th colSpan="2" style={{textAlign:'center'}}>
                                    UTM-E
                                    </th>
                                    <th colSpan="2" scope="rowgroup" style={{textAlign:'center'}}>
                                    UTM-N
                                    </th>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <input
                                            className={'form-control '}
                                            name='utmx'
                                            id="id_utmx"
                                            disabled={true}
                                            type="number"
                                            value={this.state.utmx}
                                        />
                                    </td>
                                    <td colSpan="2" scope="rowgroup">
                                        <input
                                            className={'form-control '}
                                            name='utmy'
                                            id="id_utmy"
                                            disabled={true}
                                            type="number"
                                            value={this.state.utmy}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="2" style={{textAlign:'center'}}>Longitude -x</th>
                                    <th colSpan="2" scope="rowgroup" style={{textAlign:'center'}}>Latitude-y</th>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <input
                                            className={'form-control ' }
                                            name='latlongx'
                                            id="id_latlongx"
                                            disabled={true}
                                            type="number"
                                            value ={this.state.latlongx}
                                        />
                                    </td>
                                    <td colSpan="2" scope="rowgroup">
                                        <input
                                            className={'form-control ' }
                                            name='latlongy'
                                            disabled={true}
                                            id="id_latlongy"
                                            type="number"
                                            value ={this.state.latlongy}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="3" scope="rowgroup">8. Өндөр</th>
                                    <th colSpan="3" scope="rowgroup">9. pid</th>
                                </tr>
                                <tr>
                                    <th colSpan="3" scope="rowgroup">
                                        <Field
                                            className={'form-control ' + (errors.center_typ ? 'is-invalid' : '')}
                                            name='center_typ'
                                            id="id_center_typ"
                                            type="text"
                                        />
                                        <ErrorMessage name="center_typ" component="div" className="invalid-feedback"/>
                                    </th>
                                    <th colSpan="3" scope="rowgroup">
                                        <Field
                                                className={'form-control ' + (errors.pid ? 'is-invalid' : '')}
                                                name='pid'
                                                id="id_pid"
                                                type="text"
                                            />
                                        <ErrorMessage name="pid" component="div" className="invalid-feedback"/>
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan="7" scope="rowgroup" style={{textAlign: "center"}}>10. Цэгийн фото зураг</th>
                                </tr>
                                <tr>
                                    <th style={{textAlign: "center"}} colSpan="3" scope="rowgroup">ойроос</th>
                                    <th style={{textAlign: "center"}} colSpan="3" scope="rowgroup">холоос</th>
                                </tr>
                                <tr>
                                    <td colSpan="3" scope="rowgroup" style={{height: "200px"}}>
                                        

                                    <div className="form-group">
                                        <ImageUploader
                                            withPreview={true}
                                            withIcon={false}
                                            buttonText='Зураг оруулах'
                                            onChange={(e) =>this.onDrop(e, 'tseg_oiroos_img_url')}
                                            imgExtension={['.jpeg', '.png']}
                                            maxFileSize={5242880}
                                            singleImage={true}
                                            label=''
                                        />
                                        {
                                        this.state.tseg_oiroos_img_url_zurag ?
                                        <center><img src={this.state.tseg_oiroos_img_url_zurag} width="150px" height="100px"/></center>:
                                        <center><label>Зураг байхгүй байна.</label></center>
                                        }
                                    </div>

                                    </td>
                                    <td colSpan="3" scope="rowgroup">
                                        <ImageUploader
                                            withPreview={true}
                                            withIcon={false}
                                            buttonText='Зураг оруулах'
                                            onChange={(e) =>this.onDrop(e, 'tseg_holoos_img_url')}
                                            imgExtension={['.jpg', '.png']}
                                            maxFileSize={5242880}
                                            singleImage={true}
                                            label=''
                                        />
                                        {
                                        this.state.tseg_holoos_img_url_zurag ?
                                        <center><img src={this.state.tseg_holoos_img_url_zurag } width="150px" height="100px"/></center>:
                                        <center><label>Зураг байхгүй байна.</label></center>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{textAlign: "center"}} colSpan="2" scope="rowgroup">11. Байршлын тухай: </th>
                                    <th style={{textAlign: "center"}} colSpan="4" scope="rowgroup">
                                        <input
                                            className={'form-control ' }
                                            component="textarea"
                                            name='barishil_tuhai'
                                            id="id_barishil_tuhai"
                                            type="textarea"
                                            value={`${this.state.aimag_name}` + ', ' + `${this.state.sum_name}` + ' ' + `${this.state.barishil_tuhai}`}
                                        />

                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan="3" scope="rowgroup" style={{width: "50%"}}>12. Байршлын тойм зураг</th>
                                    <th colSpan="3" scope="rowgroup" style={{width: "50%"}}>13. Төв цэгийн хэлбэр</th>
                                </tr>
                                <tr>
                                    <td colSpan="3" scope="rowgroup" style={{height: "200px"}}>
                                        <ImageUploader
                                            withPreview={true}
                                            withIcon={false}
                                            buttonText='Зураг оруулах'
                                            onChange={(e) =>this.onDrop(e, 'bairshil_tseg_oiroos_img_url')}
                                            imgExtension={['.jpg', '.png']}
                                            maxFileSize={5242880}
                                            singleImage={true}
                                            label=''
                                        />
                                        {
                                        this.state.bairshil_tseg_oiroos_img_url_zurag ?
                                        <center><img src={this.state.bairshil_tseg_oiroos_img_url_zurag} width="150px" height="100px"/></center>:
                                        <center><label>Зураг байхгүй байна.</label></center>
                                        }
                                    </td>
                                    <td colSpan="3" scope="rowgroup">
                                        <ImageUploader
                                            withPreview={true}
                                            withIcon={false}
                                            buttonText='Зураг оруулах'
                                            onChange={(e) =>this.onDrop(e, 'bairshil_tseg_holoos_img_url')}
                                            imgExtension={['.jpg', '.png']}
                                            maxFileSize={5242880}
                                            singleImage={true}
                                            label=''
                                        />
                                        {
                                        this.state.bairshil_tseg_holoos_img_url_zurag ?
                                        <center><img src={this.state.bairshil_tseg_holoos_img_url_zurag} width="150px" height="100px"/></center>:
                                        <center><label>Зураг байхгүй байна.</label></center>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="1" scope="rowgroup">14.</th>
                                    <td colSpan="5" scope="rowgroup">
                                        <Fragment>
                                            <Field name="sudalga_or_shine" as="select" className="form-control"
                                            className={'form-control ' + (errors.sudalga_or_shine ? 'is-invalid' : '')}>
                                                
                                                <option>...</option>
                                                <option>Сэргээсэн</option>
                                                <option>Шинээр суулгасан</option>
                                            </Field>
                                            <ErrorMessage name="sudalga_or_shine" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="1" scope="rowgroup">15.</th>
                                    <th colSpan="2" scope="rowgroup">Хөрсний шинж байдал:</th>
                                    <td colSpan="3" scope="rowgroup">
                                        <Field
                                            className={'form-control ' + (errors.hors_shinj_baidal ? 'is-invalid' : '')}
                                            name='hors_shinj_baidal'
                                            id="id_hors_shinj_baidal"
                                            type="text"
                                        />
                                        <ErrorMessage name="hors_shinj_baidal" component="div" className="invalid-feedback"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="1" scope="rowgroup">16.</th>
                                    <th colSpan="2" scope="rowgroup">Цэг тэмдэгт судалгасан огноо:</th>
                                    <td colSpan="3" scope="rowgroup">
                                        <Field
                                            className={'form-control ' + (errors.date ? 'is-invalid' : '')}
                                            name='date'
                                            id="id_date"
                                            type="date"
                                        />
                                        <ErrorMessage name="date" component="div" className="invalid-feedback"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="1" scope="rowgroup">17.</th>
                                    <th colSpan="2" scope="rowgroup">Хувийн хэрэг хөтөлсөн:</th>
                                    <td colSpan="3" scope="rowgroup">
                                        <Field
                                            className={'form-control ' + (errors.hotolson ? 'is-invalid' : '')}
                                            name='hotolson'
                                            id="id_hotolson"
                                            type="text"
                                        />
                                        <ErrorMessage name="hotolson" component="div" className="invalid-feedback"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="1" scope="rowgroup">18.</th>
                                    <th colSpan="2" scope="rowgroup">Файл 1:</th>
                                    <td colSpan="3" scope="rowgroup">
                                        {this.state.file_path11 === '' ? null : <a href={`/media/${this.state.file_path11}`}>{this.state.file_path11}</a>}
                                        <input
                                            type="file"
                                            className={'form-control ' + (this.state.file_path1_error > 0 ? 'is-invalid' : '')}
                                            onChange={(e) => this.onChangeHandler(e, 'file_path1')}
                                        />
                                        {this.state.file_path1_error > 0 ? 
                                        <ul className="text-danger">
                                            <li>XXXXDDDS.YYo</li>
                                            <li>XXXX – Хэмжсэн цэгийн нэр</li>
                                            <li>DDD-Жилийн өдөр (GPS-ийн өдөр, 001-365)</li>
                                            <li>S-хэмжсэн хугацааны урт (0-9, а-Z)</li>
                                            <li>YY-хэмжилт хийсэн оны сүүлийн 2 орон (2018 үед 18 )Жишээ нь: gunt2170.18o</li>
                                        </ul>
                                        : null}
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="1" scope="rowgroup">19.</th>
                                    <th colSpan="2" scope="rowgroup">Файл 2:</th>
                                    <td colSpan="3" scope="rowgroup">
                                        {this.state.file_path22 === '' ? null : <a href={`/media/${this.state.file_path22}`}>{this.state.file_path22}</a>}
                                        <input
                                            type="file"
                                            className="form-control"
                                            className={'form-control ' + (this.state.file_path2_error > 0 ? 'is-invalid' : '')}
                                            onChange={(e) => this.onChangeHandler(e, 'file_path2')}
                                        />
                                        
                                        {this.state.file_path2_error > 0 ? 
                                        <ul className="text-danger">
                                            <li>XXXXDDDS.YYo</li>
                                            <li>XXXX – Хэмжсэн цэгийн нэр</li>
                                            <li>DDD-Жилийн өдөр (GPS-ийн өдөр, 001-365)</li>
                                            <li>S-хэмжсэн хугацааны урт (0-9, а-Z)</li>
                                            <li>YY-хэмжилт хийсэн оны сүүлийн 2 орон (2018 үед 18 )Жишээ нь: gunt2170.18o</li>
                                        </ul>
                                        : null}

                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="1" scope="rowgroup">20.</th>
                                    <th colSpan="2" scope="rowgroup">Албан байгууллага:</th>
                                    <td colSpan="3" scope="rowgroup">
                                        <Field
                                            className={'form-control ' + (errors.alban_baiguullga ? 'is-invalid' : '')}
                                            name='alban_baiguullga'
                                            id="id_alban_baiguullga"
                                            type="text"
                                        />
                                        <ErrorMessage name="alban_baiguullga" component="div" className="invalid-feedback"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="1" scope="rowgroup">21.</th>
                                    <th colSpan="2" scope="rowgroup">Албан тушаал:</th>
                                    <td colSpan="3" scope="rowgroup">
                                        <Field
                                            className={'form-control ' + (errors.alban_tushaal ? 'is-invalid' : '')}
                                            name='alban_tushaal'
                                            id="id_alban_tushaal"
                                            type="text"
                                        />
                                        <ErrorMessage name="alban_tushaal" component="div" className="invalid-feedback"/>
                                    </td>
                                </tr>
                            
                            </tbody>
                        </table>
                        <div className="span3">
                            {has_error
                                ?
                                    <p> </p>
                                : status == 'saved' && !dirty &&
                                    <p>
                                        Амжилттай нэмэгдлээ
                                    </p>
                            }
                            <div>
                                <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting || has_error}>
                                    {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                    {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                    {!isSubmitting && 'Нэмэх' }
                                </button>
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