import React, { Component, Fragment } from "react"

import {Overlay} from 'ol'
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {CLASS_CONTROL, CLASS_HIDDEN} from 'ol/css.js'

class PopUpCmp extends Component {

    constructor(props) {

        super(props)
        this.allfields = []
        this.state = {
            startNumber: null,
            totalNumner: null,
            is_prev: false,
            is_plus: true,
        }
        this.plusTab = this.plusTab.bind(this)
        this.prevTab = this.prevTab.bind(this)
    }

    componentDidMount() {
        this.element = document.getElementById("popup")
        if (this.props.sendElem) this.props.sendElem(this.element)
    }

    componentDidUpdate(pP) {
        const { datas } = this.props
        if(pP.datas !== datas) {
            const startNumber = 1
            this.setState({ datas, fields: this.allfields, startNumber, is_plus: true, is_prev: false })
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
        this.checkMode(plus)
        this.setState({ startNumber: plus })
    }

    prevTab() {
        const { startNumber } = this.state
        var minus = startNumber - 1
        minus = Math.max(minus, 1)
        if (minus == 1) {
            this.setState({ is_prev: false, is_plus: true })
        }else {
            this.setState({ is_plus: true, is_prev: true })
        }
        this.checkMode(minus)
        this.setState({ startNumber: minus })
    }

    checkMode(number) {
        const { datas } = this.state
        const last = datas[number - 1].length - 1
        const mode = datas[number - 1][last]['mode']
        this.props.setSource(mode)
    }

    render() {
        const { datas, startNumber, is_prev, is_plus } = this.state
        return (
                <div>
                    <div className="ol-popup-header">
                        <div className="ol-popup-header-content">
                            {datas
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
                            {!datas && <div className="ol-popup-closer" id="popup-closer" role="button" onClick={() => this.props.close()}>
                                <i className="fa fa-times" aria-hidden="true"></i>
                            </div>}
                        </div>
                    </div>
                    <div className="ol-popup-contet">
                        {datas && datas.map((data, idx) =>
                                    data.map((info, ix) =>
                                        idx + 1 == startNumber &&
                                        (info.field_name == 'name' ?
                                        <b key={ix}>
                                            {info.value}
                                        </b> : null)
                        ))}
                        <hr className="m-1 border border-secondary rounded"/>
                        <table className="table borderless no-padding">
                            <tbody>
                                {
                                    datas
                                    ?
                                        datas.map((data, idx) =>
                                            data.map((info, ix) =>
                                                (idx + 1 == startNumber &&
                                                    ix != 0 &&
                                                <tr style={{fontSize: '12px'}} key={ix}>
                                                    <th>{info.mn_name}</th>
                                                    <td>{info.value}</td>
                                                </tr>
                                            ))
                                        )
                                    :
                                    <tr>
                                        <th>Мэдээлэл байхгүй байна</th>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
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

    getData(isload, datas, close, setSource) {
        this.toggleControl(isload)
        this.renderComponent({datas, close, setSource})
    }

}