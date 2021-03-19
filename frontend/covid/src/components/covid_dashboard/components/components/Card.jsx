import React, { PureComponent } from 'react';
import './card.css'

class Card extends PureComponent {
    render() {
        const {color, head_text, body_text, footer_text} = this.props
        return (
            <div className="col-12 col-md-4 col-lg-4 col-xl-3">
              <div className={`card text-center border-bottom-sm border-top-sm border-${color}`}>
                <div className="card-body">
                    <h6 style={{minHeight: '40px'}}>{head_text}</h6>
                    {/* <h4 className={`text-${color}`}>{body_text}</h4> */}
                    <div className={`delta bg-${color}`}>{footer_text}</div>
                </div>
              </div>
            </div>
        );
    }
}

export default Card;
