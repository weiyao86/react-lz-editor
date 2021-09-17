'use strict';



var _input = require('antd/lib/input');

var _input2 = _interopRequireDefault(_input);



var _upload = require('antd/lib/upload');

var _upload2 = _interopRequireDefault(_upload);



var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);



var _icon = require('antd/lib/icon');

var _icon2 = _interopRequireDefault(_icon);



var _message = require('antd/lib/message');

var _message2 = _interopRequireDefault(_message);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _publicDatas = require('../../supports/publicDatas');

var _findIndex = require('lodash/findIndex');

var _findIndex2 = _interopRequireDefault(_findIndex);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _uniqBy = require('lodash/uniqBy');

var _uniqBy2 = _interopRequireDefault(_uniqBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UploadImage = function (_Component) {
  _inherits(UploadImage, _Component);

  function UploadImage(props) {
    _classCallCheck(this, UploadImage);

    var _this2 = _possibleConstructorReturn(this, (UploadImage.__proto__ || Object.getPrototypeOf(UploadImage)).call(this, props));

    _this2.state = {
      isLoad: false,
      qiniu: {
        token: _this2.props.uploadConfig && Object.keys(_this2.props.uploadConfig).length ? _publicDatas.PRO_QINIU.checkQiniu.returnToken(_this2.props.uploadConfig) : null
      },
      files: [],
      upReceiverFun: null,
      inputVideoUrl: "",
      inputVideoHelp: ""
    };

    _this2.getInputVideo = _this2.getInputVideo.bind(_this2);
    _this2.changeInputVideo = _this2.changeInputVideo.bind(_this2);
    return _this2;
  }

  _createClass(UploadImage, [{
    key: 'changeInputVideo',
    value: function changeInputVideo(e) {
      var value = e.target.value;

      this.setState({ inputVideoUrl: value });
    }
  }, {
    key: 'getInputVideo',
    value: function getInputVideo(e) {
      var _this3 = this;

      var value = e.target.value;
      if (_publicDatas.PRO_COMMON.Validation.isWebFileURL(value, this.props.fileType)) {
        this.state.inputVideoUrl = "";
        this.state.inputVideoHelp = "";
        this.forceUpdate();
        setTimeout(function () {
          _this3.state.files.push({ url: value, name: value, status: "done", uid: "uid_" + _publicDatas.PRO_COMMON.String.RndNum(20) });

          setTimeout(function () {
            _this3.props.cbReceiver(_this3.state.files);
          }, 100);
        }, 100);
      } else {
        this.state.inputVideoHelp = this.props.lang.invalidUrl;
        this.forceUpdate();
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var list = [];
      if (!!this.props.fileList) {
        this.props.fileList.copyWithin(list);
      }

      if (!!list) {
        this.setState({ files: list });
      }
    }
  }, {
    key: 'beforeUpload',
    value: function beforeUpload(file) {
      var isFormat = _publicDatas.PRO_COMMON.Array.inArray(_publicDatas.PRO_QINIU.supportMime[this.props.fileType], file.type);
      if (!isFormat) {
        _message2.default.error(this.props.lang.supportMimeMsg + ' File Mimetype: ' + _publicDatas.PRO_QINIU.supportMime[this.props.fileType].join(", "), 10);
        return false;
      }
      if (!this.state.qiniu.token && !uploadConfig) {
        var token = _publicDatas.PRO_QINIU.checkQiniu.returnToken(this.props.uploadConfig);
        this.state.qiniu.token = token;
      }
      return isFormat;
    }
  }, {
    key: 'onChange',
    value: function onChange(info) {
      var _this4 = this;

      clearTimeout(this.state.upReceiverFun);
      var fileList = info.fileList;

      fileList = fileList.filter(function (f) {
        return !f.length;
      });
      var url = "";
      if (this.props.fileType == "image") {
        url = _publicDatas.PRO_URL.QINIU_DOMAIN_IMG_URL || this.props.uploadConfig.QINIU_DOMAIN_IMG_URL;
      } else if (this.props.fileType == "video" || this.props.fileType == "audio") {
        url = _publicDatas.PRO_URL.QINIU_DOMAIN_VIDEO_URL || this.props.uploadConfig.QINIU_DOMAIN_VIDEO_URL;
      }

      fileList = fileList.map(function (file) {
        if (file.response) {
          file.url = url + "/" + file.response.key;
        }
        if (!file.length) {
          return file;
        }
      });
      var _this = this;

      fileList = fileList.filter(function (file) {
        var hasNoExistCurrFileInUploadedList = !~(0, _findIndex2.default)(_this.state.files, function (item) {
          return item.name === file.name;
        });
        if (hasNoExistCurrFileInUploadedList) {
          if (!!_this.props.isMultiple == true) {
            _this.state.files.push(file);
          } else {
            _this.state.files = [file];
          }
        }
        if (!!file.response) {
          if (!!_this.props.limit && _this.state.files.length > _this.props.limit) {
            _message2.default.info(_this.props.lang.limitCountTip.replace("$limit$", _this.props.limit), 5);
            _publicDatas.PRO_COMMON.Array.removeByIndex(_this.state.files, 0);
          }
        }
        return !!file.response || !!file.url && file.status == "done" || file.status == "uploading";
      });
      fileList = (0, _uniqBy2.default)(fileList, "name");

      if (!!fileList && fileList.length != 0) {
        console.log("upload set files as fileList", fileList);
        this.setState({ files: fileList });
      }
      _this.forceUpdate();
      this.state.upReceiverFun = setTimeout(function () {
        if (!!_this4.state.files && _this4.state.files.length == 0) {
          return false;
        }
        _this4.props.cbReceiver(_this4.state.files);
      }, 1000);
    }
  }, {
    key: 'supportFileType',
    value: function supportFileType(props, propName, componentName) {
      componentName = componentName || 'ANONYMOUS';
      if (props[propName]) {
        var value = props[propName];
        if (typeof value === 'string') {
          var isInSupport = !!_publicDatas.PRO_QINIU.supportMime[value];
          return isInSupport ? null : new Error(propName + ' in ' + componentName + this.props.lang.invalidType);
        }
      } else {
        throw new Error(propName + ' in ' + componentName + this.props.lang.invalidFileType);
        return false;
      }

      return null;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this5 = this;

      clearTimeout(this.state.upReceiverFun);
      if (nextProps.uploadProps) {

        this.state.upReceiverFun = setTimeout(function () {
          if (!!nextProps.uploadProps.fileList && nextProps.uploadProps.fileList.length == 0) {
            return false;
          }
          _this5.props.cbReceiver(nextProps.uploadProps.fileList);
        }, 1000);
        return false;
      }
      if ((0, _isEqual2.default)(nextProps.fileList, this.state.files)) {
        return false;
      }
      if (nextProps.isOpenModel) {
        this.state.files = [];
        this.forceUpdate();
      }

      var list = [];
      if (this.state.files.length) {
        list = this.state.files.copyWithin(0);
      } else {
        list = (0, _cloneDeep2.default)(nextProps.fileList);
      }
      if (!!list) {
        _publicDatas.PRO_COMMON.obj.refsKeyTo(list, "uid");
        this.setState({ files: list });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var _props = this.props,
          isMultiple = _props.isMultiple,
          isShowUploadList = _props.isShowUploadList,
          uploadProps = _props.uploadProps,
          that = this;

      uploadProps = uploadProps && Object.keys(uploadProps).length > 0 ? uploadProps : {
        action: _publicDatas.PRO_URL.QINIU_URL || this.props.uploadConfig.QINIU_URL,
        onChange: this.onChange.bind(this),
        listType: 'picture',
        fileList: this.state.files,
        data: function data(file) {
          var token = that.state.qiniu.token,
              key = "";
          if (!token) {
            token = _publicDatas.PRO_QINIU.checkQiniu.returnToken(_this6.props.uploadConfig);
          }
          key = _publicDatas.PRO_COMMON.String.RndNum(20) + "." + _publicDatas.PRO_COMMON.String.GetFileExtensionName(file.name)[0];
          if (_this6.props.uploadConfig.QINIU_KEY_PREFIX) {
            key = _this6.props.uploadConfig.QINIU_KEY_PREFIX + '/' + key;
          }
          return { token: token, key: key };
        },
        multiple: isMultiple || false,
        beforeUpload: this.beforeUpload.bind(this),
        showUploadList: isShowUploadList !== undefined ? isShowUploadList : true
      };


      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _upload2.default,
          uploadProps,
          _react2.default.createElement(
            _button2.default,
            null,
            _react2.default.createElement(_icon2.default, { type: 'upload' }),
            this.props.lang.btnUpload
          )
        ),
        _react2.default.createElement(
          'div',
          { style: { margin: "10px 0 0" } },
          _react2.default.createElement(_input2.default, {
            placeholder: this.props.lang.manuallyUploadTip,
            value: this.state.inputVideoUrl,
            onChange: this.changeInputVideo,
            onPressEnter: this.getInputVideo }),
          _react2.default.createElement(
            'span',
            { style: { color: 'red' } },
            this.state.inputVideoHelp,
            '\xA0'
          )
        ),
        _react2.default.createElement(
          'span',
          null,
          this.props.showImageTipCp ? this.props.showImageTipCp :
          this.props.lang.limitAndTypeTip.replace("$limit$", this.props.limit).replace("$type$", _publicDatas.PRO_QINIU.supportMime[this.props.fileType].join(", "))
        )
      );
    }
  }]);

  return UploadImage;
}(_react.Component);

UploadImage.defaultProps = {
  limit: 1,
  isMultiple: false,
  isShowUploadList: true,
  fileType: "image",
  description: "请根据要求上传。"
};

module.exports = UploadImage;
