import React, { Component, Fragment } from "react"

import {Overlay} from 'ol'
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {CLASS_CONTROL, CLASS_HIDDEN} from 'ol/css.js'

class PopUpCmp extends Component {

    constructor(props) {

        super(props)
        this.state = {
            startNumber: null,
            totalNumner: null,
            is_prev: false,
            is_plus: true,
            data: [],
            mode: '',
            id: '',
            code: '',
        }
        this.plusTab = this.plusTab.bind(this)
        this.prevTab = this.prevTab.bind(this)
        this.checkModeAndCode = this.checkModeAndCode.bind(this)
        this.openCartSide = this.openCartSide.bind(this)
    }

    componentDidMount() {
        this.element = document.getElementById("popup")
        if (this.props.sendElem) this.props.sendElem(this.element)
    }

    componentDidUpdate(pP, pS) {
        const { datas } = this.props
        if(pP.datas !== datas) {
            const startNumber = 1
            this.setState({ startNumber, is_plus: true, is_prev: false })
            this.checkModeAndCode(startNumber, datas)
        }
    }

    plusTab() {
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
        if (datas.length > 0) {
            const mode = datas[number - 1][1]
            const code = datas[number - 1][2]
            const id = datas[number - 1][0][1][1]
            if (id[0] == 'point_id') {
                this.setState({ id: id[1] })
            }
            this.setNowData(number, datas, mode, code)
            this.props.setSource(mode)
        }
    }

    setNowData(number, datas, mode, code) {
        const data = datas[number - 1]
        this.setState({ data, mode, datas, code })
    }

    openCartSide() {
        this.props.cartButton(true, this.state.data, this.state.code, this.state.id)
    }

    render() {
        const { datas, startNumber, is_prev, is_plus } = this.state
        return (
                <div>
                    <div className="ol-popup-header">
                        <div className="ol-popup-header-content">
                            {datas && datas.length > 0
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
                    <div className="ol-popup-contet">
                        {datas && datas.map((layer, idx)=>
                            idx + 1 == startNumber &&
                            layer[0].map((values, v_idx) =>
                                v_idx == 1 &&
                                values.map((value, val_idx) =>
                                value[0] == 'point_name' ?
                                <b key={val_idx}>{value[1]}</b>
                                : null
                        )))}
                        <hr className="m-1 border border-secondary rounded"/>
                        <table className="table borderless no-padding">
                            <tbody>
                                {
                                    datas && datas.length > 0
                                    ?
                                        datas.map((layer, idx)=>
                                        (idx + 1 == startNumber &&
                                        layer[0].map((values, v_idx) =>
                                            v_idx == 1 &&
                                            values.map((value, val_idx) =>
                                                value[0] !== 'point_name' &&
                                                <tr style={{fontSize: '12px'}} key={val_idx}>
                                                    <th>{value[0]}</th>
                                                    <td>{value[1]}</td>
                                                </tr>
                                            )
                                        )))
                                    :
                                    <tr>
                                        <th>Мэдээлэл байхгүй байна</th>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    {
                        this.state.mode == 'mpoint_view'
                        ?
                            <div>
                                <button
                                    className="btn btn-lg gp-btn-primary my-3 mx-3"
                                    onClick={() => this.openCartSide()}
                                >
                                    Сагсанд нэмэх
                                </button>
                            </div>
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

    getData(isload, datas, close, setSource, cartButton, code) {
        // const datanud = [[["Полигонометрийн_сүлжээний_цэг.55",[["objectid","null"],["point_id","45546"],["point_name","holymoly"],["pid","PDF45546"],["mclass","1"],["ondor_type","Эллипсойдын өндрийн утга"],["center_typ",null],["aimag","Өвөрхангай"],["sum","Богд"],["sheet1","L"],["sheet2","44.0000000000"],["sheet3","102.0000000000"],["t_type","g105"],["ondor","787.0"],["point_class_name","Полигонометрийн сүлжээний цэг"],["point_class","5"]]],"mpoint_view","Полигонометрийн_сүлжээний_цэг"], [["Полигонометрийн_сүлжээний_цэг.58",[["objectid","null"],["point_id","489489"],["point_name","holyshit"],["pid","45245245"],["mclass","1"],["ondor_type","Эллипсойдын өндрийн утга"],["center_typ",null],["aimag","thhh"],["sum","dsadsadsa"],["sheet1","L"],["sheet2","44.0000000000"],["sheet3","102.0000000000"],["t_type","g105"],["ondor","787.0"],["point_class_name","Полигонометрийн сүлжээний цэг"],["point_class","2"]]],"mpoint_view","Полигонометрийн_сүлжээний_цэг"]]
        this.toggleControl(isload)
        this.renderComponent({datas, close, setSource, cartButton, code})
    }
}