import React, { Component } from "react"
import { NavLink } from "react-router-dom"
// import ModalAlert from "../ModalAlert";


export class MetaEdit extends Component {

    constructor(props) {
        super(props)

        this.state = {
            org_name: '',
            customer_org: '',
            distributor_org: '',
            owner_org: '',
            keywords: '',
            category: '',
            status: '',
            language: '',
            summary: '',
            title: '',
            uuid: '',
            schema: '',
            edit: false,
            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
        }
        this.handleSave = this.handleSave.bind(this)
        // this.handleGetAll=this.handleGetAll.bind(this)
        this.modalClose = this.modalClose.bind(this)
    }

    // componentDidMount(){
    //     const org_level=this.props.match.params.level
    //     const id=this.props.match.params.id
    //     this.handleGetAll(org_level,id)
    // }

    handleSave() {
        this.setState({ handleSaveIsLoad: true })
        const org_name = this.props.match.org_name
        const customer_org = this.props.match.customer_org
        const distributor_org = this.state.distributor_org
        const owner_org = this.state.owner_org
        const keywords = this.props.match.keywords
        const category = this.props.match.category
        const status = this.props.match.status
        const language = this.state.language
        const summary = this.state.summary
        const title = this.props.match.title
        const uuid = this.state.uuid
        const schema = this.props.match.schema
        const values = {
            "org_name": org_name, "customer_org": customer_org, 'distributor_org': distributor_org, "owner_org": owner_org, "keywords": keywords,
            'category': category, "status": status, "language": language, 'summary': summary, 'title': title, "uuid": uuid, "schema": schema
        }
    }

    // handleGetAll(org_level,id){
    //     if(id){
    //         service.orgAll(org_level,id).then(({ orgs }) => {
    //             if (orgs) {
    //                 orgs.map(org=>this.setState({
    //                     org_name:org.name
    //                 }))
    //             }
    //             this.setState({
    //                 edit:true
    //             })
    //         })
    //     }
    // }

    modalClose() {
        const org_level = this.props.match.params.level
        this.setState({ handleSaveIsLoad: false })
        this.props.history.push(`/gov/meta/`)
        this.setState({ modal_alert_status: "closed" })
        clearTimeout(this.state.timer)
    }

    modalCloseTime() {
        const org_level = this.props.match.params.level
        this.state.timer = setTimeout(() => {
            this.setState({ handleSaveIsLoad: false })
            this.props.history.push(`/gov/meta/`)
            this.setState({ modal_alert_status: "closed" })
        }, 2000)
    }

    render() {
        const { org_name, customer_org, distributor_org, owner_org, keywords, category, status, language, summary, title, uuid, schema } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="text-left">
                                <NavLink to={`/gov/meta/`}>
                                    <p className="btn gp-outline-primary">
                                        <i className="fa fa-angle-double-left"></i> Буцах
                                    </p>
                                </NavLink>
                            </div>
                            <br />
                            <div className="form-group">
                                <label htmlFor="id_name" >org_name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="org_name"
                                    onChange={(e) => this.handleUserSearch('org_name', e)}
                                    value={org_name}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >customer_org:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="customer_org"
                                    onChange={(e) => this.handleUserSearch('customer_org', e)}
                                    value={customer_org}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >distributor_org:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="distributor_org"
                                    onChange={(e) => this.handleUserSearch('distributor_org', e)}
                                    value={distributor_org}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >owner_org:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="owner_org"
                                    onChange={(e) => this.handleUserSearch('owner_org', e)}
                                    value={owner_org}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >keywords:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="keywords"
                                    onChange={(e) => this.handleUserSearch('keywords', e)}
                                    value={keywords}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >category:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="category"
                                    onChange={(e) => this.handleUserSearch('category', e)}
                                    value={category}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >status:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="status"
                                    onChange={(e) => this.handleUserSearch('status', e)}
                                    value={status}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >language:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="language"
                                    onChange={(e) => this.handleUserSearch('language', e)}
                                    value={language}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >summary:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="summary"
                                    onChange={(e) => this.handleUserSearch('summary', e)}
                                    value={summary}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >title:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    onChange={(e) => this.handleUserSearch('title', e)}
                                    value={title}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >uuid:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="uuid"
                                    onChange={(e) => this.handleUserSearch('uuid', e)}
                                    value={uuid}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >schema:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="schema"
                                    onChange={(e) => this.handleUserSearch('schema', e)}
                                    value={schema}
                                />
                            </div>

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-2">
                            <div className="form-group">
                                {this.state.handleSaveIsLoad ?
                                    <>
                                        <button className="btn btn-block gp-btn-primary">
                                            <a className="spinner-border text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </a>
                                            <span> Шалгаж байна. </span>
                                        </button>
                                        <ModalAlert
                                            modalAction={() => this.modalClose()}
                                            status={this.state.modal_alert_status}
                                            title="Амжилттай хадгаллаа"
                                            model_type_icon="success"
                                        />
                                    </>
                                    :
                                    <button className="btn btn-block gp-btn-primary" onClick={this.handleSave} >
                                        Хадгалах
                                </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
