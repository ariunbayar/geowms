import React, { Component } from 'react';

class index extends Component {

    printPage() {
        const mywindow = window.open('', 'PRINT', 'height=400, width=600');
        mywindow.document.write('<html><body>');
        mywindow.document.write(document.getElementById("container").innerHTML)
        mywindow.document.write(document.getElementById("payment").innerHTML)
        mywindow.document.write('</body></html>');
        mywindow.document.close()
        mywindow.focus()
        mywindow.print()
        mywindow.close();
    }

    render() {

        const { items } = this.props

        const is_success = items.is_success

        return (
            <div className="col-md-6 py-0 my-3">
                <div id="payment">
                    <h5 className="mb-3">Гүйлгээний төлөв</h5>
                    <ul className="list-unstyled">
                        <li className="f-nav-item mb-2">
                            Гүйлгээний дугаар | {items.geo_unique_number}
                        </li>
                        <li className="f-nav-item mb-2">
                            НИЙТ МӨНГӨН ДҮН | {items.total}₮
                        </li>
                        <li className="f-nav-item mb-2">
                            Үр дүн | <span className={`text-${is_success ? "success" : "danger"}`}>{is_success ? "Амжилттай" : "Амжилтгүй"}</span>
                        </li>
                    </ul>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={this.printPage}
                >
                    Хэвлэх
                </button>
            </div>
        );
    }
}

export default index;