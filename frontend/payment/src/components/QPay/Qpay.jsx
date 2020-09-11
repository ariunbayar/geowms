import React, { Component } from "react"
import {service} from './service'
export class QPay extends Component {

    constructor(props) {
        super(props)
        this.state = {
            qPay_QRimage: [],
            purchase_id: props.purchase_id,
            qpay_open: false,
        }
        this.payCheck = this.payCheck.bind(this)

    }

    componentDidMount(){
        if(this.props.qpay_open)
        {
            this.payCheck(true)
            this.HandleCreateQpay()
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.qpay_open !== this.props.qpay_open)
        {
            if(this.props.qpay_open)
            {
                this.payCheck(this.props.qpay_open)
                this.HandleCreateQpay()

            }
            else{
                this.payCheck(this.props.qpay_open)
            }
        }
    }

    HandleCreateQpay(){
        const { purchase_id } = this.state
        service.handleCreateQpay(20000, purchase_id).then(({qPay_QRimage, error_message, success}) => {
            if(success){
                this.props.history(`/payment/success/${purchase_id}/`)
            }
            else{
                this.setState({qPay_QRimage, error_message})

            }
        })

    }

    payCheck(check){
        const { purchase_id } = this.state
        if(check){
            service.check(purchase_id).then(({success, error_message}) => {
                if(success)
                {
                    this.setState({error_message:error_message})
                    this.props.history(`/payment/success/${purchase_id}/`)
                }
                else{
                    setTimeout(() => {
                        this.payCheck(this.props.qpay_open)
                    }, 5000)
                }
            })
        }
    }

    render() {
        const {error_message} = this.state
        return (
            <div className="container text-center">
                <h1 className="text-succes gp-text-primary"></h1>
                <h1 className="text-succes gp-text-primary">QR Code уншуулна уу.</h1><br></br>
                {error_message == '' ?
                <img className="shadow p-3 mb-5 bg-white rounded" src={"data:image/png;base64," +  this.state.qPay_QRimage} />:
                <h6 className="text-success">{error_message}</h6>}
            </div>
        )
    }
}