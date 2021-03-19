import React, { Component, Fragment } from "react"
import {service} from '../service'
import ReactDOM from 'react-dom'
import Loader from "@utils/Loader"
import {Control} from 'ol/control'

class PopUpCmp extends Component {

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
            form_datas: props.form_datas,
        }
        this.plusTab = this.plusTab.bind(this)
        this.prevTab = this.prevTab.bind(this)
        this.checkModeAndCode = this.checkModeAndCode.bind(this)
        this.openCartSide = this.openCartSide.bind(this)
        this.checkDataForPurchase = this.checkDataForPurchase.bind(this)
        this.checkButtonEnableWithPdf = this.checkButtonEnableWithPdf.bind(this)
        this.checkButtonEnableWithId = this.checkButtonEnableWithId.bind(this)
    }

    componentDidMount() {
        this.element = document.getElementById("popup")
        this.element.className = 'col-2 col-md-2 col-xl-2 bg-light rounded mt-4 ml-4 justify-content-between'
        if (this.props.sendElem) this.props.sendElem(this.element)
        service.getUser().then(({is_authenticated}) =>
        {
            this.setState({is_authenticated: is_authenticated})
        })
    }

    componentDidUpdate(pP, pS) {
        const { form_datas, datas} = this.props
        if(pP.datas !== datas && !this.props.is_loading) {
            this.properties = []
            const startNumber = 1
            this.setState({ startNumber, is_plus: true, is_prev: false })
            this.checkModeAndCode(startNumber, datas)
        }
        if (pP.form_datas !== form_datas) {
            this.setState({form_datas})
        }
    }

    plusTab() {
        this.properties = []

        const { startNumber, datas } = this.state
        var plus = startNumber + 1
        plus = Math.min(datas.length, plus)
        if (plus == datas.length) {
            this.setState({ is_plus: false, is_prev: true })
        } else {
            this.setState({ is_plus: true, is_prev: true })
        }
        this.checkModeAndCode(plus, datas)
        this.setState({ startNumber: plus })
    }

    prevTab() {
        this.properties = []

        const { startNumber, datas } = this.state
        var minus = startNumber - 1
        minus = Math.max(minus, 1)
        if (minus == 1) {
            this.setState({ is_prev: false, is_plus: true })
        }else {
            this.setState({ is_plus: true, is_prev: true })
        }
        this.checkModeAndCode(minus, datas)
        this.setState({ startNumber: minus })
    }

    checkModeAndCode(number, datas) {
        let mode
        let code
        let values
        let geom_name
        this.click_count = 0
        if (datas.length > 0) {
            if (this.props.is_from_inspire) {
                code = datas[number - 1][0]
                values = datas[number - 1][1]
            }
            else {
                mode = datas[number - 1][1]
                code = datas[number - 1][2]
                values = datas[number - 1][0][1]
                geom_name = datas[number - 1][0][0]
            }
            values.map((value, idx) => {
                if (value[0] == 'point_id') {
                    this.setState({ id: value[1] })
                }
                if ((value[0] == 'point_name') || value[2] && value[2].toLowerCase() == 'name') {
                    this.setState({ name: value[1] })
                }
                if (value[0] == 'pid' && mode == 'mpoint_view') {
                    this.checkButtonEnableWithPdf(value[1])
                }
                if (value[2] && value[2].toLowerCase() == 'pointnumber') {
                    this.checkButtonEnableWithId(value[1])
                    this.setState({ id: value[1] })
                    geom_name = value[1]
                }
            })
            this.setNowData(number, datas, mode, code, geom_name)
            // this.props.setSource(mode)
        }
    }

    setNowData(number, datas, mode, code, geom_name) {
        let data
        this.is_from_inspire = true
        if (this.props.is_from_inspire) data = [datas[number - 1]]
        else data = datas[number - 1]
        if (!code.startsWith("gp_layer_")) {
            this.is_from_inspire = false
        }
        this.setState({ data, mode, datas, code, geom_name })
    }

    checkButtonEnableWithPdf(pdf_id){
        service.checkButtonEnableWithPdf(pdf_id)
            .then(({is_enable, success}) => {
                if(success){
                    this.setState({ is_enable, pdf_id })
                }
            })
    }

    checkButtonEnableWithId(geo_id){
        service.checkButtonEnableWithId(geo_id)
            .then(({is_enable, success, pdf_id}) => {
                if(success){
                    this.setState({ is_enable, pdf_id })
                }
            })
    }

    openCartSide() {
        this.click_count ++
        var is_again_clicked = false
        if (this.click_count > 1) {
            is_again_clicked = true
        }
        this.props.cartButton(true, this.state.name, this.state.code, this.state.id, is_again_clicked, this.state.geom_name, this.state.pdf_id)
    }


    checkDataForPurchase(){
        this.setState({ is_purchase: true })
        var data = [{ 'name': this.state.name,'id': this.state.id, 'code': this.state.code, 'geom_name': this.state.geom_name, 'pdf_id': this.state.pdf_id }]
        if(this.state.data.length > 0){
            service.purchaseFromCart(data)
                .then(({success, msg, payment_id}) => {
                    if(success){
                        setTimeout(() => {
                            this.setState({ data: [], is_purchase: false })
                            window.location.href=`/payment/purchase/${payment_id}/`;
                        }, 1000);
                    }
                }).catch(error => alert("Алдаа гарсан тул хуудсыг дахин ачааллуулна уу"))
        }
    }

    render() {
        const { datas, data, startNumber, is_prev, is_plus, is_enable, is_authenticated, form_datas} = this.state
        const { is_empty, is_from_inspire } = this.props
        return (
                <div>
                    {
                        form_datas.length > 0 ?
                        <div className="row">
                        {
                            <div className="col-md-12 justify-content-center">
                                <div className="col-md-12 my-3">
                                    <h6 className="text-center pl-3">{form_datas[0].name}</h6>
                                    <div className="col-md-12 text-danger text-justify">
                                        <span className="float-left">Нийт тохиолдол</span>
                                        <span className="float-right">{form_datas[0].batlagdsan_tohioldol_too}</span>
                                    </div>
                                </div>
                                <div className="col-md-12 mt-3 pt-3 d-block ">
                                    <ul className="col-md-12">
                                        <li className="text-warning">
                                            <span className="float-left text-dark">Эмчлэгдэж буй</span>
                                            <span className="float-right text-muted">{form_datas[0].emchlegdej_bui_humuus_too}</span>
                                        </li>
                                        <li className="text-success">
                                            <span className="float-left text-dark">Эдгэрсэн</span>
                                            <span className="float-right text-muted">{form_datas[0].edgersen_humuus_too}</span>
                                        </li>
                                        <li className="text-dark">
                                            <span className="float-left text-dark">Нас барсан</span>
                                            <span className="float-right text-muted">{form_datas[0].nas_barsan_hunii_too}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        }
                        </div> :''
                    }
                    {/* <Loader is_loading={is_loading} /> */}
                    <div className="ol-popup-arrow">
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
        this.toggleControl = this.toggleControl.bind(this)
        this.getData = this.getData.bind(this)
        this.getFormdata = this.getFormdata.bind(this)
    }

    toggleControl(is_visible) {
        if (is_visible) {
            this.element.style.display = 'block'
            this.element.style.zIndex = '1050'
        }
        else {
            this.element.style.display = 'none'
        }

    }

    renderComponent(props) {
        if (!this.is_component_initialized) {
            ReactDOM.render(<PopUpCmp {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<PopUpCmp {...props}/>, this.element)
    }

    blockPopUp(islaod, sendElem, close) {
        this.toggleControl(islaod)
        this.renderComponent({sendElem, close})
    }

    getData(isload, datas, close, setSource, cartButton, is_empty, is_from_inspire, is_loading=false) {
        this.toggleControl(isload)
        this.renderComponent({datas, close, setSource, cartButton, is_empty, is_from_inspire, is_loading})
    }

    getFormdata(isload, form_datas) {
        this.toggleControl(isload)
        this.renderComponent({form_datas})
    }
}
