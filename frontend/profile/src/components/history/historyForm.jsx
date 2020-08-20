 
import React, { Component } from "react"
import {service} from '../service'
import {HistoryTable} from './historyTable'
export default class History extends Component {

    constructor(props) {
        super(props)
        this.state={
            payment:[],
            payment_length:1,
            currentPage:1,
            paymentPerPage:25,
        }
        this.handleGetAll=this.handleGetAll.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
        this.handleListCal=this.handleListCal.bind(this)

    }

    componentDidMount(){
        const currentPage=this.state.currentPage
        this.handleListCal(currentPage)
    }

    handleListCal(currentPage){
        const {paymentPerPage}=this.state
        const lastIndex=currentPage*paymentPerPage
        const firtsIndex=lastIndex-paymentPerPage
        const value={ "firstIndex":firtsIndex, "lastIndex": lastIndex}
        this.handleGetAll()
    }

    handleGetAll(){

        service.loadHistory().then(({ payment }) => {
            if (payment) {
                this.setState({
                    payment
                })
            }
        })
    }


    prevPage(){
        if(this.state.currentPage >1){
            this.setState({
                currentPage:this.state.currentPage-1
            })
            this.handleListCal(this.state.currentPage-1)

        }
    }

    nextPage(){
        if(this.state.currentPage<Math.ceil(this.state.payment_length/this.state.paymentPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
            this.handleListCal(this.state.currentPage+1)
        }
    }


    render() {
        const {payment,paymentPerPage,currentPage,payment_length} = this.state
        const totalPages=Math.ceil( payment_length/paymentPerPage)
        return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 py-0 my-3">
                    <table className="table table-bordered">
                         <thead>
                            <tr>
                                <th scope="col">№</th>
                                <th scope="col">#</th>
                                <th scope="col">Дугаар</th>
                                <th scope="col">Хэмжээ(Amount)</th >
                                <th scope="col">Танилцуулга (description)</th >
                                <th scope="col">Огноо</th >
                                <th scope="col">is_success</th >
                                <th scope="col">success_at</th >
                            </tr>
                        </thead>
                        <tbody>
                        { payment_length ===0 ?
                                    <tr><td>Худалдан авалт бүртгэлгүй байна</td></tr>:

                                    payment.map((p, idx) =>
                                        <HistoryTable
                                            key={idx}
                                            idx={(currentPage*25)-25+idx+1}
                                            values={p}
                                        >
                                        </HistoryTable>

                                )}
                        </tbody>
                       </table>
                       <div className="row">
                        <div className="col-md-12">
                            <div className="float-left">
                                <strong>Хуудас {currentPage}-{totalPages}</strong>
                            </div>
                            <div className="float-right">
                                <button
                                type=" button" 
                                className="btn btn-outline-primary" 
                                onClick={this.prevPage}
                                > &laquo; өмнөх
                                </button>
                                <button 
                                type="button"
                                className="btn btn-outline-primary "
                                onClick={this.nextPage
                                } >
                                дараах &raquo;
                                </button>
                                
                            </div>
                        </div>
                </div>
                    </div>
                  </div>
            </div>
        )
    }
}
