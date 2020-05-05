Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _modelsTag = require('../models/tag');

var _modelsTag2 = _interopRequireDefault(_modelsTag);

/**
 * Scan tags in atom's text editor, calling the given iterator function
 * on each tag.
 */
'use babel';

var TagScanner = (function () {
  /**
   * @param {TextEditor} textEditor - Of atom.
   * @param {Logger} logger
   */

  function TagScanner(textEditor, logger) {
    _classCallCheck(this, TagScanner);

    this._textEditor = textEditor;
    this._logger = logger;
  }

  _createClass(TagScanner, [{
    key: 'scan',

    /**
     * @callback scan~iterator
     * @param {TagScanCallbackArgument} arg
     */
    /**
     * @param  {scan~iterator} iterator
     * @return {undefined}
     */
    value: function scan(iterator) {
      var _this = this;

      this.textEditor.scan(_modelsTag2['default'].getRegExp(), function (textScanArg) {
        // Create an argument.
        var tag = _modelsTag2['default'].fromAtomSearchResult(textScanArg);
        _this.logger.log('Found a tag.');
        _this.logger.logTag(tag);
        var tagScanArg = new TagScanCallbackArgument();
        tagScanArg.tag = tag;

        // Execute.
        iterator(tagScanArg);

        // Stop scanning.
        if (tagScanArg.isScanStopped) {
          textScanArg.stop();
        }
      });
    }
  }, {
    key: 'textEditor',
    get: function get() {
      return this._textEditor;
    }
  }, {
    key: 'logger',
    get: function get() {
      return this._logger;
    }
  }]);

  return TagScanner;
})();

exports['default'] = TagScanner;

