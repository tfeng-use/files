"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var Animal = /*#__PURE__*/function () {
  function Animal(name) {
    (0, _classCallCheck2.default)(this, Animal);
    this.name = name;
  }

  (0, _createClass2.default)(Animal, [{
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }]);
  return Animal;
}();

var dog = new Animal('dog');