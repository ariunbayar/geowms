import React, { Component } from 'react'
import { PortalDataTable } from "@utils/DataTable/index"
import { service } from "./service"

class PositionList extends Component {

    constructor(props) {
        super(props)

        this.state={
            refresh: false,
            талбарууд: [
                {'field': 'name', "title": 'Албан тушаал',},
            ],
            хувьсах_талбарууд: [
                {"field": "name", "text": ""},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Засах',
                    "text": '',
                    "icon": 'fa fa-pencil-square-o text-success',
                    "action": (values) => this.handleEdit(values),
                },
                {
                    "title": 'Устгах',
                    "text": '',
                    "icon": 'fa fa-trash-o text-danger',
                    "action": (values) => this.handleAsk(values),
                    "width": "100px"
                },
            ],

            жагсаалтын_холбоос: ``,
            нэмэх_товч: ``,
            custom_query: {},
            back_link: ``,
        }
        this.handleRemove = this.handleRemove.bind(this)
        this.handleConfig = this.handleConfig.bind(this)
        this.handleAsk = this.handleAsk.bind(this)
    }

    UNSAFE_componentWillMount() {
        this.handleConfig()
    }

    handleEdit(values) {
        const { level, id } = this.props.match.params
        const { is_backend } = this.props
        if (is_backend) {
            this.props.history.push(`/back/байгууллага/түвшин/${level}/${id}/position/${values.id}/edit/`)
        }
        else {
            this.props.history.push(`/gov/perm/position/${values.id}/edit/`)
        }
    }

    handleConfig() {
        if (this.props.is_backend) {
            const { level, id } = this.props.match.params
            this.setState({
                жагсаалтын_холбоос: `/back/api/org/${id}/position/`,
                custom_query: {'org_id': id},
                нэмэх_товч: `/back/байгууллага/түвшин/${level}/${id}/position/create/`,
                back_link: `/back/байгууллага/түвшин/${level}/${id}/position/`,
            })
        }
        else {
            this.setState({
                жагсаалтын_холбоос: `/gov/api/role/position/`,
                нэмэх_товч: `/gov/perm/position/create/`,
                back_link: `/gov/api/role/position/`,
            })
        }
    }

    handleAsk(values) {
        var delete_link
        if (this.props.is_backend) {
            delete_link = `/back/api/org/${values.id}/position/remove/`
        }
        else {
            delete_link = `/gov/api/role/position/${values.id}/remove/`
        }
        const modal = {
            modal_status: "open",
            modal_icon: "fa fa-exclamation-circle",
            modal_bg: '',
            icon_color: 'warning',
            title: 'Албан тушаал устгах',
            text: `Та "${values.name}" нэртэй албан тушаалыг устгах уу?`,
            has_button: true,
            actionNameBack: 'Үгүй',
            actionNameDelete: 'Тийм',
            modalAction: () => this.handleRemove(delete_link),
            modalClose: null
        }
        global.MODAL(modal)
    }

    handleRemove(delete_link) {
        service.getRequest(delete_link)
            .then(({ success, data, error }) => {
                if (success) {
                    this.setState({ refresh: !this.state.refresh })
                    const modal = {
                        modal_status: "open",
                        modal_icon: "fa fa-check-circle",
                        modal_bg: '',
                        icon_color: 'success',
                        title: data,
                        text: '',
                        has_button: false,
                        actionNameBack: '',
                        actionNameDelete: '',
                        modalAction: null,
                        modalClose: null
                    }
                    global.MODAL(modal)
                }
                else {
                    const modal = {
                        modal_status: "open",
                        modal_icon: "fa fa-times-circle",
                        modal_bg: '',
                        icon_color: 'danger',
                        title: 'Алдаа гарлаа',
                        text: error,
                        has_button: false,
                        actionNameBack: '',
                        actionNameDelete: '',
                        modalAction: null,
                        modalClose: null
                    }
                    global.MODAL(modal)
                }
            })
    }

    render() {
        const {
            refresh,
            талбарууд,
            жагсаалтын_холбоос,
            хувьсах_талбарууд,
            custom_query,
            нэмэх_товч,
            нэмэлт_талбарууд,
            body,
        } = this.state

        return (
            <div className={`${!this.props.is_backend ? "card" : ""}`}>
                <div className={`${!this.props.is_backend ? "card-body" : ""}`}>
                    <div className="col-md-12">
                        <PortalDataTable
                            refresh={refresh}
                            color={'bg-dark'}
                            талбарууд={талбарууд}
                            жагсаалтын_холбоос={жагсаалтын_холбоос}
                            per_page={20}
                            уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                            хувьсах_талбарууд={хувьсах_талбарууд}
                            нэмэх_товч={нэмэх_товч ? нэмэх_товч : null}
                            custom_query={custom_query}
                            нэмэлт_талбарууд={нэмэлт_талбарууд}
                            body={body}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default PositionList
