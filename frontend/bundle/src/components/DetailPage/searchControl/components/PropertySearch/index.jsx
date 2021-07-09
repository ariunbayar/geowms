import React, { Component } from 'react';

import { service } from "../../../service"

class index extends Component {

    constructor(props) {
        super(props);

        this.state = {
            search_value: '',
            search_datas: [],
            is_searching: false,
            bundle_id: props.bundle_id,
        }

    }

    handleChange(value) {
        this.setState({ search_value: value })
    }

    handleSearch() {
        if (!this.state.is_searching) {
            const { bundle_id, search_value } = this.state
            this.setState({ is_searching: true })
            service
                .getFindValues(bundle_id, search_value)
                .then(({ datas }) => {
                    if (datas) {
                        this.setState({ search_datas: datas })
                    }
                })
                .catch(() => {
                    alert("Алдаа гарсан байна")
                })
                .finally(() => {
                    this.setState({ is_searching: false })
                })
        }
    }

    render() {
        const { search_value, search_datas, is_searching } = this.state
        return (
            <div className="rounded shadow-sm px-2 pb-2 mb-3 bg-white rounded row mx-0">
                <div className="d-flex justify-content-center">
                    <div className="search-bundle">
                        <input
                            type="search"
                            className="search-bundle-input"
                            placeholder="Хайх..."
                            value={search_value}
                            onChange={e => this.handleChange(e.target.value)}
                        />
                        <a role="button" className="search-bundle-icon text-white" onClick={() => this.handleSearch()}>
                            {
                                is_searching
                                ?
                                    <i className="spinner-border text-light"></i>
                                :
                                    <i className="fa fa-search"></i>
                            }
                        </a>
                    </div>
                </div>
                {
                    search_datas.map((data, idx) =>
                        <li key={idx}
                            className="list-group-item form-control list-active"
                            onClick={(e) => this.props.getGeom(data.geo_id)}
                        >
                            <i
                                className="fa fa-history mr-3 d-flex align-items-center"
                                role="button"
                                onClick={(e) => this.props.getGeom(data.geo_id)}
                            >
                                {} {data.name}
                            </i>
                        </li>
                    )
                }
            </div>
        );
    }
}

export default index;