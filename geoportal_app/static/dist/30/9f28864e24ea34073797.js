(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{916:function(e,t,l){var n=l(62),a=l(917);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var r={insert:"head",singleton:!1};n(a,r);e.exports=a.locals||{}},917:function(e,t,l){(t=l(63)(!1)).push([e.i,".colordiv li{\n    height: 46px;\n    text-align: center;\n    padding: 10px;\n    color: white;\n}\n.colordiv ul{\n    padding-left: 30px;\n}\n.colordiv .li1{\n    background-color: #00A3CF;\n}\n.colordiv .li2{\n    background-color: #FFD24A;\n}\n.colordiv .li3{\n    background-color: #FF4748;\n}\n.colordiv .li4{\n    background-color: #A11445;\n}\n.colordiv .li5{\n    background-color: #4E3395;\n}\n.colordiv .li6{\n    background-color: #0B3A7D;\n}\n.colordiv .li7{\n    background-color: #006CB6;\n}\n.colordiv .li8{\n    background-color: #0088CA;\n}",""]),e.exports=t},938:function(e,t,l){"use strict";l.r(t),l.d(t,"default",(function(){return d}));var n=l(0),a=l.n(n);l(916);function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){for(var l=0;l<t.length;l++){var n=t[l];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function u(e,t,l){return t&&o(e.prototype,t),l&&o(e,l),e}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&m(e,t)}function m(e,t){return(m=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var l,n=E(e);if(t){var a=E(this).constructor;l=Reflect.construct(n,arguments,a)}else l=n.apply(this,arguments);return p(this,l)}}function p(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function E(e){return(E=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var f=function(e){i(l,e);var t=s(l);function l(){return c(this,l),t.apply(this,arguments)}return u(l,[{key:"render",value:function(){return a.a.createElement("a",{href:this.props.href,target:"_blank"},this.props.text||this.props.href," ",a.a.createElement("i",{className:"fa fa-external-link","aria-hidden":"true"}))}}]),l}(n.Component),d=function(e){i(l,e);var t=s(l);function l(){return c(this,l),t.apply(this,arguments)}return u(l,[{key:"render",value:function(){return a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"col-md-12"},a.a.createElement("div",{className:"card"},a.a.createElement("div",{className:"card-body"},a.a.createElement("h3",null,"Libraries"),a.a.createElement("div",null,a.a.createElement("strong",null,"Fontawesome 4.7.0: "),a.a.createElement(f,{href:"https://fontawesome.com/v4.7.0/icons/"})),a.a.createElement("br",null),a.a.createElement("div",null,a.a.createElement("strong",null,"Bootstrap 4.5.0: "),a.a.createElement(f,{href:"https://getbootstrap.com/docs/4.5/components/alerts/"})),a.a.createElement("br",null),a.a.createElement("div",null,a.a.createElement("strong",null,"react-chartjs-2 (2.9.0): "),a.a.createElement("br",null),a.a.createElement("ul",null,a.a.createElement("li",null,a.a.createElement(f,{href:"http://jerairrest.github.io/react-chartjs-2/"})," is a react wrapper for"," ",a.a.createElement(f,{href:"https://www.chartjs.org/docs/latest/",text:"Chart.js 2"})),a.a.createElement("li",null,"NPM: ",a.a.createElement(f,{href:"https://www.npmjs.com/package/react-chartjs-2"})))),a.a.createElement("div",null,a.a.createElement("strong",null,"django-easy-audit 1.2.3: "),a.a.createElement(f,{href:"https://github.com/soynatan/django-easy-audit"})),a.a.createElement("ul",null,a.a.createElement("li",null,"Бусад лог хөтөлдөг сангууд ихэвчлэн кодондоо ихээхэн өөрчлөлт хийхийг шаарддаг харин django-easy-audit бол ямарч өөрчлөлтийг шаардахгүй."),a.a.createElement("li",null,"Хүссэн линкээ нэмэлтээр хориглож болно."),a.a.createElement("li",null,"Хүссэн model-оо нэмэлтээр хориглож болно."),a.a.createElement("li",null,"Нэмэлтээр кодчилол шаардахгүй."),a.a.createElement("li",null,"Django админ хэсгээс лавлах боломжтой.")),a.a.createElement("div",null,a.a.createElement("strong",null,"django-debug-toolbar 2.1: "),a.a.createElement(f,{href:"https://pypi.org/project/django-debug-toolbar/"}),a.a.createElement("ul",null,a.a.createElement("li",null,"Хөгжүүлэлтийн явцад сайтын ажиллагаатай холбоотой статистик үзүүлнэ."))),a.a.createElement("div",null,a.a.createElement("strong",null,"Django User Agents: "),a.a.createElement("ul",null,a.a.createElement("li",null,"User agent таних модуль: ",a.a.createElement(f,{href:"https://pypi.org/project/django-user-agents/"})),a.a.createElement("li",null,a.a.createElement(f,{href:"https://pypi.org/project/ua-parser/"})),a.a.createElement("li",null,a.a.createElement(f,{href:"https://pypi.org/project/user-agents/"})))),a.a.createElement("div",null,a.a.createElement("strong",null,"requests 2.23.0: "),a.a.createElement(f,{href:"https://pypi.org/project/requests/"}),a.a.createElement("ul",null,a.a.createElement("li",null,"Бусад газраас хуудас дуудахад ашиглагдана. Ихэвчлэн бусад GeoSpacial сервисүүдийг дуудахад"))),a.a.createElement("div",null,a.a.createElement("strong",null,"Pillow 7.1.2: "),a.a.createElement(f,{href:"https://pypi.org/project/Pillow/"}),a.a.createElement("ul",null,a.a.createElement("li",null,"Зураг боловсруулалтын модуль"))),a.a.createElement("div",null,a.a.createElement("strong",null,"psycopg2-binary 2.8.5: "),a.a.createElement(f,{href:"https://pypi.org/project/psycopg2-binary/"}),a.a.createElement("ul",null,a.a.createElement("li",null," Python ",a.a.createElement(f,{href:"https://www.postgresql.org/",text:"PostgreSQL"})," client"))),a.a.createElement("div",null,a.a.createElement("strong",null,"Шифрлэлт, нууцлал: "),a.a.createElement("ul",null,a.a.createElement("li",null,"pycryptodome 3.9.8: ",a.a.createElement(f,{href:"https://pypi.org/project/pycryptodome/"})),a.a.createElement("li",null,"pycrypto 2.6.1: ",a.a.createElement(f,{href:"https://pypi.org/project/pycrypto/"})),a.a.createElement("li",null,"cryptography 3.0: ",a.a.createElement(f,{href:"https://pypi.org/project/cryptography/"})))),a.a.createElement("div",null,a.a.createElement("strong",null,"pyproj 2.5.0: "),a.a.createElement(f,{href:"https://pypi.org/project/pyproj/2.5.0/"}),a.a.createElement("ul",null,a.a.createElement("li",null,"Координат хөрвүүлэх сан "))),a.a.createElement("strong",null,"'Qgis'-ийн 'Active feature'-ийн өөрчлөлтийг авах 'plugin' "),a.a.createElement("div",null,a.a.createElement("ul",null,a.a.createElement("li",null,"Татах линк:",a.a.createElement(f,{href:"/static/assets/qgis_plugin.zip"})))),a.a.createElement("div",null,a.a.createElement("strong",null,"GeoJSON==2.5.0: "),a.a.createElement(f,{href:"https://pypi.org/project/geojson/"}),a.a.createElement("ul",null,a.a.createElement("li",null,"Бүх 'GeoJSON' форматтай өгөгдөлд зориулсан сан"))),a.a.createElement("div",null,a.a.createElement("strong",null,"fpdf 1.7.2: "),a.a.createElement(f,{href:"https://pypi.org/project/fpdf/"}),a.a.createElement("ul",null,a.a.createElement("li",null,"Цэг бүртгэх үед цэгийн мэдээллийг pdf болгоход ашигласан."))),a.a.createElement("h3",null,"Координатын формат"),a.a.createElement("div",null,a.a.createElement("ul",null,a.a.createElement("li",null,"Хэрэглэгчид координатын форматыг үзүүлэхэд энэ форматаар таниулна."),a.a.createElement("li",null,"Загвар нь ",a.a.createElement("code",null,"<өргөрөг>,<уртраг>")," байна."),a.a.createElement("li",null,"Өргөрөг нь уртрагийн урд бичигдэнэ"),a.a.createElement("li",null,"Өргөрөг, уртраг нь таслалаас хойш 6 орны нарийвчлалтай, бутархай хэсгийг"," ",a.a.createElement("strong",null,"цэгээр")," тусгаарласан байна."),a.a.createElement("li",null,"Зөв утга: ",a.a.createElement("code",null,"47.917426,106.918118")),a.a.createElement("li",null,"Буруу утга: ",a.a.createElement("code",null,"47,917426,106,918118"),". Бутархай орныг таслалаар тусгаарлаж болохгүй."),a.a.createElement("li",null,"Буруу утга: ",a.a.createElement("code",null,"106.918118,47.917426"),". Өргөрөгийг уртрагийн өмнө бичих ёстой."),a.a.createElement("li",null,"Өргөрөг: ",a.a.createElement("code",null,"-90")," -ээс ",a.a.createElement("code",null,"90")," -ийн хооронд байдаг"),a.a.createElement("li",null,"Уртраг: ",a.a.createElement("code",null,"-180")," -аас ",a.a.createElement("code",null,"180")," -ын хооронд байдаг"))),a.a.createElement("h3",null,"GeoPortal гар утасны android application"),a.a.createElement("div",null,a.a.createElement("ul",null,a.a.createElement("li",null,"Татах линк:",a.a.createElement(f,{href:"/static/assets/geoportal.apk"})))),a.a.createElement("h3",null,"Өнгөний код"),a.a.createElement("div",{className:"col-md-3 colordiv"},a.a.createElement("ul",null,a.a.createElement("li",{className:"li1"}," #00A3CF "),a.a.createElement("li",{className:"li2"}," #FFD24A "),a.a.createElement("li",{className:"li3"}," #FF4748 "),a.a.createElement("li",{className:"li4"}," #A11445 "),a.a.createElement("li",{className:"li5"}," #4E3395 "),a.a.createElement("li",{className:"li6"}," #0B3A7D "),a.a.createElement("li",{className:"li7"}," #006CB6 "),a.a.createElement("li",{className:"li8"}," #0088CA ")))))))}}]),l}(n.Component)}}]);