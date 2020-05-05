(function() {
  var CompositeDisposable, MinimapPigmentsBinding;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  MinimapPigmentsBinding = require('./minimap-pigments-binding');

  module.exports = {
    active: false,
    isActive: function() {
      return this.active;
    },
    activate: function(state) {
      this.bindingsById = {};
      this.subscriptionsById = {};
      return this.subscriptions = new CompositeDisposable;
    },
    consumeMinimapServiceV1: function(minimap1) {
      this.minimap = minimap1;
      return this.minimap.registerPlugin('pigments', this);
    },
    consumePigmentsServiceV1: function(pigments) {
      this.pigments = pigments;
      this.subscriptions.add(this.pigments.getProject().onDidDestroy((function(_this) {
        return function() {
          return _this.pigments = null;
        };
      })(this)));
      if ((this.minimap != null) && this.active) {
        return this.initializeBindings();
      }
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.editorsSubscription.dispose();
      this.minimap.unregisterPlugin('pigments');
      this.minimap = null;
      return this.pigments = null;
    },
    activatePlugin: function() {
      if (this.active) {
        return;
      }
      this.active = true;
      if (this.pigments != null) {
        return this.initializeBindings();
      }
    },
    initializeBindings: function() {
      return this.editorsSubscription = this.pigments.observeColorBuffers((function(_this) {
        return function(colorBuffer) {
          var binding, editor, minimap;
          editor = colorBuffer.editor;
          minimap = _this.minimap.minimapForEditor(editor);
          binding = new MinimapPigmentsBinding({
            editor: editor,
            minimap: minimap,
            colorBuffer: colorBuffer
          });
          _this.bindingsById[editor.id] = binding;
          return _this.subscriptionsById[editor.id] = editor.onDidDestroy(function() {
            var ref;
            if ((ref = _this.subscriptionsById[editor.id]) != null) {
              ref.dispose();
            }
            binding.destroy();
            delete _this.subscriptionsById[editor.id];
            return delete _this.bindingsById[editor.id];
          });
        };
      })(this));
    },
    bindingForEditor: function(editor) {
      if (this.bindingsById[editor.id] != null) {
        return this.bindingsById[editor.id];
      }
    },
    deactivatePlugin: function() {
      var binding, id, ref, ref1;
      if (!this.active) {
        return;
      }
      ref = this.bindingsById;
      for (id in ref) {
        binding = ref[id];
        binding.destroy();
      }
      this.active = false;
      return (ref1 = this.editorsSubscription) != null ? ref1.dispose() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvbWluaW1hcC1waWdtZW50cy9saWIvbWluaW1hcC1waWdtZW50cy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsV0FBUjs7RUFDeEIsc0JBQUEsR0FBeUIsT0FBQSxDQUFRLDRCQUFSOztFQUV6QixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUFRLEtBQVI7SUFFQSxRQUFBLEVBQVUsU0FBQTthQUFHLElBQUMsQ0FBQTtJQUFKLENBRlY7SUFJQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO2FBQ3JCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7SUFIYixDQUpWO0lBU0EsdUJBQUEsRUFBeUIsU0FBQyxRQUFEO01BQUMsSUFBQyxDQUFBLFVBQUQ7YUFDeEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLElBQXBDO0lBRHVCLENBVHpCO0lBWUEsd0JBQUEsRUFBMEIsU0FBQyxRQUFEO01BQUMsSUFBQyxDQUFBLFdBQUQ7TUFDekIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxRQUFRLENBQUMsVUFBVixDQUFBLENBQXNCLENBQUMsWUFBdkIsQ0FBb0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxRQUFELEdBQVk7UUFBZjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEMsQ0FBbkI7TUFFQSxJQUF5QixzQkFBQSxJQUFjLElBQUMsQ0FBQSxNQUF4QztlQUFBLElBQUMsQ0FBQSxrQkFBRCxDQUFBLEVBQUE7O0lBSHdCLENBWjFCO0lBaUJBLFVBQUEsRUFBWSxTQUFBO01BQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7TUFDQSxJQUFDLENBQUEsbUJBQW1CLENBQUMsT0FBckIsQ0FBQTtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsZ0JBQVQsQ0FBMEIsVUFBMUI7TUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO2FBQ1gsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUxGLENBakJaO0lBd0JBLGNBQUEsRUFBZ0IsU0FBQTtNQUNkLElBQVUsSUFBQyxDQUFBLE1BQVg7QUFBQSxlQUFBOztNQUVBLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFFVixJQUF5QixxQkFBekI7ZUFBQSxJQUFDLENBQUEsa0JBQUQsQ0FBQSxFQUFBOztJQUxjLENBeEJoQjtJQStCQSxrQkFBQSxFQUFvQixTQUFBO2FBQ2xCLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFDLENBQUEsUUFBUSxDQUFDLG1CQUFWLENBQThCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxXQUFEO0FBQ25ELGNBQUE7VUFBQSxNQUFBLEdBQVMsV0FBVyxDQUFDO1VBQ3JCLE9BQUEsR0FBVSxLQUFDLENBQUEsT0FBTyxDQUFDLGdCQUFULENBQTBCLE1BQTFCO1VBRVYsT0FBQSxHQUFVLElBQUksc0JBQUosQ0FBMkI7WUFBQyxRQUFBLE1BQUQ7WUFBUyxTQUFBLE9BQVQ7WUFBa0IsYUFBQSxXQUFsQjtXQUEzQjtVQUNWLEtBQUMsQ0FBQSxZQUFhLENBQUEsTUFBTSxDQUFDLEVBQVAsQ0FBZCxHQUEyQjtpQkFFM0IsS0FBQyxDQUFBLGlCQUFrQixDQUFBLE1BQU0sQ0FBQyxFQUFQLENBQW5CLEdBQWdDLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFNBQUE7QUFDbEQsZ0JBQUE7O2lCQUE2QixDQUFFLE9BQS9CLENBQUE7O1lBQ0EsT0FBTyxDQUFDLE9BQVIsQ0FBQTtZQUNBLE9BQU8sS0FBQyxDQUFBLGlCQUFrQixDQUFBLE1BQU0sQ0FBQyxFQUFQO21CQUMxQixPQUFPLEtBQUMsQ0FBQSxZQUFhLENBQUEsTUFBTSxDQUFDLEVBQVA7VUFKNkIsQ0FBcEI7UUFQbUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCO0lBREwsQ0EvQnBCO0lBNkNBLGdCQUFBLEVBQWtCLFNBQUMsTUFBRDtNQUNoQixJQUFtQyxvQ0FBbkM7QUFBQSxlQUFPLElBQUMsQ0FBQSxZQUFhLENBQUEsTUFBTSxDQUFDLEVBQVAsRUFBckI7O0lBRGdCLENBN0NsQjtJQWdEQSxnQkFBQSxFQUFrQixTQUFBO0FBQ2hCLFVBQUE7TUFBQSxJQUFBLENBQWMsSUFBQyxDQUFBLE1BQWY7QUFBQSxlQUFBOztBQUVBO0FBQUEsV0FBQSxTQUFBOztRQUFBLE9BQU8sQ0FBQyxPQUFSLENBQUE7QUFBQTtNQUVBLElBQUMsQ0FBQSxNQUFELEdBQVU7NkRBQ1UsQ0FBRSxPQUF0QixDQUFBO0lBTmdCLENBaERsQjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2V2ZW50LWtpdCdcbk1pbmltYXBQaWdtZW50c0JpbmRpbmcgPSByZXF1aXJlICcuL21pbmltYXAtcGlnbWVudHMtYmluZGluZydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmU6IGZhbHNlXG5cbiAgaXNBY3RpdmU6IC0+IEBhY3RpdmVcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBiaW5kaW5nc0J5SWQgPSB7fVxuICAgIEBzdWJzY3JpcHRpb25zQnlJZCA9IHt9XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gIGNvbnN1bWVNaW5pbWFwU2VydmljZVYxOiAoQG1pbmltYXApIC0+XG4gICAgQG1pbmltYXAucmVnaXN0ZXJQbHVnaW4gJ3BpZ21lbnRzJywgdGhpc1xuXG4gIGNvbnN1bWVQaWdtZW50c1NlcnZpY2VWMTogKEBwaWdtZW50cykgLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHBpZ21lbnRzLmdldFByb2plY3QoKS5vbkRpZERlc3Ryb3kgPT4gQHBpZ21lbnRzID0gbnVsbFxuXG4gICAgQGluaXRpYWxpemVCaW5kaW5ncygpIGlmIEBtaW5pbWFwPyBhbmQgQGFjdGl2ZVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQGVkaXRvcnNTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgQG1pbmltYXAudW5yZWdpc3RlclBsdWdpbiAncGlnbWVudHMnXG4gICAgQG1pbmltYXAgPSBudWxsXG4gICAgQHBpZ21lbnRzID0gbnVsbFxuXG4gIGFjdGl2YXRlUGx1Z2luOiAtPlxuICAgIHJldHVybiBpZiBAYWN0aXZlXG5cbiAgICBAYWN0aXZlID0gdHJ1ZVxuXG4gICAgQGluaXRpYWxpemVCaW5kaW5ncygpIGlmIEBwaWdtZW50cz9cblxuICBpbml0aWFsaXplQmluZGluZ3M6IC0+XG4gICAgQGVkaXRvcnNTdWJzY3JpcHRpb24gPSBAcGlnbWVudHMub2JzZXJ2ZUNvbG9yQnVmZmVycyAoY29sb3JCdWZmZXIpID0+XG4gICAgICBlZGl0b3IgPSBjb2xvckJ1ZmZlci5lZGl0b3JcbiAgICAgIG1pbmltYXAgPSBAbWluaW1hcC5taW5pbWFwRm9yRWRpdG9yKGVkaXRvcilcblxuICAgICAgYmluZGluZyA9IG5ldyBNaW5pbWFwUGlnbWVudHNCaW5kaW5nKHtlZGl0b3IsIG1pbmltYXAsIGNvbG9yQnVmZmVyfSlcbiAgICAgIEBiaW5kaW5nc0J5SWRbZWRpdG9yLmlkXSA9IGJpbmRpbmdcblxuICAgICAgQHN1YnNjcmlwdGlvbnNCeUlkW2VkaXRvci5pZF0gPSBlZGl0b3Iub25EaWREZXN0cm95ID0+XG4gICAgICAgIEBzdWJzY3JpcHRpb25zQnlJZFtlZGl0b3IuaWRdPy5kaXNwb3NlKClcbiAgICAgICAgYmluZGluZy5kZXN0cm95KClcbiAgICAgICAgZGVsZXRlIEBzdWJzY3JpcHRpb25zQnlJZFtlZGl0b3IuaWRdXG4gICAgICAgIGRlbGV0ZSBAYmluZGluZ3NCeUlkW2VkaXRvci5pZF1cblxuICBiaW5kaW5nRm9yRWRpdG9yOiAoZWRpdG9yKSAtPlxuICAgIHJldHVybiBAYmluZGluZ3NCeUlkW2VkaXRvci5pZF0gaWYgQGJpbmRpbmdzQnlJZFtlZGl0b3IuaWRdP1xuXG4gIGRlYWN0aXZhdGVQbHVnaW46IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAYWN0aXZlXG5cbiAgICBiaW5kaW5nLmRlc3Ryb3koKSBmb3IgaWQsYmluZGluZyBvZiBAYmluZGluZ3NCeUlkXG5cbiAgICBAYWN0aXZlID0gZmFsc2VcbiAgICBAZWRpdG9yc1N1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4iXX0=
