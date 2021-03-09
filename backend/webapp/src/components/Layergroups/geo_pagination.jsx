import React, { Component } from "react"

export class GSPaginate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            items: props.item_list,
            page: props.page,
            total_page: 1,
            is_loading: false,
            search_query: props.search_query,
            per_page: props.per_page,
            color: props.color ? props.color : 'dark',
            filter_name: props.filter_name ? props.filter_name : ''
        }
        this.paginate = this.paginate.bind(this)
        this.load = this.load.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
    }

    componentDidMount() {
        const { page, per_page, items, search_query, filter_name} = this.state
        this.load(page, per_page, items, search_query, filter_name)
    }

    load(page, per_page, items, search_query, filter_name) {
        this.paginate(page, per_page, items, search_query, filter_name)
    }

    componentDidUpdate(pP, pS) {
        const { page, per_page, item_list, search_query, filter_name} = this.props
        if (
                pP.item_list != this.props.item_list ||
                pP.page != page ||
                pP.search_query != search_query ||
                pP.filter_name != filter_name
            ) {
            this.setState({search_query, page, items:item_list, filter_name})
            this.load(page, per_page, item_list, search_query, filter_name)
        }
    }

    paginate(page, per_page, items, search_query, filter_name) {
        const lastIndex = page*per_page
        const firtsIndex = lastIndex-per_page
        if (search_query.length >= 1) {
            if (filter_name) {
                var filter = items.filter(item => {
                    return item[filter_name].toLowerCase().includes(search_query.toLowerCase())
                })
            }

            else {
                var filter = items.filter(item => {
                    return item.toLowerCase().includes(search_query.toLowerCase())
                })
            }

            const current_list= filter.slice(firtsIndex, lastIndex)
            const totalPages=Math.ceil(filter.length / per_page)
            this.props.paginate(current_list, page, search_query)
            this.setState({total_page: totalPages})
        }
        else {
            const current_list = items.slice(firtsIndex, lastIndex)
            const totalPages = Math.ceil( items.length / per_page)
            this.props.paginate(current_list, page, search_query)
            this.setState({total_page: totalPages, search_query: ''})
        }
    }

    nextPage() {
        const { page, per_page, items, search_query, total_page, filter_name} = this.state
        if(page < total_page) {
            this.load(page + 1, per_page, items, search_query, filter_name)
        }
    }

    prevPage() {
        const { page, per_page, items, search_query, filter_name} = this.state
        if (page >1) {
            this.load(page - 1, per_page, items, search_query, filter_name)
        }
    }

    render() {
        const {total_page, page} = this.state
        return (
            <div className="row">
            <div className="col-md-12">
                <div className="float-left">
                    <strong>Хуудас {page}-{total_page}</strong>
                </div>
                <div className="float-right btn-group group-round">
                    <button
                        type=" button"
                        className="btn btn-dark waves-effect waves-light btn-sm"
                        onClick={this.prevPage}
                    > &laquo; өмнөх
                    </button>

                    <button
                        type="button"
                        className="btn btn-dark waves-effect waves-light btn-sm"
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
