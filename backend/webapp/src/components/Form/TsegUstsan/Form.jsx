import React, { Component } from "react"
import ImageUploader from 'react-images-upload'
import {service} from '../service'


export class Form extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            baiguulaga: '',
            alban_tushaal: '',
            utas: '',

            tsegiin_dugaar: '',
            oiroltsoo_bairlal: '',
            evdersen_baidal: '',
            nohtsol_baidal: '',
            zurag_hol: '',
            zurag_oir: '',
            zurag_baruun: '',
            zurag_zuun: '',
            zurag_hoid: '',
            zurag_omno: '',
            sergeeh_sanal: '',
            hemjilt_hiih_bolomj: false,
            email_error_messege: false,
            handle_save_succes: false,

        
        }
        this.handleInput = this.handleInput.bind(this)
        this.handleInputEmail = this.handleInputEmail.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleCheckGroup = this.handleCheckGroup.bind(this)
        this.handleSave = this.handleSave.bind(this)

        
    }
    handleSave(){
        this.setState({handle_save_succes:false})

        const form_datas = this.state
        service.tsegUstsan(form_datas).then(({success}) => {
            if (success) {
                setTimeout(() => {
                    this.setState({handle_save_succes:false})
                }, 1000)
            }
            else{
                alert("no")
            }
        })
    }
    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
    }
    
    handleInputEmail(field, e) {

        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test(e.target.value))
        {
            this.setState({emailErrorMessege:false , [field]: e.target.value})
        }
        else{
            this.setState({email_error_messege: true})
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
    render() {
        return (
            <div className="row container  my-4">
                <h4>Иргэний мэдээлэл</h4>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th style={{width: "5%"}} scope="row">1.</th>
                            <th style={{width: "15%"}}>Имэйл хаяг</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    onChange={(e) => this.handleInput('email', e)}
                                    value={this.state.email}
                                />
                                {this.state.email_error_messege ? <a className="text-primary">Имэйл хаяг буруу байна.</a> : null}
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "5%"}} scope="row">2.</th>
                            <th style={{width: "15%"}}>Байгууллага</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="baiguulaga"
                                    onChange={(e) => this.handleInput('baiguulaga', e)}
                                    value={this.state.baiguulaga}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "5%"}} scope="row">2.</th>
                            <th style={{width: "15%"}}>Албан тушаал</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="alban_tushaal"
                                    onChange={(e) => this.handleInput('alban_tushaal', e)}
                                    value={this.state.alban_tushaal}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "5%"}} scope="row">2.</th>
                            <th style={{width: "15%"}}>Утас</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="utas"
                                    onChange={(e) => this.handleInput('utas', e)}
                                    value={this.state.utas}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>



                <h4>Цэгийн мэдээлэл</h4>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th style={{width: "5%"}} scope="row">1.</th>
                            <th style={{width: "15%"}}>Цэгийн душаар:</th>
                            <td colSpan="4" scope="rowgroup">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tsegiin_dugaar"
                                    onChange={(e) => this.handleInput('tsegiin_dugaar', e)}
                                    value={this.state.tsegiin_dugaar}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "5%"}} scope="row">2.</th>
                            <th style={{width: "15%"}}>Ойролцоо байрлал:</th>
                            <td colSpan="4" scope="rowgroup">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="oiroltsoo_bairlal"
                                    onChange={(e) => this.handleInput('oiroltsoo_bairlal', e)}
                                    value={this.state.oiroltsoo_bairlal}
                                />
                            </td>
                        </tr>


                        <tr>
                            <th style={{width: "5%"}} scope="row">3.</th>
                            <th style={{width: "15%"}}>Эвдэрсэн байдал:</th>
                            <td colSpan="4" scope="rowgroup">
                                <select className="form-control" id="evdersen_baidal" value={this.state.evdersen_baidal} onChange={(e) => this.handleInput('evdersen_baidal', e)}>
                                    <option>Эвдэрсэн</option>
                                    <option>Төв гэмтсэн</option>
                                    <option>Хазайсан</option>
                                    <option>Дарагдсан</option>
                                </select>
                            </td>
                        </tr>


                        <tr>
                            <th style={{width: "5%"}} scope="row">4.</th>
                            <th style={{width: "15%"}}>Нөхцөл/шалтгаан:</th>
                            <td colSpan="4" scope="rowgroup">
                                <textarea 
                                    aria-label="With textarea"
                                    className="form-control"
                                    id="nohtsol_baidal"
                                    style={{height:"80px"}}
                                    onChange={(e) => this.handleInput('nohtsol_baidal', e)}
                                    value={this.state.nohtsol_baidal}>

                                </textarea>
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "5%"}} scope="row">5.</th>
                            <th className="text-center" colSpan="4" scope="rowgroup" style={{width: "15%"}}>Орчны фото зураг:</th>
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
                                    imgExtension={['.jpg', '.png']}
                                    maxFileSize={5242880}
                                    singleImage={true}
                                    label=''
                                />
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
                                />
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
                                />
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
                                />
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
                                />
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
                                />
                            </th>
                        </tr>
                        <tr>
                            <th style={{width: "5%"}} scope="row">6.</th>
                            <th style={{width: "15%"}}>Сэргээх талаар таны санал:</th>
                            <td colSpan="4" scope="rowgroup">
                                <select className="form-control" id="sergeeh_sanal" value={this.state.sergeeh_sanal} onChange={(e) => this.handleInput('sergeeh_sanal', e)}>
                                    <option>Сэргээх</option>
                                    <option>Шилжүүлэх</option>
                                    <option>Шинээр байгуулах</option>
                                </select>
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
