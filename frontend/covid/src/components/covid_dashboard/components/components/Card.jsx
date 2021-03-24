import React, { PureComponent } from 'react';
import './card.css'

class Card extends PureComponent {
    getCalculator(a, b){
        var temp = 0
        temp = a - b
        if(temp < 0) return temp
        return `+${temp}`
    }
    render() {
        const {color, head_text, body_text, prev_data} = this.props
        return (
            <div className="col">
              <div className={`card text-center border-bottom-sm border-top-sm border-${color}`}>
                <div className="card-body">
                    <h6 style={{minHeight: '30px'}}>{head_text}</h6>
                    <h4 className={`text-${color}`}>{body_text}</h4>
                    <div className={`delta bg-${color}`}>{this.getCalculator(body_text,prev_data)}</div>
                </div>
              </div>
            </div>
        );
    }
}

export default Card;
