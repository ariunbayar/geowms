(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["frontend/bundle"],{

/***/ "./frontend/bundle/src/components/App.jsx":
/*!************************************************!*\
  !*** ./frontend/bundle/src/components/App.jsx ***!
  \************************************************/
/*! exports provided: App */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "App", function() { return App; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _DetailPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DetailPage */ "./frontend/bundle/src/components/DetailPage/index.jsx");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var App = /*#__PURE__*/function (_Component) {
  _inherits(App, _Component);

  var _super = _createSuper(App);

  function App() {
    _classCallCheck(this, App);

    return _super.apply(this, arguments);
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_DetailPage__WEBPACK_IMPORTED_MODULE_1__["DetailPage"], {
        bundle: this.props.bundle
      });
    }
  }]);

  return App;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/BundleMap.jsx":
/*!*****************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/BundleMap.jsx ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BundleMap; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_ol_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/ol.css */ "./node_modules/ol/ol.css");
/* harmony import */ var ol_ol_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_ol_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol */ "./node_modules/ol/index.js");
/* harmony import */ var ol_proj__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/proj */ "./node_modules/ol/proj.js");
/* harmony import */ var ol_format_WMSGetFeatureInfo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ol/format/WMSGetFeatureInfo */ "./node_modules/ol/format/WMSGetFeatureInfo.js");
/* harmony import */ var ol_layer_Tile__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ol/layer/Tile */ "./node_modules/ol/layer/Tile.js");
/* harmony import */ var ol_layer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ol/layer */ "./node_modules/ol/layer.js");
/* harmony import */ var ol_source__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ol/source */ "./node_modules/ol/source.js");
/* harmony import */ var ol_style__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ol/style */ "./node_modules/ol/style.js");
/* harmony import */ var ol_geom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ol/geom */ "./node_modules/ol/geom.js");
/* harmony import */ var ol_source_TileImage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ol/source/TileImage */ "./node_modules/ol/source/TileImage.js");
/* harmony import */ var ol_source_TileWMS__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ol/source/TileWMS */ "./node_modules/ol/source/TileWMS.js");
/* harmony import */ var ol_source_OSM__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ol/source/OSM */ "./node_modules/ol/source/OSM.js");
/* harmony import */ var ol_coordinate__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ol/coordinate */ "./node_modules/ol/coordinate.js");
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
/* harmony import */ var _controls___WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./controls/СуурьДавхарга */ "./frontend/bundle/src/components/DetailPage/controls/СуурьДавхарга.jsx");
/* harmony import */ var _controls_CoordinateCopy__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./controls/CoordinateCopy */ "./frontend/bundle/src/components/DetailPage/controls/CoordinateCopy.jsx");
/* harmony import */ var _controls_Modal__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./controls/Modal */ "./frontend/bundle/src/components/DetailPage/controls/Modal.jsx");
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./styles.css */ "./frontend/bundle/src/components/DetailPage/styles.css");
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_styles_css__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var _service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./service */ "./frontend/bundle/src/components/DetailPage/service.js");
/* harmony import */ var _SidebarButton__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./SidebarButton */ "./frontend/bundle/src/components/DetailPage/SidebarButton.jsx");
/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./Sidebar */ "./frontend/bundle/src/components/DetailPage/Sidebar.jsx");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
























var BundleMap = /*#__PURE__*/function (_Component) {
  _inherits(BundleMap, _Component);

  var _super = _createSuper(BundleMap);

  function BundleMap(props) {
    var _this;

    _classCallCheck(this, BundleMap);

    _this = _super.call(this, props);
    _this.state = {
      projection: 'EPSG:3857',
      projection_display: 'EPSG:4326',
      bundle: props.bundle,
      map_wms_list: [],
      is_sidebar_open: true,
      coordinate_clicked: null,
      vector_layer: null
    };
    _this.controls = {
      coordinateCopy: new _controls_CoordinateCopy__WEBPACK_IMPORTED_MODULE_16__["CoordinateCopy"](),
      modal: new _controls_Modal__WEBPACK_IMPORTED_MODULE_17__["Modal"](),
      sidebar: new _Sidebar__WEBPACK_IMPORTED_MODULE_21__["Sidebar"]()
    };
    _this.marker = _this.initMarker();
    _this.handleToggle = _this.handleToggle.bind(_assertThisInitialized(_this));
    _this.handleMapDataLoaded = _this.handleMapDataLoaded.bind(_assertThisInitialized(_this));
    _this.handleMapClick = _this.handleMapClick.bind(_assertThisInitialized(_this));
    _this.handleSetCenter = _this.handleSetCenter.bind(_assertThisInitialized(_this));
    _this.toggleSidebar = _this.toggleSidebar.bind(_assertThisInitialized(_this));
    _this.loadMapData = _this.loadMapData.bind(_assertThisInitialized(_this));
    _this.showFeaturesAt = _this.showFeaturesAt.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(BundleMap, [{
    key: "initMarker",
    value: function initMarker() {
      var style = new ol_style__WEBPACK_IMPORTED_MODULE_8__["Style"]({
        image: new ol_style__WEBPACK_IMPORTED_MODULE_8__["Icon"]({
          anchor: [0.5, 86],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          scale: 0.4,
          src: '/static/assets/images/bundle/marker.png'
        })
      });
      var point = new ol_geom__WEBPACK_IMPORTED_MODULE_9__["Point"]([0, 0]);
      var feature = new ol__WEBPACK_IMPORTED_MODULE_2__["Feature"]({
        geometry: point
      });
      feature.setStyle(style);
      return {
        feature: feature,
        point: point
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadMapData(this.state.bundle.id);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevState.coordinate_clicked !== this.state.coordinate_clicked) {
        this.controls.coordinateCopy.setCoordinate(this.state.coordinate_clicked);
      }

      if (this.props.bundle.id === prevProps.bundle.id) return;
      var bundle = this.props.bundle;
      this.setState({
        bundle: bundle
      });
      this.loadMapData(bundle.id);
    }
  }, {
    key: "loadMapData",
    value: function loadMapData(bundle_id) {
      var _this2 = this;

      Promise.all([_service__WEBPACK_IMPORTED_MODULE_19__["service"].loadBaseLayers(), _service__WEBPACK_IMPORTED_MODULE_19__["service"].loadWMSLayers(bundle_id)]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            base_layer_list = _ref2[0].base_layer_list,
            wms_list = _ref2[1].wms_list;

        _this2.handleMapDataLoaded(base_layer_list, wms_list);
      });
    }
  }, {
    key: "handleMapDataLoaded",
    value: function handleMapDataLoaded(base_layer_list, wms_list) {
      var _this3 = this;

      var map_wms_list = wms_list.map(function (_ref3) {
        var name = _ref3.name,
            url = _ref3.url,
            layers = _ref3.layers;
        return {
          name: name,
          layers: layers.map(function (layer) {
            return _objectSpread(_objectSpread({}, layer), {}, {
              tile: new ol_layer_Tile__WEBPACK_IMPORTED_MODULE_5__["default"]({
                source: new ol_source_TileWMS__WEBPACK_IMPORTED_MODULE_11__["default"]({
                  projection: _this3.state.projection,
                  url: url,
                  params: {
                    'LAYERS': layer.code,
                    //'FORMAT': 'image/svg+xml',
                    'FORMAT': 'image/png'
                  }
                })
              })
            });
          })
        };
      });
      this.setState({
        map_wms_list: map_wms_list
      });

      var _base_layer_list$redu = base_layer_list.reduce(function (acc, base_layer_info, idx) {
        var layer;

        if (base_layer_info.tilename == "xyz") {
          layer = new ol_layer_Tile__WEBPACK_IMPORTED_MODULE_5__["default"]({
            source: new ol_source_TileImage__WEBPACK_IMPORTED_MODULE_10__["default"]({
              crossOrigin: 'Anonymous',
              url: base_layer_info.url
            })
          });
        }

        if (base_layer_info.tilename == "wms") {
          layer = new ol_layer_Tile__WEBPACK_IMPORTED_MODULE_5__["default"]({
            source: new ol_source_TileWMS__WEBPACK_IMPORTED_MODULE_11__["default"]({
              url: base_layer_info.url,
              params: {
                'LAYERS': base_layer_info.layers,
                'FORMAT': 'image/png'
              }
            })
          });
        }

        acc.base_layers.push(layer);
        acc.base_layer_controls.push({
          is_active: idx == 0,
          thumbnail_1x: base_layer_info.thumbnail_1x,
          thumbnail_2x: base_layer_info.thumbnail_2x,
          layer: layer
        });
        return acc;
      }, {
        base_layers: [],
        base_layer_controls: []
      }),
          base_layers = _base_layer_list$redu.base_layers,
          base_layer_controls = _base_layer_list$redu.base_layer_controls;

      var vector_layer = new ol_layer__WEBPACK_IMPORTED_MODULE_6__["Vector"]({
        source: new ol_source__WEBPACK_IMPORTED_MODULE_7__["Vector"](),
        style: new ol_style__WEBPACK_IMPORTED_MODULE_8__["Style"]({
          stroke: new ol_style__WEBPACK_IMPORTED_MODULE_8__["Stroke"]({
            color: 'rgba(100, 255, 0, 1)',
            width: 2
          }),
          fill: new ol_style__WEBPACK_IMPORTED_MODULE_8__["Fill"]({
            color: 'rgba(100, 255, 0, 0.3)'
          })
        })
      });
      this.setState({
        vector_layer: vector_layer
      });
      var marker_layer = new ol_layer__WEBPACK_IMPORTED_MODULE_6__["Vector"]({
        source: new ol_source__WEBPACK_IMPORTED_MODULE_7__["Vector"]({
          features: [this.marker.feature]
        })
      });
      var map = new ol__WEBPACK_IMPORTED_MODULE_2__["Map"]({
        target: 'map',
        controls: Object(ol_control__WEBPACK_IMPORTED_MODULE_14__["defaults"])().extend([new ol_control__WEBPACK_IMPORTED_MODULE_14__["FullScreen"](), new ol_control__WEBPACK_IMPORTED_MODULE_14__["MousePosition"]({
          projection: this.state.projection_display,
          coordinateFormat: function coordinateFormat(coord) {
            return Object(ol_coordinate__WEBPACK_IMPORTED_MODULE_13__["format"])(coord, '{y},{x}', 6);
          },
          undefinedHTML: ''
        }), new _controls___WEBPACK_IMPORTED_MODULE_15__["СуурьДавхарга"]({
          layers: base_layer_controls
        }), new _SidebarButton__WEBPACK_IMPORTED_MODULE_20__["SidebarButton"]({
          toggleSidebar: this.toggleSidebar
        }), new ol_control__WEBPACK_IMPORTED_MODULE_14__["ScaleLine"](), this.controls.modal, this.controls.coordinateCopy, this.controls.sidebar]),
        layers: [].concat(_toConsumableArray(base_layers), _toConsumableArray(map_wms_list.reduce(function (acc_main, wms) {
          var tiles = wms.layers.map(function (layer) {
            return layer.tile;
          });
          return [].concat(_toConsumableArray(acc_main), _toConsumableArray(tiles));
        }, [])), [vector_layer, marker_layer]),
        view: new ol__WEBPACK_IMPORTED_MODULE_2__["View"]({
          projection: this.state.projection,
          center: [11461613.630815497, 5878656.0228370065],
          zoom: 5.041301562246971
        })
      });
      map.on('click', this.handleMapClick);
      this.map = map;
    }
  }, {
    key: "handleMapClick",
    value: function handleMapClick(event) {
      this.marker.point.setCoordinates(event.coordinate);
      var projection = event.map.getView().getProjection();
      var map_coord = Object(ol_proj__WEBPACK_IMPORTED_MODULE_3__["transform"])(event.coordinate, projection, this.state.projection_display);

      var coordinate_clicked = Object(ol_coordinate__WEBPACK_IMPORTED_MODULE_13__["format"])(map_coord, '{y},{x}', 6);

      this.setState({
        coordinate_clicked: coordinate_clicked
      });
      this.showFeaturesAt(event.coordinate);
    }
  }, {
    key: "showFeaturesAt",
    value: function showFeaturesAt(coordinate) {
      var _this4 = this;

      var view = this.map.getView();
      var projection = view.getProjection();
      var resolution = view.getResolution();
      this.state.map_wms_list.forEach(function (_ref4) {
        var layers = _ref4.layers;
        layers.forEach(function (_ref5) {
          var tile = _ref5.tile;
          var wms_source = tile.getSource();
          var url = wms_source.getFeatureInfoUrl(coordinate, resolution, projection, {
            //'INFO_FORMAT': 'text/xml'
            //'INFO_FORMAT': 'text/html'
            'INFO_FORMAT': 'application/vnd.ogc.gml'
          });

          if (url) {
            _this4.controls.modal.showModal(null, false);

            fetch(url).then(function (response) {
              return response.text();
            }).then(function (text) {
              var parser = new ol_format_WMSGetFeatureInfo__WEBPACK_IMPORTED_MODULE_4__["default"]();
              var features = parser.readFeatures(text);
              var source = new ol_source__WEBPACK_IMPORTED_MODULE_7__["Vector"]({
                features: features
              });

              _this4.state.vector_layer.setSource(source);

              var feature_info = features.map(function (feature) {
                var geometry_name = feature.getGeometryName();
                var values = feature.getKeys().filter(function (key) {
                  return key != geometry_name;
                }).map(function (key) {
                  return [key, feature.get(key)];
                });
                return [feature.getId(), values];
              });

              _this4.controls.modal.showModal(feature_info, true);
            });
          } else {
            /* TODO */
            console.log('no feature url', wms_source);
          }
        });
      });
    }
  }, {
    key: "handleToggle",
    value: function handleToggle(idx) {
      var layer = this.state.layers[idx];
      layer.setVisible(!layer.getVisible());
    }
  }, {
    key: "handleSetCenter",
    value: function handleSetCenter(coord) {
      var view = this.map.getView();
      var map_projection = view.getProjection();
      var map_coord = Object(ol_proj__WEBPACK_IMPORTED_MODULE_3__["transform"])(coord, this.state.projection_display, map_projection);
      this.marker.point.setCoordinates(map_coord);
      view.setCenter(map_coord);
    }
  }, {
    key: "toggleSidebar",
    value: function toggleSidebar(event) {
      this.setState(function (prevState) {
        return {
          is_sidebar_open: !prevState.is_sidebar_open
        };
      });

      if (this.state.is_sidebar_open) {
        this.controls.sidebar.showSideBar(null, null, true);
      } else {
        this.controls.sidebar.showSideBar(this.state.map_wms_list, this.handleSetCenter, false);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-md-12"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "\uD83C\uDF0D"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "map"
      })))));
    }
  }]);

  return BundleMap;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);



/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/Sidebar.jsx":
/*!***************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/Sidebar.jsx ***!
  \***************************************************************/
/*! exports provided: Sidebar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sidebar", function() { return Sidebar; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers */ "./frontend/bundle/src/helpers.js");
/* harmony import */ var _WMSItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WMSItem */ "./frontend/bundle/src/components/DetailPage/WMSItem.jsx");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
/* harmony import */ var ol_css_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ol/css.js */ "./node_modules/ol/css.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }








