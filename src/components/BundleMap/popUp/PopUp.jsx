import React, { Component, Fragment } from "react"
import {service} from '../service'
import ReactDOM from 'react-dom'
import Loader from "@utils/Loader"
import {Control} from 'ol/control'

class PopUpCmp extends Component {

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
        const { datas, is_loading} = this.props
        console.log("hohfdkshfklsdjflksdjf", datas, is_loading)
        if(pP.datas !== datas || is_loading != pP.is_loading) {
            console.log(datas)
            this.setState({datas, is_loading})
        }
    }


    render() {
        const {PPComponent, is_empty, is_from_inspire, close} = this.props
        const { datas, is_loading } = this.state
        return (
                <div>
                    <PPComponent
                        datas={datas}
                        is_empty={is_empty}
                        is_from_inspire={is_from_inspire}
                        is_loading={is_loading}
                        close={close}
                    />
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

    blockPopUp(islaod, sendElem, close, PPComponent) {
        this.toggleControl(islaod)
        this.renderComponent({sendElem, close, PPComponent})
    }

    getData(isload, datas, close, setSource, cartButton, is_empty, is_from_inspire, is_loading=true, PPComponent) {
        this.toggleControl(isload)
        this.renderComponent({datas, close, setSource, cartButton, is_empty, is_from_inspire, is_loading, PPComponent})
    }
}
