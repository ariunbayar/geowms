import React, { Component } from "react"
import { PortalDataTable } from "@utils/DataTable"
import Loader from "@utils/Loader"


export class OrgForm extends Component {

    constructor(props) {
        super(props)

        this.initials = {
            currentPage: 1,
        }

        this.state = {
            level: props.match.params.level || 1,

            жагсаалтын_холбоос: `/back/api/org/level-${props.match.params.level}/org-list/`,
            талбарууд: [
                {'field': 'name', "title": 'Байгууллага нэр', 'has_action': true},
                {'field': 'num_employees', "title": 'Албан хаагчид',},
                {'field': 'num_systems', "title": 'Систем'},
            ],
            хувьсах_талбарууд: [
                {
                    "field": "name",
                    "text": "",
                    "action": (values) => this.go_link(values),
                    "action_type": false,
                },
            ],
            нэмэх_товч: `/back/байгууллага/түвшин/${props.match.params.level}/нэмэх/`,
            уншиж_байх_үед_зурвас: "Уншиж байна",
            refresh: true,
            values: {},
            is_loading: false,
        }
        this.go_link = this.go_link.bind(this)
    }

    componentDidUpdate(pp, ps) {
        if (this.props.match.params.level !==  ps.level) {
            const org_level = this.props.match.params.level
            this.setState({
                level: this.props.match.params.level,
                жагсаалтын_холбоос: `/back/api/org/level-${org_level}/org-list/`,
                refresh: !this.state.refresh,
                нэмэх_товч: `/back/байгууллага/түвшин/${org_level}/нэмэх/`
            })
        }
    }

    go_link(values){
        const {level} = this.state
        this.props.history.push(`/back/байгууллага/түвшин/${level}/${values.id}/хэрэглэгч/`)
    }

    render() {
        const { талбарууд, жагсаалтын_холбоос,
            хувьсах_талбарууд, refresh,
            нэмэх_товч, уншиж_байх_үед_зурвас,
            is_loading } = this.state
        return (
            <div className="main-content">
                <div className="page-container">
                    <PortalDataTable
                        талбарууд={талбарууд}
                        жагсаалтын_холбоос={жагсаалтын_холбоос}
                        хувьсах_талбарууд={хувьсах_талбарууд}
                        refresh={refresh}
                        уншиж_байх_үед_зурвас={уншиж_байх_үед_зурвас}
                        нэмэх_товч={нэмэх_товч}
                    />
                </div>
                <Loader is_loading={is_loading}/>
            </div>
        )

    }

}
