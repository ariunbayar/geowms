import React, { Component } from 'react';

class index extends Component {
    render() {

        const { items, payment_id } = this.props

        return (
            <div>
                {
                    !items.is_success
                    ?
                        <div className="btn gp-btn-primary">
                            Төлбөр төлөх
                        </div>
                    :
                        null
                }
            </div>
        );
    }
}

export default index;