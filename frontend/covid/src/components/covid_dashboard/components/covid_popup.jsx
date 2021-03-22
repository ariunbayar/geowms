import React, { Component, Fragment } from "react"
import ReactDOM from 'react-dom'
import Loader from "@utils/Loader"

export class CovidPP extends Component {

    constructor(props) {

        super(props)

        this.click_count = 0
        this.is_from_inspire = true
        this.properties = []
        this.state = {
            startNumber: null,
            totalNumner: null,
            is_prev: false,
            is_plus: true,
            data: [],
            datas: '',
            mode: '',
            name: '',
            id: '',
            code: '',
            geom_name: '',
            pdf_id:'',
            is_purchase: false,
            is_enable: false,
            is_authenticated: false,
            datas: props.datas,
            edgersen_humuus_too: '0',
            emchlegdej_bui_humuus_too:'0',
            nas_barsan_hunii_too: '0',
            batlagdsan_tohioldol_too: '0',
            form_datas: props.datas,
        }
    }

    componentDidMount() {
        this.element = document.getElementById("popup")
        this.element.style.width = '15%'
        this.element.style.margin = '2%'
    }

    componentDidUpdate(pP, pS) {
        const {datas} = this.props
        if(pP.datas !== datas) {
            if (datas) {
                if (datas.length >0) {
                // console.log("hohohoi", datas[0].nas_barsan_hunii_too)
                    var datas_covid = datas[0]
                    this.setState({
                        nas_barsan_hunii_too: datas_covid.nas_barsan_hunii_too,
                        edgersen_humuus_too: datas_covid.edgersen_humuus_too,
                        emchlegdej_bui_humuus_too: datas_covid.emchlegdej_bui_humuus_too,
                        batlagdsan_tohioldol_too: datas_covid.batlagdsan_tohioldol_too
                    })
                }
            }
        }
    }


    render() {
        const { datas, is_loading, nas_barsan_hunii_too, edgersen_humuus_too, emchlegdej_bui_humuus_too, batlagdsan_tohioldol_too} = this.state
        return (
            <div className="card-body justify-content-between" style={{marginRight: "1%", marginLeft: '1%'}}>
                {
                    <div className="px-0">
                        <div className="col-md-12 text-center">
                            <label htmlFor="label" className="mw-100 align-middle">Улаанбаатар</label>
                        </div>
                        <div className="row text-danger">
                            <small className="col-md-8">Батлагдсан</small>
                            <small className="col-md-4">{batlagdsan_tohioldol_too}</small>
                        </div>
                        <ul className="col-md-12 border-top border-muted">
                            <li className="text-warning">
                                <div className="row pl-2">
                                    <small className="text-dark col-md-8 px-0">Эмчлэгдэж буй</small>
                                    <small className="text-muted col-md-4 float-right">{emchlegdej_bui_humuus_too}</small>
                                </div>
                            </li>
                            <li className="text-success">
                                <div className="row pl-2">
                                    <small className="text-dark col-md-8 px-0">Эдгэрсэн</small>
                                    <small className="text-muted col-md-4 float-right">{edgersen_humuus_too}</small>
                                </div>
                            </li>
                            <li className="text-dark">
                                <div className="row pl-2">
                                    <small className="text-dark col-md-8 px-0">Нас барсан</small>
                                    <small className="text-muted col-md-4 float-right">{nas_barsan_hunii_too}</small>
                                </div>
                            </li>
                        </ul>
                    </div>
                }
            </div>
            )
    }
}
