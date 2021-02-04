import React, { Component, Fragment } from "react"
import {service} from '../service'
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'

class PopUpCmp extends Component {

    constructor(props) {

        super(props)
        this.click_count = 0
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
        if (this.props.sendElem) this.props.sendElem(this.element)
        service.getUser().then(({is_authenticated}) =>
        {
            this.setState({is_authenticated: is_authenticated})
        })
    }

    componentDidUpdate(pP, pS) {
        const { datas } = this.props
        if(pP.datas !== datas) {
            this.properties = []
            const startNumber = 1
            this.setState({ startNumber, is_plus: true, is_prev: false })
            this.checkModeAndCode(startNumber, datas)
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
                if ((value[0] == 'point_name') || value[2] == 'Name') {
                    this.setState({ name: value[1] })
                }
                if (value[0] == 'pid' && mode == 'mpoint_view') {
                    this.checkButtonEnable(value[1])
                }
                if (value[2] == 'PointNumber') {
                    this.checkButtonEnableWithId(value[1])
                    this.setState({ id: value[1] })
                    geom_name = value[1]
                }
            })
            this.setNowData(number, datas, mode, code, geom_name)
            this.props.setSource(mode)
        }
    }

    setNowData(number, datas, mode, code, geom_name) {
        let data
        if (this.props.is_from_inspire) data = [datas[number - 1]]
        else data = datas[number - 1]
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
        const { datas, data, startNumber, is_prev, is_plus, is_enable, is_authenticated } = this.state
        const { is_empty, is_from_inspire } = this.props
        return (
                <div>
                    <div className="ol-popup-header">
                        <div className="ol-popup-header-content">
                            {!is_empty && datas && datas.length > 0
                                ?
                                <div className="ol-header-cont" role="group">
                                    {startNumber}
                                    &nbsp; - &nbsp;
                                    {datas.length}
                                    &nbsp;
                                    {is_prev ? <span onClick={this.prevTab} className="span-left" role="button">
                                        <i className="fa fa-caret-left gp-text-primary fa-1x" aria-hidden="true" ></i>
                                    </span> : null}
                                    &nbsp;&nbsp;&nbsp;
                                    {!(datas.length == startNumber) && is_plus ? <span className="span-right" onClick={this.plusTab} role="button">
                                        <i className="fa fa-caret-right gp-text-primary fa-1x"  aria-hidden="true" ></i>
                                    </span> : null}
                                    <div className="ol-popup-closer" id="popup-closer" role="button" onClick={() => this.props.close()}>
                                        <i className="fa fa-times" aria-hidden="true"></i>
                                    </div>
                                </div>
                                :
                                "Сонгоогүй байна"
                            }
                            {!datas &&
                                <div className="ol-popup-closer" id="popup-closer" role="button" onClick={() => this.props.close()}>
                                    <i className="fa fa-times" aria-hidden="true"></i>
                                </div>
                            }
                        </div>
                    </div>
                    {
                        is_empty
                        ?
                            <div className="ol-popup-contet text-center">
                                <b>Хоосон газар сонгосон байна.</b>
                            </div>
                        :
                            <div className="ol-popup-contet">
                                {
                                    data.length >= 1
                                    &&
                                        data[0].map((layer, idx) =>
                                            idx == 1 &&
                                            layer.map((value, v_idx) =>
                                                value[0].toLowerCase().startsWith('name')
                                                && <b key={v_idx}>{value[1]}</b>
                                            )
                                        )
                                }
                                <hr className="m-1 border border-secondary rounded"/>
                                <table className="table borderless no-padding">
                                    <tbody>
                                        {
                                            data.length >= 1
                                            ?
                                                data[0].map((layer, idx) =>
                                                    idx == 1 &&
                                                    layer.map((value, v_idx) =>
                                                        !value[0].toLowerCase().startsWith('name')
                                                        &&
                                                            <tr className="p-0" style={{fontSize: '12px'}} key={v_idx}>
                                                                <th className="font-weight-normal">
                                                                    <b>{value[0]}:</b>
                                                                    <p className="m-0">&nbsp;&nbsp;&nbsp;{value[1]}</p>
                                                                </th>
                                                            </tr>
                                                        )
                                                )
                                            :
                                            <tr><th>Хоосон байна</th></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                    }
                    {!is_authenticated && !is_empty && is_from_inspire
                        ?
                        <div className="btn-group flex-wrap d-flex justify-content-center">
                            <button
                                className="btn btn-xs btn-primary mb-2 mx-3"
                            >
                                <a className="text-decoration-none text-white" href="/login/">Нэвтрэх</a>
                            </button>
                        </div>
                        :
                        !is_empty
                            ?
                                this.state.is_purchase
                                ?
                                    <div className="btn-group flex-wrap d-flex justify-content-center">
                                        <button className="btn btn-xs btn-primary my-2 mx-3" disabled>
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                            {} Хүлээнэ үү..
                                        </button>
                                    </div>
                                :
                                is_from_inspire
                                ?
                                    <div className="btn-group flex-wrap d-flex justify-content-center">
                                        <button
                                            className="btn btn-xs btn-primary mx-3"
                                            onClick={() => this.checkDataForPurchase()}
                                            disabled={is_enable ? "" : "disabled"}
                                        >
                                            Худалдаж авах
                                        </button>
                                        <button
                                            className="btn btn-xs btn-primary my-2 mx-3"
                                            onClick={() => this.openCartSide()}
                                            disabled={is_enable ? "" : "disabled"}
                                        >
                                            Сагсанд нэмэх
                                        </button>
                                    </div>
                                :
                                null
                            :
                            null
                    }
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

    getData(isload, datas, close, setSource, cartButton, is_empty, is_from_inspire) {
        this.toggleControl(isload)
        this.renderComponent({datas, close, setSource, cartButton, is_empty, is_from_inspire})
    }
}
