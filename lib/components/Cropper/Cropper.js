'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactCropper = require('react-cropper');

var _reactCropper2 = _interopRequireDefault(_reactCropper);

var _Form = require('../Form/Form');

var _Form2 = _interopRequireDefault(_Form);

var _Fields = require('../Form/Fields');

var _Fields2 = _interopRequireDefault(_Fields);

var _Input = require('../Form/Input');

var _Input2 = _interopRequireDefault(_Input);

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

require('react-cropper/node_modules/cropperjs/dist/cropper.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cropper = function (_React$Component) {
    _inherits(Cropper, _React$Component);

    function Cropper(props) {
        _classCallCheck(this, Cropper);

        var _this = _possibleConstructorReturn(this, (Cropper.__proto__ || Object.getPrototypeOf(Cropper)).call(this, props));

        _this._onChange = _this._onChange.bind(_this);
        _this._zoomOut = _this._zoomOut.bind(_this);
        _this._zoomIn = _this._zoomIn.bind(_this);
        _this._flipLeft = _this._flipLeft.bind(_this);
        _this._flipRight = _this._flipRight.bind(_this);
        _this._remove = _this._remove.bind(_this);
        _this._upload = _this._upload.bind(_this);
        _this._setImageSource = _this._setImageSource.bind(_this);
        return _this;
    }

    _createClass(Cropper, [{
        key: 'initialize',
        value: function initialize() {
            return {
                aspectRatio: this.props.aspectRatio,
                cropResult: '',
                croppedWidth: this.props.defaultWidth,
                croppedHeight: this.props.defaultHeight,
                imageSource: this.props.src,
                cuts: [],
                imageData: {},
                backdrop: { url: '', sizes: [] },
                mediumh: { url: '', sizes: [] },
                mediumv: { url: '', sizes: [] },
                poster: { url: '', sizes: [] },
                banner: { url: '', sizes: [] },
                square: { url: '', sizes: [] }
            };
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.state = this.initialize();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            setTimeout(function () {
                window.dispatchEvent(new Event('resize'));
            }, 1000); /* @TODO: fix this. This is just a workaround because react-cropper initializes the
                      cropper canvas on the default size (200x100), probably because it does not recognise the size of the container.
                      What this does, is fake a resize event so that the cropper resets the width because of the responsive feature  */
        }
    }, {
        key: '_zoomOut',
        value: function _zoomOut() {
            this.refs.cropper.zoom(-0.1);
        }
    }, {
        key: '_zoomIn',
        value: function _zoomIn() {
            this.refs.cropper.zoom(0.1);
        }
    }, {
        key: '_flipLeft',
        value: function _flipLeft() {
            this.refs.cropper.rotate(-45);
        }
    }, {
        key: '_flipRight',
        value: function _flipRight() {
            this.refs.cropper.rotate(45);
        }
    }, {
        key: '_setImageSource',
        value: function _setImageSource(e) {
            this.setState({ imageSource: e.target.value });
        }
    }, {
        key: '_remove',
        value: function _remove() {}
    }, {
        key: '_upload',
        value: function _upload() {}
    }, {
        key: 'getCrops',
        value: function getCrops() {
            var availableCrops = this.state.cuts.map(function (crop) {
                console.log(crops);
            });
        }
    }, {
        key: '_checkSizes',
        value: function _checkSizes(type, cropData) {
            var imageTypes = _config2.default.media.imageTypes;
            var imageSizes = _config2.default.media.imageSizes;
            var size = imageTypes[type] ? imageTypes[type].split('x') : [0, 0];
            var comparable = parseInt(size[0]) * parseInt(size[1]);
            var cropSize = cropData.width * cropData.height;
            var availableSizes = [];

            availableSizes = imageSizes.filter(function (v) {
                return cropSize >= comparable * v;
            });

            return availableSizes;
        }
    }, {
        key: '_onChange',
        value: function _onChange() {
            var _this2 = this;

            /* In this all the information of the image and the crop is gathered */
            var image = this.refs.cropper.getCroppedCanvas();
            image = image.toDataURL('image/jpeg', 0.4);
            var data = this.refs.cropper.getData();
            this.setState({ imageData: data });
            var imageData = this.refs.cropper.getImageData();
            var cuts = this.state.cuts;

            /* figure out which aspect ratio was selected and set the corresponding
            object. This is to display the preview and also pass the cut information
            to the onChange callback
            */
            var doCut = function doCut(ratio) {
                var options = {};
                options[(16 / 9).toString()] = function () {
                    return {
                        backdrop: {
                            url: image,
                            sizes: _this2._checkSizes('backdrop', data),
                            crop: data
                        }
                    };
                };
                options[(2 / 3).toString()] = function () {
                    return {
                        poster: {
                            url: image,
                            sizes: _this2._checkSizes('poster', data)
                        }
                    };
                };
                options[(4 / 3).toString()] = function () {
                    return {
                        mediumh: {
                            url: image,
                            sizes: _this2._checkSizes('mediumh', data)
                        }
                    };
                };
                options[(3 / 4).toString()] = function () {
                    return {
                        mediumv: {
                            url: image,
                            sizes: _this2._checkSizes('mediumv', data)
                        }
                    };
                };
                options['1'] = function () {
                    return {
                        square: {
                            url: image,
                            sizes: _this2._checkSizes('square', data)
                        }
                    };
                };
                options['5'] = function () {
                    return {
                        banner: {
                            url: image,
                            sizes: _this2._checkSizes('banner', data)
                        }
                    };
                };
                if (typeof options[ratio] !== 'function') {
                    throw new Error('Invalid option');
                }
                var result = options[ratio]();
                var exists = false;
                cuts.forEach(function (v) {
                    if (Object.keys(result)[0] == Object.keys(v)[0]) {
                        exists = true;
                    }
                });
                if (!exists) {
                    cuts.push(result);
                }
                _this2.setState(result);
                _this2.setState({ cuts: cuts });
            };

            doCut(this.state.aspectRatio);

            if (this.props.onChange) {
                var result = {
                    _id: this.props.id,
                    cuts: this.state.cuts
                };
                this.props.onChange(image, this.state.cuts, this.state.imageData);
            }
            this.setState({
                croppedWidth: data.width,
                croppedHeight: data.height,
                originalWidth: imageData.naturalWidth,
                originalHeight: imageData.naturalHeight,
                cropResult: image
            });
        }
    }, {
        key: 'setAspectRatio',
        value: function setAspectRatio(ratio) {
            this.setState({ aspectRatio: ratio });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { style: { maxWidth: 960 } },
                _react2.default.createElement(
                    _Form2.default,
                    null,
                    _react2.default.createElement(
                        _Fields2.default,
                        null,
                        _react2.default.createElement(_Input2.default, { labeled: true, label: 'URL', placeholder: 'http://', onChange: this._setImageSource })
                    ),
                    _react2.default.createElement(_reactCropper2.default, {
                        ref: 'cropper',
                        src: this.props.src,
                        aspectRatio: this.state.aspectRatio,
                        style: {
                            width: '100%',
                            height: 400
                        },
                        rotatable: true,
                        cropend: this._onChange,
                        crossOrigin: this.state.imageSource,
                        zoomOnWheel: false,
                        viewMode: 1
                    }),
                    _react2.default.createElement(
                        'div',
                        { className: 'cropper actions', style: { display: 'flex' } },
                        _react2.default.createElement(
                            'button',
                            {
                                onClick: this._zoomOut,
                                className: 'ui clear teal basic button'
                            },
                            _react2.default.createElement('i', { className: 'icon-zoom-out icon' })
                        ),
                        _react2.default.createElement(
                            'button',
                            {
                                onClick: this._zoomIn,
                                className: 'ui clear teal basic button'
                            },
                            _react2.default.createElement('i', { className: 'icon-zoom-in icon' })
                        ),
                        _react2.default.createElement(
                            'button',
                            {
                                onClick: this._flipLeft,
                                className: 'ui clear teal basic button'
                            },
                            _react2.default.createElement('i', { className: 'icon-arrow-flip-left icon' })
                        ),
                        _react2.default.createElement(
                            'button',
                            {
                                onClick: this._flipRight,
                                className: 'ui clear teal basic button'
                            },
                            _react2.default.createElement('i', { className: 'icon-arrow-flip-right icon' })
                        ),
                        _react2.default.createElement(
                            'button',
                            {
                                onClick: this._remove,
                                className: 'ui clear red basic button'
                            },
                            _react2.default.createElement('i', { className: 'icon-trash icon' })
                        ),
                        _react2.default.createElement(
                            'button',
                            {
                                onClick: this._upload,
                                className: 'ui clear teal basic button'
                            },
                            _react2.default.createElement('i', { className: 'icon-arrow-up icon' })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'h5',
                            null,
                            'Imagenes de preview'
                        ),
                        _react2.default.createElement(
                            'p',
                            null,
                            'En la elección del formato de la imagen, se aconseja subir imágenes en el tamaño mínimo recomendado. No obstante una imagen de menor tamaño se exhibirá de todas maneras pero en menor calidad.'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'image preview list' },
                        _react2.default.createElement(
                            'section',
                            null,
                            _react2.default.createElement(
                                'button',
                                {
                                    onClick: this.setAspectRatio.bind(this, 16 / 9),
                                    className: 'item ui button',
                                    style: {
                                        width: 170 * (16 / 9),
                                        height: '170px',
                                        backgroundImage: 'url(' + this.state.backdrop.url + ')',
                                        backgroundSize: 'cover'
                                    }
                                },
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    '1600x900 (16:9)'
                                ),
                                _react2.default.createElement(
                                    'h4',
                                    null,
                                    'Backdrop'
                                )
                            ),
                            _react2.default.createElement(
                                'button',
                                {
                                    onClick: this.setAspectRatio.bind(this, 2 / 3),
                                    className: 'item ui button',
                                    style: {
                                        width: 170 * (2 / 3),
                                        height: '170px',
                                        backgroundImage: 'url(' + this.state.poster.url + ')',
                                        backgroundSize: 'cover'
                                    }
                                },
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    '600x900 (2:3)'
                                ),
                                _react2.default.createElement(
                                    'h4',
                                    null,
                                    'Poster'
                                )
                            ),
                            _react2.default.createElement(
                                'button',
                                {
                                    onClick: this.setAspectRatio.bind(this, 4 / 3),
                                    className: 'item ui button',
                                    style: {
                                        width: 170 * (4 / 3),
                                        height: '170px',
                                        backgroundImage: 'url(' + this.state.mediumh.url + ')',
                                        backgroundSize: 'cover'
                                    }
                                },
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    '800x600 (4:3)'
                                ),
                                _react2.default.createElement(
                                    'h4',
                                    null,
                                    'Medium H'
                                )
                            ),
                            _react2.default.createElement(
                                'button',
                                {
                                    onClick: this.setAspectRatio.bind(this, 1 / 1),
                                    className: 'item ui button',
                                    style: {
                                        width: 170,
                                        height: '170px',
                                        backgroundImage: 'url(' + this.state.square.url + ')',
                                        backgroundSize: 'cover'
                                    }
                                },
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    '600x600 (1:1)'
                                ),
                                _react2.default.createElement(
                                    'h4',
                                    null,
                                    'Square'
                                )
                            ),
                            _react2.default.createElement(
                                'button',
                                {
                                    onClick: this.setAspectRatio.bind(this, 3 / 4),
                                    className: 'item ui button',
                                    style: {
                                        width: 170 * (3 / 4),
                                        height: '170px',
                                        backgroundImage: 'url(' + this.state.mediumv.url + ')',
                                        backgroundSize: 'cover'
                                    }
                                },
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    '600x800 (3:4)'
                                ),
                                _react2.default.createElement(
                                    'h4',
                                    null,
                                    'Medium V'
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'section',
                            null,
                            _react2.default.createElement(
                                'button',
                                {
                                    onClick: this.setAspectRatio.bind(this, 5 / 1),
                                    className: 'item ui button',
                                    style: {
                                        width: 192 * 5,
                                        height: '192px',
                                        backgroundImage: 'url(' + this.state.banner.url + ')',
                                        backgroundSize: 'cover'
                                    }
                                },
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    '1600x320 (5:1)'
                                ),
                                _react2.default.createElement(
                                    'h4',
                                    null,
                                    'Banner'
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Cropper;
}(_react2.default.Component);

Cropper.propTypes = {
    aspectRatio: _react2.default.PropTypes.number,
    guides: _react2.default.PropTypes.bool,
    style: _react2.default.PropTypes.object,
    src: _react2.default.PropTypes.string,
    onCrop: _react2.default.PropTypes.func,
    crop: _react2.default.PropTypes.func
};
Cropper.defaultProps = {
    aspectRatio: 16 / 9,
    defaultWidth: 1600,
    defaultHeight: 900,
    guides: false,
    src: '',
    style: {},
    onCrop: Cropper._onCrop,
    crop: Cropper._crop
};

exports.default = Cropper;