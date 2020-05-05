'use babel';

/**
 * e.g. "<foo id='bar'>", "</foo>", "<foo id='bar' />"
 * NOTE: Depends on Atom's interface.
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Tag = (function () {
  function Tag() {
    _classCallCheck(this, Tag);
  }

  _createClass(Tag, [{
    key: 'range',
    get: function get() {
      return this._range;
    },
    set: function set(val) {
      this._range = val;
    }
  }, {
    key: 'kind',
    get: function get() {
      return this._kind;
    },
    set: function set(val) {
      this._kind = val;
    }
  }, {
    key: 'tagName',
    get: function get() {
      return this._tagName;
    },
    set: function set(val) {
      this._tagName = val;
    }
  }], [{
    key: 'getRegExp',

    /**
     * Gets a regular expression with which tags are found and analyzed.
     * Capturing results are as below:
     * "<foo id='bar'>"   -> [1] ""  [2] "foo" [3] ""
     * "</foo>"           -> [1] "/" [2] "foo" [3] ""
     * "<foo id='bar' />" -> [1] ""  [2] "foo" [3] "/"
     * @return {RegExp}
     */
    value: function getRegExp() {
      return (/<(\/?)([^\s\/>]+)[^\/>]*(\/?)>/g
      );
    }

    /**
     * @typedef {Object} MultiLineSearchCallbackArgument
     * @property {string[]} match
     * @property {string} matchText
     * @property {Range} range - Of atom.
     * @function stop
     */
    /**
     * Creates a tag object from a search result object of atom's text editor.
     * It is expected that {@link Tag#getRegExp} is used in the search.
     * @param  {MultiLineSearchCallbackArgument} searchResult
     * @return {Tag}
     */
  }, {
    key: 'fromAtomSearchResult',
    value: function fromAtomSearchResult(searchResult) {
      var endPart = searchResult.match[1];
      var namePart = searchResult.match[2];
      var startAndEndPart = searchResult.match[3];

      var kind = undefined;
      if (startAndEndPart === '/') {
        kind = this.Kind.START_AND_END;
      } else if (endPart === '/') {
        kind = this.Kind.END;
      } else {
        kind = this.Kind.START;
      }

      var tag = new Tag();
      tag.range = searchResult.range;
      tag.kind = kind;
      tag.tagName = namePart;
      return tag;
    }
  }, {
    key: 'Kind',

    /**
     * A tag kind.
     * e.g. "<foo>":start, "</foo>":end, "<foo/>":start-and-end,
     * @enum {string}
     */
    value: {
      START: 'start',
      END: 'end',
      START_AND_END: 'start-and-end'
    },
    enumerable: true
  }]);

  return Tag;
})();

