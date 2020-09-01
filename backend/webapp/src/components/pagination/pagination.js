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
            .then(({ page, total_page}) => {
                this.setState({
                    page,
                    total_page,
                    is_loading: false,
                })
            })
        }    
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
                            className={"btn gp-outline-primary" + (this.state.is_loading ? " disabled" : "")}
                            onClick={this.prevPage}
                        >
                            &laquo;өмнөх
                        </button> {}

                        <button
                            type="button"
                            className={"btn gp-outline-primary" + (this.state.is_loading ? " disabled" : "")}
                            onClick={this.nextPage}
                        >
                            дараах &raquo;
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}