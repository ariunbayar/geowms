import React, { Component } from "react"

import {service} from './service'
import Govorg from './Govorg'
import {NavLink} from "react-router-dom"
import { Pagination } from '@utils/Pagination'
import ModalAlert from "../../ModalAlert";

export class Жагсаалт extends Component {


    constructor(props) {

        super(props)

        this.initial_form_values = {
        }

        this.state = {
            govorg_list: [],
            govorg_length:null,
            currentPage:1,
            govorgPerPage:20,
            load: 0,
            searchQuery: '',
            modal_alert_status: "closed",
            timer: null
        }
        this.paginate = this.paginate.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
    }

    paginate (page, query) {
        const perpage = this.state.govorgPerPage
        const org_id = this.props.match.params.id
        this.setState({ currentPage: page })
            return service
                .govorgList(page, perpage, query, org_id)
                .then(page => {
                    this.setState({ govorg_list: page.items, govorg_length: page.items.length })
                    return page
                })
    }

    handleSearch(field, e) {
        if(e.target.value.length >= 1)
        {
            this.setState({ [field]: e.target.value })
            this.paginate(1, e.target.value)
        }
        else
        {
            this.setState({ [field]: e.target.value })
            this.paginate(1, e.target.value)
        }
    }

    handleRemove(id) {
        const { load, searchQuery }=this.state
        service.remove(id).then(({success}) => {
            if (success) {
                var a = load
                a ++
                this.setState({ load: a })
                this.paginate(1, searchQuery)
                this.setState({modal_alert_status: 'open'})
            }
        })
        this.modalCloseTime()
    }

    modalClose(){
        this.setState({modal_alert_status: "closed"})
        clearTimeout(this.state.timer)
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
        }, 2000)
    }

    render() {
        const {
            refresh,
            талбарууд,
            жагсаалтын_холбоос,
            хувьсах_талбарууд,
            custom_query,
            нэмэх_товч,
        } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="col-md-12">
                        <PortalDataTable
                            refresh={refresh}
                            color={'bg-dark'}
                            талбарууд={талбарууд}
                            жагсаалтын_холбоос={жагсаалтын_холбоос}
                            per_page={20}
                            уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                            хувьсах_талбарууд={хувьсах_талбарууд}
                            нэмэх_товч={нэмэх_товч}
                            custom_query={custom_query}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
