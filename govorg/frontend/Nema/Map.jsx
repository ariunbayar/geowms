import React, { Component } from "react"
import InspireMap from "@utils/BundleMap"
import {service} from './service'
import { Children } from "react"

export default class NemaMap extends Component {

    constructor(props) {
        super(props)
        this.state = {
            wms_list: [],
            bundle:'',
            is_loading: false,
            choice_list: []
        }
        this.loadNema = this.loadNema.bind(this)
        this.getDatas = this.getDatas.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)

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
        const { choice_list, bundle} = this.state
        if ( bundle != pS.bundle ) {
            this.loadNema( bundle, choice_list )
        }
        if( pS.choice_list != choice_list ) {
            this.loadNema( bundle, choice_list )
        }
    }

    loadNema(bundle_id, choice_list) {
        service
            .getNema(bundle_id, choice_list)
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

    handleOnChange(e) {
        var choice = e.target.name
        if (e.target.checked) {

            var joined = this.state.choice_list.concat(choice)
            this.setState({ choice_list: joined})

        } else {
            var array = [...this.state.choice_list]
            for (let [i, layer] of array.entries()) {
                if (layer == choice) {
                    array.splice(i, 1);
                }
            }
            this.setState({choice_list: array})
        }
    }


    render() {
        const { wms_list } = this.state
        return (
            <div className="col-lg-12">
                <div className="col-12 col-md-12 col-xl-12 d-flex justify-content-center">
                    <div className="form-check d-inline-block mx-3 my-3">
                        <input className="form-check-input" type="checkbox" name="1"  onChange={(e) => this.handleOnChange(e)}/>
                        <label className="form-check-label h5">
                            Нээлттэй
                        </label>
                    </div>
                    <div className="form-check d-inline-block mx-3 my-3">
                        <input className="form-check-input"  name="2" type="checkbox" onChange={(e) => this.handleOnChange(e)}/>
                        <label className="form-check-label h5">
                            Хаалттай
                        </label>
                    </div>
                </div>
                <div className="col-12 col-md-12 col-xl-12">
                    <InspireMap
                        wms_list={wms_list}
                        height="80vh"
                        base_layer={true}
                    />
                </div>
            </div>
        )
    }
}
