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
            <div className={`'form-group '  ${className ? className : 'col-md-4'}`}>
                <label className='text-center'>
                    {title_name ? title_name : ''}
                </label>
                <i
                    className={
                        `form-control ${
                            !defualt_value
                            &&
                            `border border-danger icon-exclamation text-danger`
                        }`
                    }
                    title={`${title_name.toUpperCase()} хоосон байна !!!`}
                >
                    {defualt_value}
                </i>
            </div>
        );
    }
}
