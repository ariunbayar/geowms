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
        }

        this.loadPage = this.loadPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.addPage = this.addPage.bind(this)
    }

    componentDidMount() {
        this.loadPage(this.state.page, this.state.searchQuery)
    }

    componentDidUpdate(prevProps) {
        if(prevProps.searchQuery !== this.props.searchQuery)
        {
            const query = this.props.searchQuery
            this.setState({ searchQuery: query })
            this.loadPage(1, query)
        }
        if(prevProps.load !== this.props.load)
        {
            const query = this.props.searchQuery
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
        this.loadPage(this.state.page + 1, this.state.searchQuery)
    }

    prevPage() {
        this.loadPage(this.state.page - 1, this.state.searchQuery)
    }

    loadPage(page, query) {
        if (this.state.is_loading) {
            return
        }

        page = Math.max(page, 1)
        page = Math.min(page, this.state.total_page)
        this.setState({is_loading: true})
        if(this.props.org_level){
            const level = this.props.org_level
            this.props.paginate(page, query, level)
            .then(({ page, total_page}) => {
                this.setState({
                    page,
                    total_page,
                    is_loading: false,
                })
            })
        }
        else
        {
            this.props.paginate(page, query)
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
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="float-left">
                        <strong>Хуудас {page}-{total_page}</strong>
                    </div>
                    <div className="float-right">
                        <button
                            type=" button"
                            value="1"
                            className={"btn gp-outline-primary" + (this.state.is_loading ? " disabled" : "")}
                            onClick={(e) => this.addPage(e)}
                        >
                            &lt;&lt;
                        </button> {}
                        { page > 1 &&
                            <button
                                type=" button"
                                className={"btn gp-outline-primary" + (this.state.is_loading ? " disabled" : "")}
                                onClick={this.prevPage}
                            >
                                &lt;
                            </button>
                        }
                        &nbsp;
                        <button
                            type=" button"
                            value={page}
                            className={"btn gp-outline-primary" + (this.state.is_loading ? " disabled" : "")}
                        >{page}
                        </button> {}
                        { page < total_page &&
                            <button
                                type="button"
                                className={"btn gp-outline-primary" + (this.state.is_loading ? " disabled" : "")}
                                onClick={this.nextPage}
                            >
                                &gt;
                            </button>
                        }
                        &nbsp;
                        <button
                            type=" button"
                            value={total_page}
                            className={"btn gp-outline-primary" + (this.state.is_loading ? " disabled" : "")}
                            onClick={(e) => this.addPage(e)}
                        >
                            &gt;&gt;
                        </button> {}
                    </div>
                </div>
            </div>
        )
    }
}