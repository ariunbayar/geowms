import React, { Component, Fragment } from "react"
import ReactDOM from 'react-dom'
import Loader from "@utils/Loader"
import {Control} from 'ol/control'

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
            name:'',
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
                    var datas_covid = datas[0]
                    this.setState({
                        nas_barsan_hunii_too: datas_covid.nas_barsan_hunii_too,
                        edgersen_humuus_too: datas_covid.edgersen_humuus_too,
                        emchlegdej_bui_humuus_too: datas_covid.emchlegdej_bui_humuus_too,
                        batlagdsan_tohioldol_too: datas_covid.batlagdsan_tohioldol_too,
                        name: datas_covid.name
                    })
                }
            }
        }
    }


    render() {
        const { datas, is_loading, nas_barsan_hunii_too, edgersen_humuus_too, emchlegdej_bui_humuus_too, batlagdsan_tohioldol_too, name} = this.state
        return (
            <div>
                <div className="ol-popup-header">
                    <div className="ol-popup-header-content" onClick={() => this.props.close()}>
                        <div className="ol-popup-closer" id="popup-closer" role="button">
                            <i className="fa fa-times text-muted" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
                <div className="card-body justify-content-between" style={{marginRight: "1%", marginLeft: '1%'}}>
                    {
                        <div className="px-0">
                            <div className="col-md-12 text-center">
                                <label htmlFor="label" className="mw-100 align-middle">{name}</label>
                            </div>
                            <div className="row text-danger">
                                <small className="col-md-8">Батлагдсан</small>
                                <small className="col-md-4 px-0">{batlagdsan_tohioldol_too}</small>
                            </div>
                            <ul className="col-md-12 border-top border-muted">
                                <li className="text-warning">
                                    <div className="row pl-2">
                                        <small className="text-dark col-md-8 px-0">Эмчлэгдэж буй</small>
                                        <small className="text-muted col-md-4 float-right px-0">{emchlegdej_bui_humuus_too}</small>
                                    </div>
                                </li>
                                <li className="text-success">
                                    <div className="row pl-2">
                                        <small className="text-dark col-md-8 px-0">Эдгэрсэн</small>
                                        <small className="text-muted col-md-4 float-right px-0">{edgersen_humuus_too}</small>
                                    </div>
                                </li>
                                <li className="text-dark">
                                    <div className="row pl-2">
                                        <small className="text-dark col-md-8 px-0">Нас барсан</small>
                                        <small className="text-muted col-md-4 float-right px-0">{nas_barsan_hunii_too}</small>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    }
                </div>
            </div>
            )
    }
}

export class PopUp extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = false

        this.element.className = 'ol-popup'
        this.element.setAttribute("id", "popup")

        this.renderComponent = this.renderComponent.bind(this)
        this.getData = this.getData.bind(this)
    }

    renderComponent(props) {
        if (!this.is_component_initialized) {
            ReactDOM.render(<PopUpCmp {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<PopUpCmp {...props}/>, this.element)
    }

    blockPopUp(close) {
        this.renderComponent({close})
    }

    getData(close) {
        this.renderComponent({close})
    }
}
