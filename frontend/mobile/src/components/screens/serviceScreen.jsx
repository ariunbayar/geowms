import React, {Component} from 'react'
import "./style.css";


//alert(JSON.stringify(this.props.bundle))
export class ServiceScreen extends Component {
    render() {
        return (
            <div className="ServiceScreen">
                <h1 className="serviceTitle"><span>Үйлчилгээний жагсаалт</span></h1>
                <h2 className="serviceH2"><strong>Байгууллагын орон зайн өгөгдлийн дэд бүтцийн орон зайн </strong></h2>
                <h2 className="serviceH2"><strong>өгөгдөл, мэдээллийн ангилал</strong></h2>
                <table>
                <tbody>
                <tr>
                <td colspan="2">
                <p style={{textAlign:"center"}}><strong>Өгөгдлийн сангийн чиглэл</strong></p>
                </td>
                <td colspan="2">
                <p style={{textAlign:"center"}}><strong>Өгөгдлийн сангийн төрөл</strong></p>
                </td>
                <td colspan="2">
                <p style={{textAlign:"center"}}><strong>Өгөгдлийн сангийн ангилал</strong></p>
                </td>
                <td colspan="2">
                <p style={{textAlign:"center"}}><strong>Өгөгдлийн сангийн нэр</strong></p>
                </td>
                <td>
                <p style={{textAlign:"center"}}><strong>Хамрах хүрээ</strong></p>
                </td>
                <td>
                <p style={{textAlign:"center"}}><strong>Өгөгдлийн төрөл</strong></p>
                </td>
                <td>
                <p style={{textAlign:"center"}}><strong>Өгөгдлийн өргөтгөл</strong></p>
                </td>
                </tr>
                <tr>
                <td rowspan="37">
                <p><span>1</span></p>
                </td>
                <td rowspan="37">
                <p style={{textAlign:"center"}}><span>Геодези, зураг зүй</span></p>
                </td>
                <td rowspan="6">
                <p style={{textAlign:"center"}}><span>1.1</span></p>
                </td>
                <td rowspan="6">
                <p style={{textAlign:"center"}}><span>Сүлжээний мэдээлэл</span></p>
                </td>
                <td rowspan="4">
                <p><span>1.1.1</span></p>
                </td>
                <td rowspan="4">
                <p><span>Байрлал</span></p>
                </td>
                <td>
                <p><span>1.1.1.1</span></p>
                </td>
                <td>
                <p><span>Улсын Геодезийн байрлалын тулгуур сүлжээний цэгийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.1.1.2</span></p>
                </td>
                <td>
                <p><span>GPS-ын байнгын ажиглалтын цэгийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.1.1.3</span></p>
                </td>
                <td>
                <p><span>GPS-ын&nbsp; сүлжээний цэгийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.1.1.4</span></p>
                </td>
                <td>
                <p><span>Зураглалын сүлжээний цэгийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.1.2</span></p>
                </td>
                <td>
                <p><span>Өндөр</span></p>
                </td>
                <td>
                <p><span>1.1.2.1</span></p>
                </td>
                <td>
                <p><span>Өндрийн сүлжээний цэгийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.1.3</span></p>
                </td>
                <td>
                <p><span>Гравиметр</span></p>
                </td>
                <td>
                <p><span>1.1.3.1</span></p>
                </td>
                <td>
                <p><span>Гравиметрийн сүлжээний цэгийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="4">
                <p style={{textAlign:"center"}}><span>1.2</span></p>
                </td>
                <td rowspan="4">
                <p style={{textAlign:"center"}}><span>Газрын зураг</span></p>
                </td>
                <td>
                <p><span>1.1.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Жижиг масштабын газрын зураг</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор/растер</span></p>
                </td>
                <td>
                <p><span>gdb/TIFF</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.1.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Дунд масштабын байр зүйн зураг</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор/растер</span></p>
                </td>
                <td>
                <p><span>gdb/TIFF</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.1.4</span></p>
                </td>
                <td colspan="3">
                <p><span>Том масштабын байр зүйн зураг</span></p>
                </td>
                <td>
                <p><span>Хот, суурин газар</span></p>
                </td>
                <td>
                <p><span>вектор/растер</span></p>
                </td>
                <td>
                <p><span>gdb/TIFF</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.1.5</span></p>
                </td>
                <td colspan="3">
                <p><span>Газрын зургийн нэг маягийн сууриуд</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>1.3</span></p>
                </td>
                <td colspan="5">
                <p style={{textAlign:"center"}}><span>Газар зүйн нэр</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="18">
                <p style={{textAlign:"center"}}><span>1.4</span></p>
                </td>
                <td rowspan="18">
                <p style={{textAlign:"center"}}><span>Хилийн цэсийн зураг</span></p>
                </td>
                <td rowspan="4">
                <p><span>1.4.1</span></p>
                </td>
                <td rowspan="4">
                <p style={{textAlign:"center"}}><span>Засаг захиргаа, нутаг дэвсгэрийн хил</span></p>
                </td>
                <td>
                <p><span>1.4.1.1</span></p>
                </td>
                <td>
                <p><span>Улсын хилийн цэс</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.1.2</span></p>
                </td>
                <td>
                <p><span>Аймаг нийслэлийн хилийн цэс</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.1.3</span></p>
                </td>
                <td>
                <p><span>Сум, дүүргийн хилийн цэс</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.1.4</span></p>
                </td>
                <td>
                <p><span>Баг, хорооны хилийн цэс</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="14">
                <p><span>1.4.2</span></p>
                </td>
                <td rowspan="14">
                <p><span>Тусгай хэрэгцээний газрын хил</span></p>
                </td>
                <td>
                <p><span>1.4.2.1</span></p>
                </td>
                <td>
                <p><span>улсын тусгай хамгаалалттай газар;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.2.2</span></p>
                </td>
                <td>
                <p><span>улсын хилийн зурвас газар;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.2.3</span></p>
                </td>
                <td>
                <p><span>улсын батлан хамгаалах болон аюулгүй&nbsp; байдлыг хангах зориулалтаар олгосон газар;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.2.4</span></p>
                </td>
                <td>
                <p><span>гадаад улсын дипломат төлөөлөгчийн болон консулын газар, олон улсын байгууллагын төлөөлөгчийн газарт олгосон газар;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.2.5</span></p>
                </td>
                <td>
                <p><span>шинжлэх ухаан, технологийн сорилт, туршилт болон байгаль орчин, цаг агаарын төлөв байдлын байнгын ажиглалтын талбай;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.2.6</span></p>
                </td>
                <td>
                <p><span>аймаг дундын отрын бэлчээр;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.2.7</span></p>
                </td>
                <td>
                <p><span>улсын тэжээлийн сангийн хадлангийн талбай.</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.2.8</span></p>
                </td>
                <td>
                <p><span>бүтээгдэхүүн хуваах гэрээний дагуу хайгуулын зориулалтаар ашиглах газрын тосны гэрээт талбай;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.2.9</span></p>
                </td>
                <td>
                <p><span>чөлөөт бүсийн газар.</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.2.10</span></p>
                </td>
                <td>
                <p><span>цөмийн төхөөрөмж барих, ашиглах зориулалтаар олгосон газар.</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.2.11</span></p>
                </td>
                <td>
                <p><span>бичил уурхайн зориулалтаар олгосон газар.</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.2.12</span></p>
                </td>
                <td>
                <p><span>хилийн боомтын бүс.</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.2.13</span></p>
                </td>
                <td>
                <p><span>үндэсний хэмжээний томоохон бүтээн байгуулалт, дэд бүтцийн төсөл, хөтөлбөр хэрэгжүүлэх газар;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.4.2.14</span></p>
                </td>
                <td>
                <p><span>аюултай хог хаягдлын төвлөрсөн байгууламж барих газар.</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="2">
                <p style={{textAlign:"center"}}><span>1.5</span></p>
                </td>
                <td rowspan="2">
                <p style={{textAlign:"center"}}><span>Хаягийн мэдээлэл</span></p>
                </td>
                <td>
                <p><span>1.5.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Хаягийн зураг</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.5.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Хаяг</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>тоон</span></p>
                </td>
                <td>
                <p><span>gdb/dbf/txt</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="3">
                <p style={{textAlign:"center"}}><span>1.6</span></p>
                </td>
                <td rowspan="3">
                <p style={{textAlign:"center"}}><span>Өндрийн тоон загвар</span></p>
                </td>
                <td>
                <p><span>1.6.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Өндрийн тоон загвар</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>растер</span></p>
                </td>
                <td>
                <p><span>rrd/GRID</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.6.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Геодийн загвар</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>тоон</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.6.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Гадаргуугийн тоон загвар</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>растер</span></p>
                </td>
                <td>
                <p><span>rrd/GRID</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="3">
                <p style={{textAlign:"center"}}><span>1.7</span></p>
                </td>
                <td rowspan="3">
                <p style={{textAlign:"center"}}><span>Агаар, сансрын зураг</span></p>
                </td>
                <td>
                <p><span>1.7.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Агаарын зураг</span></p>
                </td>
                <td>
                <p><span>Тухайн газар</span></p>
                </td>
                <td>
                <p><span>растер</span></p>
                </td>
                <td>
                <p><span>TIFF</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.7.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Сансрын зураг</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>растер</span></p>
                </td>
                <td>
                <p><span>TIFF</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>1.7.3</span></p>
                </td>
                <td colspan="3">
                <p><span>филм, позетив, хэвлэлийн эх</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>растер</span></p>
                </td>
                <td>
                <p><span>TIFF</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="40">
                <p align="center"><span>2</span></p>
                </td>
                <td rowspan="40">
                <p align="center"><span>Геологи, хүрээлэн буй орчны мэдээлэл</span></p>
                </td>
                <td rowspan="5">
                <p style={{textAlign:"center"}}><span>2.1</span></p>
                </td>
                <td rowspan="5">
                <p style={{textAlign:"center"}}><span>Уур амьсгал, агаар мандал</span></p>
                </td>
                <td>
                <p><span>2.1.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Агаарын даралт</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.1.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Агаарын температур</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.1.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Харьцангуй чийгшил</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.1.4</span></p>
                </td>
                <td colspan="3">
                <p><span>Хур тунадас</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.1.5</span></p>
                </td>
                <td colspan="3">
                <p><span>Нийлбэр нарны цацраг</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>2.2</span></p>
                </td>
                <td colspan="5">
                <p style={{textAlign:"center"}}><span>Хөрс</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>2.3</span></p>
                </td>
                <td colspan="5">
                <p style={{textAlign:"center"}}><span>Ургамлан бүрхэвч</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>2.4</span></p>
                </td>
                <td colspan="5">
                <p style={{textAlign:"center"}}><span>Ой</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="2">
                <p style={{textAlign:"center"}}><span>2.5</span></p>
                </td>
                <td rowspan="2">
                <p style={{textAlign:"center"}}><span>Ашигт малтмал</span></p>
                </td>
                <td>
                <p><span>2.5.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Метал ашигт малтмалын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.5.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Метал биш ашигт малтмалын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="3">
                <p style={{textAlign:"center"}}><span>2.6</span></p>
                </td>
                <td rowspan="3">
                <p style={{textAlign:"center"}}><span>Түүх</span></p>
                </td>
                <td>
                <p><span>2.6.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Эртний эзэнт гүрний түүхийн үеийн зураг</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.6.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Археологийн олдворын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.6.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Түүх соёл, дурсгалт газрын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>2.7</span></p>
                </td>
                <td colspan="5">
                <p style={{textAlign:"center"}}><span>Геологи</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>2.8</span></p>
                </td>
                <td colspan="5">
                <p style={{textAlign:"center"}}><span>Гидргогеологи</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="3">
                <p style={{textAlign:"center"}}><span>2.9</span></p>
                </td>
                <td rowspan="3">
                <p style={{textAlign:"center"}}><span>Тектоник</span></p>
                </td>
                <td>
                <p><span>2.9.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Тектоникий мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.9.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Тектоник дүүрэгчлэлийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.9.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Гүний структурын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="4">
                <p style={{textAlign:"center"}}><span>2.10</span></p>
                </td>
                <td rowspan="4">
                <p style={{textAlign:"center"}}><span>Шинэ, тиктоник, газар чичирхийлэл</span></p>
                </td>
                <td>
                <p><span>2.10.1</span></p>
                </td>
                <td colspan="3">
                <p><span>МКЗ-Структур дүүрэгчлэлийн&nbsp; мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.10.2</span></p>
                </td>
                <td colspan="3">
                <p><span>МКЗ-Тектоникийн&nbsp; мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.10.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Газар хөдлөлтийн мужлалын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.10.4</span></p>
                </td>
                <td colspan="3">
                <p><span>Газар хөдлөлтийн төвийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>2.11</span></p>
                </td>
                <td colspan="5">
                <p style={{textAlign:"center"}}><span>Геоморфологи</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="4">
                <p style={{textAlign:"center"}}><span>2.12</span></p>
                </td>
                <td rowspan="4">
                <p style={{textAlign:"center"}}><span>Дөрөвдөгч геологи</span></p>
                </td>
                <td>
                <p><span>2.12.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Дээд, дунд дөрөвдөгчийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.12.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Дөрөвдөгчийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.12.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Дөрөвдөгчийн хурдсын зузааны мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.12.4</span></p>
                </td>
                <td colspan="3">
                <p><span>Плиоцеийн дөрөвдөгчийн&nbsp; мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="5">
                <p><span>2.13</span></p>
                </td>
                <td rowspan="5">
                <p style={{textAlign:"center"}}><span>Инженер геологи</span></p>
                </td>
                <td>
                <p><span>2.13.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Инженер геологийн мужлалын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.13.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Инженер геологийн нөхцөлийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.13.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Хөөлттэй хөрсний мужлалын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.13.4</span></p>
                </td>
                <td colspan="3">
                <p><span>Хөөлттэй хөрсний тархалтын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.13.5</span></p>
                </td>
                <td colspan="3">
                <p><span>Мөнх цэвдгийн тархалтын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="8">
                <p align="center"><span>2.14</span></p>
                </td>
                <td rowspan="8">
                <p align="center" style={{textAlign:"center"}}><span>Гидрологи</span></p>
                </td>
                <td>
                <p><span>2.14.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Гидрологийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.14.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Рашааны&nbsp; мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.14.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Гол мөрний урсацын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.14.4</span></p>
                </td>
                <td colspan="3">
                <p><span>Голын сүлжээний нягтшилын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.14.5</span></p>
                </td>
                <td colspan="3">
                <p><span>Хур борооны үерийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.14.6</span></p>
                </td>
                <td colspan="3">
                <p><span>Шар усны үерийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.14.7</span></p>
                </td>
                <td colspan="3">
                <p><span>Гадаргын усны ууршилтын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>2.14.8</span></p>
                </td>
                <td colspan="3">
                <p><span>цэвэр ус хангамжийн эх үүсвэр</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="24">
                <p align="center"><span>3</span></p>
                </td>
                <td rowspan="24">
                <p align="center" style={{textAlign:"center"}}><span>Газар зохион байгуулалт</span></p>
                </td>
                <td rowspan="3">
                <p align="center" style={{textAlign:"center"}}><span>3.1</span></p>
                </td>
                <td rowspan="3">
                <p><span>Газар зохион байгуулалтын ерөнхий төлөвлөгөө</span></p>
                </td>
                <td>
                <p><span>3.1.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Улсын Газар Зохион Байгуулалтын Ерөнхий Төлөвлөгөө</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.1.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Бүсийн Газар Зохион Байгуулалтын Ерөнхий Төлөвлөгөө</span></p>
                </td>
                <td>
                <p><span>Баруун бүс, зүүн бүс, төвийн бүс, говийн бүс</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.1.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Аймгийн Газар Зохион Байгуулалтын Ерөнхий Төлөвлөгөө</span></p>
                </td>
                <td>
                <p><span>21 аймаг</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="3">
                <p align="center"style={{textAlign:"center"}}><span>3.2</span></p>
                </td>
                <td rowspan="3">
                <p><span>Газар зохион байгуулалтын тухайн жилийн төлөвлөгөө</span></p>
                </td>
                <td>
                <p><span>3.2.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Аймаг, нийслэлийн газар зохион байгуулалтын тухайн жилийн төлөвлөгөө</span></p>
                </td>
                <td>
                <p><span>21 аймаг, нийслэл</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.2.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Сум, дүүргийн газар зохион байгуулалтын тухайн жилийн төлөвлөгөө </span></p>
                </td>
                <td>
                <p><span>330 сум, 9 дүүрэг</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.2.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Сумын хөгжлийн ерөнхий төлөвлөгөө</span></p>
                </td>
                <td>
                <p><span>330 сум</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="5">
                <p align="center" style={{textAlign:"center"}}><span>3.3</span></p>
                </td>
                <td rowspan="5">
                <p><span>Газрын төлөв байдал, хянан баталгааны мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>3.3.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Бэлчээрийн газрын төлөв байдал, чанарын хянан баталгаа</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.3.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Хот тосгон бусад суурины газрын төлөв байдал, чанарын хянан баталгаа</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.3.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Тариалан болон атаршсан газрын төлөв байдал, чанарын хянан баталгаа</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.3.4</span></p>
                </td>
                <td colspan="3">
                <p><span>Тусгай хамгаалалттай газрын төлөв байдал, чанарын хянан баталгаа</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.3.5</span></p>
                </td>
                <td colspan="3">
                <p><span>Хадлангийн талбайн төлөв байдал, чанарын хянан баталгаа</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="3">
                <p align="center" style={{textAlign:"center"}}><span>3.4</span></p>
                </td>
                <td rowspan="3">
                <p><span>Бүс&nbsp; газрууд</span></p>
                </td>
                <td>
                <p><span>3.4.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Байгалын бүс бүслүүр</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.4.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Эдийн засгийн бүслүүр</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.4.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Усны сав газрууд</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="3">
                <p style={{textAlign:"center"}}><span>3.5</span></p>
                </td>
                <td rowspan="3">
                <p><span>Кадастрын мэдээллийн сан</span></p>
                </td>
                <td>
                <p><span>3.5.1</span></p>
                </td>
                <td colspan="3">
                <p><span>нэгж талбарын мэдээлэл</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.5.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Иргэн, аж ахуйн нэгж, байгууллагын мэдээлэл</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.5.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Газрын улсын бүртгэлийн цахим архив</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>тоон</span></p>
                </td>
                <td>
                <p><span>pdf</span><span></span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="7">
                <p style={{textAlign:"center"}}><span>3.6</span></p>
                </td>
                <td rowspan="6">
                <p><span>Газрын нэгдмэл сан</span></p>
                </td>
                <td>
                <p><span>3.6.1</span></p>
                </td>
                <td colspan="3">
                <p><span>ХАА-н газар</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.6.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Хот, тосгон, бусад суурины газар</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.6.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Зам, шугам, сүлжээний газар</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.6.4</span></p>
                </td>
                <td colspan="3">
                <p><span>Ойн сан бүхий газар</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.6.5</span></p>
                </td>
                <td colspan="3">
                <p><span>Усан сан бүхий газар</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>3.6.6</span></p>
                </td>
                <td colspan="3">
                <p><span>Тусгай хэрэгцээний газар</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td colspan="5"></td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="3">
                <p align="center"><span>4</span></p>
                </td>
                <td rowspan="3">
                <p style={{textAlign:"center"}}><span>Хот төлөвлөлтийн мэдээллийн сан</span></p>
                </td>
                <td>
                <p style={{textAlign:"center"}}><span>4.1</span></p>
                </td>
                <td colspan="5">
                <p><span>Хэсэгчилсэн ерөнхий төлөвлөгөө</span></p>
                </td>
                <td>
                <p><span>тухайн газар нутаг</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>4.2</span></p>
                </td>
                <td colspan="5">
                <p><span>Хотын хөгжлийн ерөнхий төлөвлөгөө</span></p>
                </td>
                <td>
                <p><span>хот, суурин газар</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>4.3</span></p>
                </td>
                <td colspan="5">
                <p><span>Барилга, орон сууцны мэдээллийн сан </span></p>
                </td>
                <td>
                <p><span>хот, суурин газар</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="7">
                <p align="center"><span>5</span></p>
                </td>
                <td rowspan="7">
                <p align="center"><span>Зам тээвэр</span></p>
                </td>
                <td rowspan="5">
                <p align="center" style={{textAlign:"center"}}><span>5.1</span></p>
                </td>
                <td rowspan="5">
                <p style={{textAlign:"center"}}><span>Авто зам</span></p>
                </td>
                <td>
                <p><span>5.1.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Олон улсын чанартай авто зам</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>5.1.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Улсын чанартай авто зам</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>5.1.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Орон нутгийн чанартай авто зам</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>5.1.4</span></p>
                </td>
                <td colspan="3">
                <p><span>аж ахуйн нэгж, байгууллагын дотоодын авто зам</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>5.1.5</span></p>
                </td>
                <td colspan="3">
                <p><span>Батлагдсан замын чиглэл</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="2">
                <p align="center" style={{textAlign:"center"}}><span>5.2</span></p>
                </td>
                <td rowspan="2">
                <p style={{textAlign:"center"}}><span>Төмөр зам</span></p>
                </td>
                <td>
                <p><span>5.2.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Төмөр замын шугамын чиг</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>5.2.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Төмөр замын хязгаарлалтын бүс</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="6">
                <p><span>6</span></p>
                </td>
                <td rowspan="6">
                <p style={{textAlign:"center"}}><span>Шугам сүлжээ</span></p>
                </td>
                <td rowspan="6">
                <p style={{textAlign:"center"}}><span>6.1</span></p>
                </td>
                <td rowspan="6">
                <p style={{textAlign:"center"}}><span>Газар дээрх Газар доорх</span></p>
                </td>
                <td>
                <p><span>6.1.1</span></p>
                </td>
                <td colspan="3">
                <p><span>Цэвэр ус дамжуулах шугам</span></p>
                </td>
                <td>
                <p><span>хот, суурин газар</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>6.1.2</span></p>
                </td>
                <td colspan="3">
                <p><span>Дулаан дамжуулах шугам</span></p>
                </td>
                <td>
                <p><span>хот, суурин газар</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>6.1.3</span></p>
                </td>
                <td colspan="3">
                <p><span>Холбооны шугам</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>6.1.4</span></p>
                </td>
                <td colspan="3">
                <p><span>Цахилгаан дамжуулах</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>6.1.5</span></p>
                </td>
                <td colspan="3">
                <p><span>Ариутгах татуургын шугам</span></p>
                </td>
                <td>
                <p><span>хот, суурин газар</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p><span>6.1.6</span></p>
                </td>
                <td colspan="3">
                <p><span>Ус зайлуулах суваг</span></p>
                </td>
                <td>
                <p><span>хот, суурин газар</span></p>
                </td>
                <td>
                <p><span>вектор</span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td rowspan="12">
                <p><span>7</span></p>
                </td>
                <td rowspan="12">
                <p style={{textAlign:"center"}}><span>Нийгэм, эдийн засгийн мэдээлэл</span></p>
                </td>
                <td>
                <p style={{textAlign:"center"}}><span>7.1</span></p>
                </td>
                <td>
                <p><span>Эрчим хүч</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td colspan="3">
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span><span></span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>7.2</span></p>
                </td>
                <td>
                <p><span>Зам, тээвэр</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td colspan="3">
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span><span></span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>7.3</span></p>
                </td>
                <td>
                <p><span>Харилцаа холбоо</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td colspan="3">
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span><span></span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>7.4</span></p>
                </td>
                <td>
                <p><span>Хөдөө аж ахуй</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td colspan="3">
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span><span></span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>7.5</span></p>
                </td>
                <td>
                <p><span>Уул уурхай</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td colspan="3">
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span><span></span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>7.6</span></p>
                </td>
                <td>
                <p><span>Аж үйлдвэр</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td colspan="3">
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span><span></span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>7.7</span></p>
                </td>
                <td>
                <p><span>Хүн ам</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td colspan="3">
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span><span></span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>7.8</span></p>
                </td>
                <td>
                <p><span>Эрүүл мэнд</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td colspan="3">
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>хот, суурин газар</span></p>
                </td>
                <td>
                <p><span>вектор</span><span></span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>7.9</span></p>
                </td>
                <td>
                <p><span>Боловсрол</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td colspan="3">
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>хот, суурин газар</span></p>
                </td>
                <td>
                <p><span>вектор</span><span></span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p style={{textAlign:"center"}}><span>7.10</span></p>
                </td>
                <td>
                <p><span>Санхүүгийн дэд бүтэц</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td colspan="3">
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>хот, суурин газар</span></p>
                </td>
                <td>
                <p><span>вектор</span><span></span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p  style={{textAlign:"center"}}><span>7.11</span></p>
                </td>
                <td>
                <p><span>Бизнесийн үйлчилгээ</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td colspan="3">
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>хот, суурин газар</span></p>
                </td>
                <td>
                <p><span>вектор</span><span></span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                <tr>
                <td>
                <p  style={{textAlign:"center"}}><span>7.12</span></p>
                </td>
                <td>
                <p><span>Засаг захиргаа</span></p>
                </td>
                <td>
                <p><span>&nbsp;</span></p>
                </td>
                <td colspan="3">
                <p><span>&nbsp;</span></p>
                </td>
                <td>
                <p><span>Улсын хэмжээнд</span></p>
                </td>
                <td>
                <p><span>вектор</span><span></span></p>
                </td>
                <td>
                <p><span>gdb</span></p>
                </td>
                </tr>
                </tbody>
                </table>
            </div>
        )

    }

}
