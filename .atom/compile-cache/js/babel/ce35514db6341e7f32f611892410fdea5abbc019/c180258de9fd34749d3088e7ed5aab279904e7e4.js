'use babel';

/**
 * NOTE: Depends on Jasmine 1.3.1.
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SpecHelpers = (function () {
  function SpecHelpers() {
    _classCallCheck(this, SpecHelpers);
  }

  _createClass(SpecHelpers, null, [{
    key: 'addMyMatchers',

    /**
     * Adds custom useful matchers to a context.
     * HACK: Avoid to overwrite redunduntly.
     * This may be called more than once in a spec.
     * @param {jasmine.Spec} spec - Add them to this.
     */
    value: function addMyMatchers(spec) {
      spec.addMatchers({
        /**
         * Compares as same as 'toBe'. In addition, this signalize that
         * the behavior is in preparation.
         * @param {*} expected - An expected value.
         * @return {boolean} Is the behavior as expected ?
         * @this {jasmine.Matchers} NOTE: The type is unsertain.
         */
        toBeBeforeRun: function toBeBeforeRun(expected) {
          // Compare.
          var pass = this.actual === expected;

          // Define the error message.
          var message = '';
          if (pass) {
            message = 'Expected \'' + this.actual + '\' not to be \'' + expected + '\'.';
          } else {
            message = 'Expected \'' + this.actual + '\' to be \'' + expected + '\'.';
          }
          message += ' This failure occurs in a preparation phase.';
          message += ' The spec is likely to break.';
          this.message = function () {
            return message;
          };

          return pass;
        }
      });
    }

    /**
     * @typedef {Object} expectSelection~StateBeforeRun
     * @property {Range} cursorPosition - Of atom.
     */
    /**
     * @typedef {Object} expectSelection~Selection
     * @property {Range} range - Of atom.
     * @property {string} text
     */
    /**
     * @typedef {Object} expectSelection~ExpectedState
     * @property {expectSelection~Selection} selection
     */
    /**
     * @typedef {Object} expectSelection~TextVerificationOption
     * @property {Range} range - Of atom.
     * @property {string} text
     */
    /**
     * @typedef {Object} expectSelection~Result
     * @property {number} elaspedMs
     */
    /**
     * Expect the whole behavior about selection.
     * NOTE: Atom's global variables are used.
     * NOTE: Requires that a text editor is active.
     * @param {jasmine.Spec} spec
     * @param {expectSelection~StateBeforeRun} stateBeforeRun
     * @param {string} runCommand
     * @param {expectSelection~ExpectedState} expectedState
     * @param {expectSelection~TextVerificationOption[]} textVerificationOptions
     * @return {expectSelection~Result} - an additional result information.
     */
  }, {
    key: 'expectSelection',
    value: function expectSelection(spec, stateBeforeRun, runCommand, expectedState) {
      var textVerificationOptions = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];

      var result = {};
      var editor = atom.workspace.getActiveTextEditor();

      this.addMyMatchers(spec);

      // Verify text in the editor.
      // (It is expected that the verified part is around the position
      //  the cursor will be set on. The purpose is to detect differnce
      //  between the specified cursor position and the expected one,
      //  or unexpected changes in the text.)
      for (var vOption of textVerificationOptions) {
        editor.setSelectedBufferRange(vOption.range);

        var _actualText = editor.getSelectedText();
        spec.expect(_actualText).toBeBeforeRun(vOption.text);
      }

      // Set the cursor.
      editor.setCursorBufferPosition(stateBeforeRun.cursorPosition);

      // Run.
      var editorElement = atom.views.getView(editor);
      var start = new Date();
      atom.commands.dispatch(editorElement, runCommand);
      var end = new Date();
      result.elaspedMs = end - start;

      // Expect results.
      var expectedSelection = expectedState.selection;
      // - Range
      var actualRange = editor.getSelectedBufferRange();
      spec.expect(actualRange).toEqual(expectedSelection.range);
      // - Text
      var actualText = editor.getSelectedText();
      spec.expect(actualText).toBe(expectedSelection.text);

      return result;
    }
  }]);

  return SpecHelpers;
})();

