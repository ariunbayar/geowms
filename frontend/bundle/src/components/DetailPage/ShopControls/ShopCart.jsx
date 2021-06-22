import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {service} from '../service'

export class Cart extends Component{

    constructor(props) {
        super(props)
        this.div = []
        this.xy = []
        this.state = {
            coordinate: [],
            torf: false,
            data: [],
            x: null,
            y: null,
            is_button: false,
            is_purchase: false,
            alert_msg: '',
            max_size: 8,
            first_number: 0,
            is_again: false,
        }

        this.removeList = this.removeList.bind(this)
        this.checkDataForPurchase = this.checkDataForPurchase.bind(this)
        this.moreItems = this.moreItems.bind(this)
        this.undoItems = this.undoItems.bind(this)
        this.makeList = this.makeList.bind(this)
    }

    componentDidMount(){
        this.makeList()
    }

    componentDidUpdate(pP, pS){
        if(pP.geom_name !== this.props.geom_name) {
            this.makeList()
        }
        if(pP.point_id === this.props.point_id && this.props.is_again_clicked) {
            if (this.state.data.length > 0) {
                const found = this.state.data.filter(element => {
                    return element.id == this.props.point_id
                }).length > 0
                if (!found) {
                    this.makeList()
                }
            } else {
                this.makeList()
            }
        }
        if(pS.data !== this.state.data) {
            if(this.state.data.length == 0){
                this.setState({ is_button: true })
            }
        }
    }

    makeList() {
        const {coordinate, torf, point_name, code, point_id, geom_name, pdf_id_props} = this.props
        if(torf == true) {
            if(geom_name !== '') {
                var name = 'Нэр байхгүй байна'
                var pdf_id = 'pdf байхгүй'
                if (pdf_id_props) {
                    pdf_id = pdf_id_props
                }
                if (point_name) {
                    name = point_name
                }
                var json = {
                    'name': name,
                    'id': point_id,
                    'code': code,
                    'geom_name': geom_name,
                    'pdf_id': pdf_id,
                }
                if (this.state.data.length > 0) {
                    const found = this.state.data.filter(element => {
                        return element.geom_name == json.geom_name
                    }).length > 0
                    if(!found) {
                        const data = this.state.data
                        data.push(json)
                        this.setState({
                            data,
                            is_button: false,
                        })
                    }
                    else {
                        this.setState({ alert_msg: "Адилхан цэг байна !", success: false })
                        setTimeout(() => {
                            this.setState({ alert_msg: '', success: false})
                        }, 2000);
                    }
                }
                else {
                    this.setState({
                        data: [json],
                        is_button: false,
                    })
                }
            }
        }
    }

    removeList(geom_name){
        const {data} = this.state
        if(data.length == 1){
            this.setState({
                data: [],
            })
        }
        if(data.length > 1){
            const isBelowThreshold = (geom_name_from_array) => geom_name_from_array = geom_name;
            if(data.every(isBelowThreshold)){
                var array = data.filter((item) =>{
                    return item.geom_name !== geom_name
                })
                this.setState({
                    data: array,
                })
            }
        }
    }

    checkDataForPurchase(){
        this.setState({ is_purchase: true })
        if(this.state.data.length > 0){
            service.purchaseFromCart(this.state.data)
                .then(({success, msg, payment_id}) => {
                    if(success){
                        this.setState({ alert_msg: msg, success })
                        setTimeout(() => {
                            //this.props.history(`/payment/purchase/${payment_id}/`)
                            this.setState({ data: [], is_purchase: false, is_button: true })
                            window.location.href=`/payment/purchase/${payment_id}/`;
                        }, 1000);
                    }
                    if(!success){
                        this.setState({ is_purchase: false, is_button: false, alert_msg: msg })
                        setTimeout(() => {
                            this.setState({ alert_msg: '' })
                        }, 2000);
                    }
                })
                .catch(error => alert("Алдаа гарсан тул хуудсыг дахин ачааллуулна уу"))
        }
        else{
            this.setState({ alert_msg: "Уучлаарай сагс хоосон байна" })
        }
    }

