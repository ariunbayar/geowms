import React, { Component } from "react"
import {service} from './service'
// import { Timer } from './timeCount'

export class QPay extends Component {

    constructor(props) {
        super(props)
        this.state = {
            qPay_QRimage: '',
            purchase_id: props.purchase_id,
            qpay_open: false,
            msg: '',
            minutes: 5,
            seconds: 0,
            error_message: '',
            success: false,
        }
        this.payCheck = this.payCheck.bind(this)
        this.timerRemaining = this.timerRemaining.bind(this)
    }

    componentDidMount(){
        if(this.state.qpay_open){
            this.HandleCreateQpay()
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.qpay_open !== this.props.qpay_open)
        {
            if(this.props.qpay_open)
            {
                this.setState({minutes: 5, seconds:0, qPay_QRimage: ''})
                this.HandleCreateQpay()
            }
            else{
                clearInterval(this.myInterval)
            }
        }
    }

    HandleCreateQpay(){
        const { purchase_id } = this.state
        service
            .handleCreateQpay(purchase_id)
            .then(({ qPay_QRimage, success, error, error_message }) => {
                if(success)
                {
                    this.props.history(`/payment/history/api/details/${purchase_id}/`)
                }
                else
                {
                    if(error_message){
                        this.props.addNotif('danger', error_message, 'times')
                    }

                    if(qPay_QRimage){
                        this.setState({ qPay_QRimage })
                        this.timerRemaining()
                        this.payCheck(this.props.qpay_open)
                    }

                }
                if (error) {
                    this.props.addNotif('danger', error_message, 'times')
                }
            })

    }

    payCheck(check){
        const { purchase_id } = this.state
        if(check){
            service.check(purchase_id).then(({success, msg}) => {
                if(success) //Amjilttai boloh uyd
                {
                    this.props.handleClose(true)
                }
                else{
                    setTimeout(() => {
                        this.payCheck(this.props.qpay_open)
                    }, 5000)
                }
            })
            .catch(() => this.props.addNotif('danger', 'Алдаа гарсан байна', 'times'))
        }
    }

    timerRemaining(){
        this.myInterval = setInterval(() => {
            const { seconds, minutes } = this.state
            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    setTimeout(() => {
                        this.props.handleClose(false)
                    }, 2000);
                    clearInterval(this.myInterval)
                }
                else {
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                }
            }
        }, 1000)
    }

    render() {
        const { minutes, seconds, qPay_QRimage } = this.state
        return (
            <div className="container text-center">
                <div>
                    {qPay_QRimage != []
                        ?
                        ( minutes === 0 && seconds === 0
                            ? <h1 className="text-warning">Хугацаа дууссан!</h1>
                            : <h1>Хугацаа: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                        )
                        :
                        null
                    }
                </div>
                <h1 className="text-succes gp-text-primary"></h1>
                <h1 className="text-succes gp-text-primary">QR Code уншуулна уу.</h1><br></br>
                {
                    qPay_QRimage != []
                    ?
                        <img className="shadow p-3 mb-5 bg-white rounded" src={"data:image/png;base64," +  qPay_QRimage} />
                    :
                        <div className="my-5">
                            <div className="spinner-border gp-text-primary my-5" role="status">
                                <i className="fas fa-cog fa-spin"></i>
                            </div>
                        </div>
                }
            </div>
        )
    }
}
