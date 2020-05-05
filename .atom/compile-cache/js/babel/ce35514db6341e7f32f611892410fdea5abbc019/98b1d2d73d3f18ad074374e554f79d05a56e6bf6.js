function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libElementsList = require('../lib/elements/list');

var _libElementsList2 = _interopRequireDefault(_libElementsList);

var _helpers = require('./helpers');

describe('Intentions list element', function () {
  it('has a complete working lifecycle', function () {
    var element = new _libElementsList2['default']();
    var suggestions = [(0, _helpers.createSuggestion)('Suggestion 1', jasmine.createSpy('suggestion.selected.0'), 'someClass', 'someIcon'), (0, _helpers.createSuggestion)('Suggestion 2', jasmine.createSpy('suggestion.selected.1')), (0, _helpers.createSuggestion)('Suggestion 3', jasmine.createSpy('suggestion.selected.2'), 'anotherClass')];

    var selected = jasmine.createSpy('suggestion.selected');
    var rendered = element.render(suggestions, selected);

    expect(rendered.refs.list.children.length).toBe(3);
    expect(rendered.refs.list.children[0].textContent).toBe('Suggestion 1');
    expect(rendered.refs.list.children[1].textContent).toBe('Suggestion 2');
    expect(rendered.refs.list.children[2].textContent).toBe('Suggestion 3');
    expect(rendered.refs.list.children[0].children[0].className).toBe('someClass icon icon-someIcon');
    expect(rendered.refs.list.children[2].children[0].className).toBe('anotherClass');
    expect(element.suggestionsIndex).toBe(-1);

    element.move('down');

    expect(element.suggestionsIndex).toBe(0);
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[0].textContent);

    element.move('down');

    expect(element.suggestionsIndex).toBe(1);
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[1].textContent);

    element.move('down');

    expect(element.suggestionsIndex).toBe(2);
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[2].textContent);

    element.move('up');

    expect(element.suggestionsIndex).toBe(1);
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[1].textContent);

    element.move('up');

    expect(element.suggestionsIndex).toBe(0);
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[0].textContent);

    element.move('up');

    expect(element.suggestionsIndex).toBe(2);
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[2].textContent);

    rendered.refs.list.children[1].children[0].dispatchEvent(new MouseEvent('click', {
      bubbles: true
    }));
    expect(selected).toHaveBeenCalledWith(suggestions[1]);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvc3BlYy9lbGVtZW50LWxpc3Qtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzsrQkFFd0Isc0JBQXNCOzs7O3VCQUNiLFdBQVc7O0FBRTVDLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxZQUFXO0FBQzdDLElBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxZQUFXO0FBQ2hELFFBQU0sT0FBTyxHQUFHLGtDQUFpQixDQUFBO0FBQ2pDLFFBQU0sV0FBVyxHQUFHLENBQ2xCLCtCQUFpQixjQUFjLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsRUFDckcsK0JBQWlCLGNBQWMsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLENBQUMsRUFDNUUsK0JBQWlCLGNBQWMsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLEVBQUUsY0FBYyxDQUFDLENBQzdGLENBQUE7O0FBRUQsUUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBQ3pELFFBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFBOztBQUV0RCxVQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNsRCxVQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUN2RSxVQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FB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Q0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQTs7QUFFNUcsV0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTs7QUFFbEIsVUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN4QyxVQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFBOztBQUU1RyxZQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUU7QUFDL0UsYUFBTyxFQUFFLElBQUk7S0FDZCxDQUFDLENBQUMsQ0FBQTtBQUNILFVBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUN0RCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9zcGVjL2VsZW1lbnQtbGlzdC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IExpc3RFbGVtZW50IGZyb20gJy4uL2xpYi9lbGVtZW50cy9saXN0J1xuaW1wb3J0IHsgY3JlYXRlU3VnZ2VzdGlvbiB9IGZyb20gJy4vaGVscGVycydcblxuZGVzY3JpYmUoJ0ludGVudGlvbnMgbGlzdCBlbGVtZW50JywgZnVuY3Rpb24oKSB7XG4gIGl0KCdoYXMgYSBjb21wbGV0ZSB3b3JraW5nIGxpZmVjeWNsZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBuZXcgTGlzdEVsZW1lbnQoKVxuICAgIGNvbnN0IHN1Z2dlc3Rpb25zID0gW1xuICAgICAgY3JlYXRlU3VnZ2VzdGlvbignU3VnZ2VzdGlvbiAxJywgamFzbWluZS5jcmVhdGVTcHkoJ3N1Z2dlc3Rpb24uc2VsZWN0ZWQuMCcpLCAnc29tZUNsYXNzJywgJ3NvbWVJY29uJyksXG4gICAgICBjcmVhdGVTdWdnZXN0aW9uKCdTdWdnZXN0aW9uIDInLCBqYXNtaW5lLmNyZWF0ZVNweSgnc3VnZ2VzdGlvbi5zZWxlY3RlZC4xJykpLFxuICAgICAgY3JlYXRlU3VnZ2VzdGlvbignU3VnZ2VzdGlvbiAzJywgamFzbWluZS5jcmVhdGVTcHkoJ3N1Z2dlc3Rpb24uc2VsZWN0ZWQuMicpLCAnYW5vdGhlckNsYXNzJyksXG4gICAgXVxuXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBqYXNtaW5lLmNyZWF0ZVNweSgnc3VnZ2VzdGlvbi5zZWxlY3RlZCcpXG4gICAgY29uc3QgcmVuZGVyZWQgPSBlbGVtZW50LnJlbmRlcihzdWdnZXN0aW9ucywgc2VsZWN0ZWQpXG5cbiAgICBleHBlY3QocmVuZGVyZWQucmVmcy5saXN0LmNoaWxkcmVuLmxlbmd0aCkudG9CZSgzKVxuICAgIGV4cGVjdChyZW5kZXJlZC5yZWZzLmxpc3QuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQpLnRvQmUoJ1N1Z2dlc3Rpb24gMScpXG4gICAgZXhwZWN0KHJlbmRlcmVkLnJlZnMubGlzdC5jaGlsZHJlblsxXS50ZXh0Q29udGVudCkudG9CZSgnU3VnZ2VzdGlvbiAyJylcbiAgICBleHBlY3QocmVuZGVyZWQucmVmcy5saXN0LmNoaWxkcmVuWzJdLnRleHRDb250ZW50KS50b0JlKCdTdWdnZXN0aW9uIDMnKVxuICAgIGV4cGVjdChyZW5kZXJlZC5yZWZzLmxpc3QuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uY2xhc3NOYW1lKS50b0JlKCdzb21lQ2xhc3MgaWNvbiBpY29uLXNvbWVJY29uJylcbiAgICBleHBlY3QocmVuZGVyZWQucmVmcy5saXN0LmNoaWxkcmVuWzJdLmNoaWxkcmVuWzBdLmNsYXNzTmFtZSkudG9CZSgnYW5vdGhlckNsYXNzJylcbiAgICBleHBlY3QoZWxlbWVudC5zdWdnZXN0aW9uc0luZGV4KS50b0JlKC0xKVxuXG4gICAgZWxlbWVudC5tb3ZlKCdkb3duJylcblxuICAgIGV4cGVjdChlbGVtZW50LnN1Z2dlc3Rpb25zSW5kZXgpLnRvQmUoMClcbiAgICBleHBlY3QoZWxlbWVudC5zdWdnZXN0aW9uc1tlbGVtZW50LnN1Z2dlc3Rpb25zSW5kZXhdLnRpdGxlKS50b0JlKHJlbmRlcmVkLnJlZnMubGlzdC5jaGlsZHJlblswXS50ZXh0Q29udGVudClcblxuICAgIGVsZW1lbnQubW92ZSgnZG93bicpXG5cbiAgICBleHBlY3QoZWxlbWVudC5zdWdnZXN0aW9uc0luZGV4KS50b0JlKDEpXG4gICAgZXhwZWN0KGVsZW1lbnQuc3VnZ2VzdGlvbnNbZWxlbWVudC5zdWdnZXN0aW9uc0luZGV4XS50aXRsZSkudG9CZShyZW5kZXJlZC5yZWZzLmxpc3QuY2hpbGRyZW5bMV0udGV4dENvbnRlbnQpXG5cbiAgICBlbGVtZW50Lm1vdmUoJ2Rvd24nKVxuXG4gICAgZXhwZWN0KGVsZW1lbnQuc3VnZ2VzdGlvbnNJbmRleCkudG9CZSgyKVxuICAgIGV4cGVjdChlbGVtZW50LnN1Z2dlc3Rpb25zW2VsZW1lbnQuc3VnZ2VzdGlvbnNJbmRleF0udGl0bGUpLnRvQmUocmVuZGVyZWQucmVmcy5saXN0LmNoaWxkcmVuWzJdLnRleHRDb250ZW50KVxuXG4gICAgZWxlbWVudC5tb3ZlKCd1cCcpXG5cbiAgICBleHBlY3QoZWxlbWVudC5zdWdnZXN0aW9uc0luZGV4KS50b0JlKDEpXG4gICAgZXhwZWN0KGVsZW1lbnQuc3VnZ2VzdGlvbnNbZWxlbWVudC5zdWdnZXN0aW9uc0luZGV4XS50aXRsZSkudG9CZShyZW5kZXJlZC5yZWZzLmxpc3QuY2hpbGRyZW5bMV0udGV4dENvbnRlbnQpXG5cbiAgICBlbGVtZW50Lm1vdmUoJ3VwJylcblxuICAgIGV4cGVjdChlbGVtZW50LnN1Z2dlc3Rpb25zSW5kZXgpLnRvQmUoMClcbiAgICBleHBlY3QoZWxlbWVudC5zdWdnZXN0aW9uc1tlbGVtZW50LnN1Z2dlc3Rpb25zSW5kZXhdLnRpdGxlKS50b0JlKHJlbmRlcmVkLnJlZnMubGlzdC5jaGlsZHJlblswXS50ZXh0Q29udGVudClcblxuICAgIGVsZW1lbnQubW92ZSgndXAnKVxuXG4gICAgZXhwZWN0KGVsZW1lbnQuc3VnZ2VzdGlvbnNJbmRleCkudG9CZSgyKVxuICAgIGV4cGVjdChlbGVtZW50LnN1Z2dlc3Rpb25zW2VsZW1lbnQuc3VnZ2VzdGlvbnNJbmRleF0udGl0bGUpLnRvQmUocmVuZGVyZWQucmVmcy5saXN0LmNoaWxkcmVuWzJdLnRleHRDb250ZW50KVxuXG4gICAgcmVuZGVyZWQucmVmcy5saXN0LmNoaWxkcmVuWzFdLmNoaWxkcmVuWzBdLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoJ2NsaWNrJywge1xuICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICB9KSlcbiAgICBleHBlY3Qoc2VsZWN0ZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHN1Z2dlc3Rpb25zWzFdKVxuICB9KVxufSlcbiJdfQ==