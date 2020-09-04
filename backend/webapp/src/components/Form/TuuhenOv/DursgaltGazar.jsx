import React, { Component, Fragment } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import {service} from '../service'
import {validationSchemaTseg} from './validationSchema'
import {Formik, Field, Form, ErrorMessage} from 'formik'

export class DursgaltGazar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tuuhenov_id: '',
            durgal_id: null,
            values: {
                tuuh_soyl_id: null,
                tuuhin_ov_register_id: null,
                tuuhin_ov_date: '',
                tuuhin_ov_aimag: '',
                tuuhin_ov_sum_duureg: '',

            
                torol_zuiltorol_zuil_name: '',
                torol_zuil_dursgalt_gazriin_ner: '',

                torol_zuil_dursgalt_gazriin_coordinatutm: '',
                torol_zuil_dursgalt_gazriin_coordinatx: null,
                torol_zuil_dursgalt_gazriin_coordinaty: null,
                torol_zuil_dursgalt_gazriin_coordinatllx: null,
                torol_zuil_dursgalt_gazriin_coordinatlly: null,
                torol_zuil_dursgalt_gazriin_coordinatalt: null,

                torol_zuil_todorhoilolt: '',
                hemjee_talbai: null,
                hemjee_urt: null,
                hemjee_orgon: null,
                hemjee_ondor: null,
                hemjee_zuzaan: null,
                hemjee_golch: null,

                hemjee_busad_hemjee: '',
                hemjee_too_shirheg: null,
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

                dgh_gemtliin_temdeglel: '',

                
                dgh_baigaliin_huchin_zuil_temdeglel: '',

                dgh_sergeen_zasvarlasan_eseh_hamgaalalt: 'Үгүй',
                dgh_sergeen_zasvarlasan_eseh_temdeglel: '',

                dgh_sergeen_zasvarlah_eseh_nenshaardlaga: 'Шаардлагагүй',
                dgh_sergeen_zasvarlah_eseh_temdeglel: '',

                dgh_hamgaalaltiin_zereg_oorchloh_sanal: '',
                dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel: '',

                dgh_hashaa_baigaa_eseh_hashaa: 'Үгүй',
                dgh_hashaa_baigaa_eseh_temdeglel: '',

                dgh_saravchtai_eseh_saravch: 'Үгүй',
                dgh_saravchtai_eseh_temdeglel: '',

                dgh_hayg_tailbar_eseh_hayg: 'Үгүй',
                dgh_hayg_tailbar_eseh_temdeglel: '',


                last_busad_temdeglel: '',

            },
            torol_zuil_torol_zuil: '',
            torol_zuil_torol_zuil_tree: '',
            torol_zuil_torol_zuil_tree2: '',
            torol_zuil_torol_zuil_level1: [],
            torol_zuil_torol_zuil_level2: [],
            dgh_gemtliin_all: [],
            dgh_baigaliin_huchin_zuil_all: [],


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
            handle_save_succes: false,
            human: '',
            natural: '',



        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInput = this.handleInput.bind(this)


        this.handleInputSelect = this.handleInputSelect.bind(this)
        this.handleInputSelectTwo = this.handleInputSelectTwo.bind(this)
        this.handleTextArea = this.handleTextArea.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleCheckSelect = this.handleCheckSelect.bind(this)
        this.handleCheckSelectHun = this.handleCheckSelectHun.bind(this)
        this.handleCheckGroup = this.handleCheckGroup.bind(this)
        this.humenCheck = this.humenCheck.bind(this)
        this.baigalCheck = this.baigalCheck.bind(this)
    }
    
    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.human !== this.state.human)
        {
            this.humenCheck(this.state.human)
        }
        if(prevState.natural !== this.state.natural)
        {
            this.baigalCheck(this.state.natural)
        }
    }

    humenCheck(human){
        var humanArray = eval('(' + human + ')');
        let dgh_gemtliin_all = this.state.dgh_gemtliin_all
        for(var i = 0; i<humanArray.length; i++)
        {
            if(humanArray[i] == 'Тоносон') {
                this.setState({dgh_gemtliin_tonoson: true}) 
                dgh_gemtliin_all.push('Тоносон') 
            }
            if(humanArray[i] == 'Сүйтгэсэн') {
                this.setState({dgh_gemtliin_suitgesen: true}) 
                dgh_gemtliin_all.push('Сүйтгэсэн') 
            
            }
            if(humanArray[i] == 'Будаж балласан') {
                this.setState({dgh_gemtliin_budaj_ballasan: true}) 
                dgh_gemtliin_all.push('Будаж балласан') 
            
            }
            if(humanArray[i] == 'Хулгайлсан') {
                this.setState({dgh_gemtliin_hugalsan: true}) 
                dgh_gemtliin_all.push('Хулгайлсан') 
            
            }
            if(humanArray[i] == 'Сийлсэн') {
                this.setState({dgh_gemtliin_siilsen: true}) 
                dgh_gemtliin_all.push('Сийлсэн') 
            
            }
            if(humanArray[i] == 'Зөөгдсөн') {
                this.setState({dgh_gemtliin_zoogdson: true}) 
                dgh_gemtliin_all.push('Зөөгдсөн') 
            
            }
            if(humanArray[i] == 'Алга болсон') {
                this.setState({dgh_gemtliin_alga_bolson: true}) 
                dgh_gemtliin_all.push('Алга болсон') 
            
            }
            if(humanArray[i] == 'Тос сүүний бохирдолтой') {
                this.setState({dgh_gemtliin_tos_suu_bohirdol: true}) 
                dgh_gemtliin_all.push('Тос сүүний бохирдолтой') 
            
            }
            if(humanArray[i] == 'Буруу зассан') {
                this.setState({dgh_gemtliin_buruu_zassan: true}) 
                dgh_gemtliin_all.push('Буруу зассан') 
            
            }
            if(humanArray[i] == 'Халаг, бөс даавуу ороосон, уясан') {
                this.setState({dgh_gemtliin_hadag_bos_daavuu: true}) 
                dgh_gemtliin_all.push('Халаг, бөс даавуу ороосон, уясан') 
            
            }
            if(humanArray[i] == 'Дэд бүтцийн аюулд орсон') {
                this.setState({dgh_gemtliin_ded_buttsiin_ayuul: true}) 
                dgh_gemtliin_all.push('Дэд бүтцийн аюулд орсон') 
            
            }
            if(humanArray[i] == 'Аж ахуйн үйл ажиллагаанд өртсөн') {
                this.setState({dgh_gemtliin_aj_ahuin_ajillagaand: true}) 
                dgh_gemtliin_all.push('Аж ахуйн үйл ажиллагаанд өртсөн') 
            
            }
        }
        this.setState({dgh_gemtliin_all})
    }
    baigalCheck(natural){
        var naturalArray = eval('(' + natural + ')');
        let dgh_baigaliin_huchin_zuil_all = this.state.dgh_baigaliin_huchin_zuil_all
        for(var i = 0; i<naturalArray.length; i++)
        {
            if(naturalArray[i] == 'Нарны нөлөөлөл') {
                this.setState({dgh_baigaliin_huchin_zuil_nar: true}) 
                dgh_baigaliin_huchin_zuil_all.push('Нарны нөлөөлөл') 
            }
            if(naturalArray[i] == 'Салхиний нөлөөлөл') {
                this.setState({dgh_baigaliin_huchin_zuil_salhi: true}) 
                dgh_baigaliin_huchin_zuil_all.push('Салхиний нөлөөлөл') 
            
            }
            if(naturalArray[i] == 'Эрдэс шохойн нөлөөлөл') {
                this.setState({dgh_baigaliin_huchin_zuil_erdes_shohoin: true}) 
                dgh_baigaliin_huchin_zuil_all.push('Эрдэс шохойн нөлөөлөл') 
            
            }
            if(naturalArray[i] == 'Үер усны нөлөөлөл') {
                this.setState({dgh_baigaliin_huchin_zuil_uer_us: true}) 
                dgh_baigaliin_huchin_zuil_all.push('Үер усны нөлөөлөл') 
            
            }
            if(naturalArray[i] == 'Аянга цахилгаанд өртсөн') {
                this.setState({dgh_baigaliin_huchin_zuil_aynga: true}) 
                dgh_baigaliin_huchin_zuil_all.push('Аянга цахилгаанд өртсөн') 
            
            }
            if(naturalArray[i] == 'Гал түймэрт өртсөн') {
                this.setState({dgh_baigaliin_huchin_zuil_gal_tuimer: true}) 
                dgh_baigaliin_huchin_zuil_all.push('Гал түймэрт өртсөн') 
            
            }
            if(naturalArray[i] == 'Газар хөдлөлт') {
                this.setState({dgh_baigaliin_huchin_zuil_gazar_hodlolt: true}) 
                dgh_baigaliin_huchin_zuil_all.push('Газар хөдлөлт') 
            
            }
            if(naturalArray[i] == 'Хаг ургамлын нөлөө') {
                this.setState({dgh_baigaliin_huchin_zuil_hag_urgamliin: true}) 
                dgh_baigaliin_huchin_zuil_all.push('Хаг ургамлын нөлөө') 
            
            }
            if(naturalArray[i] == 'Биологийн бохирдолтой') {
                this.setState({dgh_baigaliin_huchin_zuil_biologiin: true}) 
                dgh_baigaliin_huchin_zuil_all.push('Биологийн бохирдолтой') 
            
            }
            if(naturalArray[i] == 'Чулууны өгөршил') {
                this.setState({dgh_baigaliin_huchin_zuil_chuluuni_ogorshil: true}) 
                dgh_baigaliin_huchin_zuil_all.push('Чулууны өгөршил') 
            
            }
            if(naturalArray[i] == 'Мал амьтны нөлөөлөл') {
                this.setState({dgh_baigaliin_huchin_zuil_mal_amitnii: true}) 
                dgh_baigaliin_huchin_zuil_all.push('Мал амьтны нөлөөлөл') 
            
            }
            
        }
        this.setState({dgh_baigaliin_huchin_zuil_all})
    }

    componentDidMount(){
        const tuuhenov_id = this.props.match.params.id
        this.setState({tuuhenov_id})
        const durgal_id = this.props.match.params.idx
        if(durgal_id){
            this.setState({durgal_id})

            service.dursgaltGazarAbout(durgal_id).then(({form_data}) => {
                if(form_data){
                    form_data.map((tuuh) => (

                        this.setState({ 
                            values:{
                                tuuhin_ov_date: tuuh['created_at'],
                                

                                torol_zuiltorol_zuil_name: tuuh['stone'],
                                torol_zuil_dursgalt_gazriin_ner: tuuh['dursgal'],

                    
                                torol_zuil_dursgalt_gazriin_coordinatutm: tuuh['utm_zone'],
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
                                dgh_hamgaalaltiin_zereg_oorchloh_sanal:tuuh['protecti_2'], 
                                dgh_sergeen_zasvarlasan_eseh_temdeglel: tuuh['recover_comment'],
                                dgh_sergeen_zasvarlah_eseh_temdeglel: tuuh['recover1_comment'],
                                dgh_saravchtai_eseh_temdeglel: tuuh['saravch_comment'],
                                dgh_hayg_tailbar_eseh_temdeglel: tuuh['hayg_comment'],
                                last_busad_temdeglel: tuuh['other1'],
                                torol_zuil_dursgalt_gazriin_coordinatalt: tuuh['alt'],
                                hemjee_talbai: tuuh['area'],
                            },
                            torol_zuil_torol_zuil: tuuh['type1'],
                            torol_zuil_torol_zuil_tree2: tuuh['type2'],
                            human: tuuh['human'],
                            natural: tuuh['natural'],
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
    
    handleSubmit(values, { setStatus, setSubmitting }) {

        setStatus('checking')
        setSubmitting(true)
        this.setState({values})

        const id = this.props.match.params.id
        const idx = this.props.match.params.idx

        const form_datas_values = this.state.values
        const form_datas = this.state
        if(idx){
            service.dursgaltGazarUpdate(form_datas_values, form_datas).then(({success}) => {
                if (success) {
                    setTimeout(() => {
                        setStatus('saved')
                        this.props.history.goBack()
                        this.props.history.push( `/back/froms/tuuhen-ov/${id}/add/`)
                    }, 1000)
                }
            })
        }
        else{
            service.dursgaltGazarCreate(form_datas_values, form_datas).then(({success}) => {
                if (success) {
                    setTimeout(() => {
                        setStatus('saved')
                        this.props.history.goBack()
                        this.props.history.push( `/back/froms/tuuhen-ov/${id}/add/`)

                    }, 1000)
                }
            })
        }
    }

    render() {
        return (
            <Formik
                enableReinitialize
                initialValues={this.state.values}
                validationSchema={validationSchemaTseg}
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
                                    <Fragment>
                                        <Field name="torol_zuiltorol_zuil_name" as="select" className="form-control"
                                        className={'form-control ' + (errors.torol_zuiltorol_zuil_name ? 'is-invalid' : '')}>
                                            <option> </option>
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
                                        </Field>
                                        <ErrorMessage name="torol_zuiltorol_zuil_name" component="div" className="invalid-feedback"/>
                                    </Fragment>
                                </td>
                                <th scope="row">Чулуун дурсгалыг урласан материалыг сонгоно.</th>
                            </tr>
                            <tr>
                                <th scope="row">Дурсгалт газрын нэр.</th>
                                <td colSpan="7" scope="rowgroup"  scope="row">
                                    <Field
                                        className={'form-control ' + (errors.torol_zuil_dursgalt_gazriin_ner ? 'is-invalid' : '')}
                                        name='torol_zuil_dursgalt_gazriin_ner'
                                        id="id_torol_zuil_dursgalt_gazriin_ner"
                                        type="text"
                                    />
                                    <ErrorMessage name="torol_zuil_dursgalt_gazriin_ner" component="div" className="invalid-feedback"/>
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
                                    <Field
                                        className={'form-control ' + (errors.torol_zuil_dursgalt_gazriin_coordinatutm ? 'is-invalid' : '')}
                                        name='torol_zuil_dursgalt_gazriin_coordinatutm'
                                        id="id_torol_zuil_dursgalt_gazriin_coordinatutm"
                                        type="text"
                                    />
                                    <ErrorMessage name="torol_zuil_dursgalt_gazriin_coordinatutm" component="div" className="invalid-feedback"/>
                                </td>
                                <td scope="row">
                                    <Field
                                        className={'form-control ' + (errors.torol_zuil_dursgalt_gazriin_coordinatx ? 'is-invalid' : '')}
                                        name='torol_zuil_dursgalt_gazriin_coordinatx'
                                        id="id_torol_zuil_dursgalt_gazriin_coordinatx"
                                        type="text"
                                    />
                                    <ErrorMessage name="torol_zuil_dursgalt_gazriin_coordinatx" component="div" className="invalid-feedback"/>
                                </td>
                                <td scope="row">
                                    <Field
                                        className={'form-control ' + (errors.torol_zuil_dursgalt_gazriin_coordinaty ? 'is-invalid' : '')}
                                        name='torol_zuil_dursgalt_gazriin_coordinaty'
                                        id="id_torol_zuil_dursgalt_gazriin_coordinaty"
                                        type="text"
                                    />
                                    <ErrorMessage name="torol_zuil_dursgalt_gazriin_coordinaty" component="div" className="invalid-feedback"/>
                                </td>
                                <td scope="row">
                                    <Field
                                        className={'form-control ' + (errors.torol_zuil_dursgalt_gazriin_coordinatllx ? 'is-invalid' : '')}
                                        name='torol_zuil_dursgalt_gazriin_coordinatllx'
                                        id="id_torol_zuil_dursgalt_gazriin_coordinatllx"
                                        type="text"
                                    />
                                    <ErrorMessage name="torol_zuil_dursgalt_gazriin_coordinatllx" component="div" className="invalid-feedback"/>
                                </td>
                                <td scope="row">
                                    <Field
                                        className={'form-control ' + (errors.torol_zuil_dursgalt_gazriin_coordinatlly ? 'is-invalid' : '')}
                                        name='torol_zuil_dursgalt_gazriin_coordinatlly'
                                        id="id_torol_zuil_dursgalt_gazriin_coordinatlly"
                                        type="text"
                                    />
                                    <ErrorMessage name="torol_zuil_dursgalt_gazriin_coordinatlly" component="div" className="invalid-feedback"/>
                                </td>
                                <td scope="row">
                                    <Field
                                        className={'form-control ' + (errors.torol_zuil_dursgalt_gazriin_coordinatalt ? 'is-invalid' : '')}
                                        name='torol_zuil_dursgalt_gazriin_coordinatalt'
                                        id="id_torol_zuil_dursgalt_gazriin_coordinatalt"
                                        type="text"
                                    />
                                    <ErrorMessage name="torol_zuil_dursgalt_gazriin_coordinatalt" component="div" className="invalid-feedback"/>
                                </td>
                            </tr>

                        </table>


                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td colSpan="8">
                                        <Field
                                            className={'form-control ' + (errors.torol_zuil_todorhoilolt ? 'is-invalid' : '')}
                                            component="textarea"
                                            name='torol_zuil_todorhoilolt'
                                            id="id_torol_zuil_todorhoilolt"
                                            type="textarea"
                                        />
                                        <ErrorMessage name="torol_zuil_todorhoilolt" component="div" className="invalid-feedback"/>
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
                                        <Field
                                            className={'form-control ' + (errors.hemjee_talbai ? 'is-invalid' : '')}
                                            name='hemjee_talbai'
                                            id="id_hemjee_talbai"
                                            type="text"
                                        />
                                        <ErrorMessage name="hemjee_talbai" component="div" className="invalid-feedback"/>
                                    </td>
                                    <td>
                                        <Field
                                            className={'form-control ' + (errors.hemjee_urt ? 'is-invalid' : '')}
                                            name='hemjee_urt'
                                            id="id_hemjee_urt"
                                            type="text"
                                        />
                                        <ErrorMessage name="hemjee_urt" component="div" className="invalid-feedback"/>
                                    </td>
                                    <td>
                                        <Field
                                            className={'form-control ' + (errors.hemjee_orgon ? 'is-invalid' : '')}
                                            name='hemjee_orgon'
                                            id="id_hemjee_orgon"
                                            type="text"
                                        />
                                        <ErrorMessage name="hemjee_orgon" component="div" className="invalid-feedback"/>
                                    </td>
                                    <td>
                                        <Field
                                            className={'form-control ' + (errors.hemjee_ondor ? 'is-invalid' : '')}
                                            name='hemjee_ondor'
                                            id="id_hemjee_ondor"
                                            type="text"
                                        />
                                        <ErrorMessage name="hemjee_ondor" component="div" className="invalid-feedback"/>
                                    </td>
                                    <td>
                                        <Field
                                            className={'form-control ' + (errors.hemjee_zuzaan ? 'is-invalid' : '')}
                                            name='hemjee_zuzaan'
                                            id="id_hemjee_zuzaan"
                                            type="text"
                                        />
                                        <ErrorMessage name="hemjee_zuzaan" component="div" className="invalid-feedback"/>
                                    </td>
                                    <td>
                                        <Field
                                            className={'form-control ' + (errors.hemjee_golch ? 'is-invalid' : '')}
                                            name='hemjee_golch'
                                            id="id_hemjee_golch"
                                            type="text"
                                        />
                                        <ErrorMessage name="hemjee_golch" component="div" className="invalid-feedback"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Бусад хэмжээ</th>
                                    <td colSpan="6" scope="rowgroup">
                                        <Field
                                            className={'form-control ' + (errors.hemjee_busad_hemjee ? 'is-invalid' : '')}
                                            name='hemjee_busad_hemjee'
                                            id="id_hemjee_busad_hemjee"
                                            type="text"
                                        />
                                        <ErrorMessage name="hemjee_busad_hemjee" component="div" className="invalid-feedback"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Тоо ширхэг</th>
                                    <td colSpan="6">
                                        <Field
                                            className={'form-control ' + (errors.hemjee_too_shirheg ? 'is-invalid' : '')}
                                            name='hemjee_too_shirheg'
                                            id="id_hemjee_too_shirheg"
                                            type="text"
                                        />
                                        <ErrorMessage name="hemjee_too_shirheg" component="div" className="invalid-feedback"/>
                                    </td>
                                    <th rowSpan="2" scope="rowgroup" scope="row">Хэрэв дурсгалт газрыг тоймлон тоолсон бол "Тоо ширхэг" хэсэгт тоон утгаар оруулж, "Тэмдэглэл" хэсэгт бичнэ.</th>
                                </tr>
                                <tr>
                                    <th>                                
                                        Тэмдэглэл
                                    </th>
                                    <td colSpan="6">
                                        <Field
                                            className={'form-control ' + (errors.hemjee_temdeglel ? 'is-invalid' : '')}
                                            component="textarea"
                                            name='hemjee_temdeglel'
                                            id="id_hemjee_temdeglel"
                                            type="textarea"
                                        />
                                        <ErrorMessage name="hemjee_temdeglel" component="div" className="invalid-feedback"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Дурсгалт газрын гэрээгээр хариуцуулж байгаа иргэн (малчин) байгаа эсэх.</th>
                                    
                                    <td>
                                        <Fragment>
                                            <Field name="dg_ezen_dursgalt_gazar_ezen" as="select" className="form-control"
                                                className={'form-control ' + (errors.dg_ezen_dursgalt_gazar_ezen ? 'is-invalid' : '')}>
                                                <option> </option>
                                                <option>Тийм</option>
                                                <option>Үгүй</option>
                                            </Field>
                                            <ErrorMessage name="dg_ezen_dursgalt_gazar_ezen" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                    </td>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг нь сонгоно.</th>
                                </tr>
                                <tr>
                                    <td>
                                        <Field
                                            className={'form-control ' + (errors.dg_ezen_temdeglel ? 'is-invalid' : '')}
                                            component="textarea"
                                            name='dg_ezen_temdeglel'
                                            id="id_dg_ezen_temdeglel"
                                            type="textarea"
                                        />
                                        <ErrorMessage name="dg_ezen_temdeglel" component="div" className="invalid-feedback"/>
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
                                        <Fragment>
                                            <Field name="dgh_angilal" as="select" className="form-control"
                                                className={'form-control ' + (errors.dgh_angilal ? 'is-invalid' : '')}>
                                                <option> </option>
                                                <option>Улсын хадгалалтад</option>
                                                <option>Аймгийн хадгалалтад</option>
                                                <option>Сумын хадгалалтад</option>
                                                <option>Хамгаалалтад аваагүй</option>
                                            </Field>
                                            <ErrorMessage name="dgh_angilal" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                    </td>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                                </tr>
                                <tr>
                                    <th rowSpan="4" scope="rowgroup" scope="row">Хамгаалалтын бүс тогтоох шаардлагатай эсэх.</th>
                                    <td>
                                        <Fragment>
                                            <Field name="dgh_bus_togtooh_shaardlaga" as="select" className="form-control"
                                                className={'form-control ' + (errors.dgh_bus_togtooh_shaardlaga ? 'is-invalid' : '')}>
                                                <option> </option>
                                                <option>Тийм</option>
                                                <option>Үгүй</option>
                                            </Field>
                                            <ErrorMessage name="dgh_bus_togtooh_shaardlaga" component="div" className="invalid-feedback"/>
                                        </Fragment>
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
                                        <Fragment>
                                            <Field name="dgh_tusgai_hamgaalalt" as="select" className="form-control"
                                                className={'form-control ' + (errors.dgh_tusgai_hamgaalalt ? 'is-invalid' : '')}>
                                                <option> </option>
                                                <option>Тийм</option>
                                                <option>Үгүй</option>
                                            </Field>
                                            <ErrorMessage name="dgh_tusgai_hamgaalalt" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                    </td>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                                </tr>
                                <tr>
                                    <td>   
                                        <Field
                                            className={'form-control ' + (errors.dgh_tusgai_temdeglel ? 'is-invalid' : '')}
                                            component="textarea"
                                            name='dgh_tusgai_temdeglel'
                                            id="id_dgh_tusgai_temdeglel"
                                            type="textarea"
                                        />
                                        <ErrorMessage name="dgh_tusgai_temdeglel" component="div" className="invalid-feedback"/>                             
                                    </td>
                                    <th>Дээр дурдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                                </tr>
                                <tr>
                                    <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Яаралтай авран хамгаалах шаардлагатай эсэх.</th>
                                    <td>
                                        <Fragment>
                                            <Field name="dgh_yaaraltai_hamgaalalt" as="select" className="form-control"
                                                className={'form-control ' + (errors.dgh_yaaraltai_hamgaalalt ? 'is-invalid' : '')}>
                                                <option> </option>
                                                <option>Тийм</option>
                                                <option>Үгүй</option>
                                            </Field>
                                            <ErrorMessage name="dgh_yaaraltai_hamgaalalt" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                    </td>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                                </tr>
                            
                                <tr>
                                <td>     
                                    <Field
                                        className={'form-control ' + (errors.dgh_yaaraltai_temdeglel ? 'is-invalid' : '')}
                                        component="textarea"
                                        name='dgh_yaaraltai_temdeglel'
                                        id="id_dgh_yaaraltai_temdeglel"
                                        type="textarea"
                                    />
                                    <ErrorMessage name="dgh_yaaraltai_temdeglel" component="div" className="invalid-feedback"/>                              
                                </td>
                                    <th>Дээр дурдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                                </tr>
                                <tr>
                                    <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Өмчлөл, эзэмших ашиглалтын байдлыг өөрчлөх саналтай эсэх.</th>
                                    <td>
                                        <Fragment>
                                            <Field name="dgh_omchlol_ezemshih_omchlol_sanal_hamgaalalt" as="select" className="form-control"
                                                className={'form-control ' + (errors.dgh_omchlol_ezemshih_omchlol_sanal_hamgaalalt ? 'is-invalid' : '')}>
                                                <option> </option>
                                                <option>Тийм</option>
                                                <option>Үгүй</option>
                                            </Field>
                                            <ErrorMessage name="dgh_omchlol_ezemshih_omchlol_sanal_hamgaalalt" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                    </td>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                                </tr>
                                <tr>
                                <td>    
                                    <Field
                                        className={'form-control ' + (errors.dgh_omchlol_ezemshih_omchlol_sanal_temdeglel ? 'is-invalid' : '')}
                                        component="textarea"
                                        name='dgh_omchlol_ezemshih_omchlol_sanal_temdeglel'
                                        id="id_dgh_omchlol_ezemshih_omchlol_sanal_temdeglel"
                                        type="textarea"
                                    />
                                    <ErrorMessage name="dgh_omchlol_ezemshih_omchlol_sanal_temdeglel" component="div" className="invalid-feedback"/>                                    
                                </td>
                                    <th>Дээр дурдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                                </tr>
                                <tr>
                                    <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Тухайн дурсгалт газрыг мэргэжлийн судалганы байгууллага судлан шигжлэх зорилгоор малтсан бол түүнийг тэмдэглэнэ. Хэрэв хууль бусаар ухаж тоносон бол "Гэмтлийн тухай мэдээлэл" хэсгээс хэд хэдэн сонголт хийж болно.</th>
                                    <td>
                                        <Fragment>
                                            <Field name="dgh_maltan_sudaltan_hamgaalalt" as="select" className="form-control"
                                                className={'form-control ' + (errors.dgh_maltan_sudaltan_hamgaalalt ? 'is-invalid' : '')}>
                                                <option> </option>
                                                <option>Тийм</option>
                                                <option>Үгүй</option>
                                            </Field>
                                            <ErrorMessage name="dgh_maltan_sudaltan_hamgaalalt" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                    </td>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                                </tr>
                                <tr>
                                <td>      
                                    <Field
                                        className={'form-control ' + (errors.dgh_maltan_sudaltan_temdeglel ? 'is-invalid' : '')}
                                        component="textarea"
                                        name='dgh_maltan_sudaltan_temdeglel'
                                        id="id_dgh_maltan_sudaltan_temdeglel"
                                        type="textarea"
                                    />
                                    <ErrorMessage name="dgh_maltan_sudaltan_temdeglel" component="div" className="invalid-feedback"/>                           
                                </td>
                                    <th>Хэрэв хууль бусаар ухаж, тоносон бол "Гэмтлийн тухай мэдээлэл" хэсгээс хэд хэдэн сонголт хийж болно.</th>
                                </tr>

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
                                    <Field
                                        className={'form-control ' + (errors.dgh_gemtliin_temdeglel ? 'is-invalid' : '')}
                                        component="textarea"
                                        name='dgh_gemtliin_temdeglel'
                                        id="id_dgh_gemtliin_temdeglel"
                                        type="textarea"
                                    />
                                    <ErrorMessage name="dgh_gemtliin_temdeglel" component="div" className="invalid-feedback"/>                    
                                </td>
                                    <th>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                                </tr>

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
                                        <Field
                                            className={'form-control ' + (errors.dgh_baigaliin_huchin_zuil_temdeglel ? 'is-invalid' : '')}
                                            component="textarea"
                                            name='dgh_baigaliin_huchin_zuil_temdeglel'
                                            id="id_dgh_baigaliin_huchin_zuil_temdeglel"
                                            type="textarea"
                                        />
                                        <ErrorMessage name="dgh_baigaliin_huchin_zuil_temdeglel" component="div" className="invalid-feedback"/>                       

                                    </td>
                                    <th>       
                                        Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно
                                    </th>
                                </tr>

                                <tr>
                                    <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Сэргээн засварласан эсэх.</th>
                                    <td>
                                        <Fragment>
                                            <Field name="dgh_sergeen_zasvarlasan_eseh_hamgaalalt" as="select" className="form-control"
                                                className={'form-control ' + (errors.dgh_sergeen_zasvarlasan_eseh_hamgaalalt ? 'is-invalid' : '')}>
                                                <option> </option>
                                                <option>Тийм</option>
                                                <option>Үгүй</option>
                                            </Field>
                                            <ErrorMessage name="dgh_sergeen_zasvarlasan_eseh_hamgaalalt" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                    </td>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                                </tr>
                                <tr>
                                    <td>    
                                        <Field
                                            className={'form-control ' + (errors.dgh_sergeen_zasvarlasan_eseh_temdeglel ? 'is-invalid' : '')}
                                            component="textarea"
                                            name='dgh_sergeen_zasvarlasan_eseh_temdeglel'
                                            id="id_dgh_sergeen_zasvarlasan_eseh_temdeglel"
                                            type="textarea"
                                        />
                                        <ErrorMessage name="dgh_sergeen_zasvarlasan_eseh_temdeglel" component="div" className="invalid-feedback"/>                            
                                    </td>
                                    <th>
                                    Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.
                                    </th>
                                </tr>
                                <tr>
                                    <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Сэргээн засварлах эсэх.</th>
                                    <td>
                                        <Fragment>
                                            <Field name="dgh_sergeen_zasvarlah_eseh_nenshaardlaga" as="select" className="form-control"
                                                className={'form-control ' + (errors.dgh_sergeen_zasvarlah_eseh_nenshaardlaga ? 'is-invalid' : '')}>
                                                <option> </option>
                                                <option>Нэн шаардлагатай</option>
                                                <option>Шаардлагагүй</option>
                                                <option>Шаардлагатай</option>
                                            </Field>
                                            <ErrorMessage name="dgh_sergeen_zasvarlah_eseh_nenshaardlaga" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                        
                                    </td>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                                </tr>
                                <tr>
                                    <td>      
                                        <Field
                                            className={'form-control ' + (errors.dgh_sergeen_zasvarlah_eseh_temdeglel ? 'is-invalid' : '')}
                                            component="textarea"
                                            name='dgh_sergeen_zasvarlah_eseh_temdeglel'
                                            id="id_dgh_sergeen_zasvarlah_eseh_temdeglel"
                                            type="textarea"
                                        />
                                        <ErrorMessage name="dgh_sergeen_zasvarlah_eseh_temdeglel" component="div" className="invalid-feedback"/>                          
                                    </td>
                                    <th>                                

                                        Шалтгааныг товч бичнэ.
                                    </th>
                                </tr>
                                <tr>
                                    <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Хамгаалалтын зэрэг өөрчлөх санал.</th>
                                    <td>
                                        <Fragment>
                                            <Field name="dgh_hamgaalaltiin_zereg_oorchloh_sanal" as="select" className="form-control"
                                                className={'form-control ' + (errors.dgh_hamgaalaltiin_zereg_oorchloh_sanal ? 'is-invalid' : '')}>
                                                <option> </option>
                                                <option>Улсын хамгаалалтаас аймгийн хамгаалалтад</option>
                                                <option>Аймгийн хамгаалалтаас улсын хамгаалалтад</option>
                                                <option>Сумын хамгаалалтаас аймгийн хамгаалалтад</option>
                                                <option>Аймгийн хамгаалалтаас сумын хамгаалалтад</option>
                                                <option>Үгүй</option>
                                            </Field>
                                            <ErrorMessage name="dgh_hamgaalaltiin_zereg_oorchloh_sanal" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                    </td>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Нэгийг сонгоно.</th>
                                </tr>
                    
                                <tr>
                                <td>  
                                    <Field
                                            className={'form-control ' + (errors.dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel ? 'is-invalid' : '')}
                                            component="textarea"
                                            name='dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel'
                                            id="id_dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel"
                                            type="textarea"
                                        />
                                    <ErrorMessage name="dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel" component="div" className="invalid-feedback"/>                              
                                </td>
                                    <th>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                                </tr>
                                <tr>
                                    <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Хашаа хайстай эсэх.</th>
                                    <td>
                                        <Fragment>
                                            <Field name="dgh_hashaa_baigaa_eseh_hashaa" as="select" className="form-control"
                                                className={'form-control ' + (errors.dgh_hashaa_baigaa_eseh_hashaa ? 'is-invalid' : '')}>
                                                <option> </option>
                                                <option>Тийм</option>
                                                <option>Үгүй</option>
                                            </Field>
                                            <ErrorMessage name="dgh_hashaa_baigaa_eseh_hashaa" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                    </td>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                                </tr>
                                <tr>
                                <td>          
                                <Field
                                            className={'form-control ' + (errors.dgh_hashaa_baigaa_eseh_temdeglel ? 'is-invalid' : '')}
                                            component="textarea"
                                            name='dgh_hashaa_baigaa_eseh_temdeglel'
                                            id="id_dgh_hashaa_baigaa_eseh_temdeglel"
                                            type="textarea"
                                        />
                                        <ErrorMessage name="dgh_hashaa_baigaa_eseh_temdeglel" component="div" className="invalid-feedback"/>                      
                                </td>
                                    <th>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                                </tr>
                                <tr>
                                    <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Саравчтай эсэх.</th>
                                    <td>
                                        <Fragment>
                                            <Field name="dgh_saravchtai_eseh_saravch" as="select" className="form-control"
                                                className={'form-control ' + (errors.dgh_saravchtai_eseh_saravch ? 'is-invalid' : '')}>
                                                <option> </option>
                                                <option>Тийм</option>
                                                <option>Үгүй</option>
                                            </Field>
                                            <ErrorMessage name="dgh_saravchtai_eseh_saravch" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                    </td>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                                </tr>
                                <tr>
                                <td>   
                                    <Field
                                        className={'form-control ' + (errors.dgh_saravchtai_eseh_temdeglel ? 'is-invalid' : '')}
                                        component="textarea"
                                        name='dgh_saravchtai_eseh_temdeglel'
                                        id="id_dgh_saravchtai_eseh_temdeglel"
                                        type="textarea"
                                    />
                                    <ErrorMessage name="dgh_saravchtai_eseh_temdeglel" component="div" className="invalid-feedback"/>                             
                                </td>
                                    <th>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                                </tr>
                                <tr>
                                    <th rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Хаяг тайлбартай эсэх.</th>
                                    <td>
                                        <Fragment>
                                            <Field name="dgh_hayg_tailbar_eseh_hayg" as="select" className="form-control"
                                                className={'form-control ' + (errors.dgh_hayg_tailbar_eseh_hayg ? 'is-invalid' : '')}>
                                                <option> </option>
                                                <option>Тийм</option>
                                                <option>Үгүй</option>
                                            </Field>
                                            <ErrorMessage name="dgh_hayg_tailbar_eseh_hayg" component="div" className="invalid-feedback"/>
                                        </Fragment>
                                    </td>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</th>
                                </tr>
                                <tr>
                                <td> 
                                    <Field
                                        className={'form-control ' + (errors.dgh_hayg_tailbar_eseh_temdeglel ? 'is-invalid' : '')}
                                        component="textarea"
                                        name='dgh_hayg_tailbar_eseh_temdeglel'
                                        id="id_dgh_hayg_tailbar_eseh_temdeglel"
                                        type="textarea"
                                    />
                                    <ErrorMessage name="dgh_hayg_tailbar_eseh_temdeglel" component="div" className="invalid-feedback"/>                               
                                </td>
                                    <th>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</th>
                                </tr>




                                <tr>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Бусад тэмдэглэл.</th>
                                    <td>    
                                        <Field
                                            className={'form-control ' + (errors.last_busad_temdeglel ? 'is-invalid' : '')}
                                            component="textarea"
                                            name='last_busad_temdeglel'
                                            id="id_last_busad_temdeglel"
                                            type="textarea"
                                        />
                                        <ErrorMessage name="last_busad_temdeglel" component="div" className="invalid-feedback"/>                            
                                    </td>
                                    <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Дээр асуулгад хамрагдаагүй бусад мэдээллийг тэмдэгтээр бичнэ.</th>
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
