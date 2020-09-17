import React, { Component, Fragment } from "react"
import ImageUploader from 'react-images-upload'
import {service} from './service'
import {validationSchema} from './validationSchema'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import Maps from '../../map/Map'


export default class Forms extends Component {

    constructor(props) {
        super(props)
        this.datalist = []
        this.error_msg = []
        this.x = []
        this.state = {
            id: '',
            values:{
                suljeenii_torol: '',
                sudalga_or_shine: '',
                date: '',
                hotolson: '',
                alban_tushaal: '',
                alban_baiguullga: '',
                center_typ: '',
                ondor: '',
                ondor_torol: '',
                pid: '',
            },
            tesgiin_ner: '',
            toviin_dugaar: '',
            hors_shinj_baidal: '',
            BA:'',
            BB:'',
            BC:'',
            LA:'',
            LB:'',
            LC:'',
            zone: '',
            cc:'',
            latlongx: "",
            latlongy: '',
            trapetsiin_dugaar: '',
            sum_name: '',
            barishil_tuhai: '',
            real_sum: '',
            aimag_name: '',
            sum_ners: '',
            point_class: '',
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
            checkError:[],
            error_msg: '',
            error:{error:''},
            hors_error:false,
            names:[],
            points_ids:[],
            hors_shinj_baidal_list:[],
            checkNull:[],
            bairshil_error:false
        }
        this.onDrop = this.onDrop.bind(this)
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.tsegUpdate = this.tsegUpdate.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleXY = this.handleXY.bind(this)
        this.handleOnchange = this.handleOnchange.bind(this)
        this.handleBoxLeave = this.handleBoxLeave.bind(this)
        this.handleBoxOver = this.handleBoxOver.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.handleCoordinatCheck = this.handleCoordinatCheck.bind(this)
        this.handleSearchWithName = this.handleSearchWithName.bind(this)
        this.checkError = this.checkError.bind(this)
    }
    handleBoxOver (e){
        this.setState({ showBox: true })
    }

    handleBoxLeave(e){
        this.setState({ showBox: false })
    }

    componentDidMount(){
        const id = this.props.match.params.id
        if(id) {
            this.setState({id})
            this.tsegUpdate(id)
        }
    }

    optionVal(items){
        this.datalist = []
        items.map((item, key) => {
            this.datalist.push(<option key={key} value={item.tseg}></option>)
        })
    }


    handleSearchWithName(field, e) {
        this.setState({ [field]: e.target.value })
        if(e.target.value.length == 0){
            this.error_msg = []
            this.error_msg.push(<div className="text-danger">Хоосон байна.</div>)
            if(this.error_msg.length > 0){
                this.setState({ checkError: this.state.error })
            }
        }
        else{
            this.error_msg = []
        }
        if(e.target.value.length >= 1){
            this.error_msg = []
            const error =  this.state.error
            this.setState({ checkError: this.state.error })
            service.searchTsegName(e.target.name, e.target.value).then(({hors_shinj_baidal_list, point_ids, names}) => {
                if(names){
                    this.optionVal(names)
                    this.setState({names, name_error:true, checkError: error})
                }
                else if(names == false){
                    this.setState({ name_error: false, checkError:[]})
                }

                else if(point_ids){
                    this.optionVal(point_ids)
                    this.setState({id_error:true, checkError: error})
                }
                else if(point_ids == false){
                    this.setState({ id_error: false , checkError:[] })
                }

                else if(hors_shinj_baidal_list){
                    this.optionVal(hors_shinj_baidal_list)
                    this.setState({hors_shinj_baidal_list, hors_error:false , checkError:[] })
                }
                else{
                    this.setState({ hors_error: true, checkError: error})
                }
            })
        }
    }

