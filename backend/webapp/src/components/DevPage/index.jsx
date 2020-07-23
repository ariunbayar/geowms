import React, { Component } from "react";

export class DevPage extends Component {
  render() {
    return (
      <div className="container my-4">
        <div className="row">
          <div className="col-md-12">
            <h1>Libraries</h1>

            <p>
              <strong>Fontawesome 4.7.0: </strong>
              <a href="https://fontawesome.com/v4.7.0/icons/" target="_blank">
                {"https://fontawesome.com/v4.7.0/icons/ "}
                <i className="fa fa-external-link" aria-hidden="true"></i>
              </a>
            </p>
            <p>
              <strong>Bootstrap 4.5.0: </strong>
              <a
                href="https://getbootstrap.com/docs/4.5/components/alerts/"
                target="_blank"
              >
                {"https://getbootstrap.com/docs/4.5/components/alerts/ "}
                <i className="fa fa-external-link" aria-hidden="true"></i>
              </a>
            </p>

            <h1>Координатын формат</h1>

            <div>
              <ul>
                <li>
                  Хэрэглэгчид координатын форматыг үзүүлэхэд энэ форматаар
                  таниулна.
                </li>
                <li>
                  Загвар нь <code>&lt;өргөрөг&gt;,&lt;уртраг&gt;</code> байна.
                </li>
                <li>Өргөрөг нь уртрагийн урд бичигдэнэ</li>
                <li>
                  Өргөрөг, уртраг нь таслалаас хойш 6 орны нарийвчлалтай,
                  бутархай хэсгийг
                  {} <strong>цэгээр</strong> тусгаарласан байна.
                </li>
                <li>
                  Зөв утга: <code>47.917426,106.918118</code>
                </li>
                <li>
                  Буруу утга: <code>47,917426,106,918118</code>. Бутархай орныг
                  таслалаар тусгаарлаж болохгүй.
                </li>
                <li>
                  Буруу утга: <code>106.918118,47.917426</code>. Өргөрөгийг
                  уртрагийн өмнө бичих ёстой.
                </li>
                <li>
                  Өргөрөг: <code>-90</code> -ээс <code>90</code> -ийн хооронд
                  байдаг
                </li>
                <li>
                  Уртраг: <code>-180</code> -аас <code>180</code> -ын хооронд
                  байдаг
                </li>
              </ul>
            </div>
            <h1>Өнгөний код </h1>
            <div>
              <ul>
                <li>
                  Хөгжүүлэгчид үндсэн логоний 8 өнгөний кодыг танилцуулж байна.
                </li>

                <li style={{ color: "#4EA2CE" }}>
                  {" "}
                  Усан цэнхэр <code>&lt;#4EA2CE&gt;</code>
                </li>
                <li style={{ color: "#FDD252" }}>
                  {" "}
                  Шар <code>&lt;#FDD252&gt;</code>
                </li>
                <li style={{ color: "#ED504D" }}>
                  {" "}
                  Улаан <code>&lt;#ED504D&gt;</code>
                </li>
                <li style={{ color: "#931F46" }}>
                  {" "}
                  Хүрэн <code>&lt;#931F46&gt;</code>
                </li>
                <li style={{ color: "#4F3694" }}>
                  {" "}
                  Чирнээлэн ягаан<code>&lt;#4F3694&gt;</code>
                </li>
                <li style={{ color: "#233B7C" }}>
                  {" "}
                  Хөх <code>&lt;#233B7C&gt;</code>
                </li>
                <li style={{ color: "#196CB5" }}>
                  {" "}
                  Гүн цэнхэр <code>&lt;#196CB5&gt;</code>
                </li>
                <li style={{ color: "#2587C8" }}>
                  {" "}
                  Цэнхэр <code>&lt;#2587C8&gt;</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
