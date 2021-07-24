import React, { Component } from "react"
import ReactDOM from 'react-dom'
import { Control } from 'ol/control'

import Loader from "@utils/Loader"

import { service } from '../service'

const DEFAULT_PER_PAGE = 5

class PopUpCmp extends Component {

    constructor(props) {

        super(props)

        this.click_count = 0
        this.is_point = false
        this.state = {
            startNumber: null,
            totalNumner: null,
            is_prev: false,
            is_plus: true,
            data: [],
            datas: '',
            feature: '',
            name: '',
            id: '',
            code: '',
            geom_name: '',
            pdf_id:'',
            is_purchase: false,
            is_enable: false,
            is_purchased: false,
            is_authenticated: props.is_authenticated,
            per_page_limit: DEFAULT_PER_PAGE
        }
        this.plusTab = this.plusTab.bind(this)
        this.prevTab = this.prevTab.bind(this)
        this.checkModeAndCode = this.checkModeAndCode.bind(this)
        this.openCartSide = this.openCartSide.bind(this)
        this.checkDataForPurchase = this.checkDataForPurchase.bind(this)
        this.checkButtonEnableWithId = this.checkButtonEnableWithId.bind(this)
    }

    componentDidMount() {
        this.element = document.getElementById("popup")
        if (this.props.sendElem) this.props.sendElem(this.element)
        service.getUser().then(({ is_authenticated }) =>
        {
            this.setState({ is_authenticated: is_authenticated })
        })
    }

    componentDidUpdate(pP, pS) {
        const { datas } = this.props
        if(pP.datas !== datas && !this.props.is_loading) {
            const startNumber = 1
            this.setState({ startNumber, is_plus: true, is_prev: false, is_enable: false })
            this.props.setSource(undefined)
            this.checkModeAndCode(startNumber, datas)
        }
    }

    plusTab() {
        const { startNumber, datas } = this.state
        var plus = startNumber + 1
        plus = Math.min(datas.length, plus)

        let obj = Object()
        obj['is_prev'] = true
        obj['is_enable'] = false
        obj['per_page_limit'] = DEFAULT_PER_PAGE
        if (plus == datas.length) obj['is_plus'] = false
        else obj['is_plus'] = true

        this.checkModeAndCode(plus, datas)
        this.setState({ startNumber: plus, ...obj })
    }

    prevTab() {

        const { startNumber, datas } = this.state
        var minus = startNumber - 1
        minus = Math.max(minus, 1)

        let obj = Object()
        obj['is_plus'] = true
        obj['is_enable'] = false
        obj['per_page_limit'] = DEFAULT_PER_PAGE
        if (minus == 1) obj['is_prev'] = false
        else obj['is_prev'] = true

        this.checkModeAndCode(minus, datas)
        this.setState({ startNumber: minus, ...obj })
    }

    checkModeAndCode(number, datas) {
        let feature
        let code
        let values
        let localid
        let geom_name
        let is_enable = false
        let check = 0
        this.click_count = 0
        if (datas.length > 0) {
            let data = datas[number - 1]
            feature = data[2]
            code = data[0]
            values = data[1]

            values.map((value, idx) => {
                if (value[0] == 'geo_id') {
                    this.setState({ id: value[1] })
                    localid = value[1]
                }
                if (value[2] && value[2].toLowerCase() == 'pointname') {
                    check ++
                    this.setState({ name: value[1] })
                    geom_name = value[1]
                }
                if (value[2] && value[2].toLowerCase() == 'pointid') {
                    check ++
                    this.setState({ pdf_id: value[1] })
                }
            })
            if (check == 2) {
                is_enable = true
            }
            this.setNowData(number, datas, feature, code, geom_name, is_enable)
            this.props.setSource(feature)
        }
    }

    setNowData(number, datas, feature, code, geom_name, is_enable) {
        let data
        this.is_point = false

        data = datas[number - 1]

        if (code.includes("gp_layer_geodeticalpoint_gp_view")) {
            this.is_point = true
        }

        this.setState({ data, feature, datas, code, geom_name, is_enable })
    }

