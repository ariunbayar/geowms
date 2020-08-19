import React, { Component } from "react"
import {LogFormTable} from './LogFormTable'
import {service} from './service'

export class LogForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            payment_all:[],
            pay_legth:null,
            currentPage:1,
            payPerPage:100
        }
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
        this.handleGetAll=this.handleGetAll.bind(this)
        this.handleListCal=this.handleListCal.bind(this)
    }

    componentDidMount(){

        this.handleListUpdated()
        const {currentPage}=this.state
        this.handleListCal(currentPage)
    }
    handleListCal(currentPage){

        const {payPerPage}=this.state
        const lastIndex=currentPage*payPerPage
        const firtsIndex=lastIndex-payPerPage
        const value={ "firstIndex":firtsIndex, "lastIndex": lastIndex}
        this.handleGetAll(value)
    }
    handleGetAll(value){
        service.getAll(value).then(({ payment_all,len }) => {
            if (payment_all) {
                this.setState({payment_all,pay_legth:len})
                console.log(len)
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
        if(this.state.currentPage<Math.ceil(this.state.org_length/this.state.orgPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
            this.handleListCal(this.state.currentPage+1)
        }
    }

    handleListUpdated(){
        service.getAll().then(({payment_all}) => {
            this.setState({payment_all})
        })
    }
    render() {
        const {payment_all} = this.state
        const {payPerPage,currentPage,pay_legth} = this.state
        const totalPages=Math.ceil( pay_legth/payPerPage)
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <h5 className="mb-3">Гүйлгээний хуулга</h5>
                    <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer shadow-lg p-3 mb-5 bg-white rounded">
                    <table className="table example" id="example">
                        <thead>
                            <tr>
                                <th scope="col">Нийт дүн</th>
                                <th scope="col">Тодорхойлолт</th>
                                <th scope="col"> Огноо   </th>
                                <th scope="col">Амжилттай</th>
                                <th scope="col">Амжилтгүй</th>
                                <th scope="col">Хэрэглэгчийн id</th>
                                <th scope="col">Банкны дугаар</th>
                                <th scope="col">Дата id</th>
                                <th scope="col">Алдаатай код</th>
                                <th scope="col">Алдаатай зурвас</th>
                                <th scope="col">Амжилтгүй болсон</th>
                                <th scope="col">Гео дугаар</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payment_all.map((pay, idx) =>
                                <LogFormTable key = {idx} values={pay}></LogFormTable>
                            )}
                        </tbody>
                    </table>
                    </div>
                    <div className="col-md-12">
                        <div className="float-left">
                            <strong>Хуудас {currentPage}-{totalPages}</strong>
                        </div>
                        <div className="float-right">
                            <button
                            type=" button"
                            className="btn btn-outline-primary"
                            onClick={this.prevPage}
                            >&laquo;өмнөх
                            </button> {}
                            <button
                            type="button"
                            className="btn btn-outline-primary "
                            onClick={this.nextPage
                            }>
                            дараах &raquo;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
