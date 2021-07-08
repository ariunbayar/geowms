import React, { Component } from "react"

export class GSPaginate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            items: props.item_list,
            page: props.page,
            total_page: 1,
            total_items: props.total_item,
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
        const { page, per_page, items, search_query, filter_name, total_items} = this.state
        this.load(page, per_page, items, search_query, filter_name, total_items)
    }

    load(page, per_page, items, search_query, filter_name, total_items) {
        this.paginate(page, per_page, items, search_query, filter_name, total_items)
    }

    componentDidUpdate(pP, pS) {
        const { page, per_page, item_list, search_query, filter_name, total_items} = this.props
        if (
                pP.item_list != this.props.item_list ||
                pP.page != page ||
                pP.search_query != search_query ||
                pP.filter_name != filter_name || pP.total_items != total_items
            ) {
            this.setState({search_query, page, items:item_list, filter_name, total_items})
            this.load(page, per_page, item_list, search_query, filter_name, total_items)
        }
    }

    paginate(page, per_page, items, search_query, filter_name, total_items) {
        const lastIndex = page*per_page
        const firtsIndex = lastIndex-per_page
        var set_items = {}
        var filter =[]
        var current_list = []
        var totalPages = ''
        if (search_query.length >= 1) {
            if (filter_name) {
                filter = total_items.filter(item => {
                    if (item[filter_name]) {
                        return item[filter_name].toString().toLowerCase().includes(search_query.toLowerCase())
                    }
                    else {
                        return item.toString().toLowerCase().includes(search_query.toLowerCase())
                    }
                })
            }

            else {
                filter = total_items.filter(item => {
                    return item.toString().toLowerCase().includes(search_query.toLowerCase())
                })
            }
            current_list= filter.slice(0, filter.length)
            totalPages=Math.ceil(filter.length / per_page)
            set_items['total_page'] = totalPages
        }
        else {
            current_list = items.slice(firtsIndex, lastIndex)
            totalPages = Math.ceil( items.length / per_page)
            set_items['total_page'] = totalPages
            set_items['search_query'] = ''
        }

        this.props.paginate(current_list, page, search_query)
        this.setState({...set_items})
    }

    nextPage() {
        const { page, per_page, items, search_query, total_page, filter_name, total_items} = this.state
        if(page < total_page) {
            this.load(page + 1, per_page, items, search_query, filter_name, total_items)
        }
    }

    prevPage() {
        const { page, per_page, items, search_query, filter_name, total_items} = this.state
        if (page >1) {
            this.load(page - 1, per_page, items, search_query, filter_name, total_items)
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
