import React, { Component } from "react"
import InspireMap from "@utils/BundleMap"
import {service} from './service'

export default class NemaMap extends Component {

    constructor(props) {
        super(props)
        this.state = {
            wms_list: [],
            bundle:'',
            is_loading: false,
        }
        this.loadNema = this.loadNema.bind(this)
        this.getDatas = this.getDatas.bind(this)

    }


    componentDidMount(){
        this.getDatas()
    }

    getDatas(){
        service
            .covidConfigGet()
            .then((values) => {
                this.setState({ bundle: values.bundle, is_loading: false })
            })
    }

    componentDidUpdate(pP, pS) {
        if (this.state.bundle != pS.bundle) {
            this.loadNema(this.state.bundle)
        }
    }

    loadNema(bundle_id) {
        service
            .getNema(bundle_id)
            .then(({ success, info, wms_list }) => {
                if (success) {
                    if (wms_list.length > 0) {
                        this.setState({wms_list})
                    }
                }
                else {
                    alert(info)
                }
            })
    }

    render() {
        const { wms_list } = this.state
        return (
            <div className="col-lg-12">
                <InspireMap
                    wms_list={wms_list}
                    height="80vh"
                    base_layer={true}
                />
            </div>
        )
    }
}
