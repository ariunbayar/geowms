import React, { Component } from 'react';
import { NavLink } from "react-router-dom"

import SearchSelects from './SearchSelects'

import {service} from './service'
import Loader from "@utils/Loader"

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            geo_id: '',
            data: [],
            is_loading: true,
            link: false,
            is_not_first: true,
        }
        this.setValueToObj = this.setValueToObj.bind(this)
        this.changeLink = this.changeLink.bind(this)
        this.setLoading = this.setLoading.bind(this)
    }

    setValueToObj(geo_id) {
        this.setState({ is_loading: true })
        service
            .getDashboardFromId(geo_id)
            .then(({ success, data }) => {
                if (success) {
                    this.props.getGeom(data[0].geo_id, data)
                    this.setState({ data, name: data[0].name, geo_id: data[0].geo_id, is_not_first: true })
                }
            })
            .finally(rsp => this.setState({ is_loading: false }))
    }

    changeLink() {
        this.setState({ link: !this.state.link })
    }

    setLoading(is_loading) {
        this.setState({ is_loading })
    }

    render() {
        const { name, is_loading, link } = this.state
        return (
            <div className="row">
                <Loader is_loading={is_loading}/>
                <div className="col-md-12">
                    <SearchSelects
                        getValue={this.setValueToObj}
                        setLoading={this.setLoading}
                        is_not_first={this.state.is_not_first}
                    />
                </div>
                <div className="col-md-5">
                    <h4>{name}</h4>
                </div>
                <div className="col-md-5">
                    {
                        !link
                        ?
                            <h4>Өнөөдрийн байдлаар</h4>
                        :
                            <h4>Өмнөх өдрүүдийн байдлаар</h4>
                    }
                </div>
                <div className="col-md-2">
                    {
                        link
                        ?
                            <NavLink to={`/gov/covid-dashboard-config/`}
                                onClick={this.changeLink}
                                className="btn btn-primary btn-block"
                            >
                                Өнөөдрийн бүртгэл
                            </NavLink>
                        :
                            <NavLink to={`/gov/covid-dashboard-config/log/`}
                                onClick={this.changeLink}
                                className="btn btn-primary btn-block"
                            >
                                Өмнөх өдрүүдийн бүртгэл
                            </NavLink>
                    }
                </div>
            </div>

        );
    }
}

export default Header;