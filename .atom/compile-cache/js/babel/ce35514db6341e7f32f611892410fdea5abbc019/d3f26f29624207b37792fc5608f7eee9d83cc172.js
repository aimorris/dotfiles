Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _createText = require('./create-text');

var _createText2 = _interopRequireDefault(_createText);

var _constantsFixturesPath = require('../constants/fixtures-path');

var _constantsFixturesPath2 = _interopRequireDefault(_constantsFixturesPath);

var _libHelpersCommonHelpers = require('../../lib/helpers/common-helpers');

var _libHelpersCommonHelpers2 = _interopRequireDefault(_libHelpersCommonHelpers);

/**
 * @return {Promise.<undefined>} - To create a file.
 */
'use babel';

exports['default'] = _asyncToGenerator(function* () {
  var createdPath = _constantsFixturesPath2['default'].largeTextPath;
  return (0, _createText2['default'])(createdPath, writeContents);
});

/**
 * @param {WriteStream} ws - A write stream.
 * @return {undefined}
 */
function writeContents(ws) {
  _libHelpersCommonHelpers2['default'].times(10000, function () {
    ws.write("<div class='foo'>This is contents.</div>\r\n");
  });
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9zcGVjL3NjcmlwdHMvY3JlYXRlLWxhcmdlLXRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBRXVCLGVBQWU7Ozs7cUNBQ2IsNEJBQTRCOzs7O3VDQUMzQixrQ0FBa0M7Ozs7Ozs7QUFKNUQsV0FBVyxDQUFDOzt1Q0FTRyxhQUFpQztBQUM5QyxNQUFNLFdBQVcsR0FBRyxtQ0FBYSxhQUFhLENBQUM7QUFDL0MsU0FBTyw2QkFBVyxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUM7Q0FDL0M7Ozs7OztBQU1ELFNBQVMsYUFBYSxDQUFDLEVBQUUsRUFBRTtBQUN6Qix1Q0FBYyxLQUFLLENBQUMsS0FBSyxFQUFFLFlBQU07QUFDL0IsTUFBRSxDQUFDLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0dBQzFELENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6Ii9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9zcGVjL3NjcmlwdHMvY3JlYXRlLWxhcmdlLXRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGNyZWF0ZVRleHQgZnJvbSAnLi9jcmVhdGUtdGV4dCc7XG5pbXBvcnQgRml4dHVyZXNQYXRoIGZyb20gJy4uL2NvbnN0YW50cy9maXh0dXJlcy1wYXRoJztcbmltcG9ydCBDb21tb25IZWxwZXJzIGZyb20gJy4uLy4uL2xpYi9oZWxwZXJzL2NvbW1vbi1oZWxwZXJzJztcblxuLyoqXG4gKiBAcmV0dXJuIHtQcm9taXNlLjx1bmRlZmluZWQ+fSAtIFRvIGNyZWF0ZSBhIGZpbGUuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUxhcmdlVGV4dCgpIHtcbiAgY29uc3QgY3JlYXRlZFBhdGggPSBGaXh0dXJlc1BhdGgubGFyZ2VUZXh0UGF0aDtcbiAgcmV0dXJuIGNyZWF0ZVRleHQoY3JlYXRlZFBhdGgsIHdyaXRlQ29udGVudHMpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7V3JpdGVTdHJlYW19IHdzIC0gQSB3cml0ZSBzdHJlYW0uXG4gKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIHdyaXRlQ29udGVudHMod3MpIHtcbiAgQ29tbW9uSGVscGVycy50aW1lcygxMDAwMCwgKCkgPT4ge1xuICAgIHdzLndyaXRlKFwiPGRpdiBjbGFzcz0nZm9vJz5UaGlzIGlzIGNvbnRlbnRzLjwvZGl2PlxcclxcblwiKTtcbiAgfSk7XG59XG4iXX0=