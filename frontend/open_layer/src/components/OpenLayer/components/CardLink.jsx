import React, { Component, Fragment } from "react"

export default class CardLink extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isload: false,
        }
    }

    copyToClipboard(url){
        this.setState({isload: true})
        var textField = document.createElement('textarea')
        textField.innerText = url
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
        setTimeout(() => {
            this.setState({isload: false})
        }, 1000);
    }

    render() {
        const {name, url, color, link} = this.props
        const {isload} = this.state
        return (
            <>
                {link ?
                <a className="col-2 mt-3 col-md-2 col-xl-2" href={url}>
                    <div className="card text-center border border-success">
                        <div className="card-body">
                            <h4 className="text-info">{name}</h4>
                            <h6 className="text-mute">{name ? "Дарж татах" : "Хоосон байна"}</h6>
                        </div>
                    </div>
                </a>
                :
                <div className="col-2 mt-3 col-md-2 col-xl-2" onClick={() => this.copyToClipboard(url)}>
                    {isload ?
                    <div className="card text-center border border-success">
                        <div className="card-body">
                            <h4 className="text-success">{name}</h4>
                            <h6 className="fa fa-check text-success">Амжилттай хууллаа</h6>
                        </div>
                    </div>
                    :
                    <div className="card text-center border border-info">
                        <div className="card-body">
                            <h4 className="text-info">{name}</h4>
                            <h6 className="text-mute">{name ? "Дарж хуулах" : "Хоосон байна"}</h6>
                        </div>
                    </div>
                    }
                </div>
            }
            </>
        )
    }
}
