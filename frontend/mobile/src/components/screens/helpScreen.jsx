import React, {Component} from 'react'
import "./style.css";


//alert(JSON.stringify(this.props.bundle))
export class HelpScreen extends Component {
    render() {
        const myImg = '/static/assets/image/help.jpg'
        return (
            <div>
                <img src={myImg}className="helpImg"/>
            </div>
        )

    }

}
