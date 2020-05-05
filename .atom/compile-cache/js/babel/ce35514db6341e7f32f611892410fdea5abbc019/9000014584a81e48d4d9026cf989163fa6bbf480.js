Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

/**
 * e.g. "<foo>bar</foo>", "<foo/>"
 */
'use babel';

var TaggedElement = (function () {
  /**
   * @param {Tag[]} tags - A start-and-end tag or a pair of a start tag and
   * an end one.
   */

  function TaggedElement() {
    _classCallCheck(this, TaggedElement);

    for (var _len = arguments.length, tags = Array(_len), _key = 0; _key < _len; _key++) {
      tags[_key] = arguments[_key];
    }

    this._tags = tags;
  }

  _createClass(TaggedElement, [{
    key: 'tags',
    get: function get() {
      return this._tags;
    }
  }, {
    key: 'tagName',
    get: function get() {
      return this.tags[0].tagName;
    }

    /**
     * A boolean whether this element consists of one tag, which is
     * a start-and-end tag. If it is false, this class should consist of
     * a pair of a start tag and an end one.
     * @return {boolean}
     */
  }, {
    key: 'consistsOfOneTag',
    get: function get() {
      return this.tags.length === 1;
    }

    /**
     * This element's whole range.
     * @return {Range} - Of atom.
     */
  }, {
    key: 'range',
    get: function get() {
      return this.consistsOfOneTag ? this.tags[0].range : new _atom.Range(this.tags[0].range.start, this.tags[1].range.end);
    }

    /**
     * This element's content's range.
     * e.g. In "<foo>bar</foo>", "bar" is content.
     * @return {Range} - Of atom.
     */
  }, {
    key: 'contentRange',
    get: function get() {
      return this.consistsOfOneTag ? null : new _atom.Range(this.tags[0].range.end, this.tags[1].range.start);
    }
  }]);

  return TaggedElement;
})();

exports['default'] = TaggedElement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9saWIvbW9kZWxzL3RhZ2dlZC1lbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVzQixNQUFNOzs7OztBQUY1QixXQUFXLENBQUM7O0lBT1MsYUFBYTs7Ozs7O0FBS3JCLFdBTFEsYUFBYSxHQUtYOzBCQUxGLGFBQWE7O3NDQUtqQixJQUFJO0FBQUosVUFBSTs7O0FBQ2pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0dBQ25COztlQVBrQixhQUFhOztTQVN4QixlQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQUU7OztTQUN0QixlQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztLQUFFOzs7Ozs7Ozs7O1NBUTFCLGVBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztLQUFFOzs7Ozs7OztTQU1oRCxlQUFHO0FBQ1YsYUFBTyxJQUFJLENBQUMsZ0JBQWdCLEdBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUNsQixnQkFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDL0Q7Ozs7Ozs7OztTQU9lLGVBQUc7QUFDakIsYUFBTyxJQUFJLENBQUMsZ0JBQWdCLEdBQzFCLElBQUksR0FDSixnQkFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDL0Q7OztTQXZDa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvc2VsZWN0LXRleHQtYmV0d2Vlbi10YWdzL2xpYi9tb2RlbHMvdGFnZ2VkLWVsZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICdhdG9tJztcblxuLyoqXG4gKiBlLmcuIFwiPGZvbz5iYXI8L2Zvbz5cIiwgXCI8Zm9vLz5cIlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYWdnZWRFbGVtZW50IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7VGFnW119IHRhZ3MgLSBBIHN0YXJ0LWFuZC1lbmQgdGFnIG9yIGEgcGFpciBvZiBhIHN0YXJ0IHRhZyBhbmRcbiAgICogYW4gZW5kIG9uZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKC4uLnRhZ3MpIHtcbiAgICB0aGlzLl90YWdzID0gdGFncztcbiAgfVxuXG4gIGdldCB0YWdzKCkgeyByZXR1cm4gdGhpcy5fdGFnczsgfVxuICBnZXQgdGFnTmFtZSgpIHsgcmV0dXJuIHRoaXMudGFnc1swXS50YWdOYW1lOyB9XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiB3aGV0aGVyIHRoaXMgZWxlbWVudCBjb25zaXN0cyBvZiBvbmUgdGFnLCB3aGljaCBpc1xuICAgKiBhIHN0YXJ0LWFuZC1lbmQgdGFnLiBJZiBpdCBpcyBmYWxzZSwgdGhpcyBjbGFzcyBzaG91bGQgY29uc2lzdCBvZlxuICAgKiBhIHBhaXIgb2YgYSBzdGFydCB0YWcgYW5kIGFuIGVuZCBvbmUuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBnZXQgY29uc2lzdHNPZk9uZVRhZygpIHsgcmV0dXJuIHRoaXMudGFncy5sZW5ndGggPT09IDE7IH1cblxuICAvKipcbiAgICogVGhpcyBlbGVtZW50J3Mgd2hvbGUgcmFuZ2UuXG4gICAqIEByZXR1cm4ge1JhbmdlfSAtIE9mIGF0b20uXG4gICAqL1xuICBnZXQgcmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc2lzdHNPZk9uZVRhZyA/XG4gICAgICB0aGlzLnRhZ3NbMF0ucmFuZ2UgOlxuICAgICAgbmV3IFJhbmdlKHRoaXMudGFnc1swXS5yYW5nZS5zdGFydCwgdGhpcy50YWdzWzFdLnJhbmdlLmVuZCk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBlbGVtZW50J3MgY29udGVudCdzIHJhbmdlLlxuICAgKiBlLmcuIEluIFwiPGZvbz5iYXI8L2Zvbz5cIiwgXCJiYXJcIiBpcyBjb250ZW50LlxuICAgKiBAcmV0dXJuIHtSYW5nZX0gLSBPZiBhdG9tLlxuICAgKi9cbiAgZ2V0IGNvbnRlbnRSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zaXN0c09mT25lVGFnID9cbiAgICAgIG51bGwgOlxuICAgICAgbmV3IFJhbmdlKHRoaXMudGFnc1swXS5yYW5nZS5lbmQsIHRoaXMudGFnc1sxXS5yYW5nZS5zdGFydCk7XG4gIH1cbn1cbiJdfQ==