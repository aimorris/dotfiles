Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _tagScanner = require('./tag-scanner');

var _tagScanner2 = _interopRequireDefault(_tagScanner);

var _modelsTag = require('../models/tag');

var _modelsTag2 = _interopRequireDefault(_modelsTag);

var _modelsTaggedElement = require('../models/tagged-element');

var _modelsTaggedElement2 = _interopRequireDefault(_modelsTaggedElement);

var _helpersCommonHelpers = require('../helpers/common-helpers');

var _helpersCommonHelpers2 = _interopRequireDefault(_helpersCommonHelpers);

/**
 * Scan tagged elements in atom's text editor, calling the given iterator
 * function on each elements.
 */
'use babel';

var TaggedElementScanner = (function () {
  /**
   * @param {TextEditor} textEditor - Of atom.
   * @param {Logger} logger
   */

  function TaggedElementScanner(textEditor, logger) {
    _classCallCheck(this, TaggedElementScanner);

    this._textEditor = textEditor;
    this._logger = logger;
    this._tagScanner = new _tagScanner2['default'](textEditor, logger);
  }

  _createClass(TaggedElementScanner, [{
    key: 'scan',

    /**
     * @callback scan~iterator
     * @param {TaggedElementScanCallbackArgument} arg
     */
    /**
     * @param  {scan~iterator} iterator
     * @return {undefined}
     */
    value: function scan(iterator) {
      var _this = this;

      var scannedTagStack = [];
      this.tagScanner.scan(function (tagScanArg) {
        var tag = tagScanArg.tag;
        // Try to create an element object from a scanned tag.
        // A tag not to use is stacked.
        // TODO: Fill up left out end tags by creating virtual tags.
        var element = (function () {
          switch (tag.kind) {
            case _modelsTag2['default'].Kind.START:
              scannedTagStack.push(tag);
              break;
            case _modelsTag2['default'].Kind.START_AND_END:
              return new _modelsTaggedElement2['default'](tag);
              break;
            case _modelsTag2['default'].Kind.END:
              var startTag = undefined;
              while ((startTag = scannedTagStack.pop()) != null) {
                if (startTag.tagName === tag.tagName) return new _modelsTaggedElement2['default'](startTag, tag);
              }
              break;
          }
        })();
        if (!element) return;
        _this.logger.log('Found a tagged element.');
        _this.logger.logTaggedElement(element);

        // Create an argument.
        var elementScanArg = new TaggedElementScanCallbackArgument();
        elementScanArg.taggedElement = element;

        // Execute.
        iterator(elementScanArg);

        // Stop scanning.
        if (elementScanArg.isScanStopped) {
          tagScanArg.stopScan();
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
  }, {
    key: 'tagScanner',
    get: function get() {
      return this._tagScanner;
    }
  }]);

  return TaggedElementScanner;
})();

exports['default'] = TaggedElementScanner;

var TaggedElementScanCallbackArgument = (function () {
  function TaggedElementScanCallbackArgument() {
    _classCallCheck(this, TaggedElementScanCallbackArgument);

    this._isScanStopped = false;
  }

  _createClass(TaggedElementScanCallbackArgument, [{
    key: 'stopScan',
    value: function stopScan() {
      this._isScanStopped = true;
    }
  }, {
    key: 'taggedElement',
    get: function get() {
      return this._taggedElement;
    },
    set: function set(val) {
      this._taggedElement = val;
    }
  }, {
    key: 'isScanStopped',
    get: function get() {
      return this._isScanStopped;
    }
  }]);

  return TaggedElementScanCallbackArgument;
})();

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9saWIvc2Nhbm5lcnMvdGFnZ2VkLWVsZW1lbnQtc2Nhbm5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzBCQUV1QixlQUFlOzs7O3lCQUN0QixlQUFlOzs7O21DQUNMLDBCQUEwQjs7OztvQ0FDMUIsMkJBQTJCOzs7Ozs7OztBQUxyRCxXQUFXLENBQUM7O0lBV1Msb0JBQW9COzs7Ozs7QUFLNUIsV0FMUSxvQkFBb0IsQ0FLM0IsVUFBVSxFQUFFLE1BQU0sRUFBRTswQkFMYixvQkFBb0I7O0FBTXJDLFFBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0FBQzlCLFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxXQUFXLEdBQUcsNEJBQWUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0dBQ3ZEOztlQVRrQixvQkFBb0I7Ozs7Ozs7Ozs7O1dBdUJuQyxjQUFDLFFBQVEsRUFBRTs7O0FBQ2IsVUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBQzNCLFVBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQUMsVUFBVSxFQUFLO0FBQ25DLFlBQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUM7Ozs7QUFJM0IsWUFBTSxPQUFPLEdBQUcsQ0FBQyxZQUFNO0FBQ3JCLGtCQUFRLEdBQUcsQ0FBQyxJQUFJO0FBQ2QsaUJBQUssdUJBQUksSUFBSSxDQUFDLEtBQUs7QUFDakIsNkJBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUIsb0JBQU07QUFBQSxBQUNSLGlCQUFLLHVCQUFJLElBQUksQ0FBQyxhQUFhO0FBQ3pCLHFCQUFPLHFDQUFrQixHQUFHLENBQUMsQ0FBQztBQUM5QixvQkFBTTtBQUFBLEFBQ1IsaUJBQUssdUJBQUksSUFBSSxDQUFDLEdBQUc7QUFDZixrQkFBSSxRQUFRLFlBQUEsQ0FBQztBQUNiLHFCQUFPLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQSxJQUFLLElBQUksRUFBRTtBQUNqRCxvQkFBSSxRQUFRLENBQUMsT0FBTyxLQUFLLEdBQUcsQ0FBQyxPQUFPLEVBQ2xDLE9BQU8scUNBQWtCLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztlQUMzQztBQUNELG9CQUFNO0FBQUEsV0FDVDtTQUNGLENBQUEsRUFBRyxDQUFDO0FBQ0wsWUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPO0FBQ3JCLGNBQUssTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQzNDLGNBQUssTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7QUFHdEMsWUFBTSxjQUFjLEdBQUcsSUFBSSxpQ0FBaUMsRUFBRSxDQUFDO0FBQy9ELHNCQUFjLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQzs7O0FBR3ZDLGdCQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7OztBQUd6QixZQUFJLGNBQWMsQ0FBQyxhQUFhLEVBQUU7QUFDaEMsb0JBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUN2QjtPQUNGLENBQUMsQ0FBQTtLQUNIOzs7U0FwRGEsZUFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztLQUFFOzs7U0FDbkMsZUFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUFFOzs7U0FDdkIsZUFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztLQUFFOzs7U0FiMUIsb0JBQW9COzs7cUJBQXBCLG9CQUFvQjs7SUFrRW5DLGlDQUFpQztBQUMxQixXQURQLGlDQUFpQyxHQUN2QjswQkFEVixpQ0FBaUM7O0FBRW5DLFFBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0dBQzdCOztlQUhHLGlDQUFpQzs7V0FTN0Isb0JBQUc7QUFDVCxVQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztLQUM1Qjs7O1NBTmdCLGVBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7S0FBRTtTQUNsQyxhQUFDLEdBQUcsRUFBRTtBQUFFLFVBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO0tBQUU7OztTQUVwQyxlQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0tBQUU7OztTQVIvQyxpQ0FBaUMiLCJmaWxlIjoiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvc2VsZWN0LXRleHQtYmV0d2Vlbi10YWdzL2xpYi9zY2FubmVycy90YWdnZWQtZWxlbWVudC1zY2FubmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBUYWdTY2FubmVyIGZyb20gJy4vdGFnLXNjYW5uZXInO1xuaW1wb3J0IFRhZyBmcm9tICcuLi9tb2RlbHMvdGFnJztcbmltcG9ydCBUYWdnZWRFbGVtZW50IGZyb20gJy4uL21vZGVscy90YWdnZWQtZWxlbWVudCc7XG5pbXBvcnQgQ29tbW9uSGVscGVycyBmcm9tICcuLi9oZWxwZXJzL2NvbW1vbi1oZWxwZXJzJztcblxuLyoqXG4gKiBTY2FuIHRhZ2dlZCBlbGVtZW50cyBpbiBhdG9tJ3MgdGV4dCBlZGl0b3IsIGNhbGxpbmcgdGhlIGdpdmVuIGl0ZXJhdG9yXG4gKiBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnRzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYWdnZWRFbGVtZW50U2Nhbm5lciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IHRleHRFZGl0b3IgLSBPZiBhdG9tLlxuICAgKiBAcGFyYW0ge0xvZ2dlcn0gbG9nZ2VyXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0ZXh0RWRpdG9yLCBsb2dnZXIpIHtcbiAgICB0aGlzLl90ZXh0RWRpdG9yID0gdGV4dEVkaXRvcjtcbiAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgdGhpcy5fdGFnU2Nhbm5lciA9IG5ldyBUYWdTY2FubmVyKHRleHRFZGl0b3IsIGxvZ2dlcik7XG4gIH1cblxuICBnZXQgdGV4dEVkaXRvcigpIHsgcmV0dXJuIHRoaXMuX3RleHRFZGl0b3I7IH1cbiAgZ2V0IGxvZ2dlcigpIHsgcmV0dXJuIHRoaXMuX2xvZ2dlcjsgfVxuICBnZXQgdGFnU2Nhbm5lcigpIHsgcmV0dXJuIHRoaXMuX3RhZ1NjYW5uZXI7IH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIHNjYW5+aXRlcmF0b3JcbiAgICogQHBhcmFtIHtUYWdnZWRFbGVtZW50U2NhbkNhbGxiYWNrQXJndW1lbnR9IGFyZ1xuICAgKi9cbiAgLyoqXG4gICAqIEBwYXJhbSAge3NjYW5+aXRlcmF0b3J9IGl0ZXJhdG9yXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIHNjYW4oaXRlcmF0b3IpIHtcbiAgICBjb25zdCBzY2FubmVkVGFnU3RhY2sgPSBbXTtcbiAgICB0aGlzLnRhZ1NjYW5uZXIuc2NhbigodGFnU2NhbkFyZykgPT4ge1xuICAgICAgY29uc3QgdGFnID0gdGFnU2NhbkFyZy50YWc7XG4gICAgICAvLyBUcnkgdG8gY3JlYXRlIGFuIGVsZW1lbnQgb2JqZWN0IGZyb20gYSBzY2FubmVkIHRhZy5cbiAgICAgIC8vIEEgdGFnIG5vdCB0byB1c2UgaXMgc3RhY2tlZC5cbiAgICAgIC8vIFRPRE86IEZpbGwgdXAgbGVmdCBvdXQgZW5kIHRhZ3MgYnkgY3JlYXRpbmcgdmlydHVhbCB0YWdzLlxuICAgICAgY29uc3QgZWxlbWVudCA9ICgoKSA9PiB7XG4gICAgICAgIHN3aXRjaCAodGFnLmtpbmQpIHtcbiAgICAgICAgICBjYXNlIFRhZy5LaW5kLlNUQVJUOlxuICAgICAgICAgICAgc2Nhbm5lZFRhZ1N0YWNrLnB1c2godGFnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgVGFnLktpbmQuU1RBUlRfQU5EX0VORDpcbiAgICAgICAgICAgIHJldHVybiBuZXcgVGFnZ2VkRWxlbWVudCh0YWcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBUYWcuS2luZC5FTkQ6XG4gICAgICAgICAgICBsZXQgc3RhcnRUYWc7XG4gICAgICAgICAgICB3aGlsZSAoKHN0YXJ0VGFnID0gc2Nhbm5lZFRhZ1N0YWNrLnBvcCgpKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIGlmIChzdGFydFRhZy50YWdOYW1lID09PSB0YWcudGFnTmFtZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFRhZ2dlZEVsZW1lbnQoc3RhcnRUYWcsIHRhZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSkoKTtcbiAgICAgIGlmICghZWxlbWVudCkgcmV0dXJuO1xuICAgICAgdGhpcy5sb2dnZXIubG9nKCdGb3VuZCBhIHRhZ2dlZCBlbGVtZW50LicpO1xuICAgICAgdGhpcy5sb2dnZXIubG9nVGFnZ2VkRWxlbWVudChlbGVtZW50KTtcblxuICAgICAgLy8gQ3JlYXRlIGFuIGFyZ3VtZW50LlxuICAgICAgY29uc3QgZWxlbWVudFNjYW5BcmcgPSBuZXcgVGFnZ2VkRWxlbWVudFNjYW5DYWxsYmFja0FyZ3VtZW50KCk7XG4gICAgICBlbGVtZW50U2NhbkFyZy50YWdnZWRFbGVtZW50ID0gZWxlbWVudDtcblxuICAgICAgLy8gRXhlY3V0ZS5cbiAgICAgIGl0ZXJhdG9yKGVsZW1lbnRTY2FuQXJnKTtcblxuICAgICAgLy8gU3RvcCBzY2FubmluZy5cbiAgICAgIGlmIChlbGVtZW50U2NhbkFyZy5pc1NjYW5TdG9wcGVkKSB7XG4gICAgICAgIHRhZ1NjYW5Bcmcuc3RvcFNjYW4oKTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbmNsYXNzIFRhZ2dlZEVsZW1lbnRTY2FuQ2FsbGJhY2tBcmd1bWVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2lzU2NhblN0b3BwZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCB0YWdnZWRFbGVtZW50KCkgeyByZXR1cm4gdGhpcy5fdGFnZ2VkRWxlbWVudDsgfVxuICBzZXQgdGFnZ2VkRWxlbWVudCh2YWwpIHsgdGhpcy5fdGFnZ2VkRWxlbWVudCA9IHZhbDsgfVxuXG4gIGdldCBpc1NjYW5TdG9wcGVkKCkgeyByZXR1cm4gdGhpcy5faXNTY2FuU3RvcHBlZDsgfVxuICBzdG9wU2NhbigpIHtcbiAgICB0aGlzLl9pc1NjYW5TdG9wcGVkID0gdHJ1ZTtcbiAgfVxufVxuIl19