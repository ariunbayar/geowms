import React, { Component } from "react"

export class DevPage extends Component {


    render() {
        return (
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-12">

                        <p>
                            <strong>Fontawesome 4.7.0: </strong>
                            <a href="https://fontawesome.com/v4.7.0/icons/" target="_blank">
                                {'https://fontawesome.com/v4.7.0/icons/ '}
                                <i class="fa fa-external-link" aria-hidden="true"></i>
                            </a>
                        </p>
                        <p>
                            <strong>Bootstrap 4.5.0: </strong>
                            <a href="https://getbootstrap.com/docs/4.5/components/alerts/" target="_blank">
                                {'https://getbootstrap.com/docs/4.5/components/alerts/ '}
                                <i class="fa fa-external-link" aria-hidden="true"></i>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}
