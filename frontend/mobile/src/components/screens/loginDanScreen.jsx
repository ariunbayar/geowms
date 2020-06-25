import React, {Component} from 'react';
import "./loginDanCss.css";

//alert(JSON.stringify(this.props.bundle))
export class LoginDanScreen extends Component {
    render() {
        return (
                    <div class="loginDan">
                            <div class="loginlogo">
                                <a href="/login/dan" class="logodan">
                                    <img src="/static/assets/image/logo/dan-logo.png" />
                                </a>
                            </div>
            
                    </div>
        )

    }

}