var SidebarComponent = /*#__PURE__*/function (_Component) {
  _inherits(SidebarComponent, _Component);

  var _super = _createSuper(SidebarComponent);

  function SidebarComponent(props) {
    var _this;

    _classCallCheck(this, SidebarComponent);

    _this = _super.call(this, props);
    _this.state = {
      coordinate: ''
    };
    _this.handleSubmitCoordinate = _this.handleSubmitCoordinate.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SidebarComponent, [{
    key: "handleSubmitCoordinate",
    value: function handleSubmitCoordinate(event) {
      event.preventDefault();
      var coord = _helpers__WEBPACK_IMPORTED_MODULE_1__["helpers"].parseCoordinateString(this.state.coordinate);
      this.props.handleSetCenter(coord);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "font-weight-bold",
        htmlFor: "formGroupInput"
      }, "\u041D\u044D\u0440\u044D\u043B\u0431\u044D\u0440\u044D\u044D\u0440 \u0445\u0430\u0439\u0445"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group mb-3"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        className: "form-control",
        placeholder: "\u0445\u0430\u0439\u0445 \u0443\u0442\u0433\u0430",
        "aria-label": "",
        "aria-describedby": ""
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group-append"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn gp-outline-primary",
        type: "button"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fa fa-search mr-1",
        "aria-hidden": "true"
      }), "\u0425\u0430\u0439\u0445")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        onSubmit: this.handleSubmitCoordinate
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "font-weight-bold",
        htmlFor: "formGroupInput"
      }, "\u0411\u0430\u0439\u0440\u043B\u0430\u043B\u0430\u0430\u0440 \u0445\u0430\u0439\u0445"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group mb-3"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        className: "form-control",
        placeholder: "\u04E9\u0440\u0433\u04E9\u0440\u04E9\u0433, \u0443\u0440\u0442\u0440\u0430\u0433",
        name: "coordinate",
        onChange: function onChange(e) {
          return _this2.setState({
            coordinate: e.target.value
          });
        },
        value: this.state.coordinate
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group-append"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn gp-outline-primary",
        type: "submit"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fa fa-search mr-1"
      }), "\u0425\u0430\u0439\u0445"))))), this.props.map_wms_list.map(function (wms, idx) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_WMSItem__WEBPACK_IMPORTED_MODULE_2__["default"], {
          wms: wms,
          key: idx
        });
      }));
    }
  }]);

  return SidebarComponent;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

var Sidebar = /*#__PURE__*/function (_Control) {
  _inherits(Sidebar, _Control);

  var _super2 = _createSuper(Sidebar);

  function Sidebar(opt_options) {
    var _this3;

    _classCallCheck(this, Sidebar);

    var options = opt_options || {};
    _this3 = _super2.call(this, {
      element: document.createElement('div'),
      target: options.target
    });
    _this3.is_component_initialized = false;
    var cssClasses = "col-md-2 \u2699  ".concat(ol_css_js__WEBPACK_IMPORTED_MODULE_5__["CLASS_HIDDEN"]);
    _this3.element.className = cssClasses;
    _this3.renderComponent = _this3.renderComponent.bind(_assertThisInitialized(_this3));
    _this3.toggleControl = _this3.toggleControl.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(Sidebar, [{
    key: "toggleControl",
    value: function toggleControl(is_visible) {
      this.element.classList.toggle(ol_css_js__WEBPACK_IMPORTED_MODULE_5__["CLASS_HIDDEN"], is_visible);
    }
  }, {
    key: "renderComponent",
    value: function renderComponent(props) {
      if (!this.is_component_initialized) {
        react_dom__WEBPACK_IMPORTED_MODULE_3___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SidebarComponent, props), this.element);
        this.is_component_initialized = true;
      }

      react_dom__WEBPACK_IMPORTED_MODULE_3___default.a.hydrate( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SidebarComponent, props), this.element);
    }
  }, {
    key: "showSideBar",
    value: function showSideBar(map_wms_list, handleSetCenter, islaod) {
      this.toggleControl(islaod);
      this.renderComponent({
        map_wms_list: map_wms_list,
        handleSetCenter: handleSetCenter
      });
    }
  }]);

  return Sidebar;
}(ol_control__WEBPACK_IMPORTED_MODULE_4__["Control"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/SidebarButton.jsx":
/*!*********************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/SidebarButton.jsx ***!
  \*********************************************************************/
/*! exports provided: SidebarButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SidebarButton", function() { return SidebarButton; });
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


var SidebarButton = /*#__PURE__*/function (_Control) {
  _inherits(SidebarButton, _Control);

  var _super = _createSuper(SidebarButton);

  function SidebarButton(opt_options) {
    var _this;

    _classCallCheck(this, SidebarButton);

    var options = opt_options || {};
    _this = _super.call(this, {
      element: document.createElement('div'),
      target: options.target
    });
    var cssClasses = '⚙-toggle';
    var element = _this.element;
    element.className = cssClasses;
    var elementa = document.createElement('a');
    elementa.setAttribute('href', '#');
    var elementi = document.createElement('i');
    elementi.setAttribute('aria-hidden', 'true');
    elementi.className = 'fa fa-bars fa-lg';
    elementa.appendChild(elementi);
    element.addEventListener('click', function (event) {
      event.preventDefault();
      options.toggleSidebar();
    });
    element.appendChild(elementa);
    return _this;
  }

  return SidebarButton;
}(ol_control__WEBPACK_IMPORTED_MODULE_0__["Control"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/WMSItem.jsx":
/*!***************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/WMSItem.jsx ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WMSItem; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _WMSLayerItems__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WMSLayerItems */ "./frontend/bundle/src/components/DetailPage/WMSLayerItems.jsx");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var WMSItem = /*#__PURE__*/function (_Component) {
  _inherits(WMSItem, _Component);

  var _super = _createSuper(WMSItem);

  function WMSItem(props) {
    var _this;

    _classCallCheck(this, WMSItem);

    _this = _super.call(this, props);
    _this.state = {
      name: props.wms.name,
      tiles: props.wms.tiles,
      layers: props.wms.layers,
      is_visible: true
    };
    _this.toggle = _this.toggle.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(WMSItem, [{
    key: "toggle",
    value: function toggle(e) {
      var is_visible = e.target.checked;
      this.setState({
        is_visible: is_visible
      });
      this.state.tile.setVisible(is_visible);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          tiles = _this$state.tiles,
          name = _this$state.name,
          layers = _this$state.layers,
          is_visible = _this$state.is_visible;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
        className: "my-1"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        className: "font-weight-bold",
        type: "checkbox",
        onChange: this.toggle,
        checked: is_visible
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "font-weight-bold",
        htmlFor: "formGroupInput"
      }, "\xA0", name)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_WMSLayerItems__WEBPACK_IMPORTED_MODULE_1__["default"], {
        layers: layers,
        tileWMS: tiles
      }));
    }
  }]);

  return WMSItem;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);



/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/WMSLayerItem.jsx":
/*!********************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/WMSLayerItem.jsx ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WMSLayerItem; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var WMSLayerItem = /*#__PURE__*/function (_Component) {
  _inherits(WMSLayerItem, _Component);

  var _super = _createSuper(WMSLayerItem);

  function WMSLayerItem(props) {
    var _this;

    _classCallCheck(this, WMSLayerItem);

    _this = _super.call(this, props);
    _this.state = {
      name: props.layer.name,
      code: props.layer.code,
      tile: props.layer.tile,
      is_visible: props.layer.defaultCheck,
      legendURL: props.layer.legendURL
    };
    _this.toggle = _this.toggle.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(WMSLayerItem, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.state.tile.setVisible(this.props.layer.defaultCheck);
    }
  }, {
    key: "toggle",
    value: function toggle(is_visible) {
      this.state.tile.setVisible(is_visible);
      this.setState({
        is_visible: is_visible
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          name = _this$state.name,
          code = _this$state.code,
          is_visible = _this$state.is_visible,
          legendURL = _this$state.legendURL;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "checkbox",
        onChange: function onChange(e) {
          return _this2.toggle(e.target.checked);
        },
        checked: is_visible
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", null, " ", name)), legendURL != "null" && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        className: "img",
        src: legendURL
      }))));
    }
  }]);

  return WMSLayerItem;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);



/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/WMSLayerItems.jsx":
/*!*********************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/WMSLayerItems.jsx ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WMSLayerItems; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _WMSLayerItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WMSLayerItem */ "./frontend/bundle/src/components/DetailPage/WMSLayerItem.jsx");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var WMSLayerItems = /*#__PURE__*/function (_Component) {
  _inherits(WMSLayerItems, _Component);

  var _super = _createSuper(WMSLayerItems);

  function WMSLayerItems(props) {
    var _this;

    _classCallCheck(this, WMSLayerItems);

    _this = _super.call(this, props);
    _this.state = {
      layers: props.layers
    };
    return _this;
  }

  _createClass(WMSLayerItems, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        style: {
          listStyle: 'none'
        }
      }, this.state.layers.map(function (layer, idx) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_WMSLayerItem__WEBPACK_IMPORTED_MODULE_1__["default"], {
          layer: layer,
          key: idx
        });
      }));
    }
  }]);

  return WMSLayerItems;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);



/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/controls/CoordinateCopy.jsx":
/*!*******************************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/controls/CoordinateCopy.jsx ***!
  \*******************************************************************************/
/*! exports provided: CoordinateCopy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoordinateCopy", function() { return CoordinateCopy; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
/* harmony import */ var ol_css_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/css.js */ "./node_modules/ol/css.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }






var CopyInput = /*#__PURE__*/function (_Component) {
  _inherits(CopyInput, _Component);

  var _super = _createSuper(CopyInput);

  function CopyInput(props) {
    var _this;

    _classCallCheck(this, CopyInput);

    _this = _super.call(this, props);
    _this.handleCoordinateSet = _this.handleCoordinateSet.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(CopyInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleCoordinateSet();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      this.handleCoordinateSet();
    }
  }, {
    key: "handleCoordinateSet",
    value: function handleCoordinateSet() {
      var input = react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.findDOMNode(this);
      input.focus();
      input.select();
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        className: "form-control",
        onChange: function onChange() {},
        onBlur: this.props.handleBlur,
        value: this.props.coordinate
      });
    }
  }]);

  return CopyInput;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

var CoordinateCopy = /*#__PURE__*/function (_Control) {
  _inherits(CoordinateCopy, _Control);

  var _super2 = _createSuper(CoordinateCopy);

  function CoordinateCopy(opt_options) {
    var _this2;

    _classCallCheck(this, CoordinateCopy);

    var options = opt_options || {};
    _this2 = _super2.call(this, {
      element: document.createElement('div'),
      target: options.target
    });
    _this2.is_component_initialized = false;
    var cssClasses = "coordinate-copy-control ".concat(ol_css_js__WEBPACK_IMPORTED_MODULE_3__["CLASS_CONTROL"], " ").concat(ol_css_js__WEBPACK_IMPORTED_MODULE_3__["CLASS_HIDDEN"]);
    _this2.element.className = cssClasses;
    _this2.renderComponent = _this2.renderComponent.bind(_assertThisInitialized(_this2));
    _this2.toggleControl = _this2.toggleControl.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(CoordinateCopy, [{
    key: "toggleControl",
    value: function toggleControl(is_visible) {
      this.element.classList.toggle(ol_css_js__WEBPACK_IMPORTED_MODULE_3__["CLASS_HIDDEN"], !is_visible);
    }
  }, {
    key: "renderComponent",
    value: function renderComponent(props) {
      var _this3 = this;

      props.handleBlur = function () {
        return _this3.toggleControl(false);
      };

      if (!this.is_component_initialized) {
        react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CopyInput, props), this.element);
        this.is_component_initialized = true;
      }

      react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.hydrate( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CopyInput, props), this.element);
    }
  }, {
    key: "setCoordinate",
    value: function setCoordinate(coordinate) {
      this.renderComponent({
        coordinate: coordinate
      });
      this.toggleControl(true);
    }
  }]);

  return CoordinateCopy;
}(ol_control__WEBPACK_IMPORTED_MODULE_2__["Control"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/controls/Modal.jsx":
/*!**********************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/controls/Modal.jsx ***!
  \**********************************************************************/
/*! exports provided: Modal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Modal", function() { return Modal; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
/* harmony import */ var _service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../service */ "./frontend/bundle/src/components/DetailPage/service.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }






var ModalComponent = /*#__PURE__*/function (_Component) {
  _inherits(ModalComponent, _Component);

  var _super = _createSuper(ModalComponent);

  function ModalComponent(props) {
    var _this;

    _classCallCheck(this, ModalComponent);

    _this = _super.call(this, props);
    _this.state = {
      price: 3000,
      description: 'Газрын бүрхэвч, газар ашиглалт',
      payload: false,
      data_id: 2
    };
    return _this;
  }

  _createClass(ModalComponent, [{
    key: "handlePayment",
    value: function handlePayment() {
      this.setState({
        payload: true
      });
      var _this$state = this.state,
          price = _this$state.price,
          description = _this$state.description,
          data_id = _this$state.data_id;
      _service__WEBPACK_IMPORTED_MODULE_3__["service"].payment(price, description, data_id).then(function (_ref) {
        var payment_id = _ref.payment_id;

        if (payment_id) {
          setTimeout(function () {
            window.location.href = "/payment/purchase/".concat(payment_id, "/");
          }, 1000);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          content = _this$props.content,
          is_complete = _this$props.is_complete;
      var payload = this.state.payload;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-dialog modal-dialog-scrollable",
        style: {
          zIndex: "5"
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-content"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-header",
        onClick: this.props.handleClose
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", {
        className: "modal-title"
      }, "\u0414\u044D\u043B\u0433\u044D\u0440\u044D\u043D\u0433\u04AF\u0439 \u043C\u044D\u0434\u044D\u044D\u043B\u044D\u043B"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "close",
        "data-dismiss": "modal",
        "aria-label": "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        "aria-hidden": "true"
      }, "\xD7"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-body"
      }, !is_complete && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, "\u0422\u04AF\u0440 \u0445\u04AF\u043B\u044D\u044D\u043D\u044D \u04AF\u04AF..."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "spinner-border ml-auto",
        role: "status",
        "aria-hidden": "true"
      })), is_complete && content.map(function (_ref2, idx) {
        var _ref3 = _slicedToArray(_ref2, 2),
            layer_name = _ref3[0],
            values = _ref3[1];

        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: idx
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", null, layer_name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
          className: "table"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, values.map(function (_ref4, val_idx) {
          var _ref5 = _slicedToArray(_ref4, 2),
              field = _ref5[0],
              value = _ref5[1];

          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
            key: val_idx
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, field), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, value));
        }))));
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-footer"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        onClick: this.props.handleClose,
        className: "btn btn-secondary",
        "data-dismiss": "modal"
      }, "\u0411\u0443\u0446\u0430\u0445"), payload ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-secondary",
        "data-dismiss": "modal"
      }, "\u0410\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0431\u0430\u0439\u043D\u0430...", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        "class": "spinner-border text-light",
        role: "status"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        "class": "sr-only"
      }, "Loading..."))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        onClick: function onClick() {
          return _this2.handlePayment();
        },
        className: "btn btn-secondary",
        "data-dismiss": "modal"
      }, "\u0425\u0443\u0434\u0430\u043B\u0434\u0430\u0436 \u0430\u0432\u0430\u0445"))));
    }
  }]);

  return ModalComponent;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

