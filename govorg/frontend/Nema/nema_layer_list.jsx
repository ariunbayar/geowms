import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"
import { PortalDataTable } from "@utils/DataTable"
import { ModelAddNema } from './add_model'


export class NemaTable extends Component {

    constructor(props) {

        super(props)
        this.state = {
            жагсаалтын_холбоос: '/gov/api/nema/',
            талбарууд: [
                {'field': 'code', "title": 'layer code'},
                {'field': 'is_open', "title": 'is_open'},
            ],
            хувьсах_талбарууд: [
                {
                    "field": "is_open",
                    "text": "",
                    "action": this.set_active_color,
                    "action_type": true,
                },
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Засах',
                    "text": '', "icon":
                    'fa fa-pencil-square-o text-success',
                    "action": (values) => this.go_link(values),
                },
                {
                    "title": 'Устгах',
                    "text": '',
                    "icon": 'fa fa-trash-o text-danger',
                    "action": (values) => this.handleRemoveAction(values),
                },
            ],
            refresh: true,
            modal_status: "closed",
            values: {},
            button_clicked: false,
        }
        this.handleRemove = this.handleRemove.bind(this)
        this.go_link = this.go_link.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.handleRemoveAction = this.handleRemoveAction.bind(this)

    }

    set_active_color(boolean){
        let color = "text-danger fa fa-times"
        if(boolean) color = "text-success fa fa-check"
        return color
    }

    go_link(values){
        this.props.history.push(`/back/nema/${values.id}/засах/`)
    }

    handleRemove() {
        const {values} = this.state
        service.remove(values.id).then(({success}) => {
            if (success) {
                this.setState({refresh: !this.state.refresh})
                this.handleModalClose()
            }
        })
    }

    handleModalOpen(){
        this.setState({modal_status: 'open'})
    }

    handleModalClose(){
        this.setState({modal_status: 'closed'})
    }

    handleRemoveAction(values){
        this.setState({values})
        this.handleModalOpen()
    }


    render() {
        const { талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд, нэмэлт_талбарууд, refresh, values, modal_status} = this.state
        return (

                <PortalDataTable
                    талбарууд={талбарууд}
                    жагсаалтын_холбоос={жагсаалтын_холбоос}
                    уншиж_байх_үед_зурвас={"Уншиж байна"}
                    хувьсах_талбарууд={хувьсах_талбарууд}
                    нэмэлт_талбарууд={нэмэлт_талбарууд}
                    нэмэх_товч={'/gov/nema/үүсгэх/'}
                    refresh={refresh}
                />
            
        )
    }
}
