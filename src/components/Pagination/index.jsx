import { get } from "ol/proj"
import React, { Component } from "react"


export class Pagination extends Component {

    constructor(props) {

        super(props)
        this.state = {
            items:[],
            page: 1,
            total_page: 1,
            is_loading: false,
            searchQuery: this.props.searchQuery,
            sort_name: this.props.sort_name,
        }

        this.loadPage = this.loadPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.addPage = this.addPage.bind(this)
    }

    componentDidMount() {
        this.loadPage(this.state.page, this.state.searchQuery,  this.state.sort_name)
    }

    componentDidUpdate(prevProps) {
        if(prevProps.searchQuery !== this.props.searchQuery)
        {
            const query = this.props.searchQuery
            this.setState({ searchQuery: query })
            this.loadPage(1, query)
        }
        if(prevProps.sort_name !== this.props.sort_name)
        {
            const sort_name = this.props.sort_name
            const query = this.props.searchQuery
            this.setState({ sort_name })
            this.loadPage(1, query, sort_name)
        }
        if(prevProps.load !== this.props.load)
        {
            const query = this.props.d
            this.loadPage(1, query)
        }
        if(this.props.org_level){
            if(prevProps.org_level !== this.props.org_level){
                const query = this.props.searchQuery
                this.loadPage(1, query)
            }
        }
    }

    nextPage() {
        this.loadPage(this.state.page + 1, this.state.searchQuery, this.state.sort_name)
    }

    prevPage() {
        this.loadPage(this.state.page - 1, this.state.searchQuery, this.state.sort_name)
    }

    loadPage(page, query, sort_name) {
        if (this.state.is_loading) {
            return
        }
        page = Math.max(page, 1)
        page = Math.min(page, this.state.total_page)
        this.setState({is_loading: true})
        if(this.props.org_level){
            const level = this.props.org_level
            this.props.paginate(page, query, level, sort_name)
            .then(({ page, total_page }) => {
                this.setState({
                    page,
                    total_page,
                    is_loading: false,
                })
            })
        }
        else
        {
            this.props.paginate(page, query, sort_name)
            .then(({ page, total_page }) => {
                this.setState({
                    page,
                    total_page,
                    is_loading: false,
                })
            })
        }
    }

    addPage(id) {
        const page = id.target.value
        this.setState({ page })
        this.loadPage(page, '')
    }

    render() {
        const {page, total_page} = this.state
        const pages = []
        for (let i = page; i <= total_page; i++) {
            pages.push(<li className="page-item" key={i}><a className="page-link">{i}</a></li>)

        }
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="col-md-12">
                        <div className="float-left">
                            <strong className="gp-text-primary">Хуудас {page}-{total_page}</strong>
                        </div>
                        <div className="float-right btn-group group-round">
                            <button
                                type=" button"
                                value="1"
                                className={"btn gp-btn-primary waves-effect waves-light btn-sm" + (this.state.is_loading ? " disabled" : "")}
                                onClick={(e) => this.addPage(e)}
                            >
                                &lt;&lt;
                            </button> {}
                            { page > 1 &&
                                <button
                                    type=" button"
                                    className={"btn gp-btn-primary waves-effect waves-light btn-sm" + (this.state.is_loading ? " disabled" : "")}
                                    onClick={this.prevPage}
                                >
                                    &lt;
                                </button>
                            }
                            <button
                                type=" button"
                                value={page}
                                className={"btn gp-btn-primary waves-effect waves-light btn-sm" + (this.state.is_loading ? " disabled" : "")}
                            >{page}
                            </button> {}
                            { page < total_page &&
                                <button
                                    type="button"
                                    className={"btn gp-btn-primary waves-effect waves-light btn-sm" + (this.state.is_loading ? " disabled" : "")}
                                    onClick={this.nextPage}
                                >
                                    &gt;
                                </button>
                            }
                            <button
                                type=" button"
                                value={total_page}
                                className={"btn gp-btn-primary waves-effect waves-light btn-sm" + (this.state.is_loading ? " disabled" : "")}
                                onClick={(e) => this.addPage(e)}
                            >
                                &gt;&gt;
                            </button> {}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
