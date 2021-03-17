import React, { Component } from "react"
import InspireMap from "@utils/BundleMap"
import {service} from './service'

export default class NemaMap extends Component {

    constructor(props) {
        super(props)
        this.state = {
            bundle: '',
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

    loadNema(addNema) {
        service
            .getNema()
            .then(({ success, info, wms_list }) => {
                if (success) {
                    if (wms_list.length > 0) {
                        addNema(wms_list)
                    }
                }
                else {
                    alert(info)
                }
            })
    }

    render() {
        const { bundle } = this.state
        return (
            <div className="col-lg-12">
                <InspireMap
                    bundle={{'id': bundle}}
                    loadNema={(func) => this.loadNema(func)}
                />
            </div>
        )
    }
}