var TagScanCallbackArgument = (function () {
  function TagScanCallbackArgument() {
    _classCallCheck(this, TagScanCallbackArgument);

    this._isScanStopped = false;
  }

  _createClass(TagScanCallbackArgument, [{
    key: 'stopScan',
    value: function stopScan() {
      this._isScanStopped = true;
    }
  }, {
    key: 'tag',
    get: function get() {
      return this._tag;
    },
    set: function set(val) {
      this._tag = val;
    }
  }, {
    key: 'isScanStopped',
    get: function get() {
      return this._isScanStopped;
    }
  }]);

  return TagScanCallbackArgument;
})();

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9saWIvc2Nhbm5lcnMvdGFnLXNjYW5uZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozt5QkFFZ0IsZUFBZTs7Ozs7Ozs7QUFGL0IsV0FBVyxDQUFDOztJQVFTLFVBQVU7Ozs7OztBQUtsQixXQUxRLFVBQVUsQ0FLakIsVUFBVSxFQUFFLE1BQU0sRUFBRTswQkFMYixVQUFVOztBQU0zQixRQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztBQUM5QixRQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztHQUN2Qjs7ZUFSa0IsVUFBVTs7Ozs7Ozs7Ozs7V0FxQnpCLGNBQUMsUUFBUSxFQUFFOzs7QUFDYixVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyx1QkFBSSxTQUFTLEVBQUUsRUFBRSxVQUFDLFdBQVcsRUFBSzs7QUFFckQsWUFBTSxHQUFHLEdBQUcsdUJBQUksb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbEQsY0FBSyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQy9CLGNBQUssTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QixZQUFNLFVBQVUsR0FBRyxJQUFJLHVCQUF1QixFQUFFLENBQUM7QUFDakQsa0JBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOzs7QUFHckIsZ0JBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7O0FBR3JCLFlBQUksVUFBVSxDQUFDLGFBQWEsRUFBRTtBQUM1QixxQkFBVyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3BCO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7OztTQTVCYSxlQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0tBQUU7OztTQUNuQyxlQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQUU7OztTQVhsQixVQUFVOzs7cUJBQVYsVUFBVTs7SUF5Q3pCLHVCQUF1QjtBQUNoQixXQURQLHVCQUF1QixHQUNiOzBCQURWLHVCQUF1Qjs7QUFFekIsUUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7R0FDN0I7O2VBSEcsdUJBQXVCOztXQVNuQixvQkFBRztBQUNULFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0tBQzVCOzs7U0FOTSxlQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQUU7U0FDeEIsYUFBQyxHQUFHLEVBQUU7QUFBRSxVQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztLQUFFOzs7U0FFaEIsZUFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztLQUFFOzs7U0FSL0MsdUJBQXVCIiwiZmlsZSI6Ii9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9saWIvc2Nhbm5lcnMvdGFnLXNjYW5uZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFRhZyBmcm9tICcuLi9tb2RlbHMvdGFnJztcblxuLyoqXG4gKiBTY2FuIHRhZ3MgaW4gYXRvbSdzIHRleHQgZWRpdG9yLCBjYWxsaW5nIHRoZSBnaXZlbiBpdGVyYXRvciBmdW5jdGlvblxuICogb24gZWFjaCB0YWcuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhZ1NjYW5uZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtUZXh0RWRpdG9yfSB0ZXh0RWRpdG9yIC0gT2YgYXRvbS5cbiAgICogQHBhcmFtIHtMb2dnZXJ9IGxvZ2dlclxuICAgKi9cbiAgY29uc3RydWN0b3IodGV4dEVkaXRvciwgbG9nZ2VyKSB7XG4gICAgdGhpcy5fdGV4dEVkaXRvciA9IHRleHRFZGl0b3I7XG4gICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xuICB9XG5cbiAgZ2V0IHRleHRFZGl0b3IoKSB7IHJldHVybiB0aGlzLl90ZXh0RWRpdG9yOyB9XG4gIGdldCBsb2dnZXIoKSB7IHJldHVybiB0aGlzLl9sb2dnZXI7IH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIHNjYW5+aXRlcmF0b3JcbiAgICogQHBhcmFtIHtUYWdTY2FuQ2FsbGJhY2tBcmd1bWVudH0gYXJnXG4gICAqL1xuICAvKipcbiAgICogQHBhcmFtICB7c2Nhbn5pdGVyYXRvcn0gaXRlcmF0b3JcbiAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgKi9cbiAgc2NhbihpdGVyYXRvcikge1xuICAgIHRoaXMudGV4dEVkaXRvci5zY2FuKFRhZy5nZXRSZWdFeHAoKSwgKHRleHRTY2FuQXJnKSA9PiB7XG4gICAgICAvLyBDcmVhdGUgYW4gYXJndW1lbnQuXG4gICAgICBjb25zdCB0YWcgPSBUYWcuZnJvbUF0b21TZWFyY2hSZXN1bHQodGV4dFNjYW5BcmcpO1xuICAgICAgdGhpcy5sb2dnZXIubG9nKCdGb3VuZCBhIHRhZy4nKVxuICAgICAgdGhpcy5sb2dnZXIubG9nVGFnKHRhZyk7XG4gICAgICBjb25zdCB0YWdTY2FuQXJnID0gbmV3IFRhZ1NjYW5DYWxsYmFja0FyZ3VtZW50KCk7XG4gICAgICB0YWdTY2FuQXJnLnRhZyA9IHRhZztcblxuICAgICAgLy8gRXhlY3V0ZS5cbiAgICAgIGl0ZXJhdG9yKHRhZ1NjYW5BcmcpO1xuXG4gICAgICAvLyBTdG9wIHNjYW5uaW5nLlxuICAgICAgaWYgKHRhZ1NjYW5BcmcuaXNTY2FuU3RvcHBlZCkge1xuICAgICAgICB0ZXh0U2NhbkFyZy5zdG9wKCk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuXG5jbGFzcyBUYWdTY2FuQ2FsbGJhY2tBcmd1bWVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2lzU2NhblN0b3BwZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCB0YWcoKSB7IHJldHVybiB0aGlzLl90YWc7IH1cbiAgc2V0IHRhZyh2YWwpIHsgdGhpcy5fdGFnID0gdmFsOyB9XG5cbiAgZ2V0IGlzU2NhblN0b3BwZWQoKSB7IHJldHVybiB0aGlzLl9pc1NjYW5TdG9wcGVkOyB9XG4gIHN0b3BTY2FuKCkge1xuICAgIHRoaXMuX2lzU2NhblN0b3BwZWQgPSB0cnVlO1xuICB9XG59XG4iXX0=