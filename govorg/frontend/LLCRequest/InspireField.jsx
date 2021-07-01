import React, { Component } from 'react';

export default class InspireField extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const {title_name, defualt_value, className} = this.props
        return (
            <div className={`form-group ${className ? className : 'col-md-4'}`}>
                <label htmlFor={`id_${title_name}`}>{title_name ? title_name : ''}</label>
                <div
                    className={`form-control ${defualt_value ? '' : 'is-invalid'}`}
                    id={`id_${title_name}`}
                >
                    {defualt_value}
                </div>
                <span className='invalid-feedback'>{`${defualt_value ? '' : 'Хоосон байна!!!'}`}</span>
            </div>
        );
    }
}
