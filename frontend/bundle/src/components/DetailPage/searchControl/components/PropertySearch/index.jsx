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
            errors: {},
        }
    }

    handleChange(value) {
        this.setState({ search_value: value })
    }

    handleSearch(e) {
        e.preventDefault()
        if (!this.state.is_searching) {
            const { bundle_id, search_value, errors } = this.state
            this.setState({ is_searching: true })
            service
                .getFindValues(bundle_id, search_value)
                .then(({ success, data, error }) => {
                    errors['search'] = error
                    this.setState({ search_datas: data, errors })
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
        const { search_value, search_datas, is_searching, errors } = this.state
        return (
            <div className="row mx-0">
                <div className="d-flex justify-content-center">
                    <form className={`search-bundle ${errors?.search ? "is-invalid" : ""}`} onSubmit={(e) => this.handleSearch(e)}>
                        <input
                            type="search"
                            className={`search-bundle-input`}
                            placeholder="Хайх..."
                            value={search_value}
                            onChange={e => this.handleChange(e.target.value)}
                        />
                        <button className="search-bundle-icon text-white">
                            {
                                is_searching
                                ?
                                    <i className="spinner-border text-light"></i>
                                :
                                    <i className="fa fa-search"></i>
                            }
                        </button>
                    </form>
                </div>
                {
                    errors?.search
                    ?
                        <small className="text-danger">
                            {errors.search}
                        </small>
                    :
                        null
                }
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