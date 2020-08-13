import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import './styles.css'

export class Form extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tuuhin_ov:{
                register_id: 0,
                date: null,
                aimag: '',
                sum_duureg: ''
            },

            torol_zuil: {
                torol_zuil: '',
                borjin: false,
                gantig: false,
                zanar: false,
                elsen: false,
                hurmen: false,
                tsahurlag: false,
                bosol: false,
                shohoin: false,
                oohon: false,
                busad: false,
                dursgalt_gazriin_ner: '',
                dursgalt_gazriin_coordinat: []
            },

            todorhoilolt: '',

            hemjee: {
                talbai: 0,
                urt: 0,
                orgon: 0,
                ondor: 0,
                zuzaan: 0,
                golch: 0,

                busad_hemjee: '',
                too_shirheg: 0,
                temdeglel: ''
            },

            dg_hamrah_huree_solbiltsol: [],
            dg_ezen:{
                dursgalt_gazar_ezen: false,
                temdeglel: '',

            },
            
            dg_hamgaalalt: {
                angilal: '',
                bus_togtooh_shaardlaga: false,
                hamrah_huree_coordinat: [],
                tusgai: {
                    hamgaalalt: false,
                    temdeglel: '',
                },
                yaaraltai: {
                    hamgaalalt: false,
                    temdeglel: '',
                },
                omchlol_ezemshih_omchlol_sanal: {
                    hamgaalalt: false,
                    temdeglel: '',
                },
                maltan_sudaltan: {
                    hamgaalalt: false,
                    temdeglel: '',
                },
                gemtliin: {
                    tonoson: false,
                    suitgesen: false,
                    budaj_ballasan: false,
                    hugalsan: false,
                    siilsen: false,
                    zoogdson: false,
                    alga_bolson: false,
                    tos_suu_bohirdol: false,
                    buruu_zassan: false,
                    hadag_bos_daavuu: false,
                    ded_buttsiin_ayuul: false,
                    aj_ahuin_ajillagaand: false,
                    temdeglel: '',
                },
                baigaliin_huchin_zuil: {
                    nar: false,
                    salhi: false,
                    erdes_shohoin: false,
                    uer_us: false,
                    aynga: false,
                    gal_tuimer: false,
                    gazar_hodlolt: false,
                    hag_urgamliin: false,
                    biologiin: false,
                    chuluuni_ogorshil: false,
                    mal_amitnii: false,
                    temdeglel: '',
                },
                sergeen_zasvarlasan_eseh: {
                    hamgaalalt: false,
                    todorhoi_bish: false,
                    temdeglel: '',
                },
                sergeen_zasvarlah_eseh: {
                    nenshaardlaga: false,
                    shaardlaga: false,
                    temdeglel: '',
                },
                hamgaalaltiin_zereg_oorchloh_sanal: {
                    uulsaas_aimag: false,
                    aimgaas_uls: false,
                    sumaas_aimag: false,
                    aimgaas_sum: false,
                    ugui: false,
                    temdeglel: '',
                },
                hashaa_baigaa_eseh: {
                    hashaa: false,
                    temdeglel: '',
                },
                saravchtai_eseh: {
                    saravch: false,
                    temdeglel: '',
                },
                hayg_tailbar_eseh: {
                    hayg: false,
                    temdeglel: '',
                },
                busad_temdeglel: '',
                burtgegch: ''
            }



        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)


    }

    handleChange(field, e) {
        if(e.target.value.length < 255)
        {
            this.setState({ [field]: e.target.value })
        }
    }


    
    handleSave(){
        console.log(JSON.stringify(this.state))

    }

    render() {
        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded tuuhiin-ov">
                <button className="btn gp-bg-primary" onClick={this.handleSave} >
                    Хадгалах
                </button>
                <row className="row container  my-4">
                    <h4>2015 ОНЫ ТҮҮХ, СОЁЛЫН ҮЛ ХӨДЛӨХ ДУРСГАЛЫН ҮЗЛЭГ, ТООЛЛОГЫН ХЭЭРИЙН БҮРТГЭЛИЙН МАЯГТ №1</h4>
                </row>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th style={{width: "20%"}} scope="row">Дурсгалт газрын бүртгэлийн дугаар</th>
                            <td colSpan="2" scope="rowgroup"  >
                                <div className="form-group col-md-12">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="register_id"
                                        placeholder="Дурсгалт газрын бүртгэлийн дугаар"
                                        onChange={(e) => this.handleChange('tuuhin_ov.register_id', e)}
                                        value={this.state.register_id}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "20%"}} scope="row">Он,сар,өдөр</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="register_id"
                                    placeholder="Дурсгалт газрын бүртгэлийн дугаар"
                                    onChange={(e) => this.handleChange('tuuhin_ov.date', e)}
                                    value={this.state.register_id}
                                />
                            </td>
                            <td style={{width: "20%"}}>Бүртгэл хийсэн он сар, өдрийг бичнэ.</td>
                        </tr>
                        <tr>
                            <th scope="row">Аймаг, Нийслэл</th>
                            <td scope="row">
                                
                            </td>
                            <td rowSpan="2" scope="rowgroup">Тухайн дурсгал оршиж буй аймаг, сумын нэрийг бичнэ.</td>
                        </tr>
                        <tr>
                            <th scope="row">Сум, Дүүрэг</th>
                            <td> ы</td>
                        </tr>
                    </tbody>
                </table>
   



                <table className="table table-bordered">
                    <tr>
                        <th scope="row" style={{width: "20%"}}>Төрөл зүйл</th>
                        <td colSpan="7" scope="rowgroup"  scope="row">N</td>
                        <td scope="row" style={{width: "20%"}}>Ерөнхий төрлийн код, нэрийг бичнэ.</td>
                    </tr>
                    <tr>
                        <th scope="row">Чулуулгын төрөл</th>
                        <td colSpan="7" scope="rowgroup"  scope="row">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="tableDefaultCheck1"></input>
                                <label className="custom-control-label" htmlFor="tableDefaultCheck1">Check 1</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="tableDefaultCheck1"></input>
                                <label className="custom-control-label" htmlFor="tableDefaultCheck1">Check 1</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="tableDefaultCheck1"></input>
                                <label className="custom-control-label" htmlFor="tableDefaultCheck1">Check 1</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="tableDefaultCheck1"></input>
                                <label className="custom-control-label" htmlFor="tableDefaultCheck1">Check 1</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="tableDefaultCheck1"></input>
                                <label className="custom-control-label" htmlFor="tableDefaultCheck1">Check 1</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="tableDefaultCheck1"></input>
                                <label className="custom-control-label" htmlFor="tableDefaultCheck1">Check 1</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="tableDefaultCheck1"></input>
                                <label className="custom-control-label" htmlFor="tableDefaultCheck1">Check 1</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="tableDefaultCheck1"></input>
                                <label className="custom-control-label" htmlFor="tableDefaultCheck1">Check 1</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="tableDefaultCheck1"></input>
                                <label className="custom-control-label" htmlFor="tableDefaultCheck1">Check 1</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="tableDefaultCheck1"></input>
                                <label className="custom-control-label" htmlFor="tableDefaultCheck1">Check 1</label>
                            </div>
                        </td>
                        <td scope="row">Чулуун дурсгалыг урласан материалыг сонгоно.</td>
                    </tr>
                    <tr>
                        <th scope="row">Дурсгалт газрын нэр.</th>
                        <td colSpan="7" scope="rowgroup"  scope="row">N</td>
                        <td scope="row">Ерөнхий төрлийн код, нэрийг бичнэ.</td>
                    </tr>
                    <tr>
                        <th rowSpan="6" scope="rowgroup" scope="row">Солбилцол</th>
                        <th rowSpan="2" scope="rowgroup" scope="row">№</th>
                        <td colSpan="3">UTM</td>
                        <td colSpan="2">Latitude Longitude</td>
                        <td rowSpan="2">Alt(m)</td>
                        <td rowSpan="6" scope="rowgroup">UTM стандартаар авсан Солбилцлын дагуу оруулна. Хэрэв Latitude Longitude стандартаар давхар авсан бол мөн тэмдэглэнэ.</td>
                    </tr>
                    <tr>
                        <td scope="row">UTM Zone</td>
                        <td scope="row">N</td>
                        <td scope="row">E</td>
                        <td scope="row">N</td>
                        <td scope="row">E</td>
                    </tr>
                    <tr>
                        <td scope="row">1</td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                    </tr>
                    <tr>
                        <td scope="row">2</td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                    </tr>

                </table>







                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <td colSpan="8">input</td>
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
                            <td>input</td>
                            <td>input</td>
                            <td>input</td>
                            <td>input</td>
                            <td>input</td>
                            <td>input</td>
                        </tr>
                        <tr>
                            <th scope="row">Бусад хэмжээ</th>
                            <td colSpan="6" scope="rowgroup">input</td>
                        </tr>
                        <tr>
                            <th>Тоо ширхэг</th>
                            <td colSpan="6">input</td>
                            <th rowSpan="2" scope="rowgroup" scope="row">Хэрэв дурсгалт газрыг тоймлон тоолсон бол "Тоо ширхэг" хэсэгт тоон утгаар оруулж, "Тэмдэглэл" хэсэгт бичнэ.</th>
                        </tr>
                        <tr>
                            <th>Тэмдэглэл</th>
                            <td colSpan="6">input</td>
                        </tr>
                    </tbody>
                </table>

                <table className="table table-bordered">
                    <tr>
                        <th rowSpan="6" scope="rowgroup" scope="row" style={{width: "10%"}}>Дурсгалт газрын хамрах хүрээний солбилцол.</th>
                        <th rowSpan="2" scope="rowgroup" scope="row">№</th>
                        <td colSpan="3">UTM</td>
                        <td colSpan="2">Latitude Longitude</td>
                        <td rowSpan="2">Alt(m)</td>
                        <td rowSpan="6" scope="rowgroup" style={{width: "20%"}}>Хэрэв тухайн газар том талбайг хамран оршиж байгаа бол дурсгалын хамрах хүрээг заавал тогтоох бөгөөд энэхүү хамрах хүрээний цэгүүдийн Солбилцлыг дарааллын дагуу бичнэ.</td>
                    </tr>
                    <tr>
                        <td scope="row">UTM Zone</td>
                        <td scope="row">N</td>
                        <td scope="row">E</td>
                        <td scope="row">N</td>
                        <td scope="row">E</td>
                    </tr>
                    <tr>
                        <td scope="row">1</td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                    </tr>
                    <tr>
                        <td scope="row">2</td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                    </tr>

                </table>
                
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th rowSpan="3" scope="rowgroup" scope="row" style={{width: "30%"}}>Дурсгалт газрын гэрээгээр хариуцуулж байгаа иргэн (малчин) байгаа эсэх.</th>
                            <td>Тийм</td>
                            <td rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг нь сонгоно.</td>
                        </tr>
                        <tr>
                            <td>Үгүй</td>
                        </tr>
                        <tr>
                            <td>Тэмдэглэл</td>
                            <td>Дээр дурдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</td>
                        </tr>
                    </tbody>
                </table>

                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th rowSpan="5" scope="rowgroup" scope="row" style={{width: "30%"}}>Хамгаалалтын ангилал.</th>
                            <td>Дэлхийн өвд бүртгэгдсэн</td>
                            <td rowSpan="5" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</td>
                        </tr>
                        <tr>
                            <td>Улсын хадгалалтад</td>
                        </tr>
                        <tr>
                            <td>Аймгийн хадгалалтад</td>
                        </tr>
                        <tr>
                            <td>Сумын хадгалалтад</td>
                        </tr>
                        <tr>
                            <td>Хамгаалалтад аваагүй</td>
                        </tr>
                        <tr>
                            <th rowSpan="5" scope="rowgroup" scope="row">Хамгаалалтын бүс тогтоох шаардлагатай эсэх.</th>
                            <td>Тийм</td>
                            <td rowSpan="5" scope="rowgroup" scope="row">Нэгийг сонгоно.</td>
                        </tr>
                        <tr>
                            <td>Үгүй</td>
                        </tr>
                    </tbody>
                </table>






                <table className="table table-bordered">
                    <tr>
                        <th rowSpan="6" scope="rowgroup" scope="row" style={{width: "10%"}}>Дурсгалт газрын хамрах хүрээгий.</th>
                        <th rowSpan="2" scope="rowgroup" scope="row">№</th>
                        <td colSpan="3">UTM</td>
                        <td colSpan="2">Latitude Longitude</td>
                        <td rowSpan="2">Alt(m)</td>
                        <td rowSpan="6" scope="rowgroup" style={{width: "20%"}}>Хамгаалалтын бүс тогтоох бүсийн санадтай дурсгалын хамгаалал тогтоох бүсийн хилийн цэгүүдийн Солбилцлыг дарааллын дагуу бичнэ.</td>
                    </tr>
                    <tr>
                        <td scope="row">UTM Zone</td>
                        <td scope="row">N</td>
                        <td scope="row">E</td>
                        <td scope="row">N</td>
                        <td scope="row">E</td>
                    </tr>
                    <tr>
                        <td scope="row">1</td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                    </tr>
                    <tr>
                        <td scope="row">2</td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                        <td scope="row">input </td>
                    </tr>

                </table>

                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th rowSpan="3" scope="rowgroup" scope="row" style={{width: "30%"}}>Тусгай хамгаалалтад авах шаардлагатай эсэх.</th>
                            <td>Тийм</td>
                            <td rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</td>
                        </tr>
                        <tr>
                            <td>Үгүй</td>
                        </tr>
                        <tr>
                            <td>Тэмдэглэл</td>
                            <td>Дээр дурдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</td>
                        </tr>
{/* /////////////////////////// */}
                        <tr>
                            <th rowSpan="3" scope="rowgroup" scope="row" style={{width: "30%"}}>Яаралтай авран хамгаалах шаардлагатай эсэх.</th>
                            <td>Тийм</td>
                            <td rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</td>
                        </tr>
                        <tr>
                            <td>Үгүй</td>
                        </tr>
                        <tr>
                            <td>Тэмдэглэл</td>
                            <td>Дээр дурдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</td>
                        </tr>
{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="3" scope="rowgroup" scope="row" style={{width: "30%"}}>Өмчлөл, эзэмших ашиглалтын байдлыг өөрчлөх саналтай эсэх.</th>
                            <td>Тийм</td>
                            <td rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</td>
                        </tr>
                        <tr>
                            <td>Үгүй</td>
                        </tr>
                        <tr>
                            <td>Тэмдэглэл</td>
                            <td>Дээр дурдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</td>
                        </tr>
{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="3" scope="rowgroup" scope="row" style={{width: "30%"}}>Тухайн дурсгалт газрыг мэргэжлийн судалганы байгууллага судлан шигжлэх зорилгоор малтсан бол түүнийг тэмдэглэнэ. Хэрэв хууль бусаар ухаж тоносон бол "Гэмтлийн тухай мэдээлэл" хэсгээс хэд хэдэн сонголт хийж болно.</th>
                            <td>Тийм</td>
                            <td rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</td>
                        </tr>
                        <tr>
                            <td>Үгүй</td>
                        </tr>
                        <tr>
                            <td>Тэмдэглэл</td>
                            <td>Хэрэв хууль бусаар ухаж, тоносон бол "Гэмтлийн тухай мэдээлэл" хэсгээс хэд хэдэн сонголт хийж болно.</td>
                        </tr>
{/* ////////////////////////////// */}

{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="13" scope="rowgroup" scope="row" style={{width: "30%"}}>Гэмтлийн тухай мэдээлэл.</th>
                            <td>Тоносон</td>
                            <td rowSpan="12" scope="rowgroup" scope="row" style={{width: "30%"}}>Хэд хэдэн сонголт хийж болно.</td>
                        </tr>
                        <tr>
                            <td>Сүйтгэсэн</td>
                        </tr>
                        <tr>
                            <td>Будаж балласан</td>
                        </tr>
                        <tr>
                            <td>Хулгайлсан</td>
                        </tr>
                        <tr>
                            <td>Сийлсэн</td>
                        </tr>
                        <tr>
                            <td>Зөөгдсөн</td>
                        </tr>
                        <tr>
                            <td>Алга болсон</td>
                        </tr>
                        <tr>
                            <td>Тос сүүний бохирдолтой</td>
                        </tr>
                        <tr>
                            <td>Буруу зассан</td>
                        </tr>
                        <tr>
                            <td>Халаг, бөс даавуу ороосон, уясан</td>
                        </tr>
                        <tr>
                            <td>Дэд бүтцийн аюулд орсон</td>
                        </tr>
                        <tr>
                            <td>Аж ахуйн үйл ажиллагаанд өртсөн</td>
                        </tr>
                        <tr>
                            <td>Тэмдэглэл</td>
                            <td>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</td>
                        </tr>

{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="11" scope="rowgroup" scope="row" style={{width: "30%"}}>Байгалийн хүчин зүйл.</th>
                            <td>Нарны нөлөөлөл</td>
                            <td rowSpan="10" scope="rowgroup" scope="row" style={{width: "30%"}}>Хэд хэдэн сонголт хийж болно.</td>
                        </tr>
                        <tr>
                            <td>Эрдэс шохойн нөлөөлөл</td>
                        </tr>
                        <tr>
                            <td>Үер усны нөлөөлөл</td>
                        </tr>
                        <tr>
                            <td>Аянга цахилгаанд өртсөн</td>
                        </tr>
                        <tr>
                            <td>Гал түймэрт өртсөн</td>
                        </tr>
                        <tr>
                            <td>Газар хөдлөлт</td>
                        </tr>
                        <tr>
                            <td>Хаг ургамлын нөлөө</td>
                        </tr>
                        <tr>
                            <td>Биологийн бохирдолтой</td>
                        </tr>
                        <tr>
                            <td>Чулууны өгөршил</td>
                        </tr>
                        <tr>
                            <td>Мал амьтны нөлөөлөл</td>
                        </tr>
                        <tr>
                            <td>Тэмдэглэл</td>
                            <td>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</td>
                        </tr>

{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="4" scope="rowgroup" scope="row" style={{width: "30%"}}>Сэргээн засварласан эсэх.</th>
                            <td>Тийм</td>
                            <td rowSpan="3" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</td>
                        </tr>
                        <tr>
                            <td>Үгүй</td>
                        </tr>
                        <tr>
                            <td>Тодорхой биш</td>
                        </tr>
                        <tr>
                            <td>Тэмдэглэл</td>
                            <td>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</td>
                        </tr>
{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="4" scope="rowgroup" scope="row" style={{width: "30%"}}>Сэргээн засварлах эсэх.</th>
                            <td>Нэн шаардлагатай</td>
                            <td rowSpan="3" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</td>
                        </tr>
                        <tr>
                            <td>Шаардлагагүй</td>
                        </tr>
                        <tr>
                            <td>Шаардлагатай</td>
                        </tr>
                        <tr>
                            <td>Тэмдэглэл</td>
                            <td>Шалтгааныг товч бичнэ.</td>
                        </tr>
{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="6" scope="rowgroup" scope="row" style={{width: "30%"}}>Хамгаалалтын зэрэг өөрчлөх санал.</th>
                            <td>Нэн шаардлагатай</td>
                            <td rowSpan="5" scope="rowgroup" scope="row" style={{width: "30%"}}>Улсын хамгаалалтаас аймгийн хамгаалалтад.</td>
                        </tr>
                        <tr>
                            <td>Аймгийн хамгаалалтаас улсын хамгаалалтад.</td>
                        </tr>
                        <tr>
                            <td>Сумын хамгаалалтаас аймгийн хамгаалалтад.</td>
                        </tr>
                        <tr>
                            <td>Аймгийн хамгаалалтаас сумын хамгаалалтад.</td>
                        </tr>
                        <tr>
                            <td>Үгүй.</td>
                        </tr>
                        <tr>
                            <td>Тэмдэглэл.</td>
                            <td>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</td>
                        </tr>
{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="3" scope="rowgroup" scope="row" style={{width: "30%"}}>Саравчтай эсэх.</th>
                            <td>Тийм</td>
                            <td rowSpan="2" scope="rowgroup" scope="row" style={{width: "30%"}}>Аль нэгийг сонгоно.</td>
                        </tr>
                        <tr>
                            <td>Үгүй</td>
                        </tr>
                        <tr>
                            <td>Тэмдэглэл</td>
                            <td>Дээр дэрдсан сонголтоос бусад тохиолдолд энэ хэсэгт үсгээр бичиж болно.</td>
                        </tr>
{/* ////////////////////////////// */}
                        <tr>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Бусад тэмдэглэл.</th>
                            <td></td>
                            <td rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Дээр асуулгад хамрагдаагүй бусад мэдээллийг тэмдэгтээр бичнэ.</td>
                        </tr>
                        <tr>
                            <th rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Бүртгэгч.</th>
                            <td>Б.Төгөлдөр</td>
                            <td rowSpan="1" scope="rowgroup" scope="row" style={{width: "30%"}}>Хэрэглэгчийн нэр нууц үгээр нэвтэрч ороход бүртгэгчийн овог нэр, албан тушаал автоматоор бичигдэнэ.</td>
                        </tr>
                    </tbody>
                </table>
                <button className="btn gp-bg-primary" onClick={this.handleSave} >
                    Хадгалах
                </button>
            </div>  
        )

    }

}