var Modal = /*#__PURE__*/function (_Control) {
  _inherits(Modal, _Control);

  var _super2 = _createSuper(Modal);

  function Modal(opt_options) {
    var _this3;

    _classCallCheck(this, Modal);

    var options = opt_options || {};
    _this3 = _super2.call(this, {
      element: document.createElement('div'),
      target: options.target
    });
    _this3.is_component_initialized = false;
    _this3.element.className = 'modal fade show';
    _this3.renderComponent = _this3.renderComponent.bind(_assertThisInitialized(_this3));
    _this3.toggleControl = _this3.toggleControl.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(Modal, [{
    key: "toggleControl",
    value: function toggleControl(is_visible) {
      this.element.classList.toggle('d-block', is_visible);
    }
  }, {
    key: "renderComponent",
    value: function renderComponent(props) {
      var _this4 = this;

      props.handleClose = function () {
        return _this4.toggleControl(false);
      };

      if (!this.is_component_initialized) {
        react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ModalComponent, props), this.element);
        this.is_component_initialized = true;
      }

      react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.hydrate( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ModalComponent, props), this.element);
    }
  }, {
    key: "showModal",
    value: function showModal(content, is_complete) {
      this.toggleControl(true);
      this.renderComponent({
        content: content,
        is_complete: is_complete
      });
    }
  }]);

  return Modal;
}(ol_control__WEBPACK_IMPORTED_MODULE_2__["Control"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/controls/СуурьДавхарга.jsx":
/*!******************************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/controls/СуурьДавхарга.jsx ***!
  \******************************************************************************/
/*! exports provided: СуурьДавхарга */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "СуурьДавхарга", function() { return СуурьДавхарга; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
/* harmony import */ var ol_css_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/css.js */ "./node_modules/ol/css.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var CLASS_ACTIVE = 'active';
var СуурьДавхарга = /*#__PURE__*/function (_Control) {
  _inherits(СуурьДавхарга, _Control);

  var _super = _createSuper(СуурьДавхарга);

  function СуурьДавхарга(opt_options) {
    var _this;

    _classCallCheck(this, СуурьДавхарга);

    var options = opt_options || {};
    _this = _super.call(this, {
      element: document.createElement('div'),
      target: options.target
    });
    _this.toggleLayer = _this.toggleLayer.bind(_assertThisInitialized(_this));
    _this.initLayer = _this.initLayer.bind(_assertThisInitialized(_this));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    _this.last_active = null;
    var base_layers = options.layers.map(_this.initLayer);
    var cssClasses = "\u0441\u0443\u0443\u0440\u044C-\u0434\u0430\u0432\u0445\u0430\u0440\u0433\u0443\u0443\u0434 ".concat(ol_css_js__WEBPACK_IMPORTED_MODULE_2__["CLASS_UNSELECTABLE"], " ").concat(ol_css_js__WEBPACK_IMPORTED_MODULE_2__["CLASS_CONTROL"]);
    var element = _this.element;
    element.className = cssClasses;
    base_layers.forEach(function (l) {
      return element.appendChild(l);
    });
    return _this;
  }

  _createClass(СуурьДавхарга, [{
    key: "initLayer",
    value: function initLayer(_ref) {
      var _this2 = this;

      var thumbnail_1x = _ref.thumbnail_1x,
          thumbnail_2x = _ref.thumbnail_2x,
          layer = _ref.layer,
          is_active = _ref.is_active;
      var el = document.createElement('a');
      el.setAttribute('href', '#');
      el.className = 'суурь-давхарга' + (is_active ? ' ' + CLASS_ACTIVE : '');
      var img = document.createElement('img');
      img.srcset = "".concat(thumbnail_1x, " 1x, ").concat(thumbnail_2x, " 2x");
      el.appendChild(img);
      el.addEventListener('click', function (event) {
        event.preventDefault();

        _this2.handleClick(el, layer);
      });
      this.toggleLayer(is_active === true, el, layer);
      return el;
    }
  }, {
    key: "toggleLayer",
    value: function toggleLayer(is_active, el, layer) {
      if (this.last_active && is_active) {
        this.last_active.layer.setVisible(false);
        this.last_active.el.classList.toggle(CLASS_ACTIVE, false);
      }

      layer.setVisible(is_active);
      el.classList.toggle(CLASS_ACTIVE, is_active);
      if (is_active) this.last_active = {
        el: el,
        layer: layer
      };
    }
  }, {
    key: "handleClick",
    value: function handleClick(el, layer) {
      if (this.last_active && this.last_active.el === el) return;
      this.toggleLayer(true, el, layer);
    }
  }]);

  return СуурьДавхарга;
}(ol_control__WEBPACK_IMPORTED_MODULE_1__["Control"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/index.jsx":
/*!*************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/index.jsx ***!
  \*************************************************************/
/*! exports provided: DetailPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DetailPage", function() { return DetailPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./service */ "./frontend/bundle/src/components/DetailPage/service.js");
/* harmony import */ var _BundleMap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BundleMap */ "./frontend/bundle/src/components/DetailPage/BundleMap.jsx");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var DetailPage = /*#__PURE__*/function (_Component) {
  _inherits(DetailPage, _Component);

  var _super = _createSuper(DetailPage);

  function DetailPage(props) {
    var _this;

    _classCallCheck(this, DetailPage);

    _this = _super.call(this, props);
    _this.state = {
      bundle: props.bundle
    };
    return _this;
  }

  _createClass(DetailPage, [{
    key: "handleSelectBundle",
    value: function handleSelectBundle(e, bundle) {
      e.preventDefault();
      this.setState({
        bundle: bundle
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_BundleMap__WEBPACK_IMPORTED_MODULE_2__["default"], {
        bundle: this.state.bundle
      });
    }
  }]);

  return DetailPage;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/service.js":
/*!**************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/service.js ***!
  \**************************************************************/
/*! exports provided: service */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "service", function() { return service; });
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var service = {
  loadWMSLayers: loadWMSLayers,
  loadBaseLayers: loadBaseLayers,
  payment: payment
};

function getCookie(name) {
  var cookieValue = null;

  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim(); // Does this cookie string begin with the name we want?

      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}

function handleResponse(response) {
  return response.text().then(function (text) {
    var data = text && JSON.parse(text);

    if (!response.ok) {
      if ([401, 403].indexOf(response.status) !== -1) {
        // TODO auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        location.reload(true);
      }

      var error = data && data.message || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function _getGetOptions() {
  return {
    method: 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  };
}

function _getPostOptions() {
  return {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken': getCookie('csrftoken')
    }
  };
}

function loadWMSLayers(id) {
  var requestOptions = _objectSpread({}, _getGetOptions());

  return fetch("/\u0434\u044D\u0434-\u0441\u0430\u043D/".concat(id, "/\u0434\u0430\u0432\u0445\u0430\u0440\u0433\u0443\u0443\u0434/"), requestOptions).then(handleResponse);
}

function loadBaseLayers() {
  var requestOptions = _objectSpread({}, _getGetOptions());

  return fetch('/суурь-давхарга/', requestOptions).then(handleResponse);
}

function payment(price, description, data_id) {
  var requestOptions = _objectSpread(_objectSpread({}, _getPostOptions()), {}, {
    body: JSON.stringify({
      price: price,
      description: description,
      data_id: data_id
    })
  });

  return fetch('/back/payment/purchase/', requestOptions).then(handleResponse);
}

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/styles.css":
/*!**************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/styles.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../../../../node_modules/css-loader/dist/cjs.js!./styles.css */ "./node_modules/css-loader/dist/cjs.js!./frontend/bundle/src/components/DetailPage/styles.css");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./frontend/bundle/src/helpers.js":
/*!****************************************!*\
  !*** ./frontend/bundle/src/helpers.js ***!
  \****************************************/
/*! exports provided: helpers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "helpers", function() { return helpers; });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _wrapRegExp(re, groups) { _wrapRegExp = function _wrapRegExp(re, groups) { return new BabelRegExp(re, undefined, groups); }; var _RegExp = _wrapNativeSuper(RegExp); var _super = RegExp.prototype; var _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = _RegExp.call(this, re, flags); _groups.set(_this, groups || _groups.get(re)); return _this; } _inherits(BabelRegExp, _RegExp); BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) result.groups = buildGroups(result, this); return result; }; BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if (typeof substitution === "string") { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { return "$" + groups[name]; })); } else if (typeof substitution === "function") { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = []; args.push.apply(args, arguments); if (_typeof(args[args.length - 1]) !== "object") { args.push(buildGroups(args, _this)); } return substitution.apply(this, args); }); } else { return _super[Symbol.replace].call(this, str, substitution); } }; function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { groups[name] = result[g[name]]; return groups; }, Object.create(null)); } return _wrapRegExp.apply(this, arguments); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var helpers = {
  parseCoordinateString: parseCoordinateString
};

function parseCoordinateString(coordinate_string) {
  var result = /*#__PURE__*/_wrapRegExp(/^(\x2D?[0-9]+(\.[0-9]+)?)[ ,](\x2D?[0-9]+(\.[0-9]+)?)$/, {
    latitude: 1,
    longitude: 3
  }).exec(coordinate_string);

  var lat = 0,
      lon = 0;

  if (result) {
    lat = parseFloat(result.groups.latitude);
    lon = parseFloat(result.groups.longitude);
  } // According to OpenLayers the format is [x, y] or [longitude, latitude]


  return [lon, lat];
}

/***/ }),

/***/ "./frontend/bundle/src/index.js":
/*!**************************************!*\
  !*** ./frontend/bundle/src/index.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/App */ "./frontend/bundle/src/components/App.jsx");



var bundle = JSON.parse(document.getElementById('bundle-app-data').innerHTML);
Object(react_dom__WEBPACK_IMPORTED_MODULE_1__["render"])( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_App__WEBPACK_IMPORTED_MODULE_2__["App"], {
  bundle: bundle
}), document.getElementById('bundle-app'));

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./frontend/bundle/src/components/DetailPage/styles.css":
/*!****************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./frontend/bundle/src/components/DetailPage/styles.css ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "element.style {\n    position: relative;\n}\n.🌍 {\n    position: relative;\n}\n\n.🌍 > #map{\n    width: 100%;\n    height: calc(100% - 37px - 96px - 33.5px - 0px);\n    position: fixed;\n }\n\n.⚙ {\n    position: absolute;\n    top: 1%;\n    right: 70px;\n    bottom: 150px;\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n    overflow-y: auto;\n    background-color: white;\n    -webkit-box-shadow: 0px 0px 21px 7px rgba(0,0,0,0.65);\n    -moz-box-shadow: 0px 0px 21px 7px rgba(0,0,0,0.65);\n    box-shadow: 0px 0px 21px 7px rgba(0,0,0,0.65);\n    opacity: 1;\n\n\n}\n.⚙.ol-hidden {\n    opacity: 0;\n    visibility: hidden;\n    transition: opacity .1s linear, visibility 0s linear .1s;\n}\n\n.⚙-toggle{\n    position: absolute;\n    top: 7px;\n    right: 12px;\n    width: 50px;\n    height: 50px;\n    background-color: rgba(0,60,136,0.5);\n    border-radius: 4px;\n    padding: 2px;\n}\n.⚙-toggle:hover{\n    background-color: rgba(0,60,136,0.7);\n}\n.⚙-toggle:focus{\n    background-color: rgba(0,60,136,0.7);\n\n}\n\n\n.⚙-toggle a{\n    position: absolute;\n    top: -6px;\n    right: -7px;\n    width: 50px;\n    height: 50px;\n\n}\n.fa-lg{\n    font-size: 40px;\n    color: white;\n    line-height: unset;\n}\n.суурь-давхаргууд{\n    right: .5rem;\n    bottom: 70px;\n    position: fixed;\n}\n.суурь-давхаргууд > .суурь-давхарга{\n    display: block;\n    width: 8rem;\n    height: 4.5rem;\n    overflow: hidden;\n    margin: 1px;\n    border-radius: 2px;\n    float: right;\n    transition: opacity .15s ease-out;\n}\n.суурь-давхаргууд > .суурь-давхарга.active,\n.суурь-давхаргууд:hover > .суурь-давхарга.active:hover,\n.суурь-давхаргууд > .суурь-давхарга:hover {\n    opacity: 1;\n}\n.суурь-давхаргууд > .суурь-давхарга,\n.суурь-давхаргууд:hover > .суурь-давхарга.active {\n    opacity: .7;\n}\n\n\n.ol-full-screen {\n    right: .5rem;\n    top: 58px;\n    width: 57px;\n    height: 57px;\n\n}\n.ol-full-screen .ol-full-screen-false{\n    width: 50px;\n    height: 50px;\n    font-size: 40px;\n\n}\n.ol-full-screen .ol-full-screen-true{\n    width: 50px;\n    height: 50px;\n    font-size: 40px;\n\n}\n.ol-zoom {\n    width: 57px;\n    height: 107px;\n    left: unset;\n    right: .5rem;\n    top: 110px;\n}\n.ol-zoom  .ol-zoom-out{\n    width: 50px;\n    height: 50px;\n    font-size: 55px;\n\n}\n.ol-zoom .ol-zoom-in{\n    width: 50px;\n    height: 50px;\n    font-size: 55px;\n}\n\n.ol-mouse-position {\n    right: 4rem;\n    background: rgba(0,60,136,0.3);\n    border-radius: 4px;\n    padding: 2px .2rem;\n    font-size: smaller;\n    color: #eee;\n    text-align: center;\n    width: 8.8rem;\n    min-height: 1rem;\n}\n\n.coordinate-copy-control {\n    width: 10rem;\n    left: 2%;\n    top: 0.5rem;\n    opacity: 1;\n}\n.coordinate-copy-control.ol-hidden {\n    opacity: 0;\n    visibility: hidden;\n    transition: opacity .25s linear, visibility 0s linear .25s;\n}\n\n.ol-scale-line{\n    position: fixed;\n    bottom: 70px;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ 1:
/*!***********************************************************!*\
  !*** multi babel-polyfill ./frontend/bundle/src/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! babel-polyfill */"./node_modules/babel-polyfill/lib/index.js");
module.exports = __webpack_require__(/*! /home/baigalaa/Documents/project/geoWMS/frontend/bundle/src/index.js */"./frontend/bundle/src/index.js");


