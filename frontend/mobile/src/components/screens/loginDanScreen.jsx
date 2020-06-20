import React, {Component} from 'react'

//alert(JSON.stringify(this.props.bundle))
export class LoginDanScreen extends Component {
    render() {
        return (
            <div class="login-container">
                <a href="/login/dan" class="full-width btn gp-outline-primary">
                    <img src="/static/assets/image/logo/dan-logo.png" />
                </a>
            </div>
        )

    }

}
