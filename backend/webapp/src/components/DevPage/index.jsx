import React, { Component } from "react";
import "./style.css";


class LinkExternal extends Component {

    render() {
        return (
            <a href={this.props.href} target="_blank">
                {this.props.text || this.props.href}
                {} <i className="fa fa-external-link" aria-hidden="true"></i>
            </a>
        )
    }

}


export class DevPage extends Component {
  render() {
    return (
      <div className="container my-4">
        <div className="row">
          <div className="col-md-12">
            <h1>Libraries</h1>

            <p>
                <strong>Fontawesome 4.7.0: </strong>
                <LinkExternal href="https://fontawesome.com/v4.7.0/icons/"/>
            </p>
              <p>
                <strong>Bootstrap 4.5.0: </strong>
                <LinkExternal href="https://getbootstrap.com/docs/4.5/components/alerts/"/>
            </p>
            <div>
                <strong>react-chartjs-2 (2.9.0): </strong><br/>
                <ul>
                    <li>
                        <LinkExternal href="http://jerairrest.github.io/react-chartjs-2/"/>
                        {} is a react wrapper for
                        {} <LinkExternal href="https://www.chartjs.org/docs/latest/" text="Chart.js 2"/>
                    </li>
                    <li>NPM: <LinkExternal href="https://www.npmjs.com/package/react-chartjs-2"/></li>
                </ul>
            </div>
            <div>
                <p>
                    <strong>django-easy-audit 1.2.3: </strong>
                    <LinkExternal href="https://github.com/soynatan/django-easy-audit"/>
                </p>
                <ul>
                    <li>Бусад лог хөтөлдөг сангууд ихэвчлэн кодондоо ихээхэн өөрчлөлт хийхийг шаарддаг харин django-easy-audit бол ямарч өөрчлөлтийг шаардахгүй.</li>
                    <li>Хүссэн линкээ нэмэлтээр хориглож болно.</li>
                    <li>Хүссэн model-оо нэмэлтээр хориглож болно.</li>
                    <li>Нэмэлтээр кодчилол шаардахгүй.</li>
                    <li>Django админ хэсгээс лавлах боломжтой.</li>
                </ul>
            </div>
            
            <p>
                <strong>pycryptodome 3.9.8: </strong>
                <LinkExternal href="https://pypi.org/project/pycryptodome/"/>
            </p>
            <p>
                <strong>pycrypto 2.6.1: </strong>
                <LinkExternal href="https://pypi.org/project/pycrypto/"/>
            </p>
            <p>
                <strong>cryptography 3.0: </strong>
                <LinkExternal href="https://pypi.org/project/cryptography/"/>
            </p>
            <p>
                <strong>elementpath 2.0.0: </strong>
                <LinkExternal href="https://pypi.org/project/elementpath/"/>
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

            <h1>GeoPortal гар утасны android application</h1>
            <div>
                 <ul>
                     <li>Татах линк:
                         <LinkExternal href="/static/assets/geoportal.apk"/>
                     </li>
                </ul>
            </div>

            <h1>Өнгөний код</h1>
            <div className="col-md-3 colordiv">
              <ul>
                <li className="li1"> #00A3CF </li>
                <li className="li2"> #FFD24A </li>
                <li className="li3"> #FF4748 </li>
                <li className="li4"> #A11445 </li>
                <li className="li5"> #4E3395 </li>
                <li className="li6"> #0B3A7D </li>
                <li className="li7"> #006CB6 </li>
                <li className="li8"> #0088CA </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