exports['default'] = Tag;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9saWIvbW9kZWxzL3RhZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lBTVMsR0FBRztXQUFILEdBQUc7MEJBQUgsR0FBRzs7O2VBQUgsR0FBRzs7U0F3RGIsZUFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUFFO1NBQzFCLGFBQUMsR0FBRyxFQUFFO0FBQUUsVUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7S0FBRTs7O1NBRTdCLGVBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7S0FBRTtTQUN6QixhQUFDLEdBQUcsRUFBRTtBQUFFLFVBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0tBQUU7OztTQUV4QixlQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQUU7U0FDNUIsYUFBQyxHQUFHLEVBQUU7QUFBRSxVQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztLQUFFOzs7Ozs7Ozs7Ozs7V0EzQ3pCLHFCQUFHO0FBQUUsYUFBTyxrQ0FBaUM7UUFBQztLQUFFOzs7Ozs7Ozs7Ozs7Ozs7OztXQWVyQyw4QkFBQyxZQUFZLEVBQUU7QUFDeEMsVUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QyxVQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFVBQU0sZUFBZSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTlDLFVBQUksSUFBSSxZQUFBLENBQUM7QUFDVCxVQUFJLGVBQWUsS0FBSyxHQUFHLEVBQUU7QUFDM0IsWUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO09BQ2hDLE1BQU0sSUFBSSxPQUFPLEtBQUssR0FBRyxFQUFFO0FBQzFCLFlBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztPQUN0QixNQUFNO0FBQ0wsWUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ3hCOztBQUVELFVBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDdEIsU0FBRyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO0FBQy9CLFNBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFNBQUcsQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBQ3ZCLGFBQU8sR0FBRyxDQUFDO0tBQ1o7Ozs7Ozs7OztXQWhEYTtBQUNaLFdBQUssRUFBRSxPQUFPO0FBQ2QsU0FBRyxFQUFFLEtBQUs7QUFDVixtQkFBYSxFQUFFLGVBQWU7S0FDL0I7Ozs7U0FWa0IsR0FBRzs7O3FCQUFILEdBQUciLCJmaWxlIjoiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvc2VsZWN0LXRleHQtYmV0d2Vlbi10YWdzL2xpYi9tb2RlbHMvdGFnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogZS5nLiBcIjxmb28gaWQ9J2Jhcic+XCIsIFwiPC9mb28+XCIsIFwiPGZvbyBpZD0nYmFyJyAvPlwiXG4gKiBOT1RFOiBEZXBlbmRzIG9uIEF0b20ncyBpbnRlcmZhY2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhZyB7XG4gIC8qKlxuICAgKiBBIHRhZyBraW5kLlxuICAgKiBlLmcuIFwiPGZvbz5cIjpzdGFydCwgXCI8L2Zvbz5cIjplbmQsIFwiPGZvby8+XCI6c3RhcnQtYW5kLWVuZCxcbiAgICogQGVudW0ge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBLaW5kID0ge1xuICAgIFNUQVJUOiAnc3RhcnQnLFxuICAgIEVORDogJ2VuZCcsXG4gICAgU1RBUlRfQU5EX0VORDogJ3N0YXJ0LWFuZC1lbmQnXG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB3aXRoIHdoaWNoIHRhZ3MgYXJlIGZvdW5kIGFuZCBhbmFseXplZC5cbiAgICogQ2FwdHVyaW5nIHJlc3VsdHMgYXJlIGFzIGJlbG93OlxuICAgKiBcIjxmb28gaWQ9J2Jhcic+XCIgICAtPiBbMV0gXCJcIiAgWzJdIFwiZm9vXCIgWzNdIFwiXCJcbiAgICogXCI8L2Zvbz5cIiAgICAgICAgICAgLT4gWzFdIFwiL1wiIFsyXSBcImZvb1wiIFszXSBcIlwiXG4gICAqIFwiPGZvbyBpZD0nYmFyJyAvPlwiIC0+IFsxXSBcIlwiICBbMl0gXCJmb29cIiBbM10gXCIvXCJcbiAgICogQHJldHVybiB7UmVnRXhwfVxuICAgKi9cbiAgc3RhdGljIGdldFJlZ0V4cCgpIHsgcmV0dXJuIC88KFxcLz8pKFteXFxzXFwvPl0rKVteXFwvPl0qKFxcLz8pPi9nOyB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IE11bHRpTGluZVNlYXJjaENhbGxiYWNrQXJndW1lbnRcbiAgICogQHByb3BlcnR5IHtzdHJpbmdbXX0gbWF0Y2hcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IG1hdGNoVGV4dFxuICAgKiBAcHJvcGVydHkge1JhbmdlfSByYW5nZSAtIE9mIGF0b20uXG4gICAqIEBmdW5jdGlvbiBzdG9wXG4gICAqL1xuICAvKipcbiAgICogQ3JlYXRlcyBhIHRhZyBvYmplY3QgZnJvbSBhIHNlYXJjaCByZXN1bHQgb2JqZWN0IG9mIGF0b20ncyB0ZXh0IGVkaXRvci5cbiAgICogSXQgaXMgZXhwZWN0ZWQgdGhhdCB7QGxpbmsgVGFnI2dldFJlZ0V4cH0gaXMgdXNlZCBpbiB0aGUgc2VhcmNoLlxuICAgKiBAcGFyYW0gIHtNdWx0aUxpbmVTZWFyY2hDYWxsYmFja0FyZ3VtZW50fSBzZWFyY2hSZXN1bHRcbiAgICogQHJldHVybiB7VGFnfVxuICAgKi9cbiAgc3RhdGljIGZyb21BdG9tU2VhcmNoUmVzdWx0KHNlYXJjaFJlc3VsdCkge1xuICAgIGNvbnN0IGVuZFBhcnQgPSBzZWFyY2hSZXN1bHQubWF0Y2hbMV07XG4gICAgY29uc3QgbmFtZVBhcnQgPSBzZWFyY2hSZXN1bHQubWF0Y2hbMl07XG4gICAgY29uc3Qgc3RhcnRBbmRFbmRQYXJ0ID0gc2VhcmNoUmVzdWx0Lm1hdGNoWzNdO1xuXG4gICAgbGV0IGtpbmQ7XG4gICAgaWYgKHN0YXJ0QW5kRW5kUGFydCA9PT0gJy8nKSB7XG4gICAgICBraW5kID0gdGhpcy5LaW5kLlNUQVJUX0FORF9FTkQ7XG4gICAgfSBlbHNlIGlmIChlbmRQYXJ0ID09PSAnLycpIHtcbiAgICAgIGtpbmQgPSB0aGlzLktpbmQuRU5EO1xuICAgIH0gZWxzZSB7XG4gICAgICBraW5kID0gdGhpcy5LaW5kLlNUQVJUO1xuICAgIH1cblxuICAgIGNvbnN0IHRhZyA9IG5ldyBUYWcoKTtcbiAgICB0YWcucmFuZ2UgPSBzZWFyY2hSZXN1bHQucmFuZ2U7XG4gICAgdGFnLmtpbmQgPSBraW5kO1xuICAgIHRhZy50YWdOYW1lID0gbmFtZVBhcnQ7XG4gICAgcmV0dXJuIHRhZztcbiAgfVxuXG4gIGdldCByYW5nZSgpIHsgcmV0dXJuIHRoaXMuX3JhbmdlOyB9XG4gIHNldCByYW5nZSh2YWwpIHsgdGhpcy5fcmFuZ2UgPSB2YWw7IH1cblxuICBnZXQga2luZCgpIHsgcmV0dXJuIHRoaXMuX2tpbmQ7IH1cbiAgc2V0IGtpbmQodmFsKSB7IHRoaXMuX2tpbmQgPSB2YWw7IH1cblxuICBnZXQgdGFnTmFtZSgpIHsgcmV0dXJuIHRoaXMuX3RhZ05hbWU7IH1cbiAgc2V0IHRhZ05hbWUodmFsKSB7IHRoaXMuX3RhZ05hbWUgPSB2YWw7IH1cblxufVxuIl19