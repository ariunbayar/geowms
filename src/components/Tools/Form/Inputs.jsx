import React, { PureComponent } from 'react';

class Inputs extends PureComponent {
    render() {
        return (
            <div>
                <label htmlFor={`id_${this.props.name}`}></label>
                <input
                    className={`custom-input`}
                    type={this.props.type}
                    name={this.props.name}
                    placeholder={this.props.placeholder}

                />
            </div>
        );
    }
}

export default Inputs;
