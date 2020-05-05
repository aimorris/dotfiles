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
  var createdPath = _constantsFixturesPath2['default'].deepTextPath;
  return (0, _createText2['default'])(createdPath, writeContents);
});

/**
 * @param {WriteStream} ws - A write stream.
 * @return {undefined}
 */
function writeContents(ws) {
  _libHelpersCommonHelpers2['default'].times(4, function () {
    var depth = 1000;

    _libHelpersCommonHelpers2['default'].times(depth, function () {
      ws.write("<div class='foo'>\r\n");
    });
    ws.write("<span class='bar'>This is contents.</span>\r\n");
    _libHelpersCommonHelpers2['default'].times(depth, function () {
      ws.write('</div>\r\n');
    });
  });
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9zcGVjL3NjcmlwdHMvY3JlYXRlLWRlZXAtdGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OzswQkFFdUIsZUFBZTs7OztxQ0FDYiw0QkFBNEI7Ozs7dUNBQzNCLGtDQUFrQzs7Ozs7OztBQUo1RCxXQUFXLENBQUM7O3VDQVNHLGFBQWdDO0FBQzdDLE1BQU0sV0FBVyxHQUFHLG1DQUFhLFlBQVksQ0FBQztBQUM5QyxTQUFPLDZCQUFXLFdBQVcsRUFBRSxhQUFhLENBQUMsQ0FBQztDQUMvQzs7Ozs7O0FBTUQsU0FBUyxhQUFhLENBQUMsRUFBRSxFQUFFO0FBQ3pCLHVDQUFjLEtBQUssQ0FBQyxDQUFDLEVBQUUsWUFBTTtBQUMzQixRQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRW5CLHlDQUFjLEtBQUssQ0FBQyxLQUFLLEVBQUUsWUFBSztBQUM5QixRQUFFLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDbkMsQ0FBQyxDQUFDO0FBQ0gsTUFBRSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO0FBQzNELHlDQUFjLEtBQUssQ0FBQyxLQUFLLEVBQUUsWUFBSztBQUM5QixRQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQ3hCLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6Ii9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9zcGVjL3NjcmlwdHMvY3JlYXRlLWRlZXAtdGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgY3JlYXRlVGV4dCBmcm9tICcuL2NyZWF0ZS10ZXh0JztcbmltcG9ydCBGaXh0dXJlc1BhdGggZnJvbSAnLi4vY29uc3RhbnRzL2ZpeHR1cmVzLXBhdGgnO1xuaW1wb3J0IENvbW1vbkhlbHBlcnMgZnJvbSAnLi4vLi4vbGliL2hlbHBlcnMvY29tbW9uLWhlbHBlcnMnO1xuXG4vKipcbiAqIEByZXR1cm4ge1Byb21pc2UuPHVuZGVmaW5lZD59IC0gVG8gY3JlYXRlIGEgZmlsZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlRGVlcFRleHQoKSB7XG4gIGNvbnN0IGNyZWF0ZWRQYXRoID0gRml4dHVyZXNQYXRoLmRlZXBUZXh0UGF0aDtcbiAgcmV0dXJuIGNyZWF0ZVRleHQoY3JlYXRlZFBhdGgsIHdyaXRlQ29udGVudHMpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7V3JpdGVTdHJlYW19IHdzIC0gQSB3cml0ZSBzdHJlYW0uXG4gKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIHdyaXRlQ29udGVudHMod3MpIHtcbiAgQ29tbW9uSGVscGVycy50aW1lcyg0LCAoKSA9PiB7XG4gICAgY29uc3QgZGVwdGggPSAxMDAwO1xuXG4gICAgQ29tbW9uSGVscGVycy50aW1lcyhkZXB0aCwgKCkgPT57XG4gICAgICB3cy53cml0ZShcIjxkaXYgY2xhc3M9J2Zvbyc+XFxyXFxuXCIpO1xuICAgIH0pO1xuICAgIHdzLndyaXRlKFwiPHNwYW4gY2xhc3M9J2Jhcic+VGhpcyBpcyBjb250ZW50cy48L3NwYW4+XFxyXFxuXCIpO1xuICAgIENvbW1vbkhlbHBlcnMudGltZXMoZGVwdGgsICgpID0+e1xuICAgICAgd3Mud3JpdGUoJzwvZGl2PlxcclxcbicpO1xuICAgIH0pO1xuICB9KTtcbn1cbiJdfQ==