    checkError(){
        const error = this.state.error
        if(this.state.tesgiin_ner == ''){
            alert("Цэгийн нэрийг оруулна уу  !!! ")
            this.setState({
                checkError:error,
            })
        }
        if(this.state.toviin_dugaar == ''){
            alert("Төвийн дугаарыг оруулна уу !!!")
            this.setState({
                checkError:error,
            })
        }

         if(this.state.hors_shinj_baidal == ''){
            alert(" Хөрсний шинж байдлыг тодорхойлно уу !!!")
            this.setState({
                checkError:error,
            })
        }

        if(this.state.barishil_tuhai.length <50){
            alert("Цэгийн байршлын тухай мэдээлэл нь багадаа 50 тэмдэгт байна !!!")
            this.setState({
                checkError:error,
            })
        }
        if(this.state.LA == '' || this.state.LB == '' || this.state.LC == '' || this.state.BA == '' || this.state.BB == '' || this.state.BC == '' ){
            alert("Солбицлын мэдээлэл дутуу байна !!!")
            this.setState({
                checkError:error
            })
        }

    }

    handleInput(e){
        if(e.target.name == 'barishil_tuhai'){
            if(e.target.value.length > 50){
                this.setState({
                    checkError:[]
                })
            }

        }
        if(e.target.name == 'BA' || e.target.name == 'BB' || e.target.name == 'BC' || e.target.name == 'LA' || e.target.name == 'LB' ||e.target.name == 'BB'){
            this.setState({
                checkError:[]
            })
        }
        this.setState({
            [e.target.name]:e.target.value,
        })
    }
    handleOnchange(e){
        if(e.target.name){
            this.setState({
                checkError:[]
            })
        }
        this.setState({
            [e.target.name]:parseFloat(e.target.value),
        })
    }

    handleCoordinatCheck(){
        const {BA, BB, BC, LA, LB, LC} = this.state
        if (BA > 40 && BB > 0 && BC > 0 && LA > 40 && LB > 0 && LC > 0)
        {
            var LL=(LB/60+LA)
            var X=((LC/3600)+(LB/60)+LA-LL) + LL
            var BBB=(BB/60+BA)
            var Bbut=(BC/3600)+(BB/60)+BA-BBB
            var niitB=Bbut+BBB
            service.findSum(X, niitB).then(({info, success}) => {
                if(success){
                    this.setState({
                        latlongy:X,
                        latlongx:niitB,
                        aimag_name:info[0]['aimag'],
                        trapetsiin_dugaar: info[0].vseg,
                        sum_name: info[0].sum,
                        cc: info[0].cc,
                        zone: info[0].zone,
                    })
                }
                else{
                    this.setState({
                        error_msg: info,
                    })
                    setTimeout(() => {
                        this.setState({error_msg: ''})
                    }, 2000);
                }
            })
        }
    }

