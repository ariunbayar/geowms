import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import {service} from '../service'

export class DursgaltGazar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: null,
            durgal_id: null,
            tuuh_soyl_id: null,
            tuuhin_ov_register_id: 0,
            tuuhin_ov_date: '',
            tuuhin_ov_aimag: '',
            tuuhin_ov_sum_duureg: '',

            torol_zuil_torol_zuil: '',
            torol_zuil_torol_zuil_tree: '',
            torol_zuil_torol_zuil_tree2: '',
            torol_zuil_torol_zuil_level1: [],
            torol_zuil_torol_zuil_level2: [],
            torol_zuiltorol_zuil_name: '',
            torol_zuil_dursgalt_gazriin_ner: '',

            torol_zuil_dursgalt_gazriin_coordinatutm: '',
            torol_zuil_dursgalt_gazriin_coordinatx: 0,
            torol_zuil_dursgalt_gazriin_coordinaty: 0,
            torol_zuil_dursgalt_gazriin_coordinatllx: 0,
            torol_zuil_dursgalt_gazriin_coordinatlly: 0,
            torol_zuil_dursgalt_gazriin_coordinatalt: 0,

            torol_zuil_todorhoilolt: '',



            hemjee_talbai: 0,
            hemjee_urt: 0,
            hemjee_orgon: 0,
            hemjee_ondor: 0,
            hemjee_zuzaan: 0,
            hemjee_golch: 0,

            hemjee_busad_hemjee: '',
            hemjee_too_shirheg: 0,
            hemjee_temdeglel: '',


            dg_ezen_dursgalt_gazar_ezen: 'Үгүй',
            dg_ezen_temdeglel: '',




            dgh_angilal: '',

            dgh_bus_togtooh_shaardlaga: 'Үгүй',

            dgh_tusgai_hamgaalalt: 'Үгүй',
            dgh_tusgai_temdeglel: '',


            dgh_yaaraltai_hamgaalalt:'Үгүй',
            dgh_yaaraltai_temdeglel: '',
            dgh_omchlol_ezemshih_omchlol_sanal_hamgaalalt: 'Үгүй',
            dgh_omchlol_ezemshih_omchlol_sanal_temdeglel: '',
            dgh_maltan_sudaltan_hamgaalalt: 'Үгүй',
            dgh_maltan_sudaltan_temdeglel: '',

            dgh_gemtliin_tonoson: false,
            dgh_gemtliin_suitgesen: false,
            dgh_gemtliin_budaj_ballasan: false,
            dgh_gemtliin_hugalsan: false,
            dgh_gemtliin_siilsen: false,
            dgh_gemtliin_zoogdson: false,
            dgh_gemtliin_alga_bolson: false,
            dgh_gemtliin_tos_suu_bohirdol: false,
            dgh_gemtliin_buruu_zassan: false,
            dgh_gemtliin_hadag_bos_daavuu: false,
            dgh_gemtliin_ded_buttsiin_ayuul: false,
            dgh_gemtliin_aj_ahuin_ajillagaand: false,
            dgh_gemtliin_all: [],
            dgh_gemtliin_temdeglel: '',

            dgh_baigaliin_huchin_zuil_nar: false,
            dgh_baigaliin_huchin_zuil_salhi: false,
            dgh_baigaliin_huchin_zuil_erdes_shohoin: false,
            dgh_baigaliin_huchin_zuil_uer_us: false,
            dgh_baigaliin_huchin_zuil_aynga: false,
            dgh_baigaliin_huchin_zuil_gal_tuimer: false,
            dgh_baigaliin_huchin_zuil_gazar_hodlolt: false,
            dgh_baigaliin_huchin_zuil_hag_urgamliin: false,
            dgh_baigaliin_huchin_zuil_biologiin: false,
            dgh_baigaliin_huchin_zuil_chuluuni_ogorshil: false,
            dgh_baigaliin_huchin_zuil_mal_amitnii: false,
            dgh_baigaliin_huchin_zuil_all: [],
            dgh_baigaliin_huchin_zuil_temdeglel: '',

            dgh_sergeen_zasvarlasan_eseh_hamgaalalt: 'Үгүй',
            dgh_sergeen_zasvarlasan_eseh_todorhoi_bish: false,
            dgh_sergeen_zasvarlasan_eseh_temdeglel: '',

            dgh_sergeen_zasvarlah_eseh_nenshaardlaga: 'Шаардлагагүй',
            dgh_sergeen_zasvarlah_eseh_shaardlaga: false,
            dgh_sergeen_zasvarlah_eseh_temdeglel: '',

            dgh_hamgaalaltiin_zereg_oorchloh_sanal: false,
            dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel: '',

            dgh_hashaa_baigaa_eseh_hashaa: 'Үгүй',
            dgh_hashaa_baigaa_eseh_temdeglel: '',

            dgh_saravchtai_eseh_saravch: 'Үгүй',
            dgh_saravchtai_eseh_temdeglel: '',

            dgh_hayg_tailbar_eseh_hayg: 'Үгүй',
            dgh_hayg_tailbar_eseh_temdeglel: '',


            last_busad_temdeglel: '',
            handle_save_succes: false,



        }

        this.handleSave = this.handleSave.bind(this)
        this.handleInput = this.handleInput.bind(this)


        this.handleInputSelect = this.handleInputSelect.bind(this)
        this.handleInputSelectTwo = this.handleInputSelectTwo.bind(this)
        this.handleTextArea = this.handleTextArea.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleCheckSelect = this.handleCheckSelect.bind(this)
        this.handleCheckSelectHun = this.handleCheckSelectHun.bind(this)
        this.handleCheckGroup = this.handleCheckGroup.bind(this)
    }
    
    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
    }

    componentDidMount(){
        const tuuhenov_id = this.props.match.params.id
        this.setState({ id:tuuhenov_id})

        const durgal_id = this.props.match.params.idx
        if(durgal_id){
            this.setState({durgal_id})

            service.dursgaltGazarAbout(durgal_id).then(({form_data}) => {
                console.log(form_data)

                if(form_data){
                    form_data.map((tuuh) => (

                        this.setState({
                            tuuhin_ov_date: tuuh['created_at'],
                            torol_zuil_torol_zuil: tuuh['type1'],
                            torol_zuil_torol_zuil_tree2: tuuh['type2'],

                            torol_zuiltorol_zuil_name: tuuh['stone'],
                            torol_zuil_dursgalt_gazriin_ner: tuuh['dursgal'],

                
                            torol_zuil_dursgalt_gazriin_coordinatutm: tuuh['utm'],
                            torol_zuil_dursgalt_gazriin_coordinatx: tuuh['utm_x'],
                            torol_zuil_dursgalt_gazriin_coordinaty: tuuh['utm_y'],
                            torol_zuil_dursgalt_gazriin_coordinatllx: tuuh['x'],
                            torol_zuil_dursgalt_gazriin_coordinatlly: tuuh['y'],
                            // torol_zuil_dursgalt_gazriin_coordinatalt: tuuh[''],
                
                            torol_zuil_todorhoilolt: tuuh['descriptio'],
                            
                            dgh_hashaa_baigaa_eseh_hashaa: tuuh['hashaa'],
                            dgh_saravchtai_eseh_saravch: tuuh['saravch'],
                            
                            dgh_hayg_tailbar_eseh_hayg: tuuh['hayg'],
                            
                            
                            dgh_sergeen_zasvarlah_eseh_nenshaardlaga: tuuh['recover1'],
                            
                            
                            dgh_sergeen_zasvarlasan_eseh_hamgaalalt: tuuh['recover'],
                            dgh_maltan_sudaltan_hamgaalalt: tuuh['malts'],
                            
                            
                            dgh_omchlol_ezemshih_omchlol_sanal_hamgaalalt: tuuh['length'],
                            
                            
                            dgh_yaaraltai_hamgaalalt: tuuh['yaral'],
                            dgh_tusgai_hamgaalalt: tuuh['tus'],
                            dgh_bus_togtooh_shaardlaga: tuuh['protecti_1'],
                            dg_ezen_dursgalt_gazar_ezen: tuuh['protection_irgen'],

                            // hemjee_talbai: tuuh[''],
                            hemjee_urt: tuuh['length'],
                            hemjee_orgon: tuuh['width'],
                            hemjee_ondor: tuuh['hight'],
                            hemjee_zuzaan: tuuh['depth'],
                            hemjee_golch: tuuh['meridian'],

                            hemjee_busad_hemjee: tuuh['other'],
                            hemjee_too_shirheg: tuuh['number'],
                            hemjee_temdeglel: tuuh['hemjee_comment'],
                            dg_ezen_temdeglel: tuuh['protection_irgen_commnent'],
                            dgh_angilal: tuuh['protection'],
                            dgh_tusgai_temdeglel: tuuh['tus_comment'],
                            dgh_yaaraltai_temdeglel: tuuh['yaral_comment'],
                            dgh_omchlol_ezemshih_omchlol_sanal_temdeglel: tuuh['omchlol_comment'],
                            dgh_maltan_sudaltan_temdeglel: tuuh['malts_comment'],
                            dgh_gemtliin_temdeglel: tuuh['human_comment'],
                            dgh_baigaliin_huchin_zuil_temdeglel: tuuh['natural_comment'],
                            dgh_hashaa_baigaa_eseh_temdeglel: tuuh['hashaa_comment'],
                            dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel: tuuh['protecti_2_comment'],
                            dgh_sergeen_zasvarlasan_eseh_temdeglel: tuuh['recover_comment'],
                            dgh_sergeen_zasvarlah_eseh_temdeglel: tuuh['recover1_comment'],
                            dgh_saravchtai_eseh_temdeglel: tuuh['saravch_comment'],
                            dgh_hayg_tailbar_eseh_temdeglel: tuuh['hayg_comment'],
                            last_busad_temdeglel: tuuh['other1'],



                            
                        })
                        )
                    )
                }
            })
        }
    }
  
    handleCheckSelect(field, e, name) {
        let dgh_baigaliin_huchin_zuil_all = this.state.dgh_baigaliin_huchin_zuil_all

        if (e.target.checked) {

            this.setState({ [field]: true })
            dgh_baigaliin_huchin_zuil_all.push(name)
        }
        else{
            this.setState({ [field]: false })
            dgh_baigaliin_huchin_zuil_all = dgh_baigaliin_huchin_zuil_all.filter((id) => id != name)
        }
        this.setState({ dgh_baigaliin_huchin_zuil_all })


    }

    handleCheckSelectHun(field, e, name) {
        let dgh_gemtliin_all = this.state.dgh_gemtliin_all
        if (e.target.checked) {

            this.setState({ [field]: true })
            dgh_gemtliin_all.push(name)
        }
        else{
            this.setState({ [field]: false })
            dgh_gemtliin_all = dgh_gemtliin_all.filter((id) => id != name)
        }
        this.setState({ dgh_gemtliin_all })


    }

    handleInputSelect(field, e) {
        if(e.target.value == '1. Чулуун зэвсгийн дурсгалт газар'){
            var chuluun_zevseg = []
            var chuluun_zevseg_array = ["1.1 Палеолит","1.2 Мезолит","1.3 Неолим","1.4 Хүний сууж байсан оромж. сууц, агуй","1.5 Бусад"]
            for (var i = 0; i < chuluun_zevseg_array.length; i++)
            {
                chuluun_zevseg.push(<option value={`1.${i+1}`}>{chuluun_zevseg_array[i]}</option>);
            }
            this.setState({ [field]: e.target.value , torol_zuil_torol_zuil_level1: chuluun_zevseg})
        }
        if(e.target.value == '2. Хадны зураг, бичгийн дүрсгэл'){
            var hadnii_zurag = []
            var hadnii_zurag_array = ["2.1 Сийлмэл зураг","2.2 Зос бэхэн зураг","2.3 Тамга тэмдэг бичгийн дурсгал"]
            for (var i = 0; i < hadnii_zurag_array.length; i++)
            {
                hadnii_zurag.push(<option value={`2.${i+1}`}>{hadnii_zurag_array[i]}</option>);
            }
            this.setState({ [field]: e.target.value , torol_zuil_torol_zuil_level1: hadnii_zurag})
        }
        if(e.target.value == '3. Булш оршуулгын дурсгал'){
            var bulsh_orshuulga = []
            var bulsh_orshuulga_array = ["3.1 Неолитын булш","3.2 Шоргоолжин булш","3.3 Хиргисүүр", "3.4 Дөрвөлжин булш", "3.5 Пазырык булш", "3.6 Хүннү булш", "3.7 Түрэг булш", "3.8 Уйгур булш", "3.9 Хятан булш", "3.10 Монгол булш", "3.11 Хадны булш", "3.12 Бусад"]
            for (var i = 0; i < bulsh_orshuulga_array.length; i++)
            {
                bulsh_orshuulga.push(<option value={`3.${i+1}`}>{bulsh_orshuulga_array[i]}</option>);
            }
    
            this.setState({ [field]: e.target.value , torol_zuil_torol_zuil_level1: bulsh_orshuulga})
        }
        if(e.target.value == '4. Тахил тайлгын байгууламж'){
            var tahil_tailga = []
            var tahil_tailga_array = ["4.1 Тахилын онгон", "4.2 Тахилын сүмийн туурь", "4.3 Шивээ", "4.4 Овоо", "4.5 Бусад"]
            for (var i = 0; i < tahil_tailga_array.length; i++)
            {
                tahil_tailga.push(<option value={`4.${i+1}`}>{tahil_tailga_array[i]}</option>);
            }
            this.setState({ [field]: e.target.value , torol_zuil_torol_zuil_level1: tahil_tailga})

        }
        if(e.target.value == '5. Барилга, архитектурын дурсгал'){
            var barilga_arhitektur = []
            var barilga_arhitektur_array = ["5.1 Суурьшлын ул мөр бүхий газар", "5.2 Эртний хот", "5.3 Хэрмэн зам", "5.4 Шуудуу", "5.5 Сүм хийдийн туурь", "5.6 суврага", "5.7 Түүхэн дурсгалт байшин", "5.8 Агуй, оромж, түр сууц", "5.9 Архитектурын дурсгал", "5.10 Бусад"]
    
            for (var i = 0; i < barilga_arhitektur_array.length; i++)
            {
                barilga_arhitektur.push(<option value={`5.${i+1}`}>{barilga_arhitektur_array[i]}</option>);
            }
            this.setState({ [field]: e.target.value , torol_zuil_torol_zuil_level1: barilga_arhitektur})
        
        }

        if(e.target.value == '6. Хөшөө дурсгал'){
            var hoshoo_dursgal = []
            var hoshoo_dursgal_array = ["6.1 Буган чулуун хөшөө", "6.2 Хүн чулуу", "6.3 Тамга тэмдэгтэй хөшөө чулуу", "6.4 Гэрэлт хөшөө", "6.5 Амьтны дүрслэлтэй хөшөө", "6.6 Цулуй хөшөө", "6.7 Бусад"]
            for (var i = 0; i < hoshoo_dursgal_array.length; i++)
            {
                hoshoo_dursgal.push(<option value={`6.${i+1}`}>{hoshoo_dursgal_array[i]}</option>);
            }
            this.setState({ [field]: e.target.value , torol_zuil_torol_zuil_level1: hoshoo_dursgal})
        
        }
        if(e.target.value == '7. Үйлдвэрлэлийн ул мөр хадгалсан дурсгалт газар'){
            var uildverleliin_ul_mor = []
            var uildverleliin_ul_mor_array = ["7.1 Төмөрлөг боловсруулалтын ул мөр", "7.2 Шавар боловсруулалтын ул мөр", "7.3 Газар боловсруулалтын ул мөр", "7.4 Чулуу боловсруулалтын ул мөр"]
            for (var i = 0; i < uildverleliin_ul_mor_array.length; i++)
            {
                uildverleliin_ul_mor.push(<option value={`7.${i+1}`}>{uildverleliin_ul_mor_array[i]}</option>);
            }
            this.setState({ [field]: e.target.value , torol_zuil_torol_zuil_level1: uildverleliin_ul_mor})
        }
        this.setState({ [field]: e.target.value})


    }
    handleInputSelectTwo(field, e){
        this.setState({ torol_zuil_torol_zuil_level2: []})

        if(e.target.value == '2.3'){
            var tamga_temdeg = []
            var tamga_temdeg_array = ["2.3.1 Түрэг", "2.3.2 Уйгур", "2.3.3 Кидан", "2.3.4 Монгол", "2.3.5 Тод", "2.3.6 Дөрвөлжин", "2.3.7 Манж", "2.3.8 Согд", "2.3.9 Араб", "2.3.10 Перс", "2.3.11 Санскрит", "2.3.12 Төвд", "2.3.13 Хятад", "2.3.14 Бусад"]
            for (var i = 0; i < tamga_temdeg_array.length; i++)
            {
                tamga_temdeg.push(<option value={`2.3.${i+1}`}>{tamga_temdeg_array[i]}</option>);
            }
            this.setState({ [field]: e.target.value , torol_zuil_torol_zuil_level2: tamga_temdeg})
        }
        if(e.target.value == '4.1'){
            var tamga_temdeg = []
            var tamga_temdeg_array = ["4.1.1 Балбал (зэл чулуу)", "4.1.2 Хашлага чулуу"]
            for (var i = 0; i < tamga_temdeg_array.length; i++)
            {
                tamga_temdeg.push(<option value={`4.1.${i+1}`}>{tamga_temdeg_array[i]}</option>);
            }
            this.setState({ [field]: e.target.value , torol_zuil_torol_zuil_level2: tamga_temdeg})
        }
        if(e.target.value == '5.2'){
            var ertnii_hot = []
            var ertnii_hot_array = ["5.2.1 Хүннү", "5.2.2 Түрэг", "5.2.3 Уйгур", "5.2.4 Кидан", "5.2.5 Монгол", "5.2.6 Манж", "5.2.7 Тодорхойгүй"]
            for (var i = 0; i < ertnii_hot_array.length; i++)
            {
                ertnii_hot.push(<option value={`5.2.${i+1}`}>{ertnii_hot_array[i]}</option>);
            }
            this.setState({ [field]: e.target.value , torol_zuil_torol_zuil_level2: ertnii_hot})
        }

        if(e.target.value == '5.9'){
            var ertnii_hot = []
            var ertnii_hot_array = ["5.9.1 Уран барилга", "5.9.2 Уран барилгын цогцолбор ", "5.9.3 Сүм хийд", "5.9.4 Уран баримал хөшөө (1921-1990 он)", "5.9.5 Сүрлэг чимэглэлийн дүрслэл"]
            for (var i = 0; i < ertnii_hot_array.length; i++)
            {
                ertnii_hot.push(<option value={`5.9.${i+1}`}>{ertnii_hot_array[i]}</option>);
            }
            this.setState({ [field]: e.target.value , torol_zuil_torol_zuil_level2: ertnii_hot})
        }

        if(e.target.value == '6.2'){
            var ertnii_hot = []
            var ertnii_hot_array = ["6.2.1 Хүрэл", "6.2.2 Түрэг", "6.2.3 Уйгур", "6.2.4 Кидан", "6.2.5 Монгол", "6.2.6 Тодорхойгүй"]
            for (var i = 0; i < ertnii_hot_array.length; i++)
            {
                ertnii_hot.push(<option value={`6.2.${i+1}`}>{ertnii_hot_array[i]}</option>);
            }
            this.setState({ [field]: e.target.value , torol_zuil_torol_zuil_level2: ertnii_hot})
        }
        this.setState({ [field]: e.target.value})


    }

    handleTextArea(field, e) {


        this.setState({ [field]: e.target.value })


    }

    handleCheckGroup(field, e, check) {
        this.setState({ [field]: check })
    }

    handleCheck(field, e) {
        if (e.target.checked) {
            this.setState({ [field]: true })
        }
        else{
            this.setState({ [field]: false })
        }
    }
    
    handleSave(){
        const id = this.props.match.params.id
        this.setState({handle_save_succes:true})

        const form_datas = this.state
        service.dursgaltGazarCreate(form_datas).then(({success}) => {
            if (success) {
                setTimeout(() => {
                    this.setState({handle_save_succes:false})
                    this.props.history.goBack()
                    this.props.history.push( `/back/froms/tuuhen-ov/${id}/add/`)

                }, 1000)
            }
        })
    }

    render() {
        return (
            <div >
                <div className="col-md-12 mb-4 my-4">
                    <a href="#" className="btn gp-outline-primary" onClick={this.props.history.goBack}>
                        <i className="fa fa-angle-double-left"></i> Буцах
                    </a>
                </div>
                <div className="row container  my-4">
                    <h4>2015 ОНЫ ТҮҮХ, СОЁЛЫН ҮЛ ХӨДЛӨХ ДУРСГАЛЫН ҮЗЛЭГ, ТООЛЛОГЫН ХЭЭРИЙН БҮРТГЭЛИЙН МАЯГТ №1</h4>
                </div>

                <table className="table table-bordered">
                    <tr>
                        <th scope="row" style={{width: "20%"}}>Төрөл зүйл</th>
                        <td colSpan="7" scope="rowgroup"  scope="row">
                            <div className="form-group">
                                <select className="form-control" id="torol_zuil_torol_zuil" value={this.state.torol_zuil_torol_zuil} onChange={(e) => this.handleInputSelect('torol_zuil_torol_zuil', e)}>
                                    <option>1. Чулуун зэвсгийн дурсгалт газар</option>
                                    <option>2. Хадны зураг, бичгийн дүрсгэл</option>
                                    <option>3. Булш оршуулгын дурсгал</option>
                                    <option>4. Тахил тайлгын байгууламж</option>
                                    <option>5. Барилга, архитектурын дурсгал</option>
                                    <option>6. Хөшөө дурсгал</option>
                                    <option>7. Үйлдвэрлэлийн ул мөр хадгалсан дурсгалт газар</option>
                                </select>
                                {this.state.torol_zuil_torol_zuil_level1.length > 0 && (
                                <select className="form-control" id="torol_zuil_torol_zuil_tree" value={this.state.torol_zuil_torol_zuil_tree} onChange={(e) => this.handleInputSelectTwo('torol_zuil_torol_zuil_tree', e)}>
                                    {this.state.torol_zuil_torol_zuil_level1}
                                </select>)}

                                {this.state.torol_zuil_torol_zuil_level2.length > 0 && (
                                <select className="form-control" id="torol_zuil_torol_zuil_tree2" value={this.state.torol_zuil_torol_zuil_tree2} onChange={(e) => this.handleInputSelect('torol_zuil_torol_zuil_tree2', e)}>
                                    {this.state.torol_zuil_torol_zuil_level2}
                                </select>)}
                            </div>
                        </td>
                        <th scope="row" style={{width: "20%"}}>Ерөнхий төрлийн код, нэрийг бичнэ.</th>
                    </tr>
                    <tr>
                        <th scope="row">Чулуулгын төрөл</th>
                        <td colSpan="7" scope="rowgroup"  scope="row">
                            <select className="form-control" id="torol_zuiltorol_zuil_name" value={this.state.torol_zuiltorol_zuil_name} onChange={(e) => this.handleInputSelect('torol_zuiltorol_zuil_name', e)}>
                                <option>Боржин</option>
                                <option>Гантиг</option>
                                <option>Занар</option>
                                <option>Элсэн чулуу</option>
                                <option>Хүрмэн чулуу</option>
                                <option>Цахурга чулуу</option>
                                <option>Бөсөл</option>
                                <option>Шохойн чулуу</option>
                                <option>Өөхөн чулуу</option>
                                <option>Бусад</option>
                            </select>
                        </td>
                        <th scope="row">Чулуун дурсгалыг урласан материалыг сонгоно.</th>
                    </tr>
                    <tr>
                        <th scope="row">Дурсгалт газрын нэр.</th>
                        <td colSpan="7" scope="rowgroup"  scope="row">
                            <input
                                type="text"
                                className="form-control"
                                id="torol_zuil_dursgalt_gazriin_ner"
                                onChange={(e) => this.handleTextArea('torol_zuil_dursgalt_gazriin_ner', e)}
                                value={this.state.torol_zuil_dursgalt_gazriin_ner}
                            />
                        </td>
                        <th scope="row">Ерөнхий төрлийн код, нэрийг бичнэ.</th>
                    </tr>
                    <tr>
                        <th rowSpan="20" scope="rowgroup" scope="row">Солбилцол</th>
                        <th rowSpan="2" scope="rowgroup" scope="row">№</th>
                        <td colSpan="3">UTM</td>
                        <td colSpan="2">Latitude Longitude</td>
                        <td rowSpan="2">Alt(m)</td>
                        <th rowSpan="20" scope="rowgroup">UTM стандартаар авсан Солбилцлын дагуу оруулна. Хэрэв Latitude Longitude стандартаар давхар авсан бол мөн тэмдэглэнэ.</th>
                    </tr>
                    <tr>
                        <td scope="row">UTM Zone</td>
                        <td scope="row">N</td>
                        <td scope="row">E</td>
                        <td scope="row">N</td>
                        <td scope="row">E</td>
                    </tr>

                    <tr>
                        <td scope="row"> namne</td>
                        <td scope="row">
                            <input
                                type="text"
                                className="form-control"
                                id="torol_zuil_dursgalt_gazriin_coordinatutm"
                                onChange={(e) => this.handleInput('torol_zuil_dursgalt_gazriin_coordinatutm', e)}
                                value={this.state.torol_zuil_dursgalt_gazriin_coordinatutm}
                            />
                        </td>
                        <td scope="row">
                            <input
                                type="number"
                                className="form-control"
                                id="torol_zuil_dursgalt_gazriin_coordinatx"
                                onChange={(e) => this.handleInput('torol_zuil_dursgalt_gazriin_coordinatx', e)}
                                value={this.state.torol_zuil_dursgalt_gazriin_coordinatx}
                            />
                        </td>
                        <td scope="row">
                            <input
                                type="number"
                                className="form-control"
                                id="torol_zuil_dursgalt_gazriin_coordinaty"
                                onChange={(e) => this.handleInput('torol_zuil_dursgalt_gazriin_coordinaty', e)}
                                value={this.state.torol_zuil_dursgalt_gazriin_coordinaty}
                            />
                        </td>
                        <td scope="row">
                            <input
                                type="number"
                                className="form-control"
                                id="torol_zuil_dursgalt_gazriin_coordinatllx"
                                onChange={(e) => this.handleInput('torol_zuil_dursgalt_gazriin_coordinatllx', e)}
                                value={this.state.torol_zuil_dursgalt_gazriin_coordinatllx}

                            />
                        </td>
                        <td scope="row">
                            <input
                                type="number"
                                className="form-control"
                                id="torol_zuil_dursgalt_gazriin_coordinatlly"
                                onChange={(e) => this.handleInput('torol_zuil_dursgalt_gazriin_coordinatlly', e)}
                                value={this.state.torol_zuil_dursgalt_gazriin_coordinatlly}

                            />
                        </td>
                        <td scope="row">
                            <input
                                type="number"
                                className="form-control"
                                id="torol_zuil_dursgalt_gazriin_coordinatalt"
                                onChange={(e) => this.handleInput('torol_zuil_dursgalt_gazriin_coordinatalt', e)}
                                value={this.state.torol_zuil_dursgalt_gazriin_coordinatalt}

                            />
                        </td>
                    </tr>

                </table>


                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <td colSpan="8">
                                <textarea 
                                    aria-label="With textarea"
                                    className="form-control"
                                    id="torol_zuil_todorhoilolt"
                                    style={{height:"120px"}}
                                    onChange={(e) => this.handleTextArea('torol_zuil_todorhoilolt', e)}
                                    value={this.state.torol_zuil_todorhoilolt}>

                                </textarea>
                            </td>
                            <th style={{width: "20%"}}>Дурсгалт газрын шинж чанар, хэлбэр хэмжээ, тоо ширхэг, хийсэн матерал, хадгалалт хамгаалалтын байдал зэргийг тоочин тэмдэглэл бичнэ.</th>
                        </tr>
                    </tbody>
                </table>

                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "10%"}}>Хэмжээ</th>
                            <td>Талбай</td>
                            <td>Урт</td>
                            <td>Өргөн</td>
                            <td>Өндөр</td>
                            <td>Зузаан</td>
                            <td>Голч</td>
                            <th rowSpan="3" scope="rowgroup" scope="row" style={{width: "20%"}}>Дурсгалт газрын ерөнхий хэмжээсийг метрийн нэгжид шилжүүлэн тохирох нүдэнд бичнэ. Бусад хэмжээний мэдээллийг "Бусад хэмжээс" хэсэгт бичнэ.</th>
                        </tr>
                        <tr>
                            <td>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="hemjee_talbai"
                                    onChange={(e) => this.handleInput('hemjee_talbai', e)}
                                    value={this.state.hemjee_talbai}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="hemjee_urt"
                                    onChange={(e) => this.handleInput('hemjee_urt', e)}
                                    value={this.state.hemjee_urt}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="hemjee_orgon"
                                    onChange={(e) => this.handleInput('hemjee_orgon', e)}
                                    value={this.state.hemjee_orgon}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="hemjee_ondor"
                                    onChange={(e) => this.handleInput('hemjee_ondor', e)}
                                    value={this.state.hemjee_ondor}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="hemjee_zuzaan"
                                    onChange={(e) => this.handleInput('hemjee_zuzaan', e)}
                                    value={this.state.hemjee_zuzaan}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="hemjee_golch"
                                    onChange={(e) => this.handleInput('hemjee_golch', e)}
                                    value={this.state.hemjee_golch}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Бусад хэмжээ</th>
                            <td colSpan="6" scope="rowgroup">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="hemjee_busad_hemjee"
                                    onChange={(e) => this.handleTextArea('hemjee_busad_hemjee', e)}
                                    value={this.state.hemjee_busad_hemjee}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Тоо ширхэг</th>
                            <td colSpan="6">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="hemjee_too_shirheg"
                                    onChange={(e) => this.handleTextArea('hemjee_too_shirheg', e)}
                                    value={this.state.hemjee_too_shirheg}
                                />
                            </td>
                            <th rowSpan="2" scope="rowgroup" scope="row">Хэрэв дурсгалт газрыг тоймлон тоолсон бол "Тоо ширхэг" хэсэгт тоон утгаар оруулж, "Тэмдэглэл" хэсэгт бичнэ.</th>
                        </tr>
                        <tr>
                            <th>                                
                                Тэмдэглэл
                            </th>
                            <td colSpan="6">
                                <textarea 
                                    aria-label="With textarea"
                                    className="form-control"
                                    id="hemjee_temdeglel"
                                    style={{height:"60px"}}
                                    onChange={(e) => this.handleTextArea('hemjee_temdeglel', e)}
                                    value={this.state.hemjee_temdeglel}>

                                </textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Дурсгалт газрын гэрээгээр хариуцуулж байгаа иргэн (малчин) байгаа эсэх.</th>
                            
                            <td>
                                <select className="form-control" id="dg_ezen_dursgalt_gazar_ezen" 
                                value={this.state.dg_ezen_dursgalt_gazar_ezen} 
                                onChange={(e) => this.handleInputSelect('dg_ezen_dursgalt_gazar_ezen', e)}>
                                    <option>Тийм</option>
                                    <option>Үгүй</option>
                                </select>
                                
                            </td>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг нь сонгоно.</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea 
                                    aria-label="With textarea"
                                    className="form-control"
                                    id="dg_ezen_temdeglel"
                                    style={{height:"60px"}}
                                    onChange={(e) => this.handleTextArea('dg_ezen_temdeglel', e)}
                                    value={this.state.dg_ezen_temdeglel}>
                                </textarea>
                            </td>
                            
                            <th>Дээр дурдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                        </tr>
                    </tbody>
                </table>

                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Хамгаалалтын ангилал.</th>
                            <td>
                                <select className="form-control" id="dgh_angilal" value={this.state.dgh_angilal} onChange={(e) => this.handleInput('dgh_angilal', e)}>
                                    <option>Улсын хадгалалтад.</option>
                                    <option>Аймгийн хадгалалтад.</option>
                                    <option>Сумын хадгалалтад.</option>
                                    <option>Хамгаалалтад аваагүй.</option>
                                </select>
                            </td>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                        </tr>
                        <tr>
                            <th rowSpan="4" scope="rowgroup" scope="row">Хамгаалалтын бүс тогтоох шаардлагатай эсэх.</th>
                            <td>
                                <select className="form-control" id="dgh_bus_togtooh_shaardlaga" 
                                value={this.state.dgh_bus_togtooh_shaardlaga} 
                                onChange={(e) => this.handleInputSelect('dgh_bus_togtooh_shaardlaga', e)}>
                                    <option>Тийм</option>
                                    <option>Үгүй</option>
                                </select>
                            </td>
                            <th rowSpan="4" scope="rowgroup" scope="row">Нэгийг сонгоно.</th>
                        </tr>
                        <tr>
                        </tr>
                    </tbody>
                </table>


                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Тусгай хамгаалалтад авах шаардлагатай эсэх.</th>
                            <td>
                                <select className="form-control" id="dgh_tusgai_hamgaalalt" 
                                value={this.state.dgh_tusgai_hamgaalalt} 
                                onChange={(e) => this.handleInputSelect('dgh_tusgai_hamgaalalt', e)}>
                                    <option>Тийм</option>
                                    <option>Үгүй</option>
                                </select>
                            </td>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                        </tr>
                        <tr>
                            <td>                                
                                <textarea 
                                    aria-label="With textarea"
                                    className="form-control"
                                    id="dgh_tusgai_temdeglel"
                                    style={{height:"60px"}}
                                    onChange={(e) => this.handleTextArea('dgh_tusgai_temdeglel', e)}
                                    value={this.state.dgh_tusgai_temdeglel}>

                                </textarea>
                            </td>
                            <th>Дээр дурдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                        </tr>
{/* /////////////////////////// */}
                        <tr>
                            <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Яаралтай авран хамгаалах шаардлагатай эсэх.</th>
                            <td>
                                <select className="form-control" id="dgh_yaaraltai_hamgaalalt" 
                                value={this.state.dgh_yaaraltai_hamgaalalt} 
                                onChange={(e) => this.handleInputSelect('dgh_yaaraltai_hamgaalalt', e)}>
                                    <option>Тийм</option>
                                    <option>Үгүй</option>
                                </select>
                            </td>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                        </tr>
                       
                        <tr>
                        <td>                                
                            <textarea 
                                aria-label="With textarea"
                                className="form-control"
                                id="dgh_yaaraltai_temdeglel"
                                style={{height:"60px"}}
                                onChange={(e) => this.handleTextArea('dgh_yaaraltai_temdeglel', e)}
                                value={this.state.dgh_yaaraltai_temdeglel}>

                            </textarea>
                        </td>
                            <th>Дээр дурдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                        </tr>
{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Өмчлөл, эзэмших ашиглалтын байдлыг өөрчлөх саналтай эсэх.</th>
                            <td>
                                <select className="form-control" id="dgh_omchlol_ezemshih_omchlol_sanal_hamgaalalt" 
                                value={this.state.dgh_omchlol_ezemshih_omchlol_sanal_hamgaalalt} 
                                onChange={(e) => this.handleInputSelect('dgh_omchlol_ezemshih_omchlol_sanal_hamgaalalt', e)}>
                                    <option>Тийм</option>
                                    <option>Үгүй</option>
                                </select>
                            </td>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                        </tr>
                        <tr>
                        <td>                                
                            <textarea 
                                aria-label="With textarea"
                                className="form-control"
                                id="dgh_omchlol_ezemshih_omchlol_sanal_temdeglel"
                                style={{height:"60px"}}
                                onChange={(e) => this.handleTextArea('dgh_omchlol_ezemshih_omchlol_sanal_temdeglel', e)}
                                value={this.state.dgh_omchlol_ezemshih_omchlol_sanal_temdeglel}>

                            </textarea>
                        </td>
                            <th>Дээр дурдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                        </tr>
{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Тухайн дурсгалт газрыг мэргэжлийн судалганы байгууллага судлан шигжлэх зорилгоор малтсан бол түүнийг тэмдэглэнэ. Хэрэв хууль бусаар ухаж тоносон бол "Гэмтлийн тухай мэдээлэл" хэсгээс хэд хэдэн сонголт хийж болно.</th>
                            <td>
                                <div className="col-md-12">
                                    <select className="form-control" id="dgh_maltan_sudaltan_hamgaalalt" 
                                        value={this.state.dgh_maltan_sudaltan_hamgaalalt} 
                                        onChange={(e) => this.handleInputSelect('dgh_maltan_sudaltan_hamgaalalt', e)}>
                                    <option>Тийм</option>
                                    <option>Үгүй</option>
                                </select>
                                </div>
                            </td>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                        </tr>
                        <tr>
                        <td>                                
                            <textarea 
                                aria-label="With textarea"
                                className="form-control"
                                id="dgh_maltan_sudaltan_temdeglel"
                                style={{height:"60px"}}
                                onChange={(e) => this.handleTextArea('dgh_maltan_sudaltan_temdeglel', e)}
                                value={this.state.dgh_maltan_sudaltan_temdeglel}>

                            </textarea>
                        </td>
                            <th>Хэрэв хууль бусаар ухаж, тоносон бол "Гэмтлийн тухай мэдээлэл" хэсгээс хэд хэдэн сонголт хийж болно.</th>
                        </tr>
{/* ////////////////////////////// */}

{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="13" scope="rowgroup" scope="row" style={{width: "30%"}}>Гэмтлийн тухай мэдээлэл.</th>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                    checked={this.state.dgh_gemtliin_tonoson}
                                    onChange={(e) => this.handleCheckSelectHun('dgh_gemtliin_tonoson', e, 'Тоносон')}
                                    value={this.state.dgh_gemtliin_tonoson}
                                        ></input>
                                    <label>Тоносон</label>
                                </div>
                            </td>
                            <th rowSpan="12" scope="rowgroup" scope="row" style={{width: "30%"}}>Хэд хэдэн сонголт хийж болно.</th>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                        checked={this.state.dgh_gemtliin_suitgesen}
                                        onChange={(e) => this.handleCheckSelectHun('dgh_gemtliin_suitgesen', e, 'Сүйтгэсэн')}
                                        value={this.state.dgh_gemtliin_suitgesen}
                                        ></input>
                                    <label>Сүйтгэсэн</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                        checked={this.state.dgh_gemtliin_budaj_ballasan}
                                        onChange={(e) => this.handleCheckSelectHun('dgh_gemtliin_budaj_ballasan', e, 'Будаж балласан')}
                                        value={this.state.dgh_gemtliin_budaj_ballasan}
                                        ></input>
                                    <label>Будаж балласан</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                        checked={this.state.dgh_gemtliin_hugalsan}
                                        onChange={(e) => this.handleCheckSelectHun('dgh_gemtliin_hugalsan', e, 'Хулгайлсан')}
                                        value={this.state.dgh_gemtliin_hugalsan}
                                        ></input>
                                    <label>Хулгайлсан</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                        checked={this.state.dgh_gemtliin_siilsen}
                                        onChange={(e) => this.handleCheckSelectHun('dgh_gemtliin_siilsen', e, 'Сийлсэн')}
                                        value={this.state.dgh_gemtliin_siilsen}
                                        ></input>
                                    <label>Сийлсэн</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                        checked={this.state.dgh_gemtliin_zoogdson}
                                        onChange={(e) => this.handleCheckSelectHun('dgh_gemtliin_zoogdson', e, 'Зөөгдсөн')}
                                        value={this.state.dgh_gemtliin_zoogdson}
                                        ></input>
                                    <label>Зөөгдсөн</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                        checked={this.state.dgh_gemtliin_alga_bolson}
                                        onChange={(e) => this.handleCheckSelectHun('dgh_gemtliin_alga_bolson', e, 'Алга болсон')}
                                        value={this.state.dgh_gemtliin_alga_bolson}
                                        ></input>
                                    <label>Алга болсон</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                        checked={this.state.dgh_gemtliin_tos_suu_bohirdol}
                                        onChange={(e) => this.handleCheckSelectHun('dgh_gemtliin_tos_suu_bohirdol', e, 'Тос сүүний бохирдолтой')}
                                        value={this.state.dgh_gemtliin_tos_suu_bohirdol}
                                        ></input>
                                    <label>Тос сүүний бохирдолтой</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                    checked={this.state.dgh_gemtliin_buruu_zassan}
                                    onChange={(e) => this.handleCheckSelectHun('dgh_gemtliin_buruu_zassan', e, 'Буруу зассан')}
                                    value={this.state.dgh_gemtliin_buruu_zassan}
                                        ></input>
                                    <label>Буруу зассан</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                        checked={this.state.dgh_gemtliin_hadag_bos_daavuu}
                                        onChange={(e) => this.handleCheckSelectHun('dgh_gemtliin_hadag_bos_daavuu', e, 'Халаг, бөс даавуу ороосон, уясан')}
                                        value={this.state.dgh_gemtliin_hadag_bos_daavuu}
                                        ></input>
                                    <label>Халаг, бөс даавуу ороосон, уясан</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                    checked={this.state.dgh_gemtliin_ded_buttsiin_ayuul}
                                    onChange={(e) => this.handleCheckSelectHun('dgh_gemtliin_ded_buttsiin_ayuul', e, 'Дэд бүтцийн аюулд орсон')}
                                    value={this.state.dgh_gemtliin_ded_buttsiin_ayuul}
                                        ></input>
                                    <label>Дэд бүтцийн аюулд орсон</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                    checked={this.state.dgh_gemtliin_aj_ahuin_ajillagaand}
                                    onChange={(e) => this.handleCheckSelectHun('dgh_gemtliin_aj_ahuin_ajillagaand', e, 'Аж ахуйн үйл ажиллагаанд өртсөн')}
                                    value={this.state.dgh_gemtliin_aj_ahuin_ajillagaand}
                                        ></input>
                                    <label>Аж ахуйн үйл ажиллагаанд өртсөн</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                        <td>                                
                            <textarea 
                                aria-label="With textarea"
                                className="form-control"
                                id="dgh_gemtliin_temdeglel"
                                style={{height:"60px"}}
                                onChange={(e) => this.handleTextArea('dgh_gemtliin_temdeglel', e)}
                                value={this.state.dgh_gemtliin_temdeglel}>

                            </textarea>
                        </td>
                            <th>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                        </tr>

{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="12" scope="rowgroup" scope="row" style={{width: "30%"}}>Байгалийн хүчин зүйл.</th>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                        checked={this.state.dgh_baigaliin_huchin_zuil_nar}
                                        onChange={(e) => this.handleCheckSelect('dgh_baigaliin_huchin_zuil_nar', e, 'Нарны нөлөөлөл')}
                                        value={this.state.dgh_baigaliin_huchin_zuil_nar}
                                        ></input>
                                    <label>Нарны нөлөөлөл</label>
                                </div>
                            </td>
                            <th rowSpan="11" scope="rowgroup" scope="row" style={{width: "30%"}}>Хэд хэдэн сонголт хийж болно.</th>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                        checked={this.state.dgh_baigaliin_huchin_zuil_salhi}
                                        onChange={(e) => this.handleCheckSelect('dgh_baigaliin_huchin_zuil_salhi', e, 'Салхиний нөлөөлөл')}
                                        value={this.state.dgh_baigaliin_huchin_zuil_salhi}
                                        ></input>
                                    <label>Салхиний нөлөөлөл</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                    checked={this.state.dgh_baigaliin_huchin_zuil_erdes_shohoin}
                                    onChange={(e) => this.handleCheckSelect('dgh_baigaliin_huchin_zuil_erdes_shohoin', e, 'Эрдэс шохойн нөлөөлөл')}
                                    value={this.state.dgh_baigaliin_huchin_zuil_erdes_shohoin}
                                        ></input>
                                    <label>Эрдэс шохойн нөлөөлөл</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                    checked={this.state.dgh_baigaliin_huchin_zuil_uer_us}
                                    onChange={(e) => this.handleCheckSelect('dgh_baigaliin_huchin_zuil_uer_us', e, 'Үер усны нөлөөлөл')}
                                    value={this.state.dgh_baigaliin_huchin_zuil_uer_us}
                                        ></input>
                                    <label>Үер усны нөлөөлөл</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                    checked={this.state.dgh_baigaliin_huchin_zuil_aynga}
                                    onChange={(e) => this.handleCheckSelect('dgh_baigaliin_huchin_zuil_aynga', e, 'Аянга цахилгаанд өртсөн')}
                                    value={this.state.dgh_baigaliin_huchin_zuil_aynga}
                                        ></input>
                                    <label>Аянга цахилгаанд өртсөн</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                    checked={this.state.dgh_baigaliin_huchin_zuil_gal_tuimer}
                                    onChange={(e) => this.handleCheckSelect('dgh_baigaliin_huchin_zuil_gal_tuimer', e, 'Гал түймэрт өртсөн')}
                                    value={this.state.dgh_baigaliin_huchin_zuil_gal_tuimer}
                                        ></input>
                                    <label>Гал түймэрт өртсөн</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                    checked={this.state.dgh_baigaliin_huchin_zuil_gazar_hodlolt}
                                    onChange={(e) => this.handleCheckSelect('dgh_baigaliin_huchin_zuil_gazar_hodlolt', e, 'Газар хөдлөлт')}
                                    value={this.state.dgh_baigaliin_huchin_zuil_gazar_hodlolt}
                                        ></input>
                                    <label>Газар хөдлөлт</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                    checked={this.state.dgh_baigaliin_huchin_zuil_hag_urgamliin}
                                    onChange={(e) => this.handleCheckSelect('dgh_baigaliin_huchin_zuil_hag_urgamliin', e, 'Хаг ургамлын нөлөө')}
                                    value={this.state.dgh_baigaliin_huchin_zuil_hag_urgamliin}
                                        ></input>
                                    <label>Хаг ургамлын нөлөө</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                    checked={this.state.dgh_baigaliin_huchin_zuil_biologiin}
                                    onChange={(e) => this.handleCheckSelect('dgh_baigaliin_huchin_zuil_biologiin', e, 'Биологийн бохирдолтой')}
                                    value={this.state.dgh_baigaliin_huchin_zuil_biologiin}
                                        ></input>
                                    <label>Биологийн бохирдолтой</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                    checked={this.state.dgh_baigaliin_huchin_zuil_chuluuni_ogorshil}
                                    onChange={(e) => this.handleCheckSelect('dgh_baigaliin_huchin_zuil_chuluuni_ogorshil', e, 'Чулууны өгөршил')}
                                    value={this.state.dgh_baigaliin_huchin_zuil_chuluuni_ogorshil}
                                        ></input>
                                    <label>Чулууны өгөршил</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="col-md-12">
                                    <input 
                                        type="checkbox" 
                                    checked={this.state.dgh_baigaliin_huchin_zuil_mal_amitnii}
                                    onChange={(e) => this.handleCheckSelect('dgh_baigaliin_huchin_zuil_mal_amitnii', e, 'Мал амьтны нөлөөлөл')}
                                    value={this.state.dgh_baigaliin_huchin_zuil_mal_amitnii}
                                        ></input>
                                    <label>Мал амьтны нөлөөлөл</label>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>                                
                                <textarea 
                                    aria-label="With textarea"
                                    className="form-control"
                                    id="dgh_baigaliin_huchin_zuil_temdeglel"
                                    style={{height:"60px"}}
                                    onChange={(e) => this.handleTextArea('dgh_baigaliin_huchin_zuil_temdeglel', e)}
                                    value={this.state.dgh_baigaliin_huchin_zuil_temdeglel}>

                                </textarea>

                            </td>
                            <th>       
                                Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно
                            </th>
                        </tr>

{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Сэргээн засварласан эсэх.</th>
                            <td>
                                <select className="form-control" id="dgh_sergeen_zasvarlasan_eseh_hamgaalalt" 
                                        value={this.state.dgh_sergeen_zasvarlasan_eseh_hamgaalalt} 
                                        onChange={(e) => this.handleInputSelect('dgh_sergeen_zasvarlasan_eseh_hamgaalalt', e)}>
                                    <option>Тийм</option>
                                    <option>Үгүй</option>
                                    <option>Тодорхой биш</option>
                                </select>
                            </td>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                        </tr>
                        <tr>
                            <td>                                
                                <textarea 
                                    aria-label="With textarea"
                                    className="form-control"
                                    id="dgh_sergeen_zasvarlasan_eseh_temdeglel"
                                    style={{height:"60px"}}
                                    onChange={(e) => this.handleTextArea('dgh_sergeen_zasvarlasan_eseh_temdeglel', e)}
                                    value={this.state.dgh_sergeen_zasvarlasan_eseh_temdeglel}>

                                </textarea>
                            </td>
                            <th>
                            Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.
                            </th>
                        </tr>
{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Сэргээн засварлах эсэх.</th>
                            <td>
                                <select className="form-control" id="dgh_sergeen_zasvarlah_eseh_nenshaardlaga" 
                                        value={this.state.dgh_sergeen_zasvarlah_eseh_nenshaardlaga} 
                                        onChange={(e) => this.handleInputSelect('dgh_sergeen_zasvarlah_eseh_nenshaardlaga', e)}>
                                    <option>Нэн шаардлагатай</option>
                                    <option>Шаардлагагүй</option>
                                    <option>Шаардлагатай</option>
                                </select>
                                
                            </td>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                        </tr>
                        <tr>
                            <td>                                
                                <textarea 
                                    aria-label="With textarea"
                                    className="form-control"
                                    id="dgh_sergeen_zasvarlah_eseh_temdeglel"
                                    style={{height:"60px"}}
                                    onChange={(e) => this.handleTextArea('dgh_sergeen_zasvarlah_eseh_temdeglel', e)}
                                    value={this.state.dgh_sergeen_zasvarlah_eseh_temdeglel}>

                                </textarea>
                            </td>
                            <th>                                

                                Шалтгааныг товч бичнэ.
                            </th>
                        </tr>
{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Хамгаалалтын зэрэг өөрчлөх санал.</th>
                            <td>
                                <select className="form-control" id="dgh_hamgaalaltiin_zereg_oorchloh_sanal" value={this.state.dgh_hamgaalaltiin_zereg_oorchloh_sanal} onChange={(e) => this.handleInputSelectTwo('dgh_hamgaalaltiin_zereg_oorchloh_sanal', e)}>
                                    <option>Улсын хамгаалалтаас аймгийн хамгаалалтад</option>
                                    <option>Аймгийн хамгаалалтаас улсын хамгаалалтад</option>
                                    <option>Сумын хамгаалалтаас аймгийн хамгаалалтад</option>
                                    <option>Аймгийн хамгаалалтаас сумын хамгаалалтад</option>
                                    <option>Үгүй</option>
                                </select>
                            </td>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Нэгийг сонгоно.</th>
                        </tr>
               
                        <tr>
                        <td>                                
                            <textarea 
                                aria-label="With textarea"
                                className="form-control"
                                id="dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel"
                                style={{height:"60px"}}
                                onChange={(e) => this.handleTextArea('dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel', e)}
                                value={this.state.dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel}>

                            </textarea>
                        </td>
                            <th>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                        </tr>
{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Хашаа хайстай эсэх.</th>
                            <td>
                                <select className="form-control" id="dgh_hashaa_baigaa_eseh_hashaa" 
                                        value={this.state.dgh_hashaa_baigaa_eseh_hashaa} 
                                        onChange={(e) => this.handleInputSelect('dgh_hashaa_baigaa_eseh_hashaa', e)}>
                                    <option>Тийм</option>
                                    <option>Үгүй</option>
                                </select>
                            </td>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                        </tr>
                        <tr>
                        <td>                                
                            <textarea 
                                aria-label="With textarea"
                                className="form-control"
                                id="dgh_hashaa_baigaa_eseh_temdeglel"
                                style={{height:"60px"}}
                                onChange={(e) => this.handleTextArea('dgh_hashaa_baigaa_eseh_temdeglel', e)}
                                value={this.state.dgh_hashaa_baigaa_eseh_temdeglel}>

                            </textarea>
                        </td>
                            <th>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                        </tr>
{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Саравчтай эсэх.</th>
                            <td>
                                <select className="form-control" id="dgh_saravchtai_eseh_saravch" 
                                        value={this.state.dgh_saravchtai_eseh_saravch} 
                                        onChange={(e) => this.handleInputSelect('dgh_saravchtai_eseh_saravch', e)}>
                                    <option>Тийм</option>
                                    <option>Үгүй</option>
                                </select>
                            </td>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                        </tr>
                        <tr>
                        <td>                                
                            <textarea 
                                aria-label="With textarea"
                                className="form-control"
                                id="dgh_saravchtai_eseh_temdeglel"
                                style={{height:"60px"}}
                                onChange={(e) => this.handleTextArea('dgh_saravchtai_eseh_temdeglel', e)}
                                value={this.state.dgh_saravchtai_eseh_temdeglel}>

                            </textarea>
                        </td>
                            <th>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                        </tr>
{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Хаяг тайлбартай эсэх.</th>
                            <td>
                                <select className="form-control" id="dgh_hayg_tailbar_eseh_hayg" 
                                        value={this.state.dgh_hayg_tailbar_eseh_hayg} 
                                        onChange={(e) => this.handleInputSelect('dgh_hayg_tailbar_eseh_hayg', e)}>
                                    <option>Тийм</option>
                                    <option>Үгүй</option>
                                </select>
                            </td>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                        </tr>
                        <tr>
                        <td>                                
                            <textarea 
                                aria-label="With textarea"
                                className="form-control"
                                id="dgh_hayg_tailbar_eseh_temdeglel"
                                style={{height:"60px"}}
                                onChange={(e) => this.handleTextArea('dgh_hayg_tailbar_eseh_temdeglel', e)}
                                value={this.state.dgh_hayg_tailbar_eseh_temdeglel}>

                            </textarea>
                        </td>
                            <th>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                        </tr>




{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Бусад тэмдэглэл.</th>
                            <td>                                
                                <textarea 
                                    aria-label="With textarea"
                                    className="form-control"
                                    id="last_busad_temdeglel"
                                    style={{height:"60px"}}
                                    onChange={(e) => this.handleTextArea('last_busad_temdeglel', e)}
                                    value={this.state.last_busad_temdeglel}>

                                </textarea>
                            </td>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Дээр асуулгад хамрагдаагүй бусад мэдээллийг тэмдэгтээр бичнэ.</th>
                        </tr>
{/* ////////////////////////////// */}               
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
