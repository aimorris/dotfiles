Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _constantsFixturesPath = require('../constants/fixtures-path');

var _constantsFixturesPath2 = _interopRequireDefault(_constantsFixturesPath);

/**
 * @callback writeContentsCallback
 * @param {WriteStream} writeStream
 * @return {undefined}
 */
/**
 * Common process to create text.
 * @param {string} createdPath
 * @param {writeContentsCallback} writeContents
 * @return {Promise.<undefined>} - To create a file.
 */
'use babel';

exports['default'] = _asyncToGenerator(function* (createdPath, writeContents) {

  if (_fsPlus2['default'].existsSync(createdPath)) {
    // Delete an old file.
    _fsPlus2['default'].removeSync(createdPath);
  } else if (!_fsPlus2['default'].existsSync(_constantsFixturesPath2['default'].DIRECTORY_FOR_AUTO_GENERATED_PATH)) {
    // Create a directory for auto generated files.
    _fsPlus2['default'].mkdirSync(_constantsFixturesPath2['default'].DIRECTORY_FOR_AUTO_GENERATED_PATH);
  }

  // Return a promise to create a file.
  return new Promise(function (resolve) {
    // NOTE: Use a write stream cuz of small memory usage.
    var ws = _fsPlus2['default'].createWriteStream(createdPath);
    // The promise is resolved when a write stream is closed.
    ws.on('close', resolve);
    writeContents(ws);
    ws.end();
  });
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9zcGVjL3NjcmlwdHMvY3JlYXRlLXRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztxQ0FDQyw0QkFBNEI7Ozs7Ozs7Ozs7Ozs7OztBQUhyRCxXQUFXLENBQUM7O3VDQWdCRyxXQUEwQixXQUFXLEVBQUUsYUFBYSxFQUFFOztBQUVuRSxNQUFJLG9CQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTs7QUFFOUIsd0JBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0dBRTVCLE1BQU0sSUFBSSxDQUFDLG9CQUFHLFVBQVUsQ0FBQyxtQ0FBYSxpQ0FBaUMsQ0FBQyxFQUFFOztBQUV6RSx3QkFBRyxTQUFTLENBQUMsbUNBQWEsaUNBQWlDLENBQUMsQ0FBQztHQUM5RDs7O0FBR0QsU0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSzs7QUFFOUIsUUFBTSxFQUFFLEdBQUcsb0JBQUcsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTdDLE1BQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hCLGlCQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEIsTUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0dBQ1YsQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvc2VsZWN0LXRleHQtYmV0d2Vlbi10YWdzL3NwZWMvc2NyaXB0cy9jcmVhdGUtdGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cyc7XG5pbXBvcnQgRml4dHVyZXNQYXRoIGZyb20gJy4uL2NvbnN0YW50cy9maXh0dXJlcy1wYXRoJztcblxuLyoqXG4gKiBAY2FsbGJhY2sgd3JpdGVDb250ZW50c0NhbGxiYWNrXG4gKiBAcGFyYW0ge1dyaXRlU3RyZWFtfSB3cml0ZVN0cmVhbVxuICogQHJldHVybiB7dW5kZWZpbmVkfVxuICovXG4vKipcbiAqIENvbW1vbiBwcm9jZXNzIHRvIGNyZWF0ZSB0ZXh0LlxuICogQHBhcmFtIHtzdHJpbmd9IGNyZWF0ZWRQYXRoXG4gKiBAcGFyYW0ge3dyaXRlQ29udGVudHNDYWxsYmFja30gd3JpdGVDb250ZW50c1xuICogQHJldHVybiB7UHJvbWlzZS48dW5kZWZpbmVkPn0gLSBUbyBjcmVhdGUgYSBmaWxlLlxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBjcmVhdGVUZXh0KGNyZWF0ZWRQYXRoLCB3cml0ZUNvbnRlbnRzKSB7XG5cbiAgaWYgKGZzLmV4aXN0c1N5bmMoY3JlYXRlZFBhdGgpKSB7XG4gICAgLy8gRGVsZXRlIGFuIG9sZCBmaWxlLlxuICAgIGZzLnJlbW92ZVN5bmMoY3JlYXRlZFBhdGgpO1xuXG4gIH0gZWxzZSBpZiAoIWZzLmV4aXN0c1N5bmMoRml4dHVyZXNQYXRoLkRJUkVDVE9SWV9GT1JfQVVUT19HRU5FUkFURURfUEFUSCkpIHtcbiAgICAvLyBDcmVhdGUgYSBkaXJlY3RvcnkgZm9yIGF1dG8gZ2VuZXJhdGVkIGZpbGVzLlxuICAgIGZzLm1rZGlyU3luYyhGaXh0dXJlc1BhdGguRElSRUNUT1JZX0ZPUl9BVVRPX0dFTkVSQVRFRF9QQVRIKTtcbiAgfVxuXG4gIC8vIFJldHVybiBhIHByb21pc2UgdG8gY3JlYXRlIGEgZmlsZS5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgLy8gTk9URTogVXNlIGEgd3JpdGUgc3RyZWFtIGN1eiBvZiBzbWFsbCBtZW1vcnkgdXNhZ2UuXG4gICAgY29uc3Qgd3MgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShjcmVhdGVkUGF0aCk7XG4gICAgLy8gVGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgd2hlbiBhIHdyaXRlIHN0cmVhbSBpcyBjbG9zZWQuXG4gICAgd3Mub24oJ2Nsb3NlJywgcmVzb2x2ZSk7XG4gICAgd3JpdGVDb250ZW50cyh3cyk7XG4gICAgd3MuZW5kKCk7XG4gIH0pO1xufVxuIl19