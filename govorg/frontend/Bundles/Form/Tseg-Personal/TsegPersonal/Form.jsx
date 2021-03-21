import React, { Component, Fragment } from "react"
import ImageUploader from 'react-images-upload'
import {NavLink} from "react-router-dom"
import {Formik, Field, Form, ErrorMessage} from 'formik'

import {service} from '../../service'
import {validationSchema} from './validationSchema'
import Maps from '../../../../components/map/Map'
import ModalAlert from "@utils/Modal/ModalAlert"


export  class Forms extends Component {

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
            bairshil_error:false,
            modal_alert_status: 'closed',
            timer: null,
            geo_id: '',
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
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
        this.getFieldValues = this.getFieldValues.bind(this)
    }

    handleBoxOver (e){
        this.setState({ showBox: true })
    }

    handleBoxLeave(e){
        this.setState({ showBox: false })
    }

    getFieldValues() {
        service
            .getFieldValue()
            .then(({ point_classes, point_types }) => {
                this.setState({ point_classes, point_types })
            })
    }

    componentDidMount(){
        this.getFieldValues()
        const id = this.props.data.match.params.id
        const t_type = this.props.data.match.params.t_type
        if(id) {
            this.tsegUpdate(id, t_type)
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
                checkError: error,
            })
        }
        if(this.state.toviin_dugaar == ''){
            alert("Төвийн дугаарыг оруулна уу !!!")
            this.setState({
                checkError: error,
            })
        }

         if(this.state.hors_shinj_baidal == ''){
            alert(" Хөрсний шинж байдлыг тодорхойлно уу !!!")
            this.setState({
                checkError: error,
            })
        }

        if(this.state.barishil_tuhai.length <50){
            alert("Цэгийн байршлын тухай мэдээлэл нь багадаа 50 тэмдэгт байна !!!")
            this.setState({
                checkError: error,
            })
        }
        if(this.state.LA == '' || this.state.LB == '' || this.state.LC == '' || this.state.BA == '' || this.state.BB == '' || this.state.BC == '' ){
            alert("Солбицлын мэдээлэл дутуу байна !!!")
            this.setState({
                checkError: error
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
        form_datas.append('ondor_torol', this.state.values.ondor_torol)
        form_datas.append('ondor', parseFloat(this.state.values.ondor))
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
        form_datas.append('geo_id', this.state.geo_id)

        const id = this.props.data.match.params.id
        const t_type = this.props.data.match.params.t_type

        form_datas.append('t_type', t_type)
        service.tsegPersonal(form_datas).then(({success, name, ids}) => {
            if (success) {
                this.setState({ modal_alert_status: 'open' })
                setStatus('saved')
                setSubmitting(false)
                this.modalCloseTime()
            }
            else{
                setSubmitting(false)
            }

            if( name){
                alert('Энэхүү цэг мэдээллийн санд байна.')
                this.setState({ name_error: true })
            }
            else {
                this.setState({ name_error:false })
            }

            if(ids) {
                alert('Энэхүү төвийн дугаар мэдээллийн санд байна.')
                this.setState({ id_error: true })
            }
            else {
                this.setState({ id_error: false })
            }

        })
    }

    tsegUpdate(id, t_type){
        service
            .updateTseg(id, t_type)
            .then(({ tseg_display }) => {
                console.log(tseg_display);
                if(tseg_display) {
                    tseg_display.map((item, idx) =>
                    {
                        const value = item.date
                        const d = value.split("-")
                        const daydhkf = parseInt(d[2]) + 1
                        if(daydhkf<=10){
                            var dated = '0' + `${daydhkf}`
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
                                ondor_torol: item.ondor_torol,
                                suljeenii_torol: item.suljeenii_torol,
                                sudalga_or_shine: item.sudalga_or_shine,
                                date: dateStr,
                                hotolson: item.hotolson,
                                alban_tushaal: item.alban_tushaal,
                                alban_baiguullga: item.alban_baiguullga,
                            },
                            hors_shinj_baidal: item.hors_shinj_baidal,
                            toviin_dugaar: item.point_id,
                            tesgiin_ner: item.point_name,
                            LA: item.LA,
                            LB: item.LB,
                            LC: item.LC,
                            BA: item.BA,
                            BB: item.BB,
                            BC: item.BC,
                            zone: item.zone,
                            cc: item.cc,
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
                            geo_id: item.geo_id,
                            id, t_type
                        })
                        }
                    )
                }
            })
    }

    getItem(){
        const id = this.props.data.match.params.id
        const t_type = this.props.data.match.params.t_type
        if(id){
            service.updateTseg(id, t_type).then(({tseg_display})=> {
                if(tseg_display){
                    const latx = tseg_display[0]["latlongx"]
                    const laty = tseg_display[0]["latlongy"]
                    this.x = []
                    this.x.push(latx, laty)
                }

            })

        }

    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
            this.props.data.history.push('/gov/froms/tseg-info/tsegpersonal/tseg-personal/')
        }, 2000)
    }

    modalClose(){
        clearTimeout(this.state.timer)
        this.setState({modal_alert_status: "closed"})
        this.props.data.history.push('/gov/froms/tseg-info/tsegpersonal/tseg-personal/')
    }

    render() {
       if(this.state.latlongy == ''){
        this.getItem()
       }

       const { point_classes, point_types } = this.state

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
                    <div className="card">
                        <div className="card-body">
                            <div className="col-md-8 ">
                                <div className="row ml-3">
                                    <div className="float-left">
                                        <Maps
                                            handleXY={this.handleXY}
                                            coordinatCheck={false}
                                            xy={this.x}
                                        />
                                    </div>
                                    <div className="col-md-12 mb-4 mt-4 pl-0">
                                        <NavLink to={`/gov/froms/tseg-info/tsegpersonal/tseg-personal/`} className='btn gp-outline-primary '>
                                                <i className="fa fa-angle-double-left"></i> Буцах
                                        </NavLink>
                                    </div>
                                    <div
                                        className={`float-lg-right mr-5 ml-5 mt-4 position-absolute alert alert-danger` +
                                            (error_msg == '' ? ` d-none`: ` d-block`)} role="alert">
                                        {error_msg ? error_msg: null}
                                    </div>
                                    <h4>Цэгийн хувийн хэрэг</h4>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th scope="row">1</th>
                                                <th>Цэгийн нэр</th>
                                                <td scope="rowgroup">
                                                    <div className="input-group">
                                                        <input
                                                            name="tesgiin_ner"
                                                            type="text"
                                                            id="tesgiin_ner"
                                                            list="tsegList"
                                                            autoComplete="off"
                                                            className={'form-control ' + (this.state.name_error || this.error_msg.length > 0 ? ' is-invalid' : '')}
                                                            onChange={(e) => this.handleSearchWithName('tesgiin_ner', e)}
                                                            value = {this.state.tesgiin_ner}
                                                        />
                                                            {this.state.name_error ? <div className="invalid-feedback">Цэгийн нэр давхцаж байна !!!</div> : this.state.tesgiin_ner == '' ? '' : ''}
                                                    </div>
                                                </td>
                                                <th scope="row">2</th>
                                                <th>Төвийн дугаар</th>
                                                <td scope="rowgroup">
                                                    <div className="input-group">
                                                        <input
                                                            name="toviin_dugaar"
                                                            type="number"
                                                            onKeyDown={ e => ( e.keyCode === 69 || e.keyCode === 190 ) && e.preventDefault() }
                                                            id="toviin_dugaar"
                                                            list="tsegList"
                                                            autoComplete="off"
                                                            className={'form-control ' + (this.state.id_error || this.error_msg.length > 0 ? 'is-invalid' : '')}
                                                            onChange={(e) => this.handleSearchWithName('toviin_dugaar', e)}
                                                            value = {this.state.toviin_dugaar}
                                                        />
                                                        {this.state.id_error ? <div className="invalid-feedback">Төвийн дугаар давхцаж байна !!!</div> : this.state.toviin_dugaar == '' ? '' : ''}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th rowSpan="2" scope="row">3</th>
                                                <th rowSpan="2">Трапецийн дугаар<br></br> (1:100000)</th>
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
                                                <th scope="row" rowSpan="2">4</th>
                                                <th>Сүлжээний төрөл</th>
                                                <td>
                                                    <Fragment>
                                                        <Field name="suljeenii_torol" as="select"
                                                        className={'custom-select ' + (errors.suljeenii_torol ? 'is-invalid' : '')}>
                                                            <option value="">...</option>
                                                            {
                                                                point_types && point_types.map((point_type, idx) =>
                                                                    <option
                                                                        key={idx}
                                                                        value={point_type.code_list_id}
                                                                    >
                                                                        {point_type.code_list_name}
                                                                    </option>
                                                                )
                                                            }
                                                        </Field>
                                                        <ErrorMessage name="suljeenii_torol" component="div" className="invalid-feedback"/>
                                                    </Fragment>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Зэрэг</th>
                                                <td>
                                                    <Fragment>
                                                        <Field name="center_typ" as="select"
                                                        className={'custom-select ' + (errors.center_typ ? 'is-invalid' : '')}>
                                                            <option value="">...</option>
                                                            {
                                                                point_classes && point_classes.map((point_class, idx) =>
                                                                    values.suljeenii_torol == point_class.top_code_list_id &&
                                                                    <option
                                                                        key={idx}
                                                                        value={point_class.code_list_id}
                                                                    >
                                                                        {point_class.code_list_name}
                                                                    </option>
                                                                )
                                                            }
                                                        </Field>
                                                        <ErrorMessage name="center_typ" component="div" className="invalid-feedback"/>
                                                    </Fragment>
                                                </td>
                                            </tr>

                                            <tr>
                                                <th scope="row">5</th>
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
                                                <th rowSpan="4" scope="rowgroup" scope="row">6</th>
                                                <th rowSpan="4" scope="rowgroup" className="text-justify">
                                                    WGS84 солбицлын<br></br> тогтолтоонд, <br></br> ITRF 2008 эринд <br></br>тодорхойлсон<br></br>
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
                                                        className={'form-control row float-left mx-0 my-2'}
                                                        name='BA'
                                                        id="BA"
                                                        placeholder="D"
                                                        type="number"
                                                        onChange = {(e)=>this.handleOnchange(e)}
                                                        value ={this.state.BA || ''}
                                                    />
                                                    <input
                                                        className={'form-control row float-left mx-0 my-2'}
                                                        placeholder="M"
                                                        name='BB'
                                                        id="BB"
                                                        type="number"
                                                        onChange = {(e)=>this.handleOnchange(e)}
                                                        value ={this.state.BB || ''}
                                                    />
                                                    <input
                                                        className={'form-control row float-left mx-0 my-2'}
                                                        placeholder="S"
                                                        name='BC'
                                                        id="BC"
                                                        type="number"
                                                        onChange = {(e)=>this.handleOnchange(e)}
                                                        value ={this.state.BC || ''}
                                                    />
                                                </td>
                                                <td colSpan="2" scope="rowgroup" className="">
                                                    <input
                                                        className={'form-control row float-left mx-0 my-2'}
                                                        placeholder="D"
                                                        name="LA"
                                                        id="LA"
                                                        type="number"
                                                        onChange = {(e)=>this.handleOnchange(e)}
                                                        value ={this.state.LA}
                                                    />
                                                    <input
                                                        className={'form-control row float-left mx-0 my-2'}
                                                        placeholder="M"
                                                        name='LB'
                                                        id="LB"
                                                        type="number"
                                                        onChange = {(e)=>this.handleOnchange(e)}
                                                        value ={this.state.LB || ''}
                                                    />
                                                    <input
                                                        className={'form-control row float-left mx-0 my-2'}
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
                                                    <br />
                                                    <Fragment>
                                                        <Field name="ondor_torol" as="select"
                                                            className={'custom-select ' + (errors.ondor_torol ? 'is-invalid' : '')}>
                                                            <option >...</option>
                                                            <option value="Эллипсойдын өндрийн утга">Эллипсойдын өндрийн утга</option>
                                                            <option value="Ортометрын өндрийн утга">Ортометрын өндрийн утга</option>
                                                            <option value="Балтын тэнгэсийн өндрийн утга">Балтын тэнгэсийн өндрийн утга</option>
                                                        </Field>
                                                        <ErrorMessage name="ondor_torol" component="div" className="invalid-feedback"/>
                                                    </Fragment>
                                                </th>
                                                <th colSpan="4" scope="rowgroup">
                                                    Өндөр тоо
                                                    <Field
                                                        className={'form-control ' + (errors.ondor ? 'is-invalid' : '')}
                                                        name='ondor'
                                                        id="id_ondor"
                                                        type="number"
                                                        onKeyDown={ e => ( e.keyCode === 69 || e.keyCode === 190 ) && e.preventDefault() }
                                                    />
                                                    <ErrorMessage name="ondor" component="div" className="invalid-feedback"/>
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
                                                <td colSpan="3" scope="rowgroup">
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
                                                    {this.state.barishil_tuhai.length < 50 ? <small className="text-danger float-left">Цэгийн байршлын тухай мэдээлэл нь багадаа 50 тэмдэгт байна </small> : ''}
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
                                                <th colSpan="3" scope="rowgroup">
                                                    9. Байршлын тойм зураг
                                                </th>
                                                <th colSpan="3" scope="rowgroup">
                                                    10. Төв цэгийн хэлбэр
                                                </th>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" scope="rowgroup">
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
                                                        <Field name="sudalga_or_shine" as="select"
                                                        className={'custom-select ' + (errors.sudalga_or_shine ? 'is-invalid' : '')}>
                                                            <option>...</option>
                                                            <option>Сэргээсэн</option>
                                                            <option>Шинээр суулгасан</option>
                                                        </Field>
                                                        <ErrorMessage name="sudalga_or_shine" component="div" className="invalid-feedback"/>
                                                    </Fragment>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th colSpan="1" scope="rowgroup">12.</th>
                                                <th colSpan="2" scope="rowgroup">Хөрсний шинж байдал:</th>
                                                <td colSpan="4" scope="rowgroup">
                                                    <div className="input-group">
                                                        <input
                                                            name="hors_shinj_baidal"
                                                            type="text"
                                                            id="hors_shinj_baidal"
                                                            list="tsegList"
                                                            autoComplete="off"
                                                            className={'form-control ' + (this.state.hors_error || this.error_msg.length > 0 ? 'is-invalid' : '')}
                                                            onChange={(e) => this.handleSearchWithName('hors_shinj_baidal', e)}
                                                            value = {this.state.hors_shinj_baidal}
                                                        />
                                                        {this.state.hors_error ? <div className="invalid-feedback">Бүртгэлгүй хөрсний мэдээлэл байна</div> : ''}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th colSpan="1" scope="rowgroup">13.</th>
                                                <th colSpan="2" scope="rowgroup">Цэг тэмдэгт суулгасан огноо:</th>
                                                <td colSpan="3" scope="input-group date">
                                                    <Field
                                                        className={'form-control ' + (errors.date ? 'is-invalid' : '')}
                                                        name='date'
                                                        id="id_date"
                                                        type="date"
                                                    />
                                                    <ErrorMessage name="date" component="div" className="invalid-feedback"/>
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
                                                    <ErrorMessage name="alban_baiguullga" component="div" className="invalid-feedback"/>
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
                                                    <ErrorMessage name="alban_tushaal" component="div" className="invalid-feedback"/>
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
                                                    <ErrorMessage name="hotolson" component="div" className="invalid-feedback"/>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="span3 my-3">
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
                )
            }}
        </Formik>
        )

    }

}
