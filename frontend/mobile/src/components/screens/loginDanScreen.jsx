import React, {Component} from 'react';
import "./loginDanCss.css";

export class LoginDanScreen extends Component {
    render() {
        return (
            <div className="loginDan">
                <div className="loginlogo">
                    <a href="/login/dan" className="logodan">
                        <img src="/static/assets/image/logo/dan-logo.png" />
                    </a>
                    <a href="/login/dan" className="logodanButton">
                        <button type="button" className="btn btn-primary btn-lg buttonDan">Нэвтрэх</button>
                    </a>
                </div>
            </div>
        )

    }

}
