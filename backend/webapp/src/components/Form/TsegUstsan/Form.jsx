import React, { Component } from "react"


export class Form extends Component {

    constructor(props) {
        super(props)
        
    }

    render() {
        return (
            <div className="row container  my-4">
                <h4>Цэгийн хувийн хэрэг</h4>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th style={{width: "5%"}} scope="row">1</th>
                            <th style={{width: "15%"}}>Цэгийн нэр</th>
                            <td></td>
                            <th style={{width: "5%"}} scope="row">2</th>
                            <th>Төвийн дугаар</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th style={{width: "5%"}} scope="row">3</th>
                            <th>Трапецийн дугаар(1:100000)</th>
                            <td></td>
                            <th style={{width: "5%"}} scope="row">4</th>
                            <th>Сүлжээний төрөл</th>
                            <td></td>
                        </tr>

                        <tr>
                            <th style={{width: "5%"}} scope="row">5</th>
                            <th>Байршил (Аймаг, сум, дүүрэг, хороо)</th>
                            <td colSpan="4" scope="rowgroup"></td>
                        </tr>

                        <tr>
                            <th rowSpan="2" scope="rowgroup" style={{width: "5%"}} scope="row">6</th>
                            <th rowSpan="2" scope="rowgroup">Солбилцол WGS-84 /UTM/</th>
                            <td>input</td>
                            <td colSpan="2" scope="rowgroup">input</td>
                            <th rowSpan="2" scope="rowgroup">Сүлжээний төрөл</th>
                        </tr>
                        <tr>
                            <td>input</td>
                            <td colSpan="2" scope="rowgroup">input</td>
                        </tr>
                        <tr>
                            <th colSpan="7" scope="rowgroup" style={{textAlign: "center"}}>7. Цэгийн фото зураг</th>
                        </tr>
                        <tr>
                            <th style={{textAlign: "center"}} colSpan="3" scope="rowgroup">ойроос</th>
                            <th style={{textAlign: "center"}} colSpan="3" scope="rowgroup">холоос</th>
                        </tr>
                        <tr>
                            <td colSpan="3" scope="rowgroup" style={{height: "400px"}}>зураг</td>
                            <td colSpan="3" scope="rowgroup">зураг</td>
                        </tr>
                        <tr>
                            <th style={{textAlign: "center"}} colSpan="2" scope="rowgroup">Байршлын тухай: </th>
                            <th style={{textAlign: "center"}} colSpan="4" scope="rowgroup">etend orshinooo</th>
                        </tr>
                        <tr>
                            <th colSpan="3" scope="rowgroup" style={{width: "50%"}}>9. Байршлын тойм зураг</th>
                            <th colSpan="3" scope="rowgroup" style={{width: "50%"}}>10. Төв цэгийн хэлбэр</th>
                        </tr>
                        <tr>
                            <td colSpan="3" scope="rowgroup" style={{height: "400px"}}>зураг</td>
                            <td colSpan="3" scope="rowgroup">зураг</td>
                        </tr>
                        <tr>
                            <th colSpan="1" scope="rowgroup">11.</th>
                            <td colSpan="2" scope="rowgroup">а. Судалгаа</td>
                            <td colSpan="3" scope="rowgroup">б. Шинээр суулгасан</td>
                        </tr>
                        <tr>
                            <th colSpan="1" scope="rowgroup">12.</th>
                            <th colSpan="2" scope="rowgroup">Хөрсний шинж байдал:</th>
                            <td colSpan="3" scope="rowgroup">input</td>
                        </tr>
                        <tr>
                            <th colSpan="1" scope="rowgroup">13.</th>
                            <th colSpan="2" scope="rowgroup">Цэг тэмдэгт судалгасан огноо:</th>
                            <td colSpan="3" scope="rowgroup">input</td>
                        </tr>
                        <tr>
                            <th colSpan="1" scope="rowgroup">14.</th>
                            <th colSpan="2" scope="rowgroup">Хувийн хэрэг хөтөлсөн:</th>
                            <td colSpan="3" scope="rowgroup">input</td>
                        </tr>
                        <tr>
                            <th colSpan="1" scope="rowgroup">15.</th>
                            <th colSpan="2" scope="rowgroup">Албан байгууллага:</th>
                            <td colSpan="3" scope="rowgroup">input</td>
                        </tr>
                        <tr>
                            <th colSpan="1" scope="rowgroup">16.</th>
                            <th colSpan="2" scope="rowgroup">Албан тушаал:</th>
                            <td colSpan="3" scope="rowgroup">input</td>
                        </tr>
                      
                    </tbody>
                </table>
            </div>
        )

    }

}
