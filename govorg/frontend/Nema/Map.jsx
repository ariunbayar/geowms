import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"
import InspireMap from "@utils/BundleMap"

export default class NemaMap extends Component {

    constructor(props) {
        super(props)
        this.state = {
            form_values: {
                code: '',
                is_open: 1,
                layer_name: '',
                created_by: '',
                created_at: '',
                user_id: '',
            },

        }
        this.loadNema = this.loadNema.bind(this)

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
        return (
            <div className="col-lg-12">
                <InspireMap
                    loadNema={(func) => this.loadNema(func)}
                />
            </div>
        )
    }
}
