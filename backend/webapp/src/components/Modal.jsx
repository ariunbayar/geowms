import React, {Component} from "react"
import ReactModal from 'react-modal';
import "./modalStyle.css";

export default class Modal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            title: '',
            text: '',
  
        };
        
      }
        render () {
            return (
                <div>
                    <ReactModal 
                        isOpen={this.props.showModal}
                        className="Modal"
                        overlayClassName="Overlay"
                    >
                    <h4>{this.props.title}</h4>
                    <hr></hr>

                    <a>{this.props.text}</a>

                    <hr></hr>
                    <button className="btn gp-outline-primary" onClick={this.props.modalClose}>Буцах</button>
                    <button className="btn gp-outline-primary" onClick={this.props.modalAction}>Устгах</button>
                    </ReactModal>
                </div>
        );
    }
}