/***/ })

},[[1,"manifest","client/browser"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9mcm9udGVuZC9idW5kbGUvc3JjL2NvbXBvbmVudHMvQXBwLmpzeCIsIndlYnBhY2s6Ly8vLi9mcm9udGVuZC9idW5kbGUvc3JjL2NvbXBvbmVudHMvRGV0YWlsUGFnZS9CdW5kbGVNYXAuanN4Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL1NpZGViYXIuanN4Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL1NpZGViYXJCdXR0b24uanN4Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL1dNU0l0ZW0uanN4Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL1dNU0xheWVySXRlbS5qc3giLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvYnVuZGxlL3NyYy9jb21wb25lbnRzL0RldGFpbFBhZ2UvV01TTGF5ZXJJdGVtcy5qc3giLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvYnVuZGxlL3NyYy9jb21wb25lbnRzL0RldGFpbFBhZ2UvY29udHJvbHMvQ29vcmRpbmF0ZUNvcHkuanN4Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL2NvbnRyb2xzL01vZGFsLmpzeCIsIndlYnBhY2s6Ly8vLi9mcm9udGVuZC9idW5kbGUvc3JjL2NvbXBvbmVudHMvRGV0YWlsUGFnZS9jb250cm9scy/QodGD0YPRgNGM0JTQsNCy0YXQsNGA0LPQsC5qc3giLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvYnVuZGxlL3NyYy9jb21wb25lbnRzL0RldGFpbFBhZ2UvaW5kZXguanN4Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL3NlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvYnVuZGxlL3NyYy9jb21wb25lbnRzL0RldGFpbFBhZ2Uvc3R5bGVzLmNzcz8yMGM3Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvaGVscGVycy5qcyIsIndlYnBhY2s6Ly8vLi9mcm9udGVuZC9idW5kbGUvc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL3N0eWxlcy5jc3MiXSwibmFtZXMiOlsiQXBwIiwicHJvcHMiLCJidW5kbGUiLCJDb21wb25lbnQiLCJCdW5kbGVNYXAiLCJzdGF0ZSIsInByb2plY3Rpb24iLCJwcm9qZWN0aW9uX2Rpc3BsYXkiLCJtYXBfd21zX2xpc3QiLCJpc19zaWRlYmFyX29wZW4iLCJjb29yZGluYXRlX2NsaWNrZWQiLCJ2ZWN0b3JfbGF5ZXIiLCJjb250cm9scyIsImNvb3JkaW5hdGVDb3B5IiwiQ29vcmRpbmF0ZUNvcHkiLCJtb2RhbCIsIk1vZGFsIiwic2lkZWJhciIsIlNpZGViYXIiLCJtYXJrZXIiLCJpbml0TWFya2VyIiwiaGFuZGxlVG9nZ2xlIiwiYmluZCIsImhhbmRsZU1hcERhdGFMb2FkZWQiLCJoYW5kbGVNYXBDbGljayIsImhhbmRsZVNldENlbnRlciIsInRvZ2dsZVNpZGViYXIiLCJsb2FkTWFwRGF0YSIsInNob3dGZWF0dXJlc0F0Iiwic3R5bGUiLCJTdHlsZSIsImltYWdlIiwiSWNvbiIsImFuY2hvciIsImFuY2hvclhVbml0cyIsImFuY2hvcllVbml0cyIsInNjYWxlIiwic3JjIiwicG9pbnQiLCJQb2ludCIsImZlYXR1cmUiLCJGZWF0dXJlIiwiZ2VvbWV0cnkiLCJzZXRTdHlsZSIsImlkIiwicHJldlByb3BzIiwicHJldlN0YXRlIiwic2V0Q29vcmRpbmF0ZSIsInNldFN0YXRlIiwiYnVuZGxlX2lkIiwiUHJvbWlzZSIsImFsbCIsInNlcnZpY2UiLCJsb2FkQmFzZUxheWVycyIsImxvYWRXTVNMYXllcnMiLCJ0aGVuIiwiYmFzZV9sYXllcl9saXN0Iiwid21zX2xpc3QiLCJtYXAiLCJuYW1lIiwidXJsIiwibGF5ZXJzIiwibGF5ZXIiLCJ0aWxlIiwiVGlsZSIsInNvdXJjZSIsIlRpbGVXTVMiLCJwYXJhbXMiLCJjb2RlIiwicmVkdWNlIiwiYWNjIiwiYmFzZV9sYXllcl9pbmZvIiwiaWR4IiwidGlsZW5hbWUiLCJUaWxlSW1hZ2UiLCJjcm9zc09yaWdpbiIsImJhc2VfbGF5ZXJzIiwicHVzaCIsImJhc2VfbGF5ZXJfY29udHJvbHMiLCJpc19hY3RpdmUiLCJ0aHVtYm5haWxfMXgiLCJ0aHVtYm5haWxfMngiLCJWZWN0b3JMYXllciIsIlZlY3RvclNvdXJjZSIsInN0cm9rZSIsIlN0cm9rZSIsImNvbG9yIiwid2lkdGgiLCJmaWxsIiwiRmlsbCIsIm1hcmtlcl9sYXllciIsImZlYXR1cmVzIiwiTWFwIiwidGFyZ2V0IiwiZGVmYXVsdENvbnRyb2xzIiwiZXh0ZW5kIiwiRnVsbFNjcmVlbiIsIk1vdXNlUG9zaXRpb24iLCJjb29yZGluYXRlRm9ybWF0IiwiY29vcmQiLCJ1bmRlZmluZWRIVE1MIiwi0KHRg9GD0YDRjNCU0LDQstGF0LDRgNCz0LAiLCJTaWRlYmFyQnV0dG9uIiwiU2NhbGVMaW5lIiwiYWNjX21haW4iLCJ3bXMiLCJ0aWxlcyIsInZpZXciLCJWaWV3IiwiY2VudGVyIiwiem9vbSIsIm9uIiwiZXZlbnQiLCJzZXRDb29yZGluYXRlcyIsImNvb3JkaW5hdGUiLCJnZXRWaWV3IiwiZ2V0UHJvamVjdGlvbiIsIm1hcF9jb29yZCIsInRyYW5zZm9ybUNvb3JkaW5hdGUiLCJyZXNvbHV0aW9uIiwiZ2V0UmVzb2x1dGlvbiIsImZvckVhY2giLCJ3bXNfc291cmNlIiwiZ2V0U291cmNlIiwiZ2V0RmVhdHVyZUluZm9VcmwiLCJzaG93TW9kYWwiLCJmZXRjaCIsInJlc3BvbnNlIiwidGV4dCIsInBhcnNlciIsIldNU0dldEZlYXR1cmVJbmZvIiwicmVhZEZlYXR1cmVzIiwic2V0U291cmNlIiwiZmVhdHVyZV9pbmZvIiwiZ2VvbWV0cnlfbmFtZSIsImdldEdlb21ldHJ5TmFtZSIsInZhbHVlcyIsImdldEtleXMiLCJmaWx0ZXIiLCJrZXkiLCJnZXQiLCJnZXRJZCIsImNvbnNvbGUiLCJsb2ciLCJzZXRWaXNpYmxlIiwiZ2V0VmlzaWJsZSIsIm1hcF9wcm9qZWN0aW9uIiwic2V0Q2VudGVyIiwic2hvd1NpZGVCYXIiLCJTaWRlYmFyQ29tcG9uZW50IiwiaGFuZGxlU3VibWl0Q29vcmRpbmF0ZSIsInByZXZlbnREZWZhdWx0IiwiaGVscGVycyIsInBhcnNlQ29vcmRpbmF0ZVN0cmluZyIsImUiLCJ2YWx1ZSIsIm9wdF9vcHRpb25zIiwib3B0aW9ucyIsImVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpc19jb21wb25lbnRfaW5pdGlhbGl6ZWQiLCJjc3NDbGFzc2VzIiwiQ0xBU1NfSElEREVOIiwiY2xhc3NOYW1lIiwicmVuZGVyQ29tcG9uZW50IiwidG9nZ2xlQ29udHJvbCIsImlzX3Zpc2libGUiLCJjbGFzc0xpc3QiLCJ0b2dnbGUiLCJSZWFjdERPTSIsInJlbmRlciIsImh5ZHJhdGUiLCJpc2xhb2QiLCJDb250cm9sIiwiZWxlbWVudGEiLCJzZXRBdHRyaWJ1dGUiLCJlbGVtZW50aSIsImFwcGVuZENoaWxkIiwiYWRkRXZlbnRMaXN0ZW5lciIsIldNU0l0ZW0iLCJjaGVja2VkIiwiV01TTGF5ZXJJdGVtIiwiZGVmYXVsdENoZWNrIiwibGVnZW5kVVJMIiwiV01TTGF5ZXJJdGVtcyIsImxpc3RTdHlsZSIsIkNvcHlJbnB1dCIsImhhbmRsZUNvb3JkaW5hdGVTZXQiLCJpbnB1dCIsImZpbmRET01Ob2RlIiwiZm9jdXMiLCJzZWxlY3QiLCJoYW5kbGVCbHVyIiwiQ0xBU1NfQ09OVFJPTCIsIk1vZGFsQ29tcG9uZW50IiwicHJpY2UiLCJkZXNjcmlwdGlvbiIsInBheWxvYWQiLCJkYXRhX2lkIiwicGF5bWVudCIsInBheW1lbnRfaWQiLCJzZXRUaW1lb3V0Iiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiY29udGVudCIsImlzX2NvbXBsZXRlIiwiekluZGV4IiwiaGFuZGxlQ2xvc2UiLCJsYXllcl9uYW1lIiwidmFsX2lkeCIsImZpZWxkIiwiaGFuZGxlUGF5bWVudCIsIkNMQVNTX0FDVElWRSIsInRvZ2dsZUxheWVyIiwiaW5pdExheWVyIiwiaGFuZGxlQ2xpY2siLCJsYXN0X2FjdGl2ZSIsIkNMQVNTX1VOU0VMRUNUQUJMRSIsImwiLCJlbCIsImltZyIsInNyY3NldCIsIkRldGFpbFBhZ2UiLCJnZXRDb29raWUiLCJjb29raWVWYWx1ZSIsImNvb2tpZSIsImNvb2tpZXMiLCJzcGxpdCIsImkiLCJsZW5ndGgiLCJ0cmltIiwic3Vic3RyaW5nIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiaGFuZGxlUmVzcG9uc2UiLCJkYXRhIiwiSlNPTiIsInBhcnNlIiwib2siLCJpbmRleE9mIiwic3RhdHVzIiwicmVsb2FkIiwiZXJyb3IiLCJtZXNzYWdlIiwic3RhdHVzVGV4dCIsInJlamVjdCIsIl9nZXRHZXRPcHRpb25zIiwibWV0aG9kIiwiaGVhZGVycyIsIl9nZXRQb3N0T3B0aW9ucyIsInJlcXVlc3RPcHRpb25zIiwiYm9keSIsInN0cmluZ2lmeSIsImNvb3JkaW5hdGVfc3RyaW5nIiwicmVzdWx0IiwiZXhlYyIsImxhdCIsImxvbiIsInBhcnNlRmxvYXQiLCJncm91cHMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFFQTtBQUdPLElBQU1BLEdBQWI7QUFBQTs7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDZCQUVhO0FBRUwsMEJBQ0ksMkRBQUMsc0RBQUQ7QUFBWSxjQUFNLEVBQUUsS0FBS0MsS0FBTCxDQUFXQztBQUEvQixRQURKO0FBSUg7QUFSTDs7QUFBQTtBQUFBLEVBQXlCQywrQ0FBekIsRTs7Ozs7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aUJBQWlCLE9BQU8sZ0JBQWdCLGlCQUFpQix5QkFBeUIsK0RBQStELEdBQUcsY0FBYyx5QkFBeUIsZUFBZSxrQkFBa0Isa0JBQWtCLG1CQUFtQiwyQ0FBMkMseUJBQXlCLG1CQUFtQixHQUFHLGtCQUFrQiwyQ0FBMkMsR0FBRyxrQkFBa0IsMkNBQTJDLEtBQUssa0JBQWtCLHlCQUF5QixnQkFBZ0Isa0JBQWtCLGtCQUFrQixtQkFBbUIsS0FBSyxTQUFTLHNCQUFzQixtQkFBbUIseUJBQXlCLEdBQUcsb0JBQW9CLG1CQUFtQixtQkFBbUIsc0JBQXNCLEdBQUcsc0NBQXNDLHFCQUFxQixrQkFBa0IscUJBQXFCLHVCQUF1QixrQkFBa0IseUJBQXlCLG1CQUFtQix3Q0FBd0MsR0FBRyxtSkFBbUosaUJBQWlCLEdBQUcsMEZBQTBGLGtCQUFrQixHQUFHLHVCQUF1QixtQkFBbUIsZ0JBQWdCLGtCQUFrQixtQkFBbUIsS0FBSyx3Q0FBd0Msa0JBQWtCLG1CQUFtQixzQkFBc0IsS0FBSyx1Q0FBdUMsa0JBQWtCLG1CQUFtQixzQkFBc0IsS0FBSyxZQUFZLGtCQUFrQixvQkFBb0Isa0JBQWtCLG1CQUFtQixpQkFBaUIsR0FBRyx5QkFBeUIsa0JBQWtCLG1CQUFtQixzQkFBc0IsS0FBSyx1QkFBdUIsa0JBQWtCLG1CQUFtQixzQkFBc0IsR0FBRyx3QkFBd0Isa0JBQWtCLHFDQUFxQyx5QkFBeUIseUJBQXlCLHlCQUF5QixrQkFBa0IseUJBQXlCLG9CQUFvQix1QkFBdUIsR0FBRyw4QkFBOEIsbUJBQW1CLGVBQWUsa0JBQWtCLGlCQUFpQixHQUFHLHNDQUFzQyxpQkFBaUIseUJBQXlCLGlFQUFpRSxHQUFHLG1CQUFtQixzQkFBc0IsbUJBQW1CLEdBQUc7QUFDcDZGO0FBQ0EiLCJmaWxlIjoiZnJvbnRlbmQvYnVuZGxlL3N0YXRpYy9hc3NldHMvanMvM2RkYjNiYjJiMjJhNWJiMzk4OTguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0J1xuXG5pbXBvcnQge0RldGFpbFBhZ2V9IGZyb20gJy4vRGV0YWlsUGFnZSdcblxuXG5leHBvcnQgY2xhc3MgQXBwIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPERldGFpbFBhZ2UgYnVuZGxlPXt0aGlzLnByb3BzLmJ1bmRsZX0vPlxuICAgICAgICApXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBGcmFnbWVudCB9IGZyb20gXCJyZWFjdFwiXG5cbmltcG9ydCAnb2wvb2wuY3NzJ1xuaW1wb3J0IHtNYXAsIFZpZXcsIEZlYXR1cmV9IGZyb20gJ29sJ1xuaW1wb3J0IHt0cmFuc2Zvcm0gYXMgdHJhbnNmb3JtQ29vcmRpbmF0ZX0gZnJvbSAnb2wvcHJvaidcbmltcG9ydCBXTVNHZXRGZWF0dXJlSW5mbyBmcm9tICdvbC9mb3JtYXQvV01TR2V0RmVhdHVyZUluZm8nXG5pbXBvcnQgVGlsZSBmcm9tICdvbC9sYXllci9UaWxlJ1xuaW1wb3J0IHtWZWN0b3IgYXMgVmVjdG9yTGF5ZXJ9IGZyb20gJ29sL2xheWVyJ1xuaW1wb3J0IHtWZWN0b3IgYXMgVmVjdG9yU291cmNlfSBmcm9tICdvbC9zb3VyY2UnXG5pbXBvcnQge0ljb24sIFN0eWxlLCBTdHJva2UsIEZpbGx9IGZyb20gJ29sL3N0eWxlJ1xuaW1wb3J0IHtQb2ludH0gZnJvbSAnb2wvZ2VvbSdcbmltcG9ydCBUaWxlSW1hZ2UgZnJvbSAnb2wvc291cmNlL1RpbGVJbWFnZSdcbmltcG9ydCBUaWxlV01TIGZyb20gJ29sL3NvdXJjZS9UaWxlV01TJ1xuaW1wb3J0IE9TTSBmcm9tICdvbC9zb3VyY2UvT1NNJ1xuaW1wb3J0IHtmb3JtYXQgYXMgY29vcmRpbmF0ZUZvcm1hdH0gZnJvbSAnb2wvY29vcmRpbmF0ZSc7XG5pbXBvcnQge2RlZmF1bHRzIGFzIGRlZmF1bHRDb250cm9scywgRnVsbFNjcmVlbiwgTW91c2VQb3NpdGlvbiwgU2NhbGVMaW5lfSBmcm9tICdvbC9jb250cm9sJ1xuXG5pbXBvcnQge9Ch0YPRg9GA0YzQlNCw0LLRhdCw0YDQs9CwfSBmcm9tICcuL2NvbnRyb2xzL9Ch0YPRg9GA0YzQlNCw0LLRhdCw0YDQs9CwJ1xuaW1wb3J0IHtDb29yZGluYXRlQ29weX0gZnJvbSAnLi9jb250cm9scy9Db29yZGluYXRlQ29weSdcbmltcG9ydCB7TW9kYWx9IGZyb20gJy4vY29udHJvbHMvTW9kYWwnXG5cbmltcG9ydCBcIi4vc3R5bGVzLmNzc1wiXG5pbXBvcnQge3NlcnZpY2V9IGZyb20gJy4vc2VydmljZSdcbmltcG9ydCB7U2lkZWJhckJ1dHRvbn0gZnJvbSAnLi9TaWRlYmFyQnV0dG9uJ1xuaW1wb3J0IHtTaWRlYmFyfSBmcm9tICcuL1NpZGViYXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1bmRsZU1hcCBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcylcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgcHJvamVjdGlvbjogJ0VQU0c6Mzg1NycsXG4gICAgICAgICAgICBwcm9qZWN0aW9uX2Rpc3BsYXk6ICdFUFNHOjQzMjYnLFxuICAgICAgICAgICAgYnVuZGxlOiBwcm9wcy5idW5kbGUsXG4gICAgICAgICAgICBtYXBfd21zX2xpc3Q6IFtdLFxuICAgICAgICAgICAgaXNfc2lkZWJhcl9vcGVuOiB0cnVlLFxuICAgICAgICAgICAgY29vcmRpbmF0ZV9jbGlja2VkOiBudWxsLFxuICAgICAgICAgICAgdmVjdG9yX2xheWVyOiBudWxsLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250cm9scyA9IHtcbiAgICAgICAgICAgIGNvb3JkaW5hdGVDb3B5OiBuZXcgQ29vcmRpbmF0ZUNvcHkoKSxcbiAgICAgICAgICAgIG1vZGFsOiBuZXcgTW9kYWwoKSxcbiAgICAgICAgICAgIHNpZGViYXI6IG5ldyBTaWRlYmFyKCksXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hcmtlciA9IHRoaXMuaW5pdE1hcmtlcigpXG5cbiAgICAgICAgdGhpcy5oYW5kbGVUb2dnbGUgPSB0aGlzLmhhbmRsZVRvZ2dsZS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMuaGFuZGxlTWFwRGF0YUxvYWRlZCA9IHRoaXMuaGFuZGxlTWFwRGF0YUxvYWRlZC5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMuaGFuZGxlTWFwQ2xpY2sgPSB0aGlzLmhhbmRsZU1hcENsaWNrLmJpbmQodGhpcylcbiAgICAgICAgdGhpcy5oYW5kbGVTZXRDZW50ZXIgPSB0aGlzLmhhbmRsZVNldENlbnRlci5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMudG9nZ2xlU2lkZWJhciA9IHRoaXMudG9nZ2xlU2lkZWJhci5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMubG9hZE1hcERhdGEgPSB0aGlzLmxvYWRNYXBEYXRhLmJpbmQodGhpcylcbiAgICAgICAgdGhpcy5zaG93RmVhdHVyZXNBdCA9IHRoaXMuc2hvd0ZlYXR1cmVzQXQuYmluZCh0aGlzKVxuICAgIH1cblxuICAgIGluaXRNYXJrZXIoKSB7XG5cbiAgICAgICAgY29uc3Qgc3R5bGUgPSBuZXcgU3R5bGUoe1xuICAgICAgICAgICAgaW1hZ2U6IG5ldyBJY29uKHtcbiAgICAgICAgICAgICAgICBhbmNob3I6IFswLjUsIDg2XSxcbiAgICAgICAgICAgICAgICBhbmNob3JYVW5pdHM6ICdmcmFjdGlvbicsXG4gICAgICAgICAgICAgICAgYW5jaG9yWVVuaXRzOiAncGl4ZWxzJyxcbiAgICAgICAgICAgICAgICBzY2FsZTogMC40LFxuICAgICAgICAgICAgICAgIHNyYzogJy9zdGF0aWMvYXNzZXRzL2ltYWdlcy9idW5kbGUvbWFya2VyLnBuZydcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQoWzAsIDBdKVxuXG4gICAgICAgIGNvbnN0IGZlYXR1cmUgPSBuZXcgRmVhdHVyZSh7Z2VvbWV0cnk6IHBvaW50fSlcbiAgICAgICAgZmVhdHVyZS5zZXRTdHlsZShzdHlsZSlcblxuICAgICAgICByZXR1cm4ge2ZlYXR1cmU6IGZlYXR1cmUsIHBvaW50OiBwb2ludH1cblxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLmxvYWRNYXBEYXRhKHRoaXMuc3RhdGUuYnVuZGxlLmlkKVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuXG4gICAgICAgIGlmIChwcmV2U3RhdGUuY29vcmRpbmF0ZV9jbGlja2VkICE9PSB0aGlzLnN0YXRlLmNvb3JkaW5hdGVfY2xpY2tlZCkge1xuICAgICAgICAgICAgdGhpcy5jb250cm9scy5jb29yZGluYXRlQ29weS5zZXRDb29yZGluYXRlKHRoaXMuc3RhdGUuY29vcmRpbmF0ZV9jbGlja2VkKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucHJvcHMuYnVuZGxlLmlkID09PSBwcmV2UHJvcHMuYnVuZGxlLmlkKSByZXR1cm5cblxuICAgICAgICBjb25zdCB7YnVuZGxlfSA9IHRoaXMucHJvcHNcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7YnVuZGxlfSlcblxuICAgICAgICB0aGlzLmxvYWRNYXBEYXRhKGJ1bmRsZS5pZClcblxuICAgIH1cblxuICAgIGxvYWRNYXBEYXRhKGJ1bmRsZV9pZCkge1xuXG4gICAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHNlcnZpY2UubG9hZEJhc2VMYXllcnMoKSxcbiAgICAgICAgICAgIHNlcnZpY2UubG9hZFdNU0xheWVycyhidW5kbGVfaWQpLFxuICAgICAgICBdKS50aGVuKChbe2Jhc2VfbGF5ZXJfbGlzdH0sIHt3bXNfbGlzdH1dKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZU1hcERhdGFMb2FkZWQoYmFzZV9sYXllcl9saXN0LCB3bXNfbGlzdClcbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGhhbmRsZU1hcERhdGFMb2FkZWQoYmFzZV9sYXllcl9saXN0LCB3bXNfbGlzdCkge1xuXG4gICAgICAgIGNvbnN0IG1hcF93bXNfbGlzdCA9IHdtc19saXN0Lm1hcCgoe25hbWUsIHVybCwgbGF5ZXJzfSkgPT4ge1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgbGF5ZXJzOiBsYXllcnMubWFwKChsYXllcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5sYXllcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGU6IG5ldyBUaWxlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IG5ldyBUaWxlV01TKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbjogdGhpcy5zdGF0ZS5wcm9qZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnTEFZRVJTJzogbGF5ZXIuY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJ0ZPUk1BVCc6ICdpbWFnZS9zdmcreG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGT1JNQVQnOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe21hcF93bXNfbGlzdH0pXG5cbiAgICAgICAgY29uc3Qge2Jhc2VfbGF5ZXJzLCBiYXNlX2xheWVyX2NvbnRyb2xzfSA9XG4gICAgICAgICAgICBiYXNlX2xheWVyX2xpc3QucmVkdWNlKFxuICAgICAgICAgICAgICAgIChhY2MsIGJhc2VfbGF5ZXJfaW5mbywgaWR4KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGxheWVyXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhc2VfbGF5ZXJfaW5mby50aWxlbmFtZSA9PSBcInh5elwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllciA9IG5ldyBUaWxlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IG5ldyBUaWxlSW1hZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcm9zc09yaWdpbjogJ0Fub255bW91cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYmFzZV9sYXllcl9pbmZvLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoYmFzZV9sYXllcl9pbmZvLnRpbGVuYW1lID09IFwid21zXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyID0gbmV3IFRpbGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbmV3IFRpbGVXTVMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGJhc2VfbGF5ZXJfaW5mby51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0xBWUVSUyc6IGJhc2VfbGF5ZXJfaW5mby5sYXllcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRk9STUFUJzogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhY2MuYmFzZV9sYXllcnMucHVzaChsYXllcilcbiAgICAgICAgICAgICAgICAgICAgYWNjLmJhc2VfbGF5ZXJfY29udHJvbHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc19hY3RpdmU6IGlkeCA9PSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGh1bWJuYWlsXzF4OiBiYXNlX2xheWVyX2luZm8udGh1bWJuYWlsXzF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGh1bWJuYWlsXzJ4OiBiYXNlX2xheWVyX2luZm8udGh1bWJuYWlsXzJ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXI6IGxheWVyLFxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2NcblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBiYXNlX2xheWVyczogW10sXG4gICAgICAgICAgICAgICAgICAgIGJhc2VfbGF5ZXJfY29udHJvbHM6IFtdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuXG4gICAgICAgIGNvbnN0IHZlY3Rvcl9sYXllciA9IG5ldyBWZWN0b3JMYXllcih7XG4gICAgICAgICAgICBzb3VyY2U6IG5ldyBWZWN0b3JTb3VyY2UoKSxcbiAgICAgICAgICAgIHN0eWxlOiBuZXcgU3R5bGUoe1xuICAgICAgICAgICAgICAgIHN0cm9rZTogbmV3IFN0cm9rZSh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAncmdiYSgxMDAsIDI1NSwgMCwgMSknLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMlxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGZpbGw6IG5ldyBGaWxsKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdyZ2JhKDEwMCwgMjU1LCAwLCAwLjMpJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnNldFN0YXRlKHt2ZWN0b3JfbGF5ZXJ9KVxuXG4gICAgICAgIGNvbnN0IG1hcmtlcl9sYXllciA9IG5ldyBWZWN0b3JMYXllcih7XG4gICAgICAgICAgICBzb3VyY2U6IG5ldyBWZWN0b3JTb3VyY2Uoe1xuICAgICAgICAgICAgICAgIGZlYXR1cmVzOiBbdGhpcy5tYXJrZXIuZmVhdHVyZV0sXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoe1xuICAgICAgICAgICAgdGFyZ2V0OiAnbWFwJyxcbiAgICAgICAgICAgIGNvbnRyb2xzOiBkZWZhdWx0Q29udHJvbHMoKS5leHRlbmQoW1xuICAgICAgICAgICAgICAgIG5ldyBGdWxsU2NyZWVuKCksXG4gICAgICAgICAgICAgICAgbmV3IE1vdXNlUG9zaXRpb24oe1xuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uOiB0aGlzLnN0YXRlLnByb2plY3Rpb25fZGlzcGxheSxcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZUZvcm1hdDogKGNvb3JkKSA9PiBjb29yZGluYXRlRm9ybWF0KGNvb3JkLCAne3l9LHt4fScsIDYpLFxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWRIVE1MOiAnJyxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBuZXcg0KHRg9GD0YDRjNCU0LDQstGF0LDRgNCz0LAoe2xheWVyczogYmFzZV9sYXllcl9jb250cm9sc30pLFxuICAgICAgICAgICAgICAgIG5ldyBTaWRlYmFyQnV0dG9uKHt0b2dnbGVTaWRlYmFyOiB0aGlzLnRvZ2dsZVNpZGViYXJ9KSxcbiAgICAgICAgICAgICAgICBuZXcgU2NhbGVMaW5lKCksXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5tb2RhbCxcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLmNvb3JkaW5hdGVDb3B5LFxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMuc2lkZWJhcixcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgbGF5ZXJzOiBbXG4gICAgICAgICAgICAgICAgLi4uYmFzZV9sYXllcnMsXG4gICAgICAgICAgICAgICAgLi4ubWFwX3dtc19saXN0LnJlZHVjZSgoYWNjX21haW4sIHdtcykgPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aWxlcyA9IHdtcy5sYXllcnMubWFwKChsYXllcikgPT4gbGF5ZXIudGlsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbLi4uYWNjX21haW4sIC4uLnRpbGVzXVxuICAgICAgICAgICAgICAgIH0sIFtdKSxcbiAgICAgICAgICAgICAgICB2ZWN0b3JfbGF5ZXIsXG4gICAgICAgICAgICAgICAgbWFya2VyX2xheWVyLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHZpZXc6IG5ldyBWaWV3KHtcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uOiB0aGlzLnN0YXRlLnByb2plY3Rpb24sXG4gICAgICAgICAgICAgICAgY2VudGVyOiBbMTE0NjE2MTMuNjMwODE1NDk3LCA1ODc4NjU2LjAyMjgzNzAwNjVdLFxuICAgICAgICAgICAgICAgIHpvb206IDUuMDQxMzAxNTYyMjQ2OTcxLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICBtYXAub24oJ2NsaWNrJywgdGhpcy5oYW5kbGVNYXBDbGljaylcblxuICAgICAgICB0aGlzLm1hcCA9IG1hcFxuXG4gICAgfVxuXG4gICAgaGFuZGxlTWFwQ2xpY2soZXZlbnQpIHtcblxuICAgICAgICB0aGlzLm1hcmtlci5wb2ludC5zZXRDb29yZGluYXRlcyhldmVudC5jb29yZGluYXRlKVxuXG4gICAgICAgIGNvbnN0IHByb2plY3Rpb24gPSBldmVudC5tYXAuZ2V0VmlldygpLmdldFByb2plY3Rpb24oKVxuICAgICAgICBjb25zdCBtYXBfY29vcmQgPSB0cmFuc2Zvcm1Db29yZGluYXRlKGV2ZW50LmNvb3JkaW5hdGUsIHByb2plY3Rpb24sIHRoaXMuc3RhdGUucHJvamVjdGlvbl9kaXNwbGF5KVxuICAgICAgICBjb25zdCBjb29yZGluYXRlX2NsaWNrZWQgPSBjb29yZGluYXRlRm9ybWF0KG1hcF9jb29yZCwgJ3t5fSx7eH0nLCA2KVxuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Nvb3JkaW5hdGVfY2xpY2tlZH0pXG5cbiAgICAgICAgdGhpcy5zaG93RmVhdHVyZXNBdChldmVudC5jb29yZGluYXRlKVxuXG4gICAgfVxuXG4gICAgc2hvd0ZlYXR1cmVzQXQoY29vcmRpbmF0ZSkge1xuXG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLm1hcC5nZXRWaWV3KClcbiAgICAgICAgY29uc3QgcHJvamVjdGlvbiA9IHZpZXcuZ2V0UHJvamVjdGlvbigpXG4gICAgICAgIGNvbnN0IHJlc29sdXRpb24gPSB2aWV3LmdldFJlc29sdXRpb24oKVxuXG4gICAgICAgIHRoaXMuc3RhdGUubWFwX3dtc19saXN0LmZvckVhY2goKHtsYXllcnN9KSA9PiB7XG4gICAgICAgICAgICBsYXllcnMuZm9yRWFjaCgoe3RpbGV9KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB3bXNfc291cmNlID0gdGlsZS5nZXRTb3VyY2UoKVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gd21zX3NvdXJjZS5nZXRGZWF0dXJlSW5mb1VybChcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x1dGlvbixcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8nSU5GT19GT1JNQVQnOiAndGV4dC94bWwnXG4gICAgICAgICAgICAgICAgICAgICAgICAvLydJTkZPX0ZPUk1BVCc6ICd0ZXh0L2h0bWwnXG4gICAgICAgICAgICAgICAgICAgICAgICAnSU5GT19GT1JNQVQnOiAnYXBwbGljYXRpb24vdm5kLm9nYy5nbWwnLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAgICAgaWYgKHVybCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMubW9kYWwuc2hvd01vZGFsKG51bGwsIGZhbHNlKVxuXG4gICAgICAgICAgICAgICAgICAgIGZldGNoKHVybClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UudGV4dCgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHRleHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgV01TR2V0RmVhdHVyZUluZm8oKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZlYXR1cmVzID0gcGFyc2VyLnJlYWRGZWF0dXJlcyh0ZXh0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IG5ldyBWZWN0b3JTb3VyY2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZWF0dXJlczogZmVhdHVyZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnZlY3Rvcl9sYXllci5zZXRTb3VyY2Uoc291cmNlKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmVhdHVyZV9pbmZvID0gZmVhdHVyZXMubWFwKChmZWF0dXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdlb21ldHJ5X25hbWUgPSBmZWF0dXJlLmdldEdlb21ldHJ5TmFtZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZWF0dXJlLmdldEtleXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoa2V5KSA9PiBrZXkgIT0gZ2VvbWV0cnlfbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKGtleSkgPT4gW2tleSwgZmVhdHVyZS5nZXQoa2V5KV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbZmVhdHVyZS5nZXRJZCgpLCB2YWx1ZXNdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm1vZGFsLnNob3dNb2RhbChmZWF0dXJlX2luZm8sIHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFRPRE8gKi9cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIGZlYXR1cmUgdXJsJywgd21zX3NvdXJjZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGhhbmRsZVRvZ2dsZShpZHgpIHtcbiAgICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLnN0YXRlLmxheWVyc1tpZHhdXG4gICAgICAgIGxheWVyLnNldFZpc2libGUoIWxheWVyLmdldFZpc2libGUoKSlcbiAgICB9XG5cbiAgICBoYW5kbGVTZXRDZW50ZXIoY29vcmQpIHtcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMubWFwLmdldFZpZXcoKVxuICAgICAgICBjb25zdCBtYXBfcHJvamVjdGlvbiA9IHZpZXcuZ2V0UHJvamVjdGlvbigpXG4gICAgICAgIGNvbnN0IG1hcF9jb29yZCA9IHRyYW5zZm9ybUNvb3JkaW5hdGUoY29vcmQsIHRoaXMuc3RhdGUucHJvamVjdGlvbl9kaXNwbGF5LCBtYXBfcHJvamVjdGlvbilcbiAgICAgICAgdGhpcy5tYXJrZXIucG9pbnQuc2V0Q29vcmRpbmF0ZXMobWFwX2Nvb3JkKVxuICAgICAgICB2aWV3LnNldENlbnRlcihtYXBfY29vcmQpXG4gICAgfVxuICAgIFxuICAgIHRvZ2dsZVNpZGViYXIoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICAgIGlzX3NpZGViYXJfb3BlbjogIXByZXZTdGF0ZS5pc19zaWRlYmFyX29wZW4sXG4gICAgICAgIH0pKVxuICAgICAgICBpZih0aGlzLnN0YXRlLmlzX3NpZGViYXJfb3Blbil7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzLnNpZGViYXIuc2hvd1NpZGVCYXIobnVsbCwgbnVsbCwgdHJ1ZSlcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzLnNpZGViYXIuc2hvd1NpZGVCYXIodGhpcy5zdGF0ZS5tYXBfd21zX2xpc3QsIHRoaXMuaGFuZGxlU2V0Q2VudGVyLCBmYWxzZSlcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIChcblxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIvCfjI1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwibWFwXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgRnJhZ21lbnQgfSBmcm9tIFwicmVhY3RcIlxuXG5pbXBvcnQge2hlbHBlcnN9IGZyb20gJy4uLy4uL2hlbHBlcnMnXG5pbXBvcnQgV01TSXRlbSBmcm9tICcuL1dNU0l0ZW0nXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuaW1wb3J0IHtDb250cm9sfSBmcm9tICdvbC9jb250cm9sJ1xuaW1wb3J0IHtDTEFTU19DT05UUk9MLCBDTEFTU19ISURERU59IGZyb20gJ29sL2Nzcy5qcydcblxuXG5jbGFzcyBTaWRlYmFyQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMpXG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGNvb3JkaW5hdGU6ICcnLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXRDb29yZGluYXRlID0gdGhpcy5oYW5kbGVTdWJtaXRDb29yZGluYXRlLmJpbmQodGhpcylcbiAgICB9XG5cbiAgICBoYW5kbGVTdWJtaXRDb29yZGluYXRlKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgY29uc3QgY29vcmQgPSBoZWxwZXJzLnBhcnNlQ29vcmRpbmF0ZVN0cmluZyh0aGlzLnN0YXRlLmNvb3JkaW5hdGUpXG4gICAgICAgIHRoaXMucHJvcHMuaGFuZGxlU2V0Q2VudGVyKGNvb3JkKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJmb250LXdlaWdodC1ib2xkXCIgaHRtbEZvcj1cImZvcm1Hcm91cElucHV0XCI+0J3RjdGA0Y3Qu9Cx0Y3RgNGN0Y3RgCDRhdCw0LnRhTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgbWItM1wiPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj1cItGF0LDQudGFINGD0YLQs9CwXCIgYXJpYS1sYWJlbD1cIlwiIGFyaWEtZGVzY3JpYmVkYnk9XCJcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWFwcGVuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGdwLW91dGxpbmUtcHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIj48aSBjbGFzc05hbWU9XCJmYSBmYS1zZWFyY2ggbXItMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT7QpdCw0LnRhTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0Q29vcmRpbmF0ZX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZvbnQtd2VpZ2h0LWJvbGRcIiBodG1sRm9yPVwiZm9ybUdyb3VwSW5wdXRcIj7QkdCw0LnRgNC70LDQu9Cw0LDRgCDRhdCw0LnRhTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwIG1iLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj1cItOp0YDQs9Op0YDTqdCzLCDRg9GA0YLRgNCw0LNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVwiY29vcmRpbmF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdGhpcy5zZXRTdGF0ZSh7Y29vcmRpbmF0ZTogZS50YXJnZXQudmFsdWV9KSB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmNvb3JkaW5hdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWFwcGVuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBncC1vdXRsaW5lLXByaW1hcnlcIiB0eXBlPVwic3VibWl0XCI+PGkgY2xhc3NOYW1lPVwiZmEgZmEtc2VhcmNoIG1yLTFcIj48L2k+0KXQsNC50YU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMubWFwX3dtc19saXN0Lm1hcCgod21zLCBpZHgpID0+XG4gICAgICAgICAgICAgICAgICAgIDxXTVNJdGVtIHdtcz17d21zfSBrZXk9e2lkeH0vPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNpZGViYXIgZXh0ZW5kcyBDb250cm9sIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdF9vcHRpb25zKSB7XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IG9wdF9vcHRpb25zIHx8IHt9XG5cbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgZWxlbWVudDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICB0YXJnZXQ6IG9wdGlvbnMudGFyZ2V0LFxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuaXNfY29tcG9uZW50X2luaXRpYWxpemVkID0gZmFsc2VcbiAgICAgICAgY29uc3QgY3NzQ2xhc3NlcyA9IGBjb2wtbWQtMiDimpkgICR7Q0xBU1NfSElEREVOfWBcblxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lID0gY3NzQ2xhc3Nlc1xuICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudCA9IHRoaXMucmVuZGVyQ29tcG9uZW50LmJpbmQodGhpcylcbiAgICAgICAgdGhpcy50b2dnbGVDb250cm9sID0gdGhpcy50b2dnbGVDb250cm9sLmJpbmQodGhpcylcbiAgICB9XG5cbiAgICB0b2dnbGVDb250cm9sKGlzX3Zpc2libGUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoQ0xBU1NfSElEREVOLCBpc192aXNpYmxlKVxuXG4gICAgfVxuXG4gICAgcmVuZGVyQ29tcG9uZW50KHByb3BzKSB7XG4gICAgICAgIGlmICghdGhpcy5pc19jb21wb25lbnRfaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIFJlYWN0RE9NLnJlbmRlcig8U2lkZWJhckNvbXBvbmVudCB7Li4ucHJvcHN9Lz4sIHRoaXMuZWxlbWVudClcbiAgICAgICAgICAgIHRoaXMuaXNfY29tcG9uZW50X2luaXRpYWxpemVkID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgUmVhY3RET00uaHlkcmF0ZSg8U2lkZWJhckNvbXBvbmVudCB7Li4ucHJvcHN9Lz4sIHRoaXMuZWxlbWVudClcbiAgICB9XG5cbiAgICBzaG93U2lkZUJhcihtYXBfd21zX2xpc3QsIGhhbmRsZVNldENlbnRlciwgaXNsYW9kKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlQ29udHJvbChpc2xhb2QpXG4gICAgICAgIHRoaXMucmVuZGVyQ29tcG9uZW50KHttYXBfd21zX2xpc3QsIGhhbmRsZVNldENlbnRlcn0pXG4gICAgfVxuXG59XG4iLCJpbXBvcnQge0NvbnRyb2x9IGZyb20gJ29sL2NvbnRyb2wnXG5cblxuZXhwb3J0IGNsYXNzIFNpZGViYXJCdXR0b24gZXh0ZW5kcyBDb250cm9sIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdF9vcHRpb25zKSB7XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IG9wdF9vcHRpb25zIHx8IHt9XG5cbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgZWxlbWVudDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICB0YXJnZXQ6IG9wdGlvbnMudGFyZ2V0LFxuICAgICAgICB9KVxuXG5cbiAgICAgICAgY29uc3QgY3NzQ2xhc3NlcyA9ICfimpktdG9nZ2xlJ1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50XG4gICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY3NzQ2xhc3Nlc1xuICAgICAgICBjb25zdCBlbGVtZW50YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgICAgICBlbGVtZW50YS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpXG5cbiAgICAgICAgY29uc3QgZWxlbWVudGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJylcbiAgICAgICAgZWxlbWVudGkuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcbiAgICAgICAgZWxlbWVudGkuY2xhc3NOYW1lID0gJ2ZhIGZhLWJhcnMgZmEtbGcnXG4gICAgICAgIGVsZW1lbnRhLmFwcGVuZENoaWxkKGVsZW1lbnRpKVxuXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIG9wdGlvbnMudG9nZ2xlU2lkZWJhcigpXG4gICAgICAgIH0pXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudGEpXG5cbiAgICB9XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBGcmFnbWVudCB9IGZyb20gXCJyZWFjdFwiXG5cbmltcG9ydCBXTVNMYXllckl0ZW1zIGZyb20gXCIuL1dNU0xheWVySXRlbXNcIlxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdNU0l0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpXG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIG5hbWU6IHByb3BzLndtcy5uYW1lLFxuICAgICAgICAgICAgdGlsZXM6IHByb3BzLndtcy50aWxlcyxcbiAgICAgICAgICAgIGxheWVyczogcHJvcHMud21zLmxheWVycyxcbiAgICAgICAgICAgIGlzX3Zpc2libGU6IHRydWUsXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRvZ2dsZSA9IHRoaXMudG9nZ2xlLmJpbmQodGhpcylcblxuICAgIH1cblxuICAgIHRvZ2dsZShlKSB7XG4gICAgICAgIGNvbnN0IGlzX3Zpc2libGUgPSBlLnRhcmdldC5jaGVja2VkXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzX3Zpc2libGV9KVxuICAgICAgICB0aGlzLnN0YXRlLnRpbGUuc2V0VmlzaWJsZShpc192aXNpYmxlKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICBjb25zdCB7dGlsZXMsIG5hbWUsIGxheWVycywgaXNfdmlzaWJsZX0gPSB0aGlzLnN0YXRlXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8RnJhZ21lbnQ+XG5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJteS0xXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb250LXdlaWdodC1ib2xkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnRvZ2dsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXtpc192aXNpYmxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZvbnQtd2VpZ2h0LWJvbGRcIiBodG1sRm9yPVwiZm9ybUdyb3VwSW5wdXRcIj4mbmJzcDt7bmFtZX08L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8V01TTGF5ZXJJdGVtc1xuICAgICAgICAgICAgICAgICAgICBsYXllcnM9e2xheWVyc31cbiAgICAgICAgICAgICAgICAgICAgdGlsZVdNUz17dGlsZXN9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgIClcbiAgICB9XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBGcmFnbWVudCB9IGZyb20gXCJyZWFjdFwiXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV01TTGF5ZXJJdGVtIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKVxuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBuYW1lOiBwcm9wcy5sYXllci5uYW1lLFxuICAgICAgICAgICAgY29kZTogcHJvcHMubGF5ZXIuY29kZSxcbiAgICAgICAgICAgIHRpbGU6IHByb3BzLmxheWVyLnRpbGUsXG4gICAgICAgICAgICBpc192aXNpYmxlOiBwcm9wcy5sYXllci5kZWZhdWx0Q2hlY2ssXG4gICAgICAgICAgICBsZWdlbmRVUkw6IHByb3BzLmxheWVyLmxlZ2VuZFVSTCxcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9nZ2xlID0gdGhpcy50b2dnbGUuYmluZCh0aGlzKVxuICAgIH1cbiAgICBjb21wb25lbnREaWRNb3VudCgpe1xuICAgICAgICB0aGlzLnN0YXRlLnRpbGUuc2V0VmlzaWJsZSh0aGlzLnByb3BzLmxheWVyLmRlZmF1bHRDaGVjaylcbiAgICB9XG4gICAgdG9nZ2xlKGlzX3Zpc2libGUpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS50aWxlLnNldFZpc2libGUoaXNfdmlzaWJsZSlcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNfdmlzaWJsZX0pXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIGNvbnN0IHsgbmFtZSwgY29kZSwgaXNfdmlzaWJsZSwgbGVnZW5kVVJMIH0gPSB0aGlzLnN0YXRlXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHRoaXMudG9nZ2xlKGUudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17aXNfdmlzaWJsZX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPGE+IHtuYW1lfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIHtsZWdlbmRVUkwgIT0gXCJudWxsXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiaW1nXCIgc3JjPXtsZWdlbmRVUkx9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgKVxuICAgIH1cbn1cbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IFdNU0xheWVySXRlbSBmcm9tIFwiLi9XTVNMYXllckl0ZW1cIlxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdNU0xheWVySXRlbXMgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpXG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGxheWVyczogcHJvcHMubGF5ZXJzLFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHVsIHN0eWxlPXt7bGlzdFN0eWxlOiAnbm9uZSd9fT5cbiAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5sYXllcnMubWFwKChsYXllciwgaWR4KSA9PlxuICAgICAgICAgICAgICAgICAgICA8V01TTGF5ZXJJdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllcj17bGF5ZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2lkeH1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgKVxuICAgIH1cblxufVxuIiwiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcbmltcG9ydCB7Q29udHJvbH0gZnJvbSAnb2wvY29udHJvbCdcbmltcG9ydCB7Q0xBU1NfQ09OVFJPTCwgQ0xBU1NfSElEREVOfSBmcm9tICdvbC9jc3MuanMnXG5cblxuY2xhc3MgQ29weUlucHV0IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKVxuICAgICAgICB0aGlzLmhhbmRsZUNvb3JkaW5hdGVTZXQgPSB0aGlzLmhhbmRsZUNvb3JkaW5hdGVTZXQuYmluZCh0aGlzKVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLmhhbmRsZUNvb3JkaW5hdGVTZXQoKVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVDb29yZGluYXRlU2V0KClcbiAgICB9XG5cbiAgICBoYW5kbGVDb29yZGluYXRlU2V0KCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpXG4gICAgICAgIGlucHV0LmZvY3VzKClcbiAgICAgICAgaW5wdXQuc2VsZWN0KClcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4ge319XG4gICAgICAgICAgICAgICAgb25CbHVyPXt0aGlzLnByb3BzLmhhbmRsZUJsdXJ9XG4gICAgICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMuY29vcmRpbmF0ZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgIClcblxuICAgIH1cblxufVxuXG5cbmV4cG9ydCBjbGFzcyBDb29yZGluYXRlQ29weSBleHRlbmRzIENvbnRyb2wge1xuXG4gICAgY29uc3RydWN0b3Iob3B0X29wdGlvbnMpIHtcblxuICAgICAgICBjb25zdCBvcHRpb25zID0gb3B0X29wdGlvbnMgfHwge31cblxuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICBlbGVtZW50OiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIHRhcmdldDogb3B0aW9ucy50YXJnZXQsXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5pc19jb21wb25lbnRfaW5pdGlhbGl6ZWQgPSBmYWxzZVxuXG4gICAgICAgIGNvbnN0IGNzc0NsYXNzZXMgPSBgY29vcmRpbmF0ZS1jb3B5LWNvbnRyb2wgJHtDTEFTU19DT05UUk9MfSAke0NMQVNTX0hJRERFTn1gXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUgPSBjc3NDbGFzc2VzXG5cbiAgICAgICAgdGhpcy5yZW5kZXJDb21wb25lbnQgPSB0aGlzLnJlbmRlckNvbXBvbmVudC5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMudG9nZ2xlQ29udHJvbCA9IHRoaXMudG9nZ2xlQ29udHJvbC5iaW5kKHRoaXMpXG5cbiAgICB9XG5cbiAgICB0b2dnbGVDb250cm9sKGlzX3Zpc2libGUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoQ0xBU1NfSElEREVOLCAhaXNfdmlzaWJsZSlcbiAgICB9XG5cbiAgICByZW5kZXJDb21wb25lbnQocHJvcHMpIHtcblxuICAgICAgICBwcm9wcy5oYW5kbGVCbHVyID0gKCkgPT4gdGhpcy50b2dnbGVDb250cm9sKGZhbHNlKVxuXG4gICAgICAgIGlmICghdGhpcy5pc19jb21wb25lbnRfaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIFJlYWN0RE9NLnJlbmRlcig8Q29weUlucHV0IHsuLi5wcm9wc30vPiwgdGhpcy5lbGVtZW50KVxuICAgICAgICAgICAgdGhpcy5pc19jb21wb25lbnRfaW5pdGlhbGl6ZWQgPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICBSZWFjdERPTS5oeWRyYXRlKDxDb3B5SW5wdXQgey4uLnByb3BzfS8+LCB0aGlzLmVsZW1lbnQpXG4gICAgfVxuXG4gICAgc2V0Q29vcmRpbmF0ZShjb29yZGluYXRlKSB7XG4gICAgICAgIHRoaXMucmVuZGVyQ29tcG9uZW50KHtjb29yZGluYXRlfSlcbiAgICAgICAgdGhpcy50b2dnbGVDb250cm9sKHRydWUpXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gXCJyZWFjdFwiXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuaW1wb3J0IHtDb250cm9sfSBmcm9tICdvbC9jb250cm9sJ1xuaW1wb3J0IHtzZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlJ1xuXG5jbGFzcyBNb2RhbENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMpXG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHByaWNlOiAzMDAwLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICfQk9Cw0LfRgNGL0L0g0LHSr9GA0YXRjdCy0YcsINCz0LDQt9Cw0YAg0LDRiNC40LPQu9Cw0LvRgicsXG4gICAgICAgICAgICBwYXlsb2FkOiBmYWxzZSxcbiAgICAgICAgICAgIGRhdGFfaWQ6IDIsXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGhhbmRsZVBheW1lbnQoKXtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cGF5bG9hZDogdHJ1ZX0pXG4gICAgICAgIGNvbnN0IHtwcmljZSwgZGVzY3JpcHRpb24sIGRhdGFfaWR9ID0gdGhpcy5zdGF0ZVxuICAgICAgICBzZXJ2aWNlLnBheW1lbnQocHJpY2UsIGRlc2NyaXB0aW9uLCBkYXRhX2lkKS50aGVuKCh7IHBheW1lbnRfaWQgfSkgPT4ge1xuICAgICAgICAgICAgaWYocGF5bWVudF9pZCl7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPWAvcGF5bWVudC9wdXJjaGFzZS8ke3BheW1lbnRfaWR9L2A7XG4gICAgICAgICAgICAgICAgfSwgMTAwMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IGNvbnRlbnQsIGlzX2NvbXBsZXRlIH0gPSB0aGlzLnByb3BzXG4gICAgICAgIGNvbnN0IHsgcGF5bG9hZCB9ID0gdGhpcy5zdGF0ZVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWRpYWxvZyBtb2RhbC1kaWFsb2ctc2Nyb2xsYWJsZVwiIHN0eWxlPXt7ekluZGV4OlwiNVwifX0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtaGVhZGVyXCIgb25DbGljaz17dGhpcy5wcm9wcy5oYW5kbGVDbG9zZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwibW9kYWwtdGl0bGVcIj7QlNGN0LvQs9GN0YDRjdC90LPSr9C5INC80Y3QtNGN0Y3Qu9GN0Ls8L2g1PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgeyFpc19jb21wbGV0ZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPtCi0q/RgCDRhdKv0LvRjdGN0L3RjSDSr9KvLi4uPC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3Bpbm5lci1ib3JkZXIgbWwtYXV0b1wiIHJvbGU9XCJzdGF0dXNcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpc19jb21wbGV0ZSAmJiBjb250ZW50Lm1hcCgoW2xheWVyX25hbWUsIHZhbHVlc10sIGlkeCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17aWR4fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg2PntsYXllcl9uYW1lfTwvaDY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt2YWx1ZXMubWFwKChbZmllbGQsIHZhbHVlXSwgdmFsX2lkeCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17dmFsX2lkeH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+e2ZpZWxkfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3ZhbHVlfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMucHJvcHMuaGFuZGxlQ2xvc2V9IGNsYXNzTmFtZT1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj7QkdGD0YbQsNGFPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICB7cGF5bG9hZCA/XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAg0JDRh9Cw0LDQu9C70LDQtiDQsdCw0LnQvdCwLi4uICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHRleHQtbGlnaHRcIiByb2xlPVwic3RhdHVzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPkxvYWRpbmcuLi48L3NwYW4+IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gdGhpcy5oYW5kbGVQYXltZW50KCl9IGNsYXNzTmFtZT1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj7QpdGD0LTQsNC70LTQsNC2INCw0LLQsNGFPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1vZGFsIGV4dGVuZHMgQ29udHJvbCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRfb3B0aW9ucykge1xuXG4gICAgICBjb25zdCBvcHRpb25zID0gb3B0X29wdGlvbnMgfHwge31cbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgZWxlbWVudDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICB0YXJnZXQ6IG9wdGlvbnMudGFyZ2V0LFxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuaXNfY29tcG9uZW50X2luaXRpYWxpemVkID0gZmFsc2VcblxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lID0gJ21vZGFsIGZhZGUgc2hvdydcblxuICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudCA9IHRoaXMucmVuZGVyQ29tcG9uZW50LmJpbmQodGhpcylcbiAgICAgICAgdGhpcy50b2dnbGVDb250cm9sID0gdGhpcy50b2dnbGVDb250cm9sLmJpbmQodGhpcylcblxuICAgIH1cblxuICAgIHRvZ2dsZUNvbnRyb2woaXNfdmlzaWJsZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnZC1ibG9jaycsIGlzX3Zpc2libGUpXG4gICAgfVxuXG4gICAgcmVuZGVyQ29tcG9uZW50KHByb3BzKSB7XG5cbiAgICAgICAgcHJvcHMuaGFuZGxlQ2xvc2UgPSAoKSA9PiB0aGlzLnRvZ2dsZUNvbnRyb2woZmFsc2UpXG5cbiAgICAgICAgaWYgKCF0aGlzLmlzX2NvbXBvbmVudF9pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgUmVhY3RET00ucmVuZGVyKDxNb2RhbENvbXBvbmVudCB7Li4ucHJvcHN9Lz4sIHRoaXMuZWxlbWVudClcbiAgICAgICAgICAgIHRoaXMuaXNfY29tcG9uZW50X2luaXRpYWxpemVkID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgUmVhY3RET00uaHlkcmF0ZSg8TW9kYWxDb21wb25lbnQgey4uLnByb3BzfS8+LCB0aGlzLmVsZW1lbnQpXG4gICAgfVxuXG4gICAgc2hvd01vZGFsKGNvbnRlbnQsIGlzX2NvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlQ29udHJvbCh0cnVlKVxuICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudCh7Y29udGVudCwgaXNfY29tcGxldGV9KVxuICAgIH1cblxufVxuXG4iLCJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gXCJyZWFjdFwiXG5pbXBvcnQge0NvbnRyb2x9IGZyb20gJ29sL2NvbnRyb2wnXG5pbXBvcnQge0NMQVNTX0NPTlRST0wsIENMQVNTX1VOU0VMRUNUQUJMRX0gZnJvbSAnb2wvY3NzLmpzJ1xuXG5cbmNvbnN0IENMQVNTX0FDVElWRSA9ICdhY3RpdmUnXG5cblxuZXhwb3J0IGNsYXNzINCh0YPRg9GA0YzQlNCw0LLRhdCw0YDQs9CwIGV4dGVuZHMgQ29udHJvbCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRfb3B0aW9ucykge1xuXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBvcHRfb3B0aW9ucyB8fCB7fVxuXG4gICAgICAgIHN1cGVyKHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgdGFyZ2V0OiBvcHRpb25zLnRhcmdldCxcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLnRvZ2dsZUxheWVyID0gdGhpcy50b2dnbGVMYXllci5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMuaW5pdExheWVyID0gdGhpcy5pbml0TGF5ZXIuYmluZCh0aGlzKVxuICAgICAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpXG5cbiAgICAgICAgdGhpcy5sYXN0X2FjdGl2ZSA9IG51bGxcblxuICAgICAgICBjb25zdCBiYXNlX2xheWVycyA9IG9wdGlvbnMubGF5ZXJzLm1hcCh0aGlzLmluaXRMYXllcilcblxuICAgICAgICBjb25zdCBjc3NDbGFzc2VzID0gYNGB0YPRg9GA0Ywt0LTQsNCy0YXQsNGA0LPRg9GD0LQgJHtDTEFTU19VTlNFTEVDVEFCTEV9ICR7Q0xBU1NfQ09OVFJPTH1gXG5cbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudFxuICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGNzc0NsYXNzZXNcbiAgICAgICAgYmFzZV9sYXllcnMuZm9yRWFjaCgobCkgPT4gZWxlbWVudC5hcHBlbmRDaGlsZChsKSlcblxuICAgIH1cblxuICAgIGluaXRMYXllcih7dGh1bWJuYWlsXzF4LCB0aHVtYm5haWxfMngsIGxheWVyLCBpc19hY3RpdmV9KSB7XG5cbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKVxuICAgICAgICBlbC5jbGFzc05hbWUgPSAn0YHRg9GD0YDRjC3QtNCw0LLRhdCw0YDQs9CwJyArIChpc19hY3RpdmUgPyAnICcgKyBDTEFTU19BQ1RJVkUgOiAnJylcblxuICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuICAgICAgICBpbWcuc3Jjc2V0ID0gYCR7dGh1bWJuYWlsXzF4fSAxeCwgJHt0aHVtYm5haWxfMnh9IDJ4YFxuICAgICAgICBlbC5hcHBlbmRDaGlsZChpbWcpXG5cbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2soZWwsIGxheWVyKVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMudG9nZ2xlTGF5ZXIoaXNfYWN0aXZlID09PSB0cnVlLCBlbCwgbGF5ZXIpXG5cbiAgICAgICAgcmV0dXJuIGVsXG5cbiAgICB9XG5cbiAgICB0b2dnbGVMYXllcihpc19hY3RpdmUsIGVsLCBsYXllcikge1xuXG4gICAgICAgIGlmICh0aGlzLmxhc3RfYWN0aXZlICYmIGlzX2FjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5sYXN0X2FjdGl2ZS5sYXllci5zZXRWaXNpYmxlKGZhbHNlKVxuICAgICAgICAgICAgdGhpcy5sYXN0X2FjdGl2ZS5lbC5jbGFzc0xpc3QudG9nZ2xlKENMQVNTX0FDVElWRSwgZmFsc2UpXG4gICAgICAgIH1cblxuICAgICAgICBsYXllci5zZXRWaXNpYmxlKGlzX2FjdGl2ZSlcbiAgICAgICAgZWwuY2xhc3NMaXN0LnRvZ2dsZShDTEFTU19BQ1RJVkUsIGlzX2FjdGl2ZSlcblxuICAgICAgICBpZiAoaXNfYWN0aXZlKVxuICAgICAgICAgICAgdGhpcy5sYXN0X2FjdGl2ZSA9IHtlbCwgbGF5ZXJ9XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2soZWwsIGxheWVyKSB7XG4gICAgICAgIGlmICh0aGlzLmxhc3RfYWN0aXZlICYmIHRoaXMubGFzdF9hY3RpdmUuZWwgPT09IGVsKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIHRoaXMudG9nZ2xlTGF5ZXIodHJ1ZSwgZWwsIGxheWVyKVxuICAgIH1cblxufVxuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gXCJyZWFjdFwiXG5cbmltcG9ydCB7c2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlJ1xuaW1wb3J0IEJ1bmRsZU1hcCBmcm9tICcuL0J1bmRsZU1hcCdcblxuXG5leHBvcnQgY2xhc3MgRGV0YWlsUGFnZSBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcylcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgYnVuZGxlOiBwcm9wcy5idW5kbGUsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVTZWxlY3RCdW5kbGUoZSwgYnVuZGxlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtidW5kbGV9KVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxCdW5kbGVNYXAgYnVuZGxlPXt0aGlzLnN0YXRlLmJ1bmRsZX0vPlxuICAgICAgICApXG4gICAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IHNlcnZpY2UgPSB7XG4gICAgbG9hZFdNU0xheWVycyxcbiAgICBsb2FkQmFzZUxheWVycyxcbiAgICBwYXltZW50XG59XG5cbmZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4gICAgdmFyIGNvb2tpZVZhbHVlID0gbnVsbDtcbiAgICBpZiAoZG9jdW1lbnQuY29va2llICYmIGRvY3VtZW50LmNvb2tpZSAhPT0gJycpIHtcbiAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29va2llID0gY29va2llc1tpXS50cmltKCk7XG4gICAgICAgICAgICAvLyBEb2VzIHRoaXMgY29va2llIHN0cmluZyBiZWdpbiB3aXRoIHRoZSBuYW1lIHdlIHdhbnQ/XG4gICAgICAgICAgICBpZiAoY29va2llLnN1YnN0cmluZygwLCBuYW1lLmxlbmd0aCArIDEpID09PSAobmFtZSArICc9JykpIHtcbiAgICAgICAgICAgICAgICBjb29raWVWYWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChjb29raWUuc3Vic3RyaW5nKG5hbWUubGVuZ3RoICsgMSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29raWVWYWx1ZTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUmVzcG9uc2UocmVzcG9uc2UpIHtcbiAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpLnRoZW4odGV4dCA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0ZXh0ICYmIEpTT04ucGFyc2UodGV4dClcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgaWYgKFs0MDEsIDQwM10uaW5kZXhPZihyZXNwb25zZS5zdGF0dXMpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIC8vIFRPRE8gYXV0byBsb2dvdXQgaWYgNDAxIFVuYXV0aG9yaXplZCBvciA0MDMgRm9yYmlkZGVuIHJlc3BvbnNlIHJldHVybmVkIGZyb20gYXBpXG4gICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKHRydWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IChkYXRhICYmIGRhdGEubWVzc2FnZSkgfHwgcmVzcG9uc2Uuc3RhdHVzVGV4dFxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGFcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBfZ2V0R2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnWC1SZXF1ZXN0ZWQtV2l0aCc6ICdYTUxIdHRwUmVxdWVzdCcsXG4gICAgICAgIH0sXG4gICAgfVxufVxuXG5mdW5jdGlvbiBfZ2V0UG9zdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdYLVJlcXVlc3RlZC1XaXRoJzogJ1hNTEh0dHBSZXF1ZXN0JyxcbiAgICAgICAgICAgICdYLUNTUkZUb2tlbic6IGdldENvb2tpZSgnY3NyZnRva2VuJyksXG4gICAgICAgIH0sXG4gICAgfVxufVxuXG5mdW5jdGlvbiBsb2FkV01TTGF5ZXJzKGlkKSB7XG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICAgIC4uLl9nZXRHZXRPcHRpb25zKCksXG4gICAgfVxuICAgIHJldHVybiBmZXRjaChgL9C00Y3QtC3RgdCw0L0vJHtpZH0v0LTQsNCy0YXQsNGA0LPRg9GD0LQvYCwgcmVxdWVzdE9wdGlvbnMpLnRoZW4oaGFuZGxlUmVzcG9uc2UpXG59XG5cbmZ1bmN0aW9uIGxvYWRCYXNlTGF5ZXJzKCkge1xuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgICAuLi5fZ2V0R2V0T3B0aW9ucygpLFxuICAgIH1cbiAgICByZXR1cm4gZmV0Y2goJy/RgdGD0YPRgNGMLdC00LDQstGF0LDRgNCz0LAvJywgcmVxdWVzdE9wdGlvbnMpLnRoZW4oaGFuZGxlUmVzcG9uc2UpXG59XG5cbmZ1bmN0aW9uIHBheW1lbnQocHJpY2UsIGRlc2NyaXB0aW9uLCBkYXRhX2lkKSB7XG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICAgIC4uLl9nZXRQb3N0T3B0aW9ucygpLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7cHJpY2UsIGRlc2NyaXB0aW9uLCBkYXRhX2lkfSlcbiAgICB9XG4gICAgcmV0dXJuIGZldGNoKCcvYmFjay9wYXltZW50L3B1cmNoYXNlLycsIHJlcXVlc3RPcHRpb25zKS50aGVuKGhhbmRsZVJlc3BvbnNlKVxufVxuIiwidmFyIGFwaSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCIpO1xuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5jc3NcIik7XG5cbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50Ll9fZXNNb2R1bGUgPyBjb250ZW50LmRlZmF1bHQgOiBjb250ZW50O1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbiAgICAgICAgICAgIH1cblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5pbnNlcnQgPSBcImhlYWRcIjtcbm9wdGlvbnMuc2luZ2xldG9uID0gZmFsc2U7XG5cbnZhciB1cGRhdGUgPSBhcGkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzIHx8IHt9OyIsImV4cG9ydCBjb25zdCBoZWxwZXJzID0ge1xuICAgIHBhcnNlQ29vcmRpbmF0ZVN0cmluZyxcbn1cblxuXG5mdW5jdGlvbiBwYXJzZUNvb3JkaW5hdGVTdHJpbmcoY29vcmRpbmF0ZV9zdHJpbmcpIHtcblxuICAgIGNvbnN0IHJlc3VsdCA9IC9eKD88bGF0aXR1ZGU+LT9cXGQrKFxcLlxcZCspPylbLCBdKD88bG9uZ2l0dWRlPi0/XFxkKyhcXC5cXGQrKT8pJC8uZXhlYyhjb29yZGluYXRlX3N0cmluZylcbiAgICBsZXQgW2xhdCwgbG9uXSA9IFswLCAwXVxuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBsYXQgPSBwYXJzZUZsb2F0KHJlc3VsdC5ncm91cHMubGF0aXR1ZGUpXG4gICAgICAgIGxvbiA9IHBhcnNlRmxvYXQocmVzdWx0Lmdyb3Vwcy5sb25naXR1ZGUpXG4gICAgfVxuXG4gICAgLy8gQWNjb3JkaW5nIHRvIE9wZW5MYXllcnMgdGhlIGZvcm1hdCBpcyBbeCwgeV0gb3IgW2xvbmdpdHVkZSwgbGF0aXR1ZGVdXG4gICAgcmV0dXJuIFtsb24sIGxhdF1cbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7cmVuZGVyfSBmcm9tICdyZWFjdC1kb20nXG5cbmltcG9ydCB7QXBwfSBmcm9tICcuL2NvbXBvbmVudHMvQXBwJ1xuXG5jb25zdCBidW5kbGUgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidW5kbGUtYXBwLWRhdGEnKS5pbm5lckhUTUwpXG5cbnJlbmRlcig8QXBwIGJ1bmRsZT17YnVuZGxlfS8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVuZGxlLWFwcCcpKVxuIiwiLy8gSW1wb3J0c1xudmFyIF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpO1xuZXhwb3J0cyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhmYWxzZSk7XG4vLyBNb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcImVsZW1lbnQuc3R5bGUge1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcbi7wn4yNIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4u8J+MjSA+ICNtYXB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDM3cHggLSA5NnB4IC0gMzMuNXB4IC0gMHB4KTtcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcbiB9XFxuXFxuLuKamSB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiAxJTtcXG4gICAgcmlnaHQ6IDcwcHg7XFxuICAgIGJvdHRvbTogMTUwcHg7XFxuICAgIHBhZGRpbmctdG9wOiAxcmVtO1xcbiAgICBwYWRkaW5nLWJvdHRvbTogMXJlbTtcXG4gICAgb3ZlcmZsb3cteTogYXV0bztcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICAgIC13ZWJraXQtYm94LXNoYWRvdzogMHB4IDBweCAyMXB4IDdweCByZ2JhKDAsMCwwLDAuNjUpO1xcbiAgICAtbW96LWJveC1zaGFkb3c6IDBweCAwcHggMjFweCA3cHggcmdiYSgwLDAsMCwwLjY1KTtcXG4gICAgYm94LXNoYWRvdzogMHB4IDBweCAyMXB4IDdweCByZ2JhKDAsMCwwLDAuNjUpO1xcbiAgICBvcGFjaXR5OiAxO1xcblxcblxcbn1cXG4u4pqZLm9sLWhpZGRlbiB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcXG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAuMXMgbGluZWFyLCB2aXNpYmlsaXR5IDBzIGxpbmVhciAuMXM7XFxufVxcblxcbi7impktdG9nZ2xle1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHRvcDogN3B4O1xcbiAgICByaWdodDogMTJweDtcXG4gICAgd2lkdGg6IDUwcHg7XFxuICAgIGhlaWdodDogNTBweDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDYwLDEzNiwwLjUpO1xcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICAgIHBhZGRpbmc6IDJweDtcXG59XFxuLuKamS10b2dnbGU6aG92ZXJ7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCw2MCwxMzYsMC43KTtcXG59XFxuLuKamS10b2dnbGU6Zm9jdXN7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCw2MCwxMzYsMC43KTtcXG5cXG59XFxuXFxuXFxuLuKamS10b2dnbGUgYXtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB0b3A6IC02cHg7XFxuICAgIHJpZ2h0OiAtN3B4O1xcbiAgICB3aWR0aDogNTBweDtcXG4gICAgaGVpZ2h0OiA1MHB4O1xcblxcbn1cXG4uZmEtbGd7XFxuICAgIGZvbnQtc2l6ZTogNDBweDtcXG4gICAgY29sb3I6IHdoaXRlO1xcbiAgICBsaW5lLWhlaWdodDogdW5zZXQ7XFxufVxcbi7RgdGD0YPRgNGMLdC00LDQstGF0LDRgNCz0YPRg9C0e1xcbiAgICByaWdodDogLjVyZW07XFxuICAgIGJvdHRvbTogNzBweDtcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcbn1cXG4u0YHRg9GD0YDRjC3QtNCw0LLRhdCw0YDQs9GD0YPQtCA+IC7RgdGD0YPRgNGMLdC00LDQstGF0LDRgNCz0LB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICB3aWR0aDogOHJlbTtcXG4gICAgaGVpZ2h0OiA0LjVyZW07XFxuICAgIG92ZXJmbG93OiBoaWRkZW47XFxuICAgIG1hcmdpbjogMXB4O1xcbiAgICBib3JkZXItcmFkaXVzOiAycHg7XFxuICAgIGZsb2F0OiByaWdodDtcXG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAuMTVzIGVhc2Utb3V0O1xcbn1cXG4u0YHRg9GD0YDRjC3QtNCw0LLRhdCw0YDQs9GD0YPQtCA+IC7RgdGD0YPRgNGMLdC00LDQstGF0LDRgNCz0LAuYWN0aXZlLFxcbi7RgdGD0YPRgNGMLdC00LDQstGF0LDRgNCz0YPRg9C0OmhvdmVyID4gLtGB0YPRg9GA0Ywt0LTQsNCy0YXQsNGA0LPQsC5hY3RpdmU6aG92ZXIsXFxuLtGB0YPRg9GA0Ywt0LTQsNCy0YXQsNGA0LPRg9GD0LQgPiAu0YHRg9GD0YDRjC3QtNCw0LLRhdCw0YDQs9CwOmhvdmVyIHtcXG4gICAgb3BhY2l0eTogMTtcXG59XFxuLtGB0YPRg9GA0Ywt0LTQsNCy0YXQsNGA0LPRg9GD0LQgPiAu0YHRg9GD0YDRjC3QtNCw0LLRhdCw0YDQs9CwLFxcbi7RgdGD0YPRgNGMLdC00LDQstGF0LDRgNCz0YPRg9C0OmhvdmVyID4gLtGB0YPRg9GA0Ywt0LTQsNCy0YXQsNGA0LPQsC5hY3RpdmUge1xcbiAgICBvcGFjaXR5OiAuNztcXG59XFxuXFxuXFxuLm9sLWZ1bGwtc2NyZWVuIHtcXG4gICAgcmlnaHQ6IC41cmVtO1xcbiAgICB0b3A6IDU4cHg7XFxuICAgIHdpZHRoOiA1N3B4O1xcbiAgICBoZWlnaHQ6IDU3cHg7XFxuXFxufVxcbi5vbC1mdWxsLXNjcmVlbiAub2wtZnVsbC1zY3JlZW4tZmFsc2V7XFxuICAgIHdpZHRoOiA1MHB4O1xcbiAgICBoZWlnaHQ6IDUwcHg7XFxuICAgIGZvbnQtc2l6ZTogNDBweDtcXG5cXG59XFxuLm9sLWZ1bGwtc2NyZWVuIC5vbC1mdWxsLXNjcmVlbi10cnVle1xcbiAgICB3aWR0aDogNTBweDtcXG4gICAgaGVpZ2h0OiA1MHB4O1xcbiAgICBmb250LXNpemU6IDQwcHg7XFxuXFxufVxcbi5vbC16b29tIHtcXG4gICAgd2lkdGg6IDU3cHg7XFxuICAgIGhlaWdodDogMTA3cHg7XFxuICAgIGxlZnQ6IHVuc2V0O1xcbiAgICByaWdodDogLjVyZW07XFxuICAgIHRvcDogMTEwcHg7XFxufVxcbi5vbC16b29tICAub2wtem9vbS1vdXR7XFxuICAgIHdpZHRoOiA1MHB4O1xcbiAgICBoZWlnaHQ6IDUwcHg7XFxuICAgIGZvbnQtc2l6ZTogNTVweDtcXG5cXG59XFxuLm9sLXpvb20gLm9sLXpvb20taW57XFxuICAgIHdpZHRoOiA1MHB4O1xcbiAgICBoZWlnaHQ6IDUwcHg7XFxuICAgIGZvbnQtc2l6ZTogNTVweDtcXG59XFxuXFxuLm9sLW1vdXNlLXBvc2l0aW9uIHtcXG4gICAgcmlnaHQ6IDRyZW07XFxuICAgIGJhY2tncm91bmQ6IHJnYmEoMCw2MCwxMzYsMC4zKTtcXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgICBwYWRkaW5nOiAycHggLjJyZW07XFxuICAgIGZvbnQtc2l6ZTogc21hbGxlcjtcXG4gICAgY29sb3I6ICNlZWU7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgd2lkdGg6IDguOHJlbTtcXG4gICAgbWluLWhlaWdodDogMXJlbTtcXG59XFxuXFxuLmNvb3JkaW5hdGUtY29weS1jb250cm9sIHtcXG4gICAgd2lkdGg6IDEwcmVtO1xcbiAgICBsZWZ0OiAyJTtcXG4gICAgdG9wOiAwLjVyZW07XFxuICAgIG9wYWNpdHk6IDE7XFxufVxcbi5jb29yZGluYXRlLWNvcHktY29udHJvbC5vbC1oaWRkZW4ge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XFxuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgLjI1cyBsaW5lYXIsIHZpc2liaWxpdHkgMHMgbGluZWFyIC4yNXM7XFxufVxcblxcbi5vbC1zY2FsZS1saW5le1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgIGJvdHRvbTogNzBweDtcXG59XFxuXCIsIFwiXCJdKTtcbi8vIEV4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcbiJdLCJzb3VyY2VSb290IjoiIn0=