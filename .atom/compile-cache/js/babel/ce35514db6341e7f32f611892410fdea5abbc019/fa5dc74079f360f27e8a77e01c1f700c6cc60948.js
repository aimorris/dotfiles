'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CommonHelpers = (function () {
  function CommonHelpers() {
    _classCallCheck(this, CommonHelpers);
  }

  _createClass(CommonHelpers, null, [{
    key: 'overwriteArray',

    /**
     * Overwrites an array to an array. (Non-destructive)
     * @param {*[]} origin
     * @param {*[]} addition
     * @return {*[]}
     */
    value: function overwriteArray(origin, addition) {
      // NOTE: Avoid to change origin's value.
      var writtenArray = Array.from(origin);
      writtenArray.length = Math.max(origin.length, addition.length);

      addition.forEach(function (item, index) {
        if (item != null) writtenArray[index] = item;
      });
      return writtenArray;
    }

    /**
     * Generates a sequence of numbers.
     * @param {...number} args - Three arguments, which are start, stop and step.
     * [4]        -> start: 0(default), stop: 4 , step: 1(default)
     * [4, 10]    -> start: 4         , stop: 10, step: 1(default)
     * [4, 10, 2] -> start: 4         , stop: 10, step: 2
     * @return {number[]}
     */
  }, {
    key: 'range',
    value: function range() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // Validate.
      if (args.length === 0) throw new Error('No arguments.');
      if (args.length > 3) throw new Error('Too many arguments.');

      // Arrange arguments.
      var start = 0,
          stop = undefined,
          step = 1;
      if (args.length === 1) {
        stop = args[0];
      } else {
        var _overwriteArray = this.overwriteArray([start, stop, step], args);

        var _overwriteArray2 = _slicedToArray(_overwriteArray, 3);

        start = _overwriteArray2[0];
        stop = _overwriteArray2[1];
        step = _overwriteArray2[2];
      }

      // Validate.
      if (step === 0) throw new Error('An endless loop.');

      // Generate.
      var seq = [];
      var staysInSeq = step > 0 ? function (i) {
        return i <= stop;
      } : function (i) {
        return i >= stop;
      };
      for (var i = start; staysInSeq(i); i += step) {
        seq.push(i);
      }
      return seq;
    }

    /**
     * @callback times~predicate
     */
    /**
     * Repeats the same process.
     * @param {number} num - The number of times we repeat the process.
     * @param {times~predicate} predicate - A repeated process.
     * @return {undefined}
     */
  }, {
    key: 'times',
    value: function times(num, predicate) {
      for (var i = 0; i < num; i++) {
        predicate();
      }
    }

    /**
     * Gets a last item of an array.
     * @param  {*[]} arr
     * @return {*}
     */
  }, {
    key: 'last',
    value: function last(arr) {
      return arr[arr.length - 1];
    }
  }]);

  return CommonHelpers;
})();

