Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.create = create;
var PADDING_CHARACTER = ' ';

exports.PADDING_CHARACTER = PADDING_CHARACTER;

function create(intention, length) {
  var tries = 0;
  var element = document.createElement('intention-inline');
  element.style.opacity = '0';
  element.textContent = PADDING_CHARACTER.repeat(length);
  function checkStyle() {
    if (++tries === 20) {
      return;
    }
    var styles = getComputedStyle(element);
    if (styles.lineHeight && styles.width !== 'auto') {
      element.style.opacity = '1';
      element.style.top = '-' + styles.lineHeight;
    } else requestAnimationFrame(checkStyle);
  }
  requestAnimationFrame(checkStyle);
  return element;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL2VsZW1lbnRzL2hpZ2hsaWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBSU8sSUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUE7Ozs7QUFFN0IsU0FBUyxNQUFNLENBQUMsU0FBd0IsRUFBRSxNQUFjLEVBQWU7QUFDNUUsTUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFBO0FBQ2IsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0FBQzFELFNBQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQTtBQUMzQixTQUFPLENBQUMsV0FBVyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN0RCxXQUFTLFVBQVUsR0FBRztBQUNwQixRQUFJLEVBQUUsS0FBSyxLQUFLLEVBQUUsRUFBRTtBQUFFLGFBQU07S0FBRTtBQUM5QixRQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUN4QyxRQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxNQUFNLEVBQUU7QUFDaEQsYUFBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFBO0FBQzNCLGFBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFBO0tBQzVDLE1BQU0scUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUE7R0FDekM7QUFDRCx1QkFBcUIsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNqQyxTQUFPLE9BQU8sQ0FBQTtDQUNmIiwiZmlsZSI6Ii9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL2VsZW1lbnRzL2hpZ2hsaWdodC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB0eXBlIHsgSGlnaGxpZ2h0SXRlbSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5leHBvcnQgY29uc3QgUEFERElOR19DSEFSQUNURVIgPSAn4oCHJ1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKGludGVudGlvbjogSGlnaGxpZ2h0SXRlbSwgbGVuZ3RoOiBudW1iZXIpOiBIVE1MRWxlbWVudCB7XG4gIGxldCB0cmllcyA9IDBcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ludGVudGlvbi1pbmxpbmUnKVxuICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMCdcbiAgZWxlbWVudC50ZXh0Q29udGVudCA9IFBBRERJTkdfQ0hBUkFDVEVSLnJlcGVhdChsZW5ndGgpXG4gIGZ1bmN0aW9uIGNoZWNrU3R5bGUoKSB7XG4gICAgaWYgKCsrdHJpZXMgPT09IDIwKSB7IHJldHVybiB9XG4gICAgY29uc3Qgc3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KVxuICAgIGlmIChzdHlsZXMubGluZUhlaWdodCAmJiBzdHlsZXMud2lkdGggIT09ICdhdXRvJykge1xuICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnXG4gICAgICBlbGVtZW50LnN0eWxlLnRvcCA9ICctJyArIHN0eWxlcy5saW5lSGVpZ2h0XG4gICAgfSBlbHNlIHJlcXVlc3RBbmltYXRpb25GcmFtZShjaGVja1N0eWxlKVxuICB9XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShjaGVja1N0eWxlKVxuICByZXR1cm4gZWxlbWVudFxufVxuIl19