import React, { Component, Fragment } from "react"
import { FormJson } from '../OrgRequest/requestModal'

export default class Маягт extends Component {

    constructor(props) {
        super(props)

        this.state = {
        }
    }


    render() {
        const { form_json } = this.props
        return(
            <FormJson form_json={form_json}/>
        )
    }
}