    handleXY(values, info, success){
        if(success){
            this.setState({
                latlongy:values[0],
                latlongx:values[1],
                aimag_name:info[0]['aimag'],
                trapetsiin_dugaar: info[0].vseg,
                sum_name: info[0].sum,
                cc: info[0].cc,
                zone: info[0].zone,
                BA: info[0].BA,
                BB: info[0].BB,
                BC: info[0].BC,
                LA: info[0].LA,
                LB: info[0].LB,
                LC: info[0].LC
            })
            if(info[0]['aimag'] == 'Улаанбаатар'){
                const barishil_tuhai = info[0]['aimag'] +' '+ 'хотын'
                this.setState({barishil_tuhai:barishil_tuhai})
            }
            else{
                const barishil_tuhai = info[0]['aimag'] +' '+ 'аймгийн' +' '+ info[0].sum +' '+ 'сум'
                this.setState({barishil_tuhai:barishil_tuhai})
            }
        }
        else{
            this.setState({
                error_msg: info,
                latlongx:'',
                aimag_name:'',
                trapetsiin_dugaar: '',
                sum_name: '',
                cc: '',
                zone: '',
                BA:'',
                BB:'',
                BC:'',
                LA:'',
                LB:'',
                LC:'',
            })
            setTimeout(() => {
                this.setState({error_msg: ''})
            }, 2000);
        }
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
                this.setState({[name+'_error']: false, [name]: file })
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
        var LL=(this.state.LB/60+this.state.LA)
        var X=((this.state.LC/3600)+(this.state.LB/60)+this.state.LA-LL) + LL
        var BBB=(this.state.BB/60+this.state.BA)
        var Bbut=(this.state.BC/3600)+(this.state.BB/60)+this.state.BA-BBB
        var niitB=Bbut+BBB
        const trapetsiin_dugaar = this.state.trapetsiin_dugaar.split(",")[0]
        form_datas.append('file1', this.state.file_path1)
        form_datas.append('file2', this.state.file_path2)
        form_datas.append('tesgiin_ner', this.state.tesgiin_ner)
        form_datas.append('idx', this.state.id)
        form_datas.append('trapetsiin_dugaar',trapetsiin_dugaar)
        form_datas.append('toviin_dugaar', this.state.toviin_dugaar)
        form_datas.append('center_typ', this.state.values.center_typ)
        form_datas.append('ondor', parseFloat(this.state.values.ondor))
        form_datas.append('ondor_torol', parseFloat(this.state.values.ondor_torol))
        form_datas.append('pid', this.state.values.pid)
        form_datas.append('suljeenii_torol', this.state.values.suljeenii_torol)
        form_datas.append('aimag_name', this.state.aimag_name)
        form_datas.append('sum_name', this.state.sum_name)
        form_datas.append('latlongx', X)
        form_datas.append('latlongy', niitB)
        form_datas.append('tseg_oiroos_img_url', this.state.tseg_oiroos_img_url)
        form_datas.append('tseg_holoos_img_url', this.state.tseg_holoos_img_url)
        form_datas.append('barishil_tuhai', this.state.barishil_tuhai)
        form_datas.append('point_class', this.state.point_class)
        form_datas.append('bairshil_tseg_oiroos_img_url', this.state.bairshil_tseg_oiroos_img_url)
        form_datas.append('bairshil_tseg_holoos_img_url', this.state.bairshil_tseg_holoos_img_url)
        form_datas.append('sudalga_or_shine', this.state.values.sudalga_or_shine)
        form_datas.append('hors_shinj_baidal', this.state.hors_shinj_baidal)
        form_datas.append('date', this.state.values.date)
        form_datas.append('BA', this.state.BA)
        form_datas.append('LA', this.state.LA)
        form_datas.append('zone', this.state.zone)
        form_datas.append('cc', this.state.cc)
        form_datas.append('hotolson', this.state.values.hotolson)
        form_datas.append('alban_tushaal', this.state.values.alban_tushaal)
        form_datas.append('alban_baiguullga', this.state.values.alban_baiguullga)
        const id = this.props.match.params.id
        service.tsegPersonal(form_datas).then(({success, name, ids}) => {
            if (success) {
                setTimeout(() => {
                    setStatus('saved')
                    setSubmitting(false)
                    this.props.history.push('/profile/tseg-personal/')
                }, 1000)
            }
            else{
                setSubmitting(false)
            }

            if( name){
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
                {
                    const value = item.date
                    const d = value.split("-")
                    const daydhkf = parseInt(d[2])+1
                    if(daydhkf<=10){
                        var dated = '0' +`${daydhkf}`
                    }
                    else{
                        var dated = `${daydhkf}`
                    }
                    const m =d[1]
                    const y = d[0]
                    var dateStr = y+ "-" + m + "-" + dated;

                    this.setState({
                        values : {
                            ...this.state.values,
                            pid: item.pid,
                            center_typ: item.center_typ,
                            ondor: item.ondor,
                            ondor: item.ondor_torol,
                            suljeenii_torol: item.point_type,
                            sudalga_or_shine: item.sudalga_or_shine,
                            date: dateStr,
                            hotolson: item.hotolson,
                            alban_tushaal: item.alban_tushaal,
                            alban_baiguullga: item.alban_baiguullga,
                        },
                        hors_shinj_baidal: item.hors_shinj_baidal,
                        toviin_dugaar: item.point_id,
                        tesgiin_ner: item.point_name,
                        LA:item.LA,
                        LB:item.LB,
                        LC:item.LC,
                        BA:item.BA,
                        BB:item.BB,
                        BC:item.BC,
                        zone:item.zone,
                        cc:item.cc,
                        latlongx: item.latlongx,
                        latlongy: item.latlongy,
                        sum_name: item.sum,
                        aimag_name: item.aimag,
                        point_class: item.point_class,
                        trapetsiin_dugaar: item.sheet1,
                        barishil_tuhai: item.barishil_tuhai,
                        tseg_oiroos_img_url_zurag: item.tseg_oiroos_img_url,
                        tseg_holoos_img_url_zurag: item.tseg_holoos_img_url,
                        bairshil_tseg_oiroos_img_url_zurag: item.bairshil_tseg_oiroos_img_url,
                        bairshil_tseg_holoos_img_url_zurag: item.bairshil_tseg_holoos_img_url,
                        file_path11: item.file_path1,
                        file_path22: item.file_path2,
                    })
                    }
                )
            }

        }
         )
    }


    render() {

       const error_msg = this.state.error_msg
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
                    <div className="row container  m-l">
                        <div className="float-left">
                            <Maps
                                handleXY={this.handleXY}
                                coordinatCheck={false}
                                xy={this.x}
                            />
                        </div>
                        <div className="col-md-12 mb-4 mt-4 pl-0">
                            <a href="#" className="btn gp-outline-primary " onClick={this.props.history.goBack}>
                                <i className="fa fa-angle-double-left"></i> Буцах
                            </a>
                        </div>
                        <div
                            style={{right:'0'}}
                            className={`float-lg-right mr-5 ml-5 mt-4 position-absolute alert alert-danger` +
                                (error_msg == '' ? ` d-none`: ` d-block`)} role="alert">
                            {error_msg ? error_msg: null}
                        </div>
                        <h4>Цэгийн хувийн хэрэг</h4>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th style={{width: "5%"}} scope="row">1</th>
                                    <th style={{width: "15%"}}>Цэгийн нэр</th>
                                    <td  scope="rowgroup">
                                        {this.state.name_error ? <a className="text-danger">Цэгийн нэр давхцаж байна !!!</a> : this.state.tesgiin_ner == '' ? '' : ''}
                                        <div className="input-group">
                                            <input
                                                name="tesgiin_ner"
                                                type="text"
                                                id="tesgiin_ner"
                                                list="tsegList"
                                                autoComplete="off"
                                                className={'form-control' + (this.state.name_error || this.error_msg.length > 0 ? ' is-invalid' : '')} 
                                                onChange={(e) => this.handleSearchWithName('tesgiin_ner', e)}
                                                value = {this.state.tesgiin_ner}
                                            />
                                        </div>
                                    </td>
                                    <th style={{width: "5%"}} scope="row">2</th>
                                    <th>Төвийн дугаар</th>
                                    <td  scope="rowgroup">
                                        {this.state.id_error ? <a className="text-danger">Төвийн дугаар давхцаж байна !!! </a> : this.state.toviin_dugaar == '' ? '' : ''}
                                        <div className="input-group">
                                            <input
                                                name="toviin_dugaar"
                                                type="text"
                                                id="toviin_dugaar"
                                                list="tsegList"
                                                autoComplete="off"
                                                className={'form-control' + (this.state.id_error || this.error_msg.length > 0 ? ' is-invalid' : '')} 
                                                onChange={(e) => this.handleSearchWithName('toviin_dugaar', e)}
                                                value = {this.state.toviin_dugaar}
                                            />
                                            <div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th rowSpan="2" style={{width: "5%"}} scope="row">3</th>
                                    <th rowSpan="2">Трапецийн дугаар(1:100000)</th>
                                    <td rowSpan="2">
                                        <input
                                            className={'form-control ' + (errors.trapetsiin_dugaar ? 'is-invalid' : '')}
                                            name='trapetsiin_dugaar'
                                            id="id_trapetsiin_dugaar"
                                            disabled={true}
                                            type="text"
                                            value={this.state.trapetsiin_dugaar }
                                            value={(this.state.trapetsiin_dugaar == ''? '' : `${this.state.trapetsiin_dugaar}` + '- ' + `${this.state.zone}` + ' -' + `${this.state.cc}`)}
                                        />
                                    </td>
                                    <th style={{width: "5%"}} scope="row" rowSpan="2">4</th>
                                    <th>Сүлжээний төрөл</th>
                                    <td>
                                        <Fragment>
                                            <Field name="suljeenii_torol" as="select" className="form-control"
                                            className={'form-control ' + (errors.suljeenii_torol ? 'is-invalid' : '')}>
                                                <option>...</option>
                                                <option value="3">GPS-ийн сүлжээ</option>
                                                <option value="6">Гравиметрийн сүлжээ</option>
                                                <option value="7">Өндрийн сүлжээ</option>
                                                <option value="4">Триангуляцийн сүлжээ</option>
                                                <option value="5">Полигометрийн сүлжээ</option>
                                                <option value="8">Зураглалын сүлжээ</option>
                                                <option value="2">GNSS-ийн байнгын ажиллагаатай станц</option>
                                            </Field>
                                            <ErrorMessage name="suljeenii_torol" component="div" className="text-dange"/>
                                        </Fragment>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Зэрэг</th>
                                    {values.suljeenii_torol == '2' ?
                                        <td>
                                        <Fragment>
                                            <Field name="center_typ" as="select" className="form-control"
                                            className={'form-control ' + (errors.center_typ ? 'is-invalid' : '')}>
                                                <option>...</option>
                                                <option value="1">Идэвхтэй</option>
                                                <option value="2">Идэвхгүй</option>
                                            </Field>
                                            <ErrorMessage name="center_typ" component="div" className="text-dange"/>
                                        </Fragment>
                                    </td> : values.suljeenii_torol == '3' ?
                                        <td>
                                        <Fragment>
                                            <Field name="center_typ" as="select" className="form-control"
                                            className={'form-control ' + (errors.center_typ ? 'is-invalid' : '')}>
                                                <option>...</option>
                                                <option value="1">AA анги</option>
                                                <option value="2">A анги</option>
                                                <option value="3">B анги</option>
                                            </Field>
                                            <ErrorMessage name="center_typ" component="div" className="text-dange"/>
                                        </Fragment>
                                    </td> : values.suljeenii_torol == '4' ?
                                        <td>
                                        <Fragment>
                                            <Field name="center_typ" as="select" className="form-control"
                                            className={'form-control ' + (errors.center_typ ? 'is-invalid' : '')}>
                                                <option>...</option>
                                                <option value="1">I анги</option>
                                                <option value="2">II анги</option>
                                                <option value="3">III анги</option>
                                                <option value="4">IV анги</option>
                                            </Field>
                                            <ErrorMessage name="center_typ" component="div" className="text-dange"/>
                                        </Fragment>
                                    </td> : values.suljeenii_torol == '5' ?
                                        <td>
                                        <Fragment>
                                            <Field name="center_typ" as="select" className="form-control"
                                            className={'form-control ' + (errors.center_typ ? 'is-invalid' : '')}>
                                                <option>...</option>
                                                <option value="1">I анги</option>
                                                <option value="2">II анги</option>
                                                <option value="3">III анги</option>
                                                <option value="4">IV анги</option>
                                            </Field>
                                            <ErrorMessage name="center_typ" component="div" className="text-dange"/>
                                        </Fragment>
                                    </td> : values.suljeenii_torol == '6' ?
                                        <td>
                                        <Fragment>
                                            <Field name="center_typ" as="select" className="form-control"
                                            className={'form-control ' + (errors.center_typ ? 'is-invalid' : '')}>
                                                <option>...</option>
                                                <option value="1">I анги</option>
                                                <option value="2">II анги</option>
                                            </Field>
                                            <ErrorMessage name="center_typ" component="div" className="text-dange"/>
                                        </Fragment>
                                    </td> : values.suljeenii_torol == '7' ?
                                        <td>
                                        <Fragment>
                                            <Field name="center_typ" as="select" className="form-control"
                                            className={'form-control ' + (errors.center_typ ? 'is-invalid' : '')}>
                                                <option>...</option>
                                                <option value="1">I анги</option>
                                                <option value="2">II анги</option>
                                                <option value="3">III анги</option>
                                                <option value="4">IV анги</option>
                                            </Field>
                                            <ErrorMessage name="center_typ" component="div" className="text-dange"/>
                                        </Fragment>
                                    </td>  :
                                        <td>
                                        <Fragment>
                                            <Field name="center_typ" as="select" className="form-control"
                                            className={'form-control ' + (errors.center_typ ? 'is-invalid' : '')}>
                                                <option>...</option>
                                                <option value="1">C анги</option>
                                            </Field>
                                            <ErrorMessage name="center_typ" component="div" className="text-dange"/>
                                        </Fragment>
                                    </td>
                                    }
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
                                    <th rowSpan="4" scope="rowgroup">
                                    WGS84 солбицлын тогтолтоонд, ITRF 2008 эринд 2008 эринд тодорхойлсон
                                        <button type='button' className="btn gp-outline-primary " onClick={this.handleCoordinatCheck}>
                                            Шалгах
                                        </button>
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan="2" style={{textAlign:'center'}}>Өргөрөг(B)</th>
                                    <th colSpan="2" scope="rowgroup" style={{textAlign:'center'}}>Уртраг(L)</th>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="pl-3">
                                        <input
                                            className={'form-control row float-left m-2' }
                                            style={{width:"90%"}}
                                            name='BA'
                                            id="BA"
                                            placeholder="D"
                                            type="number"
                                            onChange = {(e)=>this.handleOnchange(e)}
                                            value ={this.state.BA || ''}
                                        />
                                        <input
                                            className={'form-control row float-left m-2' }
                                            style={{width:"90%"}}
                                            placeholder="M"
                                            name='BB'
                                            id="BB"
                                            type="number"
                                            onChange = {(e)=>this.handleOnchange(e)}
                                            value ={this.state.BB || ''}
                                        />
                                        <input
                                            className={'form-control row float-left m-2' }
                                            style={{width:"90%"}}
                                            placeholder="S"
                                            name='BC'
                                            id="BC"
                                            type="number"
                                            onChange = {(e)=>this.handleOnchange(e)}
                                            value ={this.state.BC || ''}
                                        />
                                    </td>
                                    <td colSpan="2" scope="rowgroup" className="pl-5">
                                        <input
                                            className={'form-control row float-left m-2' }
                                            style={{width:"90%"}}
                                            placeholder="D"
                                            name="LA"
                                            id="LA"
                                            type="number"
                                            onChange = {(e)=>this.handleOnchange(e)}
                                            value ={this.state.LA || ''}
                                        />
                                        <input
                                            className={'form-control row float-left m-2' }
                                            style={{width:"90%"}}
                                            placeholder="M"
                                            name='LB'
                                            id="LB"
                                            type="number"
                                            onChange = {(e)=>this.handleOnchange(e)}
                                            value ={this.state.LB || ''}
                                        />
                                        <input
                                            className={'form-control row float-left m-2' }
                                            style={{width:"90%"}}
                                            placeholder="S"
                                            name='LC'
                                            id="LC"
                                            type="number"
                                            onChange = {(e)=>this.handleOnchange(e)}
                                            value ={this.state.LC || ''}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="2" scope="rowgroup">
                                        Өндөр төрөл
                                        <Fragment>
                                            <Field name="ondor_torol" as="select" className="form-control"
                                                className={'form-control ' + (errors.ondor_torol ? 'is-invalid' : '')}>
                                                <option >...</option>
                                                <option value="1">Эллипсойдын өндрийн утга</option>
                                                <option value="2">Ортометрын өндрийн утга</option>
                                                <option value="3">Балтын тэнгэсийн өндрийн утга</option>
                                            </Field>
                                            <ErrorMessage name="ondor_torol" component="div" className="text-dange"/>
                                        </Fragment>
                                    </th>
                                    <th colSpan="4" scope="rowgroup">
                                        Өндөр тоо
                                        <Field
                                            className={'form-control ' + (errors.ondor ? 'is-invalid' : '')}
                                            name='ondor'
                                            id="id_ondor"
                                            type="number"
                                        />
                                        <ErrorMessage name="ondor" component="div" className="text-dange"/>
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan="7" scope="rowgroup" style={{textAlign: "center"}}>
                                        7. Цэгийн фото зураг
                                        <div
                                            type="button"
                                            onMouseOver={(e) => this.handleBoxOver(e)}
                                            onMouseLeave={(e) => this.handleBoxLeave(e)}
                                            style={{backgroundColor:"white"}}
                                            className="float-right"
                                        >
                                        <i className="fa fa-exclamation-circle float-right">
                                            <div className={`alert alert-dark rounded position-absolute d-none`+
                                                        `${this.state.showBox ? " d-block" : ""}`}
                                                        role="alert"
                                            >
                                                <h6 className="alert-heading">Санамж!</h6>
                                                <p>".jpeg" болон ".png" байх ёстой</p>
                                            </div>
                                        </i>
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    <th style={{textAlign: "center"}} colSpan="3" scope="rowgroup">
                                        ойроос
                                    </th>
                                    <th style={{textAlign: "center"}} colSpan="3" scope="rowgroup">
                                        холоос
                                    </th>
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
                                            maxFileSize={2250000}
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
                                            maxFileSize={2250000}
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
                                    <th style={{textAlign: "center"}} colSpan="2" scope="rowgroup">8. Байршлын тухай: </th>
                                    <th style={{textAlign: "center"}} colSpan="4" scope="rowgroup">
                                         {this.state.barishil_tuhai.length < 50 ? <a className="text-danger float-left">Цэгийн байршлын тухай мэдээлэл нь багадаа 50 тэмдэгт байна </a> : ''}
                                        <input
                                            className={'form-control' + ( this.state.barishil_tuhai.length < 50 ? ' is-invalid' : '')} 
                                            name='barishil_tuhai'
                                            id="id_barishil_tuhai"
                                            type="textarea"
                                            onChange = {(e) => this.handleInput(e)}
                                            value={this.state.barishil_tuhai}
                                        />
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan="3" scope="rowgroup" style={{width: "50%"}}>
                                        9. Байршлын тойм зураг
                                    </th>
                                    <th colSpan="3" scope="rowgroup" style={{width: "50%"}}>
                                        10. Төв цэгийн хэлбэр
                                    </th>
                                </tr>
                                <tr>
                                    <td colSpan="3" scope="rowgroup" style={{height: "200px"}}>
                                        <ImageUploader
                                            withPreview={true}
                                            withIcon={false}
                                            buttonText='Зураг оруулах'
                                            onChange={(e) =>this.onDrop(e, 'bairshil_tseg_oiroos_img_url')}
                                            imgExtension={['.jpg', '.png']}
                                            maxFileSize={2250000}
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
                                            maxFileSize={2250000}
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
                                    <th colSpan="1" scope="rowgroup">11.</th>
                                    <td colSpan="5" scope="rowgroup">
                                        <Fragment>
                                            <Field name="sudalga_or_shine" as="select" className="form-control"
                                            className={'form-control ' + (errors.sudalga_or_shine ? 'is-invalid' : '')}>
                                                <option>...</option>
                                                <option>Сэргээсэн</option>
                                                <option>Шинээр суулгасан</option>
                                            </Field>
                                            <ErrorMessage name="sudalga_or_shine" component="div" className="text-dange"/>
                                        </Fragment>
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="1" scope="rowgroup">12.</th>
                                    <th colSpan="2" scope="rowgroup">Хөрсний шинж байдал:</th>
                                    <td colSpan="4" scope="rowgroup">
                                    {this.state.hors_error ? <a className="text-danger">Бүртгэлгүй хөрсний мэдээлэл байна</a> : ''}
                                        <div className="input-group"> 
                                            <input
                                                name="hors_shinj_baidal"
                                                type="text"
                                                id="hors_shinj_baidal"
                                                list="tsegList"
                                                autoComplete="off"
                                                className={'form-control' + (this.state.hors_error || this.error_msg.length > 0 ? ' is-invalid feedbakc' : '')} 
                                                onChange={(e) => this.handleSearchWithName('hors_shinj_baidal', e)}
                                                value = {this.state.hors_shinj_baidal}
                                            />
                                            <div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="1" scope="rowgroup">13.</th>
                                    <th colSpan="2" scope="rowgroup">Цэг тэмдэгт судалгасан огноо:</th>
                                    <td colSpan="3" scope="input-group date">
                                        <Field
                                            className={'form-control ' + (errors.date ? 'is-invalid' : '')}
                                            name='date'
                                            id="id_date"
                                            type="date"
                                        />
                                        <ErrorMessage name="date" component="div" className="text-dange"/>
                                    </td>
                                </tr>
                                {values.suljeenii_torol == '3' ?
                                <tr>
                                    <th colSpan="1" scope="rowgroup">14.</th>
                                    <th colSpan="2" scope="rowgroup">Файл 1:</th>
                                    <td colSpan="3" scope="rowgroup">
                                        {this.state.file_path11 === '' ? null : <a href={`/media/${this.state.file_path11}`}>{this.state.file_path11}</a>}
                                        <input
                                            type="file"
                                            className={'form-control ' + (this.state.file_path1_error > 0 ? 'is-invalid' : '')}
                                            disabled={values.suljeenii_torol == '3' ? false : true}
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
                                </tr>: null}
                                {values.suljeenii_torol == '3' ?
                                <tr>
                                    <th colSpan="1" scope="rowgroup">15.</th>
                                    <th colSpan="2" scope="rowgroup">Файл 2:</th>
                                    <td colSpan="3" scope="rowgroup">
                                        {this.state.file_path22 === '' ? null : <a href={`/media/${this.state.file_path22}`}>{this.state.file_path22}</a>}
                                        <input
                                            type="file"
                                            className="form-control"
                                            className={'form-control ' + (this.state.file_path2_error > 0 ? 'is-invalid' : '')}
                                            disabled={values.suljeenii_torol == '3' ? false : true}
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
                                : null}
                                <tr>
                                    <th colSpan="1" scope="rowgroup">16.</th>
                                    <th colSpan="2" scope="rowgroup">Албан байгууллага:</th>
                                    <td colSpan="3" scope="rowgroup">
                                        <Field
                                            className={'form-control ' + (errors.alban_baiguullga ? 'is-invalid' : '')}
                                            name='alban_baiguullga'
                                            id="id_alban_baiguullga"
                                            type="text"
                                        />
                                        <ErrorMessage name="alban_baiguullga" component="div" className="text-danger"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="1" scope="rowgroup">17.</th>
                                    <th colSpan="2" scope="rowgroup">Албан тушаал:</th>
                                    <td colSpan="3" scope="rowgroup">
                                        <Field
                                            className={'form-control ' + (errors.alban_tushaal ? 'is-invalid' : '')}
                                            name='alban_tushaal'
                                            id="id_alban_tushaal"
                                            type="text"
                                        />
                                        <ErrorMessage name="alban_tushaal" component="div" className="=text-danger"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="1" scope="rowgroup">18.</th>
                                    <th colSpan="2" scope="rowgroup">Хувийн хэрэг хөтөлсөн:</th>
                                    <td colSpan="3" scope="rowgroup">
                                        <Field
                                            className={'form-control ' + (errors.hotolson ? 'is-invalid' : '')}
                                            name='hotolson'
                                            id="id_hotolson"
                                            type="text"
                                        />
                                        <ErrorMessage name="hotolson" component="div" className="text-danger"/>
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
                            <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting || has_error || Object.keys(this.state.checkError).length > 0} onClick = {this.checkError}>
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
                 </Form>
                )
            }}
        </Formik>
        )

    }

}