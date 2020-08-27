import React, { Component } from "react"
import ImageUploader from 'react-images-upload'
import {service} from '../service'


export class Form extends Component {

    constructor(props) {
        super(props)
        this.state = {
        
        tesgiin_ner: '',
        toviin_dugaar: '',
        trapetsiin_dugaar: '',
        suljeenii_dugaar: 'GPS',
        aimag: 'Архангай',
        sum: '',
        sum_ners: [],

        utmx: 0,
        utmy: 0,
        latlongx: 0,
        latlongy: 0,

        barishil_tuhai: '',
        sudalga_or_shine: '',
        hors_shinj_baidal: '',
        date: '',

        hotolson: '',
        alban_tushaal: '',
        alban_baiguullga: '',

        tseg_oiroos_img_url: '',
        tseg_holoos_img_url: '',

        bairshil_tseg_oiroos_img_url: '',
        bairshil_tseg_holoos_img_url: '',

        
        handle_save_succes: false,

        file_path1: null,
        file_path1_error: false,
        file_path2: null,
        file_path2_error: false,
        bairshil_tseg_holoos_img_url: '',

        }
        this.handleInput = this.handleInput.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleInputAimag = this.handleInputAimag.bind(this)
        this.onChangeHandler = this.onChangeHandler.bind(this)
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
 
    handleInputAimag(field, e) {
        if(e.target.value == 'Архангай'){
            var sum_ners = ['Батцэнгэл', 'Булган', 'Жаргалант', 'Ихтамир', 'Өгийнуур', 'Өлзийт', 'Өндөр-Улаан', 'Тариат', 'Цахир', 'Чулуут']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Баян-Өлгий'){
            var sum_ners = ['Алтай', 'Алтанцөгц', 'Баяннуур', 'Бугат', 'Булган', 'Буянт', 'Дэлгүүн', 'Ногооннуур', 'Сагсай', 'Цагааннуур', 'Толбо', 'Улаанхус', 'Цэнгэл']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Баянхонгор'){
            var sum_ners = ['Баянхонгор', 'Баацагаан', 'Баянбулаг', 'Баянговь', 'Баян-Овоо', 'Баян-Өндөр', 'Баянцагаан', 'Богд', 'Бөмбөгөр', 'Бууцагаан', 'Галуут', 'Гурванбулаг', 'Жаргалант', 'Жинст', 'Заг', 'Өлзийт', 'Хүрээмарал', 'Шинэжинст', 'Эрдэнэцогт']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Булган'){
            var sum_ners = ['Булган', 'Баян-Агт', 'Баяннуур', 'Бугат', 'Бүрэгхангай', 'Гурванбулаг', 'Дашинчилэн', 'Могод', 'Орхон', 'Рашаант', 'Сайхан', 'Сэлэнгэ', 'Тэшиг', 'Хангал', 'Хишиг-Өндөр', 'Хутаг-Өндөр']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Говь-Алтай'){
            var sum_ners = ['Алтай', 'Баян-Уул', 'Бигэр', 'Бугат', 'Дарви', 'Дэлгэр', 'Есөнбулаг', 'Жаргалан', 'Тайшир', 'Тонхил', 'Төгрөг', 'Халиун', 'Хөхморьт', 'Цогт', 'Цээл', 'Чандмань', 'Шарга', 'Эрдэнэ']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Говьсүмбэр'){
            var sum_ners = ['Сүмбэр', 'Баянтал', 'Шивээговь']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Дархан-Уул'){
            var sum_ners = ['Дархан', 'Хонгор', 'Орхон', 'Шарынгол']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Дорноговь'){

            var sum_ners = ['Айраг', 'Алтанширээ', 'Даланжаргалан', 'Дэлгэрэх', 'Замын-Үүд', 'Иххэт', 'Мандах', 'Өргөн', 'Сайхандулаан', 'Улаанбадрах', 'Хатанбулаг', 'Хөвсгөл', 'Эрдэнэ']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Дорнод'){
            
            var sum_ners = ['Баяндун', 'Баянтүмэн', 'Баян-Уул', 'Булган', 'Гурванзагал', 'Дашбалбар', 'Матад', 'Сэргэлэн', 'Халхгол', 'Хөлөнбуйр', 'Хэрлэн (Сүмбэр)', 'Цагаан-Овоо', 'Чулуунхороот (Эрээнцав)', 'Чойбалсан']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Дундговь'){
            var sum_ners = ['Адаацаг', 'Баянжаргалан', 'Говь-Угтаал', 'Гурвансайхан', 'Дэлгэрхангай', 'Дэлгэрцогт', 'Дэрэн', 'Луус', 'Өлзийт', 'Өндөршил', 'Сайхан-Овоо', 'Сайнцагаан', 'Хулд', 'Цагаандэлгэр', 'Эрдэнэдалай']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Завхан'){

            var sum_ners = ['Алдархаан', 'Асгат', 'Баянтэс', 'Баянхайрхан', 'Дөрвөлжин', 'Завханмандал', 'Идэр', 'Их-Уул', 'Нөмрөг', 'Отгон', 'Сантмаргац', 'Сонгино', 'Тосонцэнгэл', 'Түдэвтэй', 'Тэлмэн', 'Тэс', 'Ургамал', 'Цагаанхайрхан', 'Цагаанчулуут', 'Цэцэн-Уул', 'Шилүүстэй', 'Эрдэнэхайрхан', 'Яруу']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }

        if(e.target.value == 'Орхон'){
            var sum_ners = ['Баян-Өндөр', 'Жаргалант']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Өвөрхангай'){
            var sum_ners = ['Арвайхээр', 'Баруунбаян-Улаан', 'Бат-Өлзий', 'Баянгол', 'Баян-Өндөр', 'Богд', 'Бүрд', 'Гучин-Ус', 'Хархорин', 'Хайрхандулаан', 'Хужирт', 'Нарийнтээл', 'Өлзийт', 'Сант', 'Тарагт', 'Төгрөг', 'Уянга', 'Есөнзүйл', 'Зүүнбаян-Улаан']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Өмнөговь'){
            var sum_ners = ['Баяндалай', 'Баян-Овоо', 'Булган', 'Гурвантэс', 'Мандал-Овоо', 'Манлай', 'Ноён', 'Номгон', 'Сэврэй', 'Ханбогд', 'Ханхонгор', 'Хүрмэн', 'Цогт-Овоо', 'Цогтцэций']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Сүхбаатар'){
            var sum_ners = ['Асгат', 'Баяндэлгэр', 'Дарьганга', 'Мөнххаан', 'Наран', 'Онгон', 'Сүхбаатар', 'Түвшинширээ', 'Түмэнцогт', 'Уулбаян', 'Халзан', 'Эрдэнэцагаан']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Сэлэнгэ'){
            var sum_ners = ['Алтанбулаг', 'Баруунбүрэн', 'Баянгол', 'Ерөө', 'Жавхлант', 'Зүүнбүрэн', 'Мандал', 'Орхон', 'Орхонтуул', 'Сайхан', 'Сант', 'Сүхбаатар', 'Түшиг', 'Хүдэр', 'Хушаат', 'Цагааннуур', 'Шаамар']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Төв'){
            var sum_ners = ['Алтанбулаг', 'Аргалант', 'Архуст', 'Баян', 'Батсүмбэр', 'Баяндэлгэр', 'Баянжаргалан', 'Баян-Өнжүүл', 'Баянхангай', 'Баянцагаан', 'Баянцогт', 'Баянчандмань', 'Борнуур', 'Бүрэн', 'Дэлгэрхаан', 'Жаргалант', 'Заамар', 'Лүн', 'Мөнгөнморьт', 'Өндөрширээт', 'Сэргэлэн', 'Сүмбэр', 'Угтаал', 'Цээл', 'Эрдэнэ', 'Эрдэнэсант']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Увс'){
            var sum_ners = ['Баруунтуруун', 'Бөхмөрөн', 'Давст', 'Завхан', 'Зүүнговь', 'Зүүнхангай', 'Малчин', 'Наранбулаг', 'Өлгий', 'Өмнөговь', 'Өндөрхангай', 'Сагил', 'Тариалан', 'Тэс', 'Түргэн', 'Улаангом', 'Ховд', 'Хяргас', 'Цагаанхайрхан']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Ховд'){
            var sum_ners = ['Жаргалант','Алтай', 'Булган', 'Буянт', 'Дарви', 'Дөргөн', 'Дуут', 'Зэрэг', 'Манхан', 'Мөнххайрхан', 'Мөст', 'Мянгад', 'Үенч', 'Ховд', 'Цэцэг', 'Чандмань', 'Эрдэнэбүрэн']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Хөвсгөл'){

            var sum_ners = ['Алаг-Эрдэнэ', 'Арбулаг', 'Баянзүрх', 'Бүрэнтогтох', 'Галт', 'Жаргалант', 'Их-Уул', 'Мөрөн', 'Рашаант', 'Рэнчинлхүмбэ', 'Тариалан', 'Тосонцэнгэл', 'Төмөрбулаг', 'Түнэл', 'Улаан-Уул', 'Ханх', 'Хатгал', 'Цагааннуур', 'Цагаан-Уул', 'Цагаан-Үүр', 'Цэцэрлэг', 'Чандмань-Өндөр', 'Шинэ-Идэр', 'Эрдэнэбулган']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
        if(e.target.value == 'Хэнтий'){
            var sum_ners = ['Батноров', 'Батширээт', 'Баян-Адрага', 'Баянмөнх', 'Баян-Овоо', 'Баянхутаг', 'Биндэр', 'Галшар', 'Дадал', 'Дархан', 'Дэлгэрхаан', 'Жаргалтхаан', 'Мөрөн', 'Норовлин', 'Өмнөдэлгэр', 'Хэрлэн', 'Цэнхэрмандал']
            var sum_ners_options = []
            for (var i = 0; i < sum_ners.length; i++)
            {
                sum_ners_options.push(<option>{sum_ners[i]}</option>);
            }
            this.setState({ [field]: e.target.value , sum_ners: sum_ners_options})
        }
    }

    onChangeHandler(e, name){
        const file = e.target.files[0]
        var re = /^[a-z A-Z 0-9]+[a-z A-Z 0-9]+[a-z A-Z 0-9]+[a-z A-Z 0-9]+[0-9]+[0-9]+[0-9]+[a-z A-Z 0-9]+[.]+[0-9]+[0-9]+[a-z A-Z 0-9]+$/
        this.setState({[name+'_error']: false, [name]: file })
        console.log()
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

    handleSave(){
        this.setState({handle_save_succes:true})

        const form_datas = new FormData() 
        form_datas.append('file1', this.state.file_path1)
        form_datas.append('file2', this.state.file_path2)
        form_datas.append('tesgiin_ner', this.state.tesgiin_ner)
        form_datas.append('toviin_dugaar', this.state.toviin_dugaar)
        form_datas.append('trapetsiin_dugaar', this.state.trapetsiin_dugaar)
        form_datas.append('suljeenii_dugaar', this.state.suljeenii_dugaar)
        form_datas.append('aimag_name', this.state.aimag)
        form_datas.append('sum_name', this.state.sum)
        form_datas.append('utmx', this.state.utmx)
        form_datas.append('utmy', this.state.utmy)
        form_datas.append('latlongx', this.state.latlongx)
        form_datas.append('latlongy', this.state.latlongy)
        form_datas.append('tseg_oiroos_img_url', this.state.tseg_oiroos_img_url)
        form_datas.append('tseg_holoos_img_url', this.state.tseg_holoos_img_url)
        form_datas.append('barishil_tuhai', this.state.barishil_tuhai)
        form_datas.append('bairshil_tseg_oiroos_img_url', this.state.bairshil_tseg_oiroos_img_url)
        form_datas.append('bairshil_tseg_holoos_img_url', this.state.bairshil_tseg_holoos_img_url)
        form_datas.append('sudalga_or_shine', this.state.sudalga_or_shine)
        form_datas.append('hors_shinj_baidal', this.state.hors_shinj_baidal)
        form_datas.append('date', this.state.date)
        form_datas.append('hotolson', this.state.hotolson)
        form_datas.append('alban_tushaal', this.state.alban_tushaal)
        form_datas.append('alban_baiguullga', this.state.alban_baiguullga)
        
        service.tsegPersonal(form_datas).then(({success}) => {
            if (success) {
                setTimeout(() => {
                    this.setState({handle_save_succes:false})
                    this.props.history.goBack()
                }, 1000)
            }
        })
    }
    

    render() {
        return (
            <div className="row container  my-4">
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
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tesgiin_ner"
                                    onChange={(e) => this.handleInput('tesgiin_ner', e)}
                                    value={this.state.tesgiin_ner}
                                />
                            </td>
                            <th style={{width: "5%"}} scope="row">2</th>
                            <th>Төвийн дугаар</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="toviin_dugaar"
                                    onChange={(e) => this.handleInput('toviin_dugaar', e)}
                                    value={this.state.toviin_dugaar}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "5%"}} scope="row">3</th>
                            <th>Трапецийн дугаар(1:100000)</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="trapetsiin_dugaar"
                                    onChange={(e) => this.handleInput('trapetsiin_dugaar', e)}
                                    value={this.state.trapetsiin_dugaar}
                                />
                            </td>
                            <th style={{width: "5%"}} scope="row">4</th>
                            <th>Сүлжээний төрөл</th>
                            <td>
                                <select className="form-control" id="suljeenii_dugaar" value={this.state.suljeenii_dugaar} onChange={(e) => this.handleInput('suljeenii_dugaar', e)}>
                                    <option>GPS</option>
                                    <option>GPS</option>
                                    <option>GPS</option>
                                    <option>GPS</option>
                                    <option>GPS</option>
                                    <option>GPS</option>
                                    <option>GPS</option>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th style={{width: "5%"}} scope="row">5</th>
                            <th>Аймаг</th>
                            <td colSpan="1" scope="rowgroup">
                                <select className="form-control" id="aimag" value={this.state.aimag} onChange={(e) => this.handleInputAimag('aimag', e)}>
                                    <option>Архангай</option>
                                    <option>Баян-Өлгий</option>
                                    <option>Баянхонгор</option>
                                    <option>Булган</option>
                                    <option>Говь-Алтай</option>
                                    <option>Говьсүмбэр</option>
                                    <option>Дархан-Уул</option>
                                    <option>Дорноговь</option>
                                    <option>Дорнод</option>
                                    <option>Дундговь</option>
                                    <option>Завхан</option>
                                    <option>Орхон</option>
                                    <option>Өвөрхангай</option>
                                    <option>Өмнөговь</option>
                                    <option>Сүхбаатар</option>
                                    <option>Сэлэнгэ</option>
                                    <option>Төв</option>
                                    <option>Увс</option>
                                    <option>Ховд</option>
                                    <option>Хөвсгөл</option>
                                    <option>Хэнтий</option>
                                </select>
                            </td>
                            <th>Сум</th>
                            <td colSpan="2" scope="rowgroup">
                                <select className="form-control" id="sum" value={this.state.sum} onChange={(e) => this.handleInput('sum', e)}>
                                    {this.state.sum_ners}
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th rowSpan="4" scope="rowgroup" style={{width: "5%"}} scope="row">6</th>
                            <th rowSpan="4" scope="rowgroup">Солбилцол WGS-84 /UTM/</th>
                            <th colSpan="1"style={{textAlign:'center'}}>
                                UTM-N
                            </th>
                            <th colSpan="2" scope="rowgroup" style={{textAlign:'center'}}>
                                UTM-E
                            </th>
                            <th rowSpan="4" scope="rowgroup">Сүлжээний төрөл</th>
                        </tr>
                        <tr>
                            <td>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="utmx"
                                    onChange={(e) => this.handleInput('utmx', e)}
                                    value={this.state.utmx}
                                />
                            </td>
                            <td colSpan="2" scope="rowgroup">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="utmy"
                                    onChange={(e) => this.handleInput('utmy', e)}
                                    value={this.state.utmy}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{textAlign:'center'}}>Latitude Longitude-X</th>
                            <th colSpan="2" scope="rowgroup" style={{textAlign:'center'}}>Latitude Longitude-Y</th>
                        </tr>
                        <tr>
                            <td>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="latlongx"
                                    onChange={(e) => this.handleInput('latlongx', e)}
                                    value={this.state.latlongx}
                                />
                            </td>
                            <td colSpan="2" scope="rowgroup">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="latlongy"
                                    onChange={(e) => this.handleInput('latlongy', e)}
                                    value={this.state.latlongy}
                                />
                            </td>
                        </tr>





                        <tr>
                            <th colSpan="7" scope="rowgroup" style={{textAlign: "center"}}>7. Цэгийн фото зураг</th>
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
                                    imgExtension={['.jpg', '.png']}
                                    maxFileSize={5242880}
                                    singleImage={true}
                                    label=''
                                />
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
                            </td>
                        </tr>
                        <tr>
                            <th style={{textAlign: "center"}} colSpan="2" scope="rowgroup">8. Байршлын тухай: </th>
                            <th style={{textAlign: "center"}} colSpan="4" scope="rowgroup">
                                <textarea 
                                    style={{height: '200px'}}
                                    aria-label="With textarea"
                                    className="form-control"
                                    id="barishil_tuhai"
                                    style={{height:"60px"}}
                                    onChange={(e) => this.handleInput('barishil_tuhai', e)}
                                    value={this.state.barishil_tuhai}>

                                </textarea>
                            </th>
                        </tr>
                        <tr>
                            <th colSpan="3" scope="rowgroup" style={{width: "50%"}}>9. Байршлын тойм зураг</th>
                            <th colSpan="3" scope="rowgroup" style={{width: "50%"}}>10. Төв цэгийн хэлбэр</th>
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
                            </td>
                        </tr>
                        <tr>
                            <th colSpan="1" scope="rowgroup">11.</th>
                            <td colSpan="5" scope="rowgroup">
                                <select className="form-control" id="sudalga_or_shine" value={this.state.sudalga_or_shine} onChange={(e) => this.handleInput('sudalga_or_shine', e)}>
                                    <option>Судалгаа</option>
                                    <option>Шинээр суулгасан</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th colSpan="1" scope="rowgroup">12.</th>
                            <th colSpan="2" scope="rowgroup">Хөрсний шинж байдал:</th>
                            <td colSpan="3" scope="rowgroup">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="hors_shinj_baidal"
                                    onChange={(e) => this.handleInput('hors_shinj_baidal', e)}
                                    value={this.state.hors_shinj_baidal}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th colSpan="1" scope="rowgroup">13.</th>
                            <th colSpan="2" scope="rowgroup">Цэг тэмдэгт судалгасан огноо:</th>
                            <td colSpan="3" scope="rowgroup">
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    onChange={(e) => this.handleInput('date', e)}
                                    value={this.state.date}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th colSpan="1" scope="rowgroup">14.</th>
                            <th colSpan="2" scope="rowgroup">Хувийн хэрэг хөтөлсөн:</th>
                            <td colSpan="3" scope="rowgroup">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="hotolson"
                                    onChange={(e) => this.handleInput('hotolson', e)}
                                    value={this.state.hotolson}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th colSpan="1" scope="rowgroup">15.</th>
                            <th colSpan="2" scope="rowgroup">Файл 1:</th>
                            <td colSpan="3" scope="rowgroup">
                                <input
                                    type="file"
                                    className="form-control"
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
                            <th colSpan="1" scope="rowgroup">16.</th>
                            <th colSpan="2" scope="rowgroup">Файл 2:</th>
                            <td colSpan="3" scope="rowgroup">
                                <input
                                    type="file"
                                    className="form-control"
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
                            <th colSpan="1" scope="rowgroup">17.</th>
                            <th colSpan="2" scope="rowgroup">Албан байгууллага:</th>
                            <td colSpan="3" scope="rowgroup">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="alban_baiguullga"
                                    onChange={(e) => this.handleInput('alban_baiguullga', e)}
                                    value={this.state.alban_baiguullga}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th colSpan="1" scope="rowgroup">18.</th>
                            <th colSpan="2" scope="rowgroup">Албан тушаал:</th>
                            <td colSpan="3" scope="rowgroup">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="alban_tushaal"
                                    onChange={(e) => this.handleInput('alban_tushaal', e)}
                                    value={this.state.alban_tushaal}
                                />
                            </td>
                        </tr>
                      
                    </tbody>
                </table>
                { this.state.handle_save_succes ?
                    <button className="btn gp-bg-primary">
                        <a className="spinner-border text-light" role="status">
                            <span className="sr-only">Loading...</span> 
                        </a>
                        <span> Шалгаж байна. </span>
                    </button>:
                    <button className="btn gp-bg-primary" onClick={this.handleSave} >
                        Хадгалах
                    </button>
                }
            </div>
        )

    }

}
