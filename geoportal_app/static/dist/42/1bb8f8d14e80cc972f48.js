(window.webpackJsonp=window.webpackJsonp||[]).push([[42],{970:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return D}));var n=a(0),r=a.n(n),o=a(20),l=a(33),i=a(99),c=a.n(i),m=a(219);function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function u(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){d(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function d(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var g={covid:{get:function(){var e=Object(m.a)();return fetch("/back/api/config/covid/",e).then(m.c)},save:function(e,t){var a=u(u({},Object(m.b)()),{},{body:JSON.stringify(e)});return fetch("/back/api/config/covid/save/",a).then(m.c)}}};function _(e){return(_="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function b(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var a=[],n=!0,r=!1,o=void 0;try{for(var l,i=e[Symbol.iterator]();!(n=(l=i.next()).done)&&(a.push(l.value),!t||a.length!==t);n=!0);}catch(e){r=!0,o=e}finally{try{n||null==i.return||i.return()}finally{if(r)throw o}}return a}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return p(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);"Object"===a&&e.constructor&&(a=e.constructor.name);if("Map"===a||"Set"===a)return Array.from(e);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return p(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}function h(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function E(e,t){return(E=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function v(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=w(e);if(t){var r=w(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return y(this,a)}}function y(e,t){return!t||"object"!==_(t)&&"function"!=typeof t?N(e):t}function N(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function w(e){return(w=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var j=l.c().shape({batlagdsan_tohioldol:l.d().required("Хоосон байна!"),edgersen_humuusiin_too:l.d(),emchlegdej_bui_humuus_too:l.d(),tusgaarlagdsan_humuusiin_too:l.d(),medeellin_eh_survalj:l.d(),emiin_sangiin_too:l.d(),emlegiin_too:l.d(),niit_eruul_mend_baiguullaga_too:l.d(),title:l.d(),bundle:l.d(),shinjilgee_too:l.d(),nas_barsan_too:l.d()}),O=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&E(e,t)}(m,e);var t,a,l,i=v(m);function m(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,m),(t=i.call(this,e)).state={is_editing:!1,initial_values:{batlagdsan_tohioldol:"",edgersen_humuusiin_too:"",emchlegdej_bui_humuus_too:"",tusgaarlagdsan_humuusiin_too:"",medeellin_eh_survalj:"",emiin_sangiin_too:"",emlegiin_too:"",niit_eruul_mend_baiguullaga_too:"",title:"",bundle:"1",shinjilgee_too:"",nas_barsan_too:"",erguul_ungu:"",line_graph_org:"",nas_barsan_too_org:"",shinjilgee_too_org:"",niit_eruul_mend_baiguullaga_too_org:"",emlegiin_too_org:"",emiin_sangiin_too_org:"",tusgaarlagdsan_humuusiin_org:"",emchlegdej_bui_humuus_too_org:"",edgersen_humuusiin_too_org:"",batlagdsan_tohioldol_org:""},emy_logo:"",emy_logo_old:"",gzbgzzg_logo:"",gzbgzzg_logo_old:"",values:{},line_chart_datas:[],bundles:[],orgs:[]},t.handleEdit=t.handleEdit.bind(N(t)),t.handleSubmit=t.handleSubmit.bind(N(t)),t.arrayRemove=t.arrayRemove.bind(N(t)),t.arrayOnChange=t.arrayOnChange.bind(N(t)),t.arrayOnChangeDatas=t.arrayOnChangeDatas.bind(N(t)),t.arrayAdd=t.arrayAdd.bind(N(t)),t.onDrop=t.onDrop.bind(N(t)),t}return t=m,(a=[{key:"arrayRemove",value:function(e){var t=this.state.line_chart_datas;t.splice(e,1),this.setState(t)}},{key:"arrayAdd",value:function(){var e=this.state.line_chart_datas;e.push({label:"Огноо",datas:1}),this.setState(e)}},{key:"arrayOnChange",value:function(e,t){var a=this.state.line_chart_datas;a[e].label=t,this.setState(a)}},{key:"arrayOnChangeDatas",value:function(e,t){var a=this.state.line_chart_datas;a[e].datas=t,this.setState(a)}},{key:"componentDidMount",value:function(){var e=this;g.covid.get().then((function(t){e.setState({initial_values:t,values:t,line_chart_datas:t.line_chart_datas,line_graph_org:t.line_graph_org,emy_logo:t.emy_logo,emy_logo_old:t.emy_logo,gzbgzzg_logo:t.gzbgzzg_logo,gzbgzzg_logo_old:t.gzbgzzg_logo,bundles:t.bundles,orgs:t.orgs})}))}},{key:"handleEdit",value:function(e){e.preventDefault();var t=this.state.is_editing;this.setState({is_editing:!t})}},{key:"handleSubmit",value:function(e,t){var a=this,n=t.setStatus,r=t.setValues,o=this.state,l=o.emy_logo,i=o.gzbgzzg_logo,c=o.line_chart_datas;n("saving");var m=e;m.emy_logo=l,m.gzbgzzg_logo=i,g.covid.save(m,c).then((function(t){if(!t.success)return Promise.reject();n("save_success"),a.setState({values:e})})).catch((function(){r(a.state.values),n("save_error")})).finally((function(){a.setState({is_editing:!1})}))}},{key:"onDrop",value:function(e,t){var a=this,n=b(e,1)[0];if(n){var r=new FileReader;r.onload=function(e){a.setState(f({},t,btoa(e.target.result)))},r.readAsBinaryString(n)}}},{key:"render",value:function(){var e=this,t=this.state,a=t.is_editing,l=t.initial_values,i=(t.gzbgzzg_logo,t.gzbgzzg_logo_old),m=(t.emy_logo,t.emy_logo_old),s=t.line_chart_datas,u=t.bundles,d=t.orgs;return r.a.createElement("div",{className:"card"},r.a.createElement("div",{className:"card-header"},"Covid",r.a.createElement("div",{className:"card-action"},r.a.createElement("a",{href:"#",onClick:this.handleEdit},r.a.createElement("i",{className:"fa fa-edit"})))),r.a.createElement("div",{className:"card-body"},r.a.createElement(o.e,{initialValues:l,initialStatus:"initial",enableReinitialize:!0,validationSchema:j,onSubmit:this.handleSubmit},(function(t){var l=t.errors,g=t.status,_=(t.touched,t.isSubmitting,t.setFieldValue,t.setStatus),b=(t.setValues,t.handleBlur,t.values);return t.isValid,t.dirty,r.a.createElement(o.d,null,r.a.createElement("fieldset",{disabled:!a},r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-12"},r.a.createElement("label",{htmlFor:"bundle"},"Дэд сан"),u.map((function(e,t){return b.bundle==e.pk&&r.a.createElement("img",{key:t,src:e.icon,className:"logo-icon",alt:"logo icon"})})),r.a.createElement(n.Fragment,null,r.a.createElement(o.b,{name:"bundle",as:"select",className:"form-control mt-2 "+(l.bundle?"is-invalid":"")},u.map((function(e,t){return r.a.createElement("option",{key:t,value:e.pk},e.name)}))),r.a.createElement(o.a,{name:"bundle",component:"div",className:"text-dange"})))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-12"},r.a.createElement("label",{htmlFor:"title"},"Гарчиг"),r.a.createElement(o.b,{name:"title",id:"id_title",type:"text",className:"form-control"}))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-12"},r.a.createElement("label",{htmlFor:"emy_logo"},"ЕМЯ logo"),r.a.createElement(c.a,{withPreview:!0,withIcon:!1,buttonText:"Зураг оруулах",onChange:function(t){return e.onDrop(t,"emy_logo")},imgExtension:[".jpeg",".png"],maxFileSize:225e4,singleImage:!0,label:""}),r.a.createElement("p",null,"Өмнөх зураг"),r.a.createElement("br",null),r.a.createElement("img",{className:"shadow p-3 mb-5 bg-white rounded",src:"data:image/png;base64,"+m,style:{height:"150px"}}))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-12"},r.a.createElement("label",{htmlFor:"gzbgzzg_logo"},"ГЗБГЗЗГ logo"),r.a.createElement(c.a,{withPreview:!0,withIcon:!1,buttonText:"Зураг оруулах",onChange:function(t){return e.onDrop(t,"gzbgzzg_logo")},imgExtension:[".jpeg",".png"],maxFileSize:225e4,singleImage:!0,label:""}),r.a.createElement("p",null,"Өмнөх зураг"),r.a.createElement("br",null),r.a.createElement("img",{className:"shadow p-3 mb-5 bg-white rounded",src:"data:image/png;base64,"+i,style:{height:"150px"}}))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-10"},r.a.createElement("label",{htmlFor:"batlagdsan_tohioldol"},"Батлагдсан тохиолдол"),r.a.createElement(o.b,{name:"batlagdsan_tohioldol",id:"id_batlagdsan_tohioldol",type:"number",className:"form-control"})),r.a.createElement("div",{className:"col-md-2"},r.a.createElement("label",{htmlFor:"batlagdsan_tohioldol_org"},"Байгууллага"),r.a.createElement(o.b,{name:"batlagdsan_tohioldol_org",as:"select",className:"form-control"},r.a.createElement("option",{value:""}," --- Байгууллага --- "),d.map((function(e,t){return r.a.createElement("option",{key:t,value:e.id},e.name)}))))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-10"},r.a.createElement("label",{htmlFor:"edgersen_humuusiin_too"},"Эдгэрсэн хүмүүсийн тоо"),r.a.createElement(o.b,{name:"edgersen_humuusiin_too",id:"id_edgersen_humuusiin_too",type:"number",className:"form-control"})),r.a.createElement("div",{className:"col-md-2"},r.a.createElement("label",{htmlFor:"edgersen_humuusiin_too_org"},"Байгууллага"),r.a.createElement(o.b,{name:"edgersen_humuusiin_too_org",as:"select",className:"form-control"},r.a.createElement("option",{value:""}," --- Байгууллага --- "),d.map((function(e,t){return r.a.createElement("option",{key:t,value:e.id},e.name)}))))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-10"},r.a.createElement("label",{htmlFor:"emchlegdej_bui_humuus_too"},"Эмчлэгдэж буй хүмүүсийн тоо"),r.a.createElement(o.b,{name:"emchlegdej_bui_humuus_too",id:"id_emchlegdej_bui_humuus_too",type:"number",className:"form-control"})),r.a.createElement("div",{className:"col-md-2"},r.a.createElement("label",{htmlFor:"emchlegdej_bui_humuus_too_org"},"Байгууллага"),r.a.createElement(o.b,{name:"emchlegdej_bui_humuus_too_org",as:"select",className:"form-control"},r.a.createElement("option",{value:""}," --- Байгууллага --- "),d.map((function(e,t){return r.a.createElement("option",{key:t,value:e.id},e.name)}))))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-10"},r.a.createElement("label",{htmlFor:"tusgaarlagdsan_humuusiin_too"},"Тусгаарлагдаж буй хүмүүсийн тоо"),r.a.createElement(o.b,{name:"tusgaarlagdsan_humuusiin_too",id:"id_tusgaarlagdsan_humuusiin_too",type:"number",className:"form-control"})),r.a.createElement("div",{className:"col-md-2"},r.a.createElement("label",{htmlFor:"tusgaarlagdsan_humuusiin_too_org"},"Байгууллага"),r.a.createElement(o.b,{name:"tusgaarlagdsan_humuusiin_too_org",as:"select",className:"form-control"},r.a.createElement("option",{value:""}," --- Байгууллага --- "),d.map((function(e,t){return r.a.createElement("option",{key:t,value:e.id},e.name)}))))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-12"},r.a.createElement("label",{htmlFor:"medeellin_eh_survalj"},"Мэдээллийн эх сурвалж"),r.a.createElement(o.b,{name:"medeellin_eh_survalj",id:"id_medeellin_eh_survalj",as:"textarea",className:"form-control"}))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-10"},r.a.createElement("label",{htmlFor:"emiin_sangiin_too"},"Эмийн сангийн тоо"),r.a.createElement(o.b,{name:"emiin_sangiin_too",id:"id_emiin_sangiin_too",type:"number",className:"form-control"})),r.a.createElement("div",{className:"col-md-2"},r.a.createElement("label",{htmlFor:"emiin_sangiin_too_org"},"Байгууллага"),r.a.createElement(o.b,{name:"emiin_sangiin_too_org",as:"select",className:"form-control"},r.a.createElement("option",{value:""}," --- Байгууллага --- "),d.map((function(e,t){return r.a.createElement("option",{key:t,value:e.id},e.name)}))))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-10"},r.a.createElement("label",{htmlFor:"emlegiin_too"},"Эмнэлгийн тоо"),r.a.createElement(o.b,{name:"emlegiin_too",id:"id_emlegiin_too",type:"number",className:"form-control"})),r.a.createElement("div",{className:"col-md-2"},r.a.createElement("label",{htmlFor:"emlegiin_too_org"},"Байгууллага"),r.a.createElement(o.b,{name:"emlegiin_too_org",as:"select",className:"form-control"},r.a.createElement("option",{value:""}," --- Байгууллага --- "),d.map((function(e,t){return r.a.createElement("option",{key:t,value:e.id},e.name)}))))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-10"},r.a.createElement("label",{htmlFor:"niit_eruul_mend_baiguullaga_too"},"Нийт эрүүл мэндийн байгуулагын тоо"),r.a.createElement(o.b,{name:"niit_eruul_mend_baiguullaga_too",id:"id_niit_eruul_mend_baiguullaga_too",type:"number",className:"form-control"})),r.a.createElement("div",{className:"col-md-2"},r.a.createElement("label",{htmlFor:"niit_eruul_mend_baiguullaga_too_org"},"Байгууллага"),r.a.createElement(o.b,{name:"niit_eruul_mend_baiguullaga_too_org",as:"select",className:"form-control"},r.a.createElement("option",{value:""}," --- Байгууллага --- "),d.map((function(e,t){return r.a.createElement("option",{key:t,value:e.id},e.name)}))))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-10"},r.a.createElement("label",{htmlFor:"id_shinjilgee_too"},"Шинжилгээ хийсэн тоо"),r.a.createElement(o.b,{name:"shinjilgee_too",id:"id_shinjilgee_too",type:"number",className:"form-control"})),r.a.createElement("div",{className:"col-md-2"},r.a.createElement("label",{htmlFor:"shinjilgee_too_org"},"Байгууллага"),r.a.createElement(o.b,{name:"shinjilgee_too_org",as:"select",className:"form-control"},r.a.createElement("option",{value:""}," --- Байгууллага --- "),d.map((function(e,t){return r.a.createElement("option",{key:t,value:e.id},e.name)}))))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-10"},r.a.createElement("label",{htmlFor:"id_nas_barsan_too"},"Нас барсан хүмүүсийн тоо"),r.a.createElement(o.b,{name:"nas_barsan_too",id:"id_nas_barsan_too",type:"number",className:"form-control"})),r.a.createElement("div",{className:"col-md-2"},r.a.createElement("label",{htmlFor:"nas_barsan_too_org"},"Байгууллага"),r.a.createElement(o.b,{name:"nas_barsan_too_org",as:"select",className:"form-control"},r.a.createElement("option",{value:""}," --- Байгууллага --- "),d.map((function(e,t){return r.a.createElement("option",{key:t,value:e.id},e.name)}))))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-12"},r.a.createElement("label",{htmlFor:"id_erguul_ungu"},"Эргүүлд гарсан хүний цэгийн өнгө"),r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-md-8"},r.a.createElement(o.b,{name:"erguul_ungu",id:"id_erguul_ungu",type:"color",className:"form-control"})),r.a.createElement("div",{className:"col-md-4"},r.a.createElement("div",{className:b.erguul_ungu?"h5":""},b.erguul_ungu?b.erguul_ungu:"өнгө сонгоогүй байна"))))),r.a.createElement("div",{className:"row mb-2"},r.a.createElement("table",{className:"table table-bordered"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",{colSpan:"4",className:"text-center align-center",scope:"rowgroup"},"Line graph утга")),r.a.createElement("tr",null,r.a.createElement("th",null,"№"),r.a.createElement("th",null,"Огноо"),r.a.createElement("th",null,"Тоо"),r.a.createElement("th",null,"Хасах"))),r.a.createElement("tbody",null,s.map((function(t,a){return r.a.createElement("tr",{key:a},r.a.createElement("td",null,a+1),r.a.createElement("td",null,r.a.createElement("input",{onChange:function(t){return e.arrayOnChange(a,t.target.value)},type:"date",className:"form-control",value:t.label})),r.a.createElement("td",null,r.a.createElement("input",{onChange:function(t){return e.arrayOnChangeDatas(a,t.target.value)},type:"number",className:"form-control",value:t.datas})),r.a.createElement("td",null,r.a.createElement("a",{onClick:function(){return e.arrayRemove(a)},className:"btn btn-outline-primary "},"Хасах")))})),r.a.createElement("tr",null,r.a.createElement("td",{colSpan:"4",className:"text-center align-center",scope:"rowgroup"},r.a.createElement("a",f({className:"text-center",onClick:e.arrayAdd},"className","btn btn-outline-primary rounded-circle"),"Нэмэх"))))),r.a.createElement(o.b,{name:"line_graph_org",as:"select",className:"form-control"},r.a.createElement("option",{value:""}," --- Байгууллага --- "),d.map((function(e,t){return r.a.createElement("option",{key:t,value:e.id},e.name)})))),a&&r.a.createElement("button",{type:"submit",className:"btn gp-btn-primary",disabled:"saving"==g},"saving"==g&&r.a.createElement(n.Fragment,null,r.a.createElement("i",{className:"fa fa-circle-o-notch fa-spin"})," ","Түр хүлээнэ үү..."),"saving"!=g&&"Хадгалах")),!a&&"save_success"==g&&r.a.createElement("div",{className:"alert alert-icon-success alert-dismissible",role:"alert"},r.a.createElement("button",{type:"button",className:"close",onClick:function(){return _("initial")}},"×"),r.a.createElement("div",{className:"alert-icon icon-part-success"},r.a.createElement("i",{className:"icon-check"})),r.a.createElement("div",{className:"alert-message"},r.a.createElement("span",null,"Амжилттай хадгаллаа!"))),!a&&"save_error"==g&&r.a.createElement("div",{className:"alert alert-icon-warning alert-dismissible",role:"alert"},r.a.createElement("button",{type:"button",className:"close",onClick:function(){return _("initial")}},"×"),r.a.createElement("div",{className:"alert-icon icon-part-warning"},r.a.createElement("i",{className:"icon-check"})),r.a.createElement("div",{className:"alert-message"},r.a.createElement("span",null,"Хадгалахад алдаа гарлаа!"))))}))))}}])&&h(t.prototype,a),l&&h(t,l),m}(n.Component);function S(e){return(S="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function k(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function z(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function F(e,t){return(F=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function P(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=x(e);if(t){var r=x(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return C(this,a)}}function C(e,t){return!t||"object"!==S(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function x(e){return(x=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var D=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&F(e,t)}(l,e);var t,a,n,o=P(l);function l(){return k(this,l),o.apply(this,arguments)}return t=l,(a=[{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-lg-6"},r.a.createElement(O,null))))}}])&&z(t.prototype,a),n&&z(t,n),l}(n.Component)}}]);