exports['default'] = SpecHelpers;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9zcGVjL2hlbHBlcnMvc3BlYy1oZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7OztJQUtTLFdBQVc7V0FBWCxXQUFXOzBCQUFYLFdBQVc7OztlQUFYLFdBQVc7Ozs7Ozs7OztXQU9WLHVCQUFDLElBQUksRUFBRTtBQUN6QixVQUFJLENBQUMsV0FBVyxDQUFDOzs7Ozs7OztBQVFmLHFCQUFhLEVBQUUsdUJBQVMsUUFBUSxFQUFFOztBQUVoQyxjQUFNLElBQUksR0FBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQUFBQyxDQUFDOzs7QUFHeEMsY0FBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLGNBQUksSUFBSSxFQUFFO0FBQ1IsbUJBQU8sbUJBQWdCLElBQUksQ0FBQyxNQUFNLHVCQUFnQixRQUFRLFFBQUksQ0FBQztXQUNoRSxNQUFNO0FBQ0wsbUJBQU8sbUJBQWdCLElBQUksQ0FBQyxNQUFNLG1CQUFZLFFBQVEsUUFBSSxDQUFDO1dBQzVEO0FBQ0QsaUJBQU8sSUFBSSw4Q0FBOEMsQ0FBQztBQUMxRCxpQkFBTyxJQUFJLCtCQUErQixDQUFDO0FBQzNDLGNBQUksQ0FBQyxPQUFPLEdBQUc7bUJBQU0sT0FBTztXQUFBLENBQUM7O0FBRTdCLGlCQUFPLElBQUksQ0FBQztTQUNiO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0FtQ3FCLHlCQUNwQixJQUFJLEVBQ0osY0FBYyxFQUNkLFVBQVUsRUFDVixhQUFhLEVBQ2lCO1VBQTlCLHVCQUF1Qix5REFBRyxFQUFFOztBQUMxQixVQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOztBQUVwRCxVQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7O0FBT3pCLFdBQUssSUFBTSxPQUFPLElBQUksdUJBQXVCLEVBQUU7QUFDN0MsY0FBTSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFN0MsWUFBTSxXQUFVLEdBQUcsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQzVDLFlBQUksQ0FBQyxNQUFNLENBQUMsV0FBVSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNyRDs7O0FBR0QsWUFBTSxDQUFDLHVCQUF1QixDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7O0FBRzlELFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2pELFVBQU0sS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDekIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2xELFVBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdkIsWUFBTSxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDOzs7QUFHL0IsVUFBTSxpQkFBaUIsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDOztBQUVsRCxVQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztBQUNwRCxVQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFMUQsVUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQzVDLFVBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVyRCxhQUFPLE1BQU0sQ0FBQztLQUNqQjs7O1NBaEhrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvaG9tZS9haW1vcnJpcy8uYXRvbS9wYWNrYWdlcy9zZWxlY3QtdGV4dC1iZXR3ZWVuLXRhZ3Mvc3BlYy9oZWxwZXJzL3NwZWMtaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKipcbiAqIE5PVEU6IERlcGVuZHMgb24gSmFzbWluZSAxLjMuMS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BlY0hlbHBlcnMge1xuICAvKipcbiAgICogQWRkcyBjdXN0b20gdXNlZnVsIG1hdGNoZXJzIHRvIGEgY29udGV4dC5cbiAgICogSEFDSzogQXZvaWQgdG8gb3ZlcndyaXRlIHJlZHVuZHVudGx5LlxuICAgKiBUaGlzIG1heSBiZSBjYWxsZWQgbW9yZSB0aGFuIG9uY2UgaW4gYSBzcGVjLlxuICAgKiBAcGFyYW0ge2phc21pbmUuU3BlY30gc3BlYyAtIEFkZCB0aGVtIHRvIHRoaXMuXG4gICAqL1xuICBzdGF0aWMgYWRkTXlNYXRjaGVycyhzcGVjKSB7XG4gICAgc3BlYy5hZGRNYXRjaGVycyh7XG4gICAgICAvKipcbiAgICAgICAqIENvbXBhcmVzIGFzIHNhbWUgYXMgJ3RvQmUnLiBJbiBhZGRpdGlvbiwgdGhpcyBzaWduYWxpemUgdGhhdFxuICAgICAgICogdGhlIGJlaGF2aW9yIGlzIGluIHByZXBhcmF0aW9uLlxuICAgICAgICogQHBhcmFtIHsqfSBleHBlY3RlZCAtIEFuIGV4cGVjdGVkIHZhbHVlLlxuICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0gSXMgdGhlIGJlaGF2aW9yIGFzIGV4cGVjdGVkID9cbiAgICAgICAqIEB0aGlzIHtqYXNtaW5lLk1hdGNoZXJzfSBOT1RFOiBUaGUgdHlwZSBpcyB1bnNlcnRhaW4uXG4gICAgICAgKi9cbiAgICAgIHRvQmVCZWZvcmVSdW46IGZ1bmN0aW9uKGV4cGVjdGVkKSB7XG4gICAgICAgIC8vIENvbXBhcmUuXG4gICAgICAgIGNvbnN0IHBhc3MgPSAodGhpcy5hY3R1YWwgPT09IGV4cGVjdGVkKTtcblxuICAgICAgICAvLyBEZWZpbmUgdGhlIGVycm9yIG1lc3NhZ2UuXG4gICAgICAgIGxldCBtZXNzYWdlID0gJyc7XG4gICAgICAgIGlmIChwYXNzKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IGBFeHBlY3RlZCAnJHt0aGlzLmFjdHVhbH0nIG5vdCB0byBiZSAnJHtleHBlY3RlZH0nLmA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVzc2FnZSA9IGBFeHBlY3RlZCAnJHt0aGlzLmFjdHVhbH0nIHRvIGJlICcke2V4cGVjdGVkfScuYDtcbiAgICAgICAgfVxuICAgICAgICBtZXNzYWdlICs9ICcgVGhpcyBmYWlsdXJlIG9jY3VycyBpbiBhIHByZXBhcmF0aW9uIHBoYXNlLic7XG4gICAgICAgIG1lc3NhZ2UgKz0gJyBUaGUgc3BlYyBpcyBsaWtlbHkgdG8gYnJlYWsuJztcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gKCkgPT4gbWVzc2FnZTtcblxuICAgICAgICByZXR1cm4gcGFzcztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBleHBlY3RTZWxlY3Rpb25+U3RhdGVCZWZvcmVSdW5cbiAgICogQHByb3BlcnR5IHtSYW5nZX0gY3Vyc29yUG9zaXRpb24gLSBPZiBhdG9tLlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IGV4cGVjdFNlbGVjdGlvbn5TZWxlY3Rpb25cbiAgICogQHByb3BlcnR5IHtSYW5nZX0gcmFuZ2UgLSBPZiBhdG9tLlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdGV4dFxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IGV4cGVjdFNlbGVjdGlvbn5FeHBlY3RlZFN0YXRlXG4gICAqIEBwcm9wZXJ0eSB7ZXhwZWN0U2VsZWN0aW9uflNlbGVjdGlvbn0gc2VsZWN0aW9uXG4gICAqL1xuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gZXhwZWN0U2VsZWN0aW9uflRleHRWZXJpZmljYXRpb25PcHRpb25cbiAgICogQHByb3BlcnR5IHtSYW5nZX0gcmFuZ2UgLSBPZiBhdG9tLlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdGV4dFxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IGV4cGVjdFNlbGVjdGlvbn5SZXN1bHRcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9IGVsYXNwZWRNc1xuICAgKi9cbiAgLyoqXG4gICAqIEV4cGVjdCB0aGUgd2hvbGUgYmVoYXZpb3IgYWJvdXQgc2VsZWN0aW9uLlxuICAgKiBOT1RFOiBBdG9tJ3MgZ2xvYmFsIHZhcmlhYmxlcyBhcmUgdXNlZC5cbiAgICogTk9URTogUmVxdWlyZXMgdGhhdCBhIHRleHQgZWRpdG9yIGlzIGFjdGl2ZS5cbiAgICogQHBhcmFtIHtqYXNtaW5lLlNwZWN9IHNwZWNcbiAgICogQHBhcmFtIHtleHBlY3RTZWxlY3Rpb25+U3RhdGVCZWZvcmVSdW59IHN0YXRlQmVmb3JlUnVuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBydW5Db21tYW5kXG4gICAqIEBwYXJhbSB7ZXhwZWN0U2VsZWN0aW9ufkV4cGVjdGVkU3RhdGV9IGV4cGVjdGVkU3RhdGVcbiAgICogQHBhcmFtIHtleHBlY3RTZWxlY3Rpb25+VGV4dFZlcmlmaWNhdGlvbk9wdGlvbltdfSB0ZXh0VmVyaWZpY2F0aW9uT3B0aW9uc1xuICAgKiBAcmV0dXJuIHtleHBlY3RTZWxlY3Rpb25+UmVzdWx0fSAtIGFuIGFkZGl0aW9uYWwgcmVzdWx0IGluZm9ybWF0aW9uLlxuICAgKi9cbiAgc3RhdGljIGV4cGVjdFNlbGVjdGlvbihcbiAgICBzcGVjLFxuICAgIHN0YXRlQmVmb3JlUnVuLFxuICAgIHJ1bkNvbW1hbmQsXG4gICAgZXhwZWN0ZWRTdGF0ZSxcbiAgICB0ZXh0VmVyaWZpY2F0aW9uT3B0aW9ucyA9IFtdKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICAgICAgdGhpcy5hZGRNeU1hdGNoZXJzKHNwZWMpO1xuXG4gICAgICAvLyBWZXJpZnkgdGV4dCBpbiB0aGUgZWRpdG9yLlxuICAgICAgLy8gKEl0IGlzIGV4cGVjdGVkIHRoYXQgdGhlIHZlcmlmaWVkIHBhcnQgaXMgYXJvdW5kIHRoZSBwb3NpdGlvblxuICAgICAgLy8gIHRoZSBjdXJzb3Igd2lsbCBiZSBzZXQgb24uIFRoZSBwdXJwb3NlIGlzIHRvIGRldGVjdCBkaWZmZXJuY2VcbiAgICAgIC8vICBiZXR3ZWVuIHRoZSBzcGVjaWZpZWQgY3Vyc29yIHBvc2l0aW9uIGFuZCB0aGUgZXhwZWN0ZWQgb25lLFxuICAgICAgLy8gIG9yIHVuZXhwZWN0ZWQgY2hhbmdlcyBpbiB0aGUgdGV4dC4pXG4gICAgICBmb3IgKGNvbnN0IHZPcHRpb24gb2YgdGV4dFZlcmlmaWNhdGlvbk9wdGlvbnMpIHtcbiAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2Uodk9wdGlvbi5yYW5nZSk7XG5cbiAgICAgICAgY29uc3QgYWN0dWFsVGV4dCA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKTtcbiAgICAgICAgc3BlYy5leHBlY3QoYWN0dWFsVGV4dCkudG9CZUJlZm9yZVJ1bih2T3B0aW9uLnRleHQpO1xuICAgICAgfVxuXG4gICAgICAvLyBTZXQgdGhlIGN1cnNvci5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihzdGF0ZUJlZm9yZVJ1bi5jdXJzb3JQb3NpdGlvbik7XG5cbiAgICAgIC8vIFJ1bi5cbiAgICAgIGNvbnN0IGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKTtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoKTtcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgcnVuQ29tbWFuZCk7XG4gICAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZSgpO1xuICAgICAgcmVzdWx0LmVsYXNwZWRNcyA9IGVuZCAtIHN0YXJ0O1xuXG4gICAgICAvLyBFeHBlY3QgcmVzdWx0cy5cbiAgICAgIGNvbnN0IGV4cGVjdGVkU2VsZWN0aW9uID0gZXhwZWN0ZWRTdGF0ZS5zZWxlY3Rpb247XG4gICAgICAvLyAtIFJhbmdlXG4gICAgICBjb25zdCBhY3R1YWxSYW5nZSA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKCk7XG4gICAgICBzcGVjLmV4cGVjdChhY3R1YWxSYW5nZSkudG9FcXVhbChleHBlY3RlZFNlbGVjdGlvbi5yYW5nZSk7XG4gICAgICAvLyAtIFRleHRcbiAgICAgIGNvbnN0IGFjdHVhbFRleHQgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCk7XG4gICAgICBzcGVjLmV4cGVjdChhY3R1YWxUZXh0KS50b0JlKGV4cGVjdGVkU2VsZWN0aW9uLnRleHQpO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=