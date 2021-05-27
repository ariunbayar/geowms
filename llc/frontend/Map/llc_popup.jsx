import React, { Component, Fragment } from "react"
import Loader from "@utils/Loader"


export class LLCPP extends Component {

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
            datas: props.datas,
            mode: '',
            name: '',
            id: '',
            code: '',
            geom_name: '',
            pdf_id:'',
            is_purchase: false,
            is_enable: false,
            is_authenticated: false,
            layer_name: '',
            attr10: '',
            attr10_status: false,
            choices_list: [],
            attributes: [],
        }
        this.plusTab = this.plusTab.bind(this)
        this.prevTab = this.prevTab.bind(this)
        this.checkModeAndCode = this.checkModeAndCode.bind(this)
        this.getNemaAttributeDetail = this.getNemaAttributeDetail.bind(this)
    }

    componentDidUpdate(pP, pS) {
        const { datas } = this.props
        if(pP.datas !== datas && !this.props.is_loading) {
            this.getNemaAttributeDetail(datas)
        }

        if (pP.datas !== datas) {
            if (datas && datas[0][0][1]) this.setState({datas})
        }
    }

    getNemaAttributeDetail(datas) {
            this.properties = []
            const startNumber = 1
            this.setState({ startNumber, is_plus: true, is_prev: false})

            this.checkModeAndCode(startNumber, datas)
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
            this.setNowData(number, datas, mode, code, geom_name)
        }
    }

    setNowData(number, datas, mode, code, geom_name) {
        let data
        this.is_from_inspire = true

        if (this.props.is_from_inspire) data = [datas[number - 1]]
        else data = datas[number - 1]

        if (code != "gp_layer_geodetical_point_view") {
            this.is_from_inspire = false
        }
        this.setState({ data, mode, datas, code, geom_name })
    }

    render() {
        const { datas, data, startNumber, is_prev, is_plus} = this.state
        const { is_empty, is_from_inspire, is_loading, datas_hoho} = this.props
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
                    <Loader is_loading={is_loading} />
                    {
                        is_empty
                        ?
                            <div className="ol-popup-contet text-center">
                                <b>Хоосон газар сонгосон байна.</b>
                            </div>
                        :
                            <div className="ol-popup-contet  overflow-auto" style={{height: '30vh'}}>
                                {
                                    data.length>= 1 && data[2]
                                        &&
                                        <div className="text-info text-center col-md-12">{data[2]}</div>
                                }
                                <hr className="m-1 border border-secondary rounded"/>
                                <table className="table borderless no-padding">
                                    <tbody>
                                        {
                                            data.length >= 1
                                            ?
                                                data[0].map((layer, idx) =>
                                                    idx == 1 &&
                                                    <Fragment key={idx}>
                                                        {   layer.map((value, v_idx) =>
                                                            !value[0].toLowerCase().startsWith('name')
                                                            &&
                                                                <tr className="p-0" style={{fontSize: '12px'}} key={v_idx}>
                                                                    <th className="font-weight-normal">
                                                                        <b>{value[0].charAt(0).toUpperCase() + value[0].substring(1)}:</b>
                                                                        <p className="m-0">&nbsp;&nbsp;&nbsp;{value[1].charAt(0).toUpperCase() + value[1].substring(1)}</p>
                                                                    </th>
                                                                </tr>
                                                            )}
                                                        </Fragment>
                                                )
                                            :
                                            <tr><th>Хоосон байна.</th></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                    }
                </div>
            )
    }
}