    moreItems(){
        const { max_size, first_number } = this.state
        var first = first_number
        var max = max_size
        var need = max - first
        first = first + need
        max = max + need
        this.setState({ first_number: first, max_size: max, undoItem: true })
    }

    undoItems(){
        const { max_size, first_number } = this.state
        var first = first_number
        var max = max_size
        var need = max - first_number
        first = first - need
        max = max - need
        this.setState({ max_size: max, first_number: first })
        if(first <= 0){
            this.setState({ undoItem: false })
        }
    }

    render(){
        const {coordinate, torf, data, is_button, alert_msg, success, max_size, first_number, undoItem } = this.state
        const {x, y} = this.props

        if(data.length > 0){
            this.div = []
            data.slice(first_number, max_size).map((data, key) => {
                var idx = key + 1 + first_number
                this.div.push(
                    <div className="rounded bg-light card-baraa row shadow-sm bg-white"  key={key}>
                        <div className="col-md-1 icon"><i type="button" className="fa fa-trash text-danger" onClick={() => this.removeList(data.geom_name)}></i></div>
                        <span className="col-md-10 name"><b>{idx}. Цэгийн нэр: </b>{data.name}</span>
                    </div>
                )
            })
        }
        else{
            this.div = []
        }
        return(
            <div className="root">
                {
                    alert_msg !== '' && success
                    ?
                    <div className="alert alert-success alert-custom-css" role="alert">
                        {alert_msg}
                    </div>
                    :
                    <div className={`alert alert-danger alert-custom-css `+ (alert_msg !== '' ? 'd-block': 'd-none')} role="alert">
                        {alert_msg}
                    </div>
                }
                <div>
                <div className="cart-button">
                    <div className="card-count">
                        {data.length}
                    </div>
                    <div className="card-icon">
                        <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="cart-list">
                    {
                        undoItem
                        ?
                        <a type="button" className="btn-outline btn-block p-0 my-2 m-0 text-center" onClick={() => this.undoItems()}><i style={{fontSize:"30px"}} className="fa fa-angle-up gp-text-primary" aria-hidden="true"></i></a>
                        :
                        null
                    }
                    {this.div}
                    {
                        data.length > max_size
                        ?
                        <a type="button" className="btn-outline btn-block p-0 my-2 m-0 text-center" onClick={() => this.moreItems()}><i style={{fontSize:"30px"}} className="fa fa-angle-down gp-text-primary" aria-hidden="true"></i></a>
                        :
                        null
                    }
                    {this.state.is_purchase ?
                        <button className="btn gp-btn-primary my-4" disabled>
                            <div className="spinner-border" role="status">
                                <span className="sr-only"></span>
                            </div>
                            {} Түр хүлээнэ үү...
                        </button> :
                        <button
                            className="btn gp-btn-primary pay-button my-4"
                            onClick={() => this.checkDataForPurchase()}
                            disabled={is_button}
                            // disabled={true}
                        >
                            {/* Засвартай байгаа */}
                            Худалдаж авах

                        </button>
                    }
                    </div>
                </div>
            </div>
        )
    }
}

export class ShopCart extends Control {

    constructor(opt_options) {
        const options = opt_options || {}
        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = true
        this.is_cart = false

        this.element.className = 'd-block'

        this.renderComponent = this.renderComponent.bind(this)
        this.showModal = this.showModal.bind(this)
    }

    renderComponent(props) {
        if (!this.is_component_initialized) {
            ReactDOM.render(<Cart {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<Cart {...props}/>, this.element)
    }

    showModal(coordinate, torf, x, y, point_name, code, point_id, is_again_clicked, geom_name, pdf_id_props) {
        this.renderComponent({coordinate, torf, x, y, point_name, code, point_id, is_again_clicked, geom_name, pdf_id_props})
    }
}
