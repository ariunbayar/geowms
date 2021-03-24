import React, { Component } from 'react';

class DropDown extends Component {
    render() {
        return (
            <div className="card bg-transparent shadow-none border border-light">
                <div className="card-header bg-transparent border-light">Top Selling Categories
                    <div className="card-action">
                        <div className="dropdown">
                            <a href="#" className="dropdown-toggle dropdown-toggle-nocaret" data-toggle="dropdown">
                                <i className="fa fa-ellipsis-h"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <a className="dropdown-item" href="#">Something else here</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Separated link</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DropDown;