    checkButtonEnableWithId(geo_id, pdf_id){
        service.checkButtonEnableWithId(geo_id, pdf_id)
            .then(({is_enable, success, geo_id}) => {
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
        if (this.state.is_enable) {
            this.setState({ is_purchase: true })
            var data = [{ 'name': this.state.name,'id': this.state.id, 'code': this.state.code, 'geom_name': this.state.geom_name, 'pdf_id': this.state.pdf_id }]
            if(this.state.data.length > 0){
                service.purchaseFromCart(data)
                    .then(({ success, msg, payment_id }) => {
                        if(success){
                            this.setState({ data: [], is_purchase: false, is_purchased: true })
                            window.location.href=`/payment/purchase/${payment_id}/`;
                        }
                    })
                    .catch(error => {
                        alert("Алдаа гарсан тул хуудсыг дахин ачааллуулна уу")
                        this.setState({ is_purchase: false })
                    })
            }
        }
    }

    showMore() {
        let per_page_limit = this.state.data[1].length + 1
        this.setState({ per_page_limit })
    }

    render() {
        const {
            datas, data, startNumber, is_prev, is_plus,
            is_enable, is_authenticated, is_purchased,
            per_page_limit,
        } = this.state

        const { is_empty, is_loading } = this.props

        return (
                <div>
                    <div className="ol-popup-header">
                        <div className="ol-popup-header-content">
                            <div className="ol-header-cont" role="group">
                                {!is_empty && datas && datas.length > 0
                                    ?
                                        <>
                                            {startNumber}
                                            &nbsp; - &nbsp;
                                            {datas.length}
                                            &nbsp;
                                            {
                                                is_prev
                                                ?
                                                    <span onClick={this.prevTab} className="span-left" role="button">
                                                        <i className="fa fa-caret-left gp-text-primary fa-1x" aria-hidden="true" ></i>
                                                    </span>
                                                :
                                                    null
                                            }
                                            &nbsp;&nbsp;&nbsp;
                                            {
                                                !(datas.length == startNumber) && is_plus
                                                ?
                                                    <span className="span-right" onClick={this.plusTab} role="button">
                                                        <i className="fa fa-caret-right gp-text-primary fa-1x"  aria-hidden="true" ></i>
                                                    </span>
                                                :
                                                    null
                                            }
                                        </>
                                    :
                                        "Сонгоогүй байна"
                                }
                                <div className="ol-popup-closer" id="popup-closer" role="button" onClick={() => this.props.close()}>
                                    <i className="fa fa-times" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Loader is_loading={is_loading} />
                    {
                        is_empty && is_authenticated
                        ?
                            <div className="ol-popup-contet text-center">
                                <b>Хоосон газар сонгосон байна.</b>
                            </div>
                        :
                            is_authenticated
                            &&
                                <div className="ol-popup-contet">
                                    {
                                        data.length > 0 && data[1].length >= 1
                                        &&
                                            data[1].map((value, idx) =>
                                                value[0].toLowerCase().startsWith('name')
                                                && <b key={idx}>{value[1]}</b>
                                            )
                                    }
                                    <hr className="m-1 border border-secondary rounded"/>
                                    <table className="table borderless no-padding">
                                        <tbody>
                                            {
                                                data.length > 0 && data[1].length >= 1
                                                ?
                                                    data[1].map((value, idx) =>
                                                        idx <= per_page_limit
                                                        &&
                                                        value[0] != 'geo_id' && !value[0].toLowerCase().startsWith('name')
                                                            &&
                                                            <tr className="p-0" style={{fontSize: '12px'}} key={idx}>
                                                                <th className="font-weight-normal">
                                                                    <b>{value[0].charAt(0).toUpperCase() + value[0].substring(1)}:</b>
                                                                    <p className="m-0">&nbsp;&nbsp;&nbsp;{value[1].charAt(0).toUpperCase() + value[1].substring(1)}</p>
                                                                </th>
                                                            </tr>
                                                    )
                                                :
                                                    <tr>
                                                        <th>
                                                        {
                                                            !is_purchased
                                                            ? "Хоосон байна"
                                                            : "Амжилттай"
                                                        }
                                                        </th>
                                                    </tr>
                                            }
                                            {
                                                data.length > 0 && data[1].length >= per_page_limit
                                                ?
                                                    <tr>
                                                        <th>
                                                            <span className="gp-text-link" onClick={() => this.showMore()}>
                                                                Илүүг үзэх
                                                            </span>
                                                        </th>
                                                    </tr>
                                                :
                                                    null
                                            }
                                        </tbody>
                                    </table>
                                </div>
                    }
                    {
                        is_purchased
                        ? <div></div>
                        : !is_authenticated && !is_empty
                            ?
                                <div className="m-5">
                                    <button
                                        className="btn btn-primary p-2 mx-4"
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
                                        this.is_point
                                        ?
                                            <div className="btn-group flex-wrap d-flex justify-content-center p-3">
                                                <button
                                                    className="btn btn-xs btn-primary mx-1 my-1"
                                                    onClick={() => this.checkDataForPurchase()}
                                                    disabled={is_enable ? "" : "disabled"}
                                                    // disabled={true}
                                                >
                                                    {
                                                        is_enable
                                                        ?
                                                            "Худалдаж авах"
                                                        :
                                                            "Худалдаж авах боломжгүй"
                                                    }
                                                    {/* Засвартай байгаа */}
                                                </button>
                                                <button
                                                    className="btn btn-xs btn-primary mx-1 my-1"
                                                    onClick={() => this.openCartSide()}
                                                    disabled={is_enable ? "" : "disabled"}
                                                >
                                                    Сагсанд нэмэх
                                                </button>
                                            </div>
                                        : null
                                    : null
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

    getData(isload, datas, close, setSource, cartButton, is_empty, is_loading=true, is_authenticated=false) {
        this.toggleControl(isload)
        this.renderComponent({datas, close, setSource, cartButton, is_empty, is_loading, is_authenticated})
    }
}
