import { set } from "ol/transform"
import React, { Component } from "react"


export class Pagination extends Component {

    constructor(props) {

        super(props)
        this.state = {
            items:[],
            page: props.current_page,
            total_page: 1,
            is_loading: false,
            query: props.query,
            sort_name: props.sort_name,
            custom_query: props.custom_query,
            per_page: props.per_page,
            is_user: this.props.is_user,
        }

        this.loadPage = this.loadPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.addPage = this.addPage.bind(this)
    }

    componentDidMount() {
        this.loadPage(this.state.page, this.state.query, this.state.sort_name, this.state.per_page, this.props.custom_query, this.state.is_user)
    }

    componentDidUpdate(prevProps) {
        if(prevProps.query !== this.props.query)
        {
            const query = this.props.query
            this.setState({ query })
            this.loadPage(1, query, this.props.sort_name, this.state.per_page, this.props.custom_query, this.state.is_user)
        }
        if(prevProps.sort_name !== this.props.sort_name)
        {
            const sort_name = this.props.sort_name
            const query = this.props.query
            this.setState({ sort_name })
            this.loadPage(1, query, sort_name, this.state.per_page, this.props.custom_query, this.state.is_user)
        }
        if(prevProps.current_page !== this.props.current_page)
        {
            const current_page = this.props.current_page
            this.setState({ page: current_page })
            this.loadPage(current_page, this.state.query, this.state.sort_name, this.state.per_page, this.props.custom_query, this.state.is_user)
        }
        if(prevProps.refresh !== this.props.refresh)
        {
            this.loadPage(1, this.state.query, this.state.sort_name, this.state.per_page, this.props.custom_query, this.state.is_user)
        }
        if(prevProps.per_page !== this.props.per_page)
        {
            const per_page = this.props.per_page
            this.setState({ per_page })
            this.loadPage(1, this.props.query, this.props.sort_name, per_page, this.props.custom_query, this.state.is_user)
        }
        if(this.props.custom_query){
            if(prevProps.custom_query !== this.props.custom_query){
                this.setState({ custom_query: this.props.custom_query })
                this.loadPage(1, this.props.query, this.props.sort_name, this.state.per_page, this.props.custom_query, this.state.is_user)
            }
        }
        if(prevProps.is_user !== this.props.is_user){
            this.setState(
                { is_user: this.props.is_user },
                () => this.loadPage(1, this.state.query, this.state.sort_name, this.state.per_page, this.props.custom_query, this.state.is_user)
            )
        }
    }

    nextPage() {
        this.loadPage(this.state.page + 1, this.state.query, this.state.sort_name, this.state.per_page, this.state.custom_query, this.state.is_user)
    }

    prevPage() {
        this.loadPage(this.state.page - 1, this.state.query, this.state.sort_name, this.state.per_page, this.state.custom_query, this.state.is_user)
    }

    loadPage(page, query, sort_name, per_page, custom_query, is_user) {
        if (this.state.is_loading) {
            return
        }
        page = Math.max(page, 1)
        page = Math.min(page, this.state.total_page)
        this.setState({is_loading: true})
        this.props.paginate(page, query, sort_name, per_page, custom_query, is_user)
        .then(({ page, total_page }) => {
            this.setState({
                page,
                total_page,
                is_loading: false,
            })
        })
    }

    addPage(id) {
        const page = id.target.value
        this.setState({ page })
        this.loadPage(page, this.state.query, this.state.sort_name, this.state.per_page, this.state.custom_query, this.state.is_user)
    }

    render() {
        const {page, total_page} = this.state
        const pages = []
        const { color } = this.props
        for (let i = page; i <= total_page; i++) {
            pages.push(<li className="page-item" key={i}><a className="page-link">{i}</a></li>)

        }
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="col-md-12">
                        <div className="float-left">
                            <h5 className={`text-${color}`}>Хуудас&nbsp;{page}-{total_page}</h5>
                        </div>
                        <div className="float-right btn-group group-round">
                            <button
                                type=" button"
                                value="1"
                                className={`btn btn-${color} waves-effect waves-light btn-sm` + (this.state.is_loading ? " disabled" : "")}
                                onClick={(e) => this.addPage(e)}
                            >
                                &lt;&lt;
                            </button> {}
                            { page > 1 &&
                                <button
                                    type=" button"
                                    className={`btn btn-${color} waves-effect waves-light btn-sm` + (this.state.is_loading ? " disabled" : "")}
                                    onClick={() => this.prevPage()}
                                >
                                    &lt;
                                </button>
                            }
                            <button
                                type=" button"
                                value={page}
                                className={`btn btn-${color} waves-effect waves-light btn-sm` + (this.state.is_loading ? " disabled" : "")}
                            >{page}
                            </button> {}
                            { page < total_page &&
                                <button
                                    type="button"
                                    className={`btn btn-${color} waves-effect waves-light btn-sm` + (this.state.is_loading ? " disabled" : "")}
                                    onClick={() => this.nextPage()}
                                >
                                    &gt;
                                </button>
                            }
                            <button
                                type=" button"
                                value={total_page}
                                className={`btn btn-${color} waves-effect waves-light btn-sm` + (this.state.is_loading ? " disabled" : "")}
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