exports['default'] = CommonHelpers;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9saWIvaGVscGVycy9jb21tb24taGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7OztJQUVTLGFBQWE7V0FBYixhQUFhOzBCQUFiLGFBQWE7OztlQUFiLGFBQWE7Ozs7Ozs7OztXQU9YLHdCQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7O0FBRXRDLFVBQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEMsa0JBQVksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFL0QsY0FBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7QUFDaEMsWUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7T0FDOUMsQ0FBQyxDQUFDO0FBQ0gsYUFBTyxZQUFZLENBQUM7S0FDckI7Ozs7Ozs7Ozs7OztXQVVXLGlCQUFVO3dDQUFOLElBQUk7QUFBSixZQUFJOzs7O0FBRWxCLFVBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN4RCxVQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7O0FBRzVELFVBQUksS0FBSyxHQUFHLENBQUM7VUFBRSxJQUFJLFlBQUE7VUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLFVBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDckIsWUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNoQixNQUFNOzhCQUNpQixJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUM7Ozs7QUFBbkUsYUFBSztBQUFFLFlBQUk7QUFBRSxZQUFJO09BQ25COzs7QUFHRCxVQUFJLElBQUksS0FBSyxDQUFDLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOzs7QUFHcEQsVUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsVUFBTSxVQUFVLEdBQUcsQUFBQyxJQUFJLEdBQUcsQ0FBQyxHQUFJLFVBQUMsQ0FBQztlQUFLLENBQUMsSUFBSSxJQUFJO09BQUEsR0FBRyxVQUFDLENBQUM7ZUFBSyxDQUFDLElBQUksSUFBSTtPQUFBLENBQUM7QUFDcEUsV0FBSyxJQUFJLENBQUMsR0FBRyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDNUMsV0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNiO0FBQ0QsYUFBTyxHQUFHLENBQUM7S0FDWjs7Ozs7Ozs7Ozs7OztXQVdXLGVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRTtBQUMzQixXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRTtBQUFFLGlCQUFTLEVBQUUsQ0FBQztPQUFBO0tBQzNDOzs7Ozs7Ozs7V0FPVSxjQUFDLEdBQUcsRUFBRTtBQUNmLGFBQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDNUI7OztTQXZFa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvc2VsZWN0LXRleHQtYmV0d2Vlbi10YWdzL2xpYi9oZWxwZXJzL2NvbW1vbi1oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1vbkhlbHBlcnMge1xuICAvKipcbiAgICogT3ZlcndyaXRlcyBhbiBhcnJheSB0byBhbiBhcnJheS4gKE5vbi1kZXN0cnVjdGl2ZSlcbiAgICogQHBhcmFtIHsqW119IG9yaWdpblxuICAgKiBAcGFyYW0geypbXX0gYWRkaXRpb25cbiAgICogQHJldHVybiB7KltdfVxuICAgKi9cbiAgc3RhdGljIG92ZXJ3cml0ZUFycmF5KG9yaWdpbiwgYWRkaXRpb24pIHtcbiAgICAvLyBOT1RFOiBBdm9pZCB0byBjaGFuZ2Ugb3JpZ2luJ3MgdmFsdWUuXG4gICAgY29uc3Qgd3JpdHRlbkFycmF5ID0gQXJyYXkuZnJvbShvcmlnaW4pO1xuICAgIHdyaXR0ZW5BcnJheS5sZW5ndGggPSBNYXRoLm1heChvcmlnaW4ubGVuZ3RoLCBhZGRpdGlvbi5sZW5ndGgpO1xuXG4gICAgYWRkaXRpb24uZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChpdGVtICE9IG51bGwpIHdyaXR0ZW5BcnJheVtpbmRleF0gPSBpdGVtO1xuICAgIH0pO1xuICAgIHJldHVybiB3cml0dGVuQXJyYXk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgc2VxdWVuY2Ugb2YgbnVtYmVycy5cbiAgICogQHBhcmFtIHsuLi5udW1iZXJ9IGFyZ3MgLSBUaHJlZSBhcmd1bWVudHMsIHdoaWNoIGFyZSBzdGFydCwgc3RvcCBhbmQgc3RlcC5cbiAgICogWzRdICAgICAgICAtPiBzdGFydDogMChkZWZhdWx0KSwgc3RvcDogNCAsIHN0ZXA6IDEoZGVmYXVsdClcbiAgICogWzQsIDEwXSAgICAtPiBzdGFydDogNCAgICAgICAgICwgc3RvcDogMTAsIHN0ZXA6IDEoZGVmYXVsdClcbiAgICogWzQsIDEwLCAyXSAtPiBzdGFydDogNCAgICAgICAgICwgc3RvcDogMTAsIHN0ZXA6IDJcbiAgICogQHJldHVybiB7bnVtYmVyW119XG4gICAqL1xuICBzdGF0aWMgcmFuZ2UoLi4uYXJncykge1xuICAgIC8vIFZhbGlkYXRlLlxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkgdGhyb3cgbmV3IEVycm9yKCdObyBhcmd1bWVudHMuJyk7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gMykgdGhyb3cgbmV3IEVycm9yKCdUb28gbWFueSBhcmd1bWVudHMuJyk7XG5cbiAgICAvLyBBcnJhbmdlIGFyZ3VtZW50cy5cbiAgICBsZXQgc3RhcnQgPSAwLCBzdG9wLCBzdGVwID0gMTtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHN0b3AgPSBhcmdzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBbc3RhcnQsIHN0b3AsIHN0ZXBdID0gdGhpcy5vdmVyd3JpdGVBcnJheShbc3RhcnQsIHN0b3AsIHN0ZXBdLCBhcmdzKTtcbiAgICB9XG5cbiAgICAvLyBWYWxpZGF0ZS5cbiAgICBpZiAoc3RlcCA9PT0gMCkgdGhyb3cgbmV3IEVycm9yKCdBbiBlbmRsZXNzIGxvb3AuJyk7XG5cbiAgICAvLyBHZW5lcmF0ZS5cbiAgICBjb25zdCBzZXEgPSBbXTtcbiAgICBjb25zdCBzdGF5c0luU2VxID0gKHN0ZXAgPiAwKSA/IChpKSA9PiBpIDw9IHN0b3AgOiAoaSkgPT4gaSA+PSBzdG9wO1xuICAgIGZvciAobGV0IGkgPSBzdGFydDsgc3RheXNJblNlcShpKTsgaSArPSBzdGVwKSB7XG4gICAgICBzZXEucHVzaChpKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlcTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgdGltZXN+cHJlZGljYXRlXG4gICAqL1xuICAvKipcbiAgICogUmVwZWF0cyB0aGUgc2FtZSBwcm9jZXNzLlxuICAgKiBAcGFyYW0ge251bWJlcn0gbnVtIC0gVGhlIG51bWJlciBvZiB0aW1lcyB3ZSByZXBlYXQgdGhlIHByb2Nlc3MuXG4gICAqIEBwYXJhbSB7dGltZXN+cHJlZGljYXRlfSBwcmVkaWNhdGUgLSBBIHJlcGVhdGVkIHByb2Nlc3MuXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIHN0YXRpYyB0aW1lcyhudW0sIHByZWRpY2F0ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtOyBpKyspIHByZWRpY2F0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsYXN0IGl0ZW0gb2YgYW4gYXJyYXkuXG4gICAqIEBwYXJhbSAgeypbXX0gYXJyXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBzdGF0aWMgbGFzdChhcnIpIHtcbiAgICByZXR1cm4gYXJyW2Fyci5sZW5ndGggLSAxXTtcbiAgfVxufVxuIl19