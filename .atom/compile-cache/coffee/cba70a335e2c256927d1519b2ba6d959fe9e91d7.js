(function() {
  var wrapSelection;

  module.exports = {
    activate: function(state) {
      return atom.commands.add('atom-workspace', {
        'wrap-in-tag:wrap': (function(_this) {
          return function() {
            return _this.wrap();
          };
        })(this)
      });
    },
    wrap: function() {
      var editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        return editor.getSelections().map(function(item) {
          return wrapSelection(editor, item);
        });
      }
    }
  };

  wrapSelection = function(editor, selection) {
    var editorView, endTagSelection, newEndTagSelectRange, newStartTagSelectRange, newText, range, tag, tagRangePos, text;
    tag = 'p';
    text = selection.getText();
    tagRangePos = selection.getBufferRange();
    newText = ['<', tag, '>', text, '</', tag, '>'].join('');
    range = {
      start: {
        from: [tagRangePos.start.row, tagRangePos.start.column + 1],
        to: [tagRangePos.start.row, tagRangePos.start.column + 2]
      },
      end: {
        from: [tagRangePos.end.row, tagRangePos.end.column + 5],
        to: [tagRangePos.end.row, tagRangePos.end.column + 6]
      }
    };
    if (range.end.from[0] > range.start.from[0]) {
      range.end.from[1] = range.end.from[1] - 3;
      range.end.to[1] = range.end.to[1] - 3;
    }
    newStartTagSelectRange = [range.start.from, range.start.to];
    newEndTagSelectRange = [range.end.from, range.end.to];
    selection.insertText(newText);
    selection.cursor.setBufferPosition([tagRangePos.start.row, tagRangePos.start.column + 1]);
    editor.addSelectionForBufferRange(newStartTagSelectRange);
    endTagSelection = editor.addSelectionForBufferRange(newEndTagSelectRange);
    editorView = atom.views.getView(editor);
    return editorView.addEventListener('keydown', function(event) {
      if (event.keyCode === 32) {
        endTagSelection.cursor.marker.destroy();
        return this.removeEventListener('keydown', arguments.callee);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvYXRvbS13cmFwLWluLXRhZy9saWIvd3JhcC1pbi10YWcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDthQUVSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxrQkFBQSxFQUFvQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxJQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEI7T0FBcEM7SUFGUSxDQUFWO0lBSUEsSUFBQSxFQUFNLFNBQUE7QUFDSixVQUFBO01BQUEsSUFBRyxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVo7ZUFDRSxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsR0FBdkIsQ0FBMkIsU0FBQyxJQUFEO2lCQUFVLGFBQUEsQ0FBYyxNQUFkLEVBQXNCLElBQXRCO1FBQVYsQ0FBM0IsRUFERjs7SUFESSxDQUpOOzs7RUFRRixhQUFBLEdBQWdCLFNBQUMsTUFBRCxFQUFTLFNBQVQ7QUFDZCxRQUFBO0lBQUEsR0FBQSxHQUFNO0lBQ04sSUFBQSxHQUFPLFNBQVMsQ0FBQyxPQUFWLENBQUE7SUFDUCxXQUFBLEdBQWMsU0FBUyxDQUFDLGNBQVYsQ0FBQTtJQUVkLE9BQUEsR0FBVSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixHQUE1QixFQUFpQyxHQUFqQyxDQUFxQyxDQUFDLElBQXRDLENBQTJDLEVBQTNDO0lBRVYsS0FBQSxHQUNFO01BQUEsS0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFuQixFQUF3QixXQUFXLENBQUMsS0FBSyxDQUFDLE1BQWxCLEdBQXlCLENBQWpELENBQU47UUFDQSxFQUFBLEVBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQW5CLEVBQXdCLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBbEIsR0FBeUIsQ0FBakQsQ0FESjtPQURGO01BR0EsR0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFqQixFQUFzQixXQUFXLENBQUMsR0FBRyxDQUFDLE1BQWhCLEdBQXVCLENBQTdDLENBQU47UUFDQSxFQUFBLEVBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQWpCLEVBQXNCLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBaEIsR0FBdUIsQ0FBN0MsQ0FESjtPQUpGOztJQU9GLElBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFmLEdBQW9CLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBeEM7TUFDRSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQWYsR0FBb0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFmLEdBQW9CO01BQ3hDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRyxDQUFBLENBQUEsQ0FBYixHQUFrQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUcsQ0FBQSxDQUFBLENBQWIsR0FBa0IsRUFGdEM7O0lBSUEsc0JBQUEsR0FBeUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQWIsRUFBbUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUEvQjtJQUN6QixvQkFBQSxHQUF1QixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBWCxFQUFpQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTNCO0lBRXZCLFNBQVMsQ0FBQyxVQUFWLENBQXFCLE9BQXJCO0lBQ0EsU0FBUyxDQUFDLE1BQU0sQ0FBQyxpQkFBakIsQ0FBbUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQW5CLEVBQXdCLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBbEIsR0FBeUIsQ0FBakQsQ0FBbkM7SUFDQSxNQUFNLENBQUMsMEJBQVAsQ0FBa0Msc0JBQWxDO0lBQ0EsZUFBQSxHQUFrQixNQUFNLENBQUMsMEJBQVAsQ0FBa0Msb0JBQWxDO0lBRWxCLFVBQUEsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkI7V0FDYixVQUFVLENBQUMsZ0JBQVgsQ0FBNEIsU0FBNUIsRUFBdUMsU0FBQyxLQUFEO01BQ3JDLElBQUcsS0FBSyxDQUFDLE9BQU4sS0FBaUIsRUFBcEI7UUFDRSxlQUFlLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUE5QixDQUFBO2VBQ0EsSUFBQyxDQUFBLG1CQUFELENBQXFCLFNBQXJCLEVBQWdDLFNBQVMsQ0FBQyxNQUExQyxFQUZGOztJQURxQyxDQUF2QztFQTVCYztBQVZoQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ3dyYXAtaW4tdGFnOndyYXAnOiA9PiBAd3JhcCgpXG5cbiAgd3JhcDogLT5cbiAgICBpZiBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGVkaXRvci5nZXRTZWxlY3Rpb25zKCkubWFwKChpdGVtKSAtPiB3cmFwU2VsZWN0aW9uKGVkaXRvciwgaXRlbSkpXG5cbndyYXBTZWxlY3Rpb24gPSAoZWRpdG9yLCBzZWxlY3Rpb24pIC0+XG4gIHRhZyA9ICdwJ1xuICB0ZXh0ID0gc2VsZWN0aW9uLmdldFRleHQoKVxuICB0YWdSYW5nZVBvcyA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG5cbiAgbmV3VGV4dCA9IFsnPCcsIHRhZywgJz4nLCB0ZXh0LCAnPC8nLCB0YWcsICc+J10uam9pbignJylcblxuICByYW5nZSA9XG4gICAgc3RhcnQ6XG4gICAgICBmcm9tOiBbdGFnUmFuZ2VQb3Muc3RhcnQucm93LCB0YWdSYW5nZVBvcy5zdGFydC5jb2x1bW4rMV1cbiAgICAgIHRvOiBbdGFnUmFuZ2VQb3Muc3RhcnQucm93LCB0YWdSYW5nZVBvcy5zdGFydC5jb2x1bW4rMl1cbiAgICBlbmQ6XG4gICAgICBmcm9tOiBbdGFnUmFuZ2VQb3MuZW5kLnJvdywgdGFnUmFuZ2VQb3MuZW5kLmNvbHVtbis1XSxcbiAgICAgIHRvOiBbdGFnUmFuZ2VQb3MuZW5kLnJvdywgdGFnUmFuZ2VQb3MuZW5kLmNvbHVtbis2XVxuXG4gIGlmIHJhbmdlLmVuZC5mcm9tWzBdID4gcmFuZ2Uuc3RhcnQuZnJvbVswXVxuICAgIHJhbmdlLmVuZC5mcm9tWzFdID0gcmFuZ2UuZW5kLmZyb21bMV0gLSAzXG4gICAgcmFuZ2UuZW5kLnRvWzFdID0gcmFuZ2UuZW5kLnRvWzFdIC0gM1xuXG4gIG5ld1N0YXJ0VGFnU2VsZWN0UmFuZ2UgPSBbcmFuZ2Uuc3RhcnQuZnJvbSwgcmFuZ2Uuc3RhcnQudG9dXG4gIG5ld0VuZFRhZ1NlbGVjdFJhbmdlID0gW3JhbmdlLmVuZC5mcm9tLCByYW5nZS5lbmQudG9dXG5cbiAgc2VsZWN0aW9uLmluc2VydFRleHQobmV3VGV4dClcbiAgc2VsZWN0aW9uLmN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihbdGFnUmFuZ2VQb3Muc3RhcnQucm93LCB0YWdSYW5nZVBvcy5zdGFydC5jb2x1bW4rMV0pXG4gIGVkaXRvci5hZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZShuZXdTdGFydFRhZ1NlbGVjdFJhbmdlKVxuICBlbmRUYWdTZWxlY3Rpb24gPSBlZGl0b3IuYWRkU2VsZWN0aW9uRm9yQnVmZmVyUmFuZ2UobmV3RW5kVGFnU2VsZWN0UmFuZ2UpXG5cbiAgZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyBlZGl0b3JcbiAgZWRpdG9yVmlldy5hZGRFdmVudExpc3RlbmVyICdrZXlkb3duJywgKGV2ZW50KSAtPlxuICAgIGlmIGV2ZW50LmtleUNvZGUgaXMgMzJcbiAgICAgIGVuZFRhZ1NlbGVjdGlvbi5jdXJzb3IubWFya2VyLmRlc3Ryb3koKVxuICAgICAgQHJlbW92ZUV2ZW50TGlzdGVuZXIgJ2tleWRvd24nLCBhcmd1bWVudHMuY2FsbGVlO1xuIl19