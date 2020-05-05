(function() {
  var MinimapPigments;

  MinimapPigments = require('../lib/minimap-pigments');

  describe("MinimapPigments", function() {
    var binding, colorBuffer, editBuffer, editor, minimap, minimapPackage, pigmentsProject, plugin, ref, workspaceElement;
    ref = [], workspaceElement = ref[0], editor = ref[1], minimapPackage = ref[2], minimap = ref[3], pigmentsProject = ref[4], colorBuffer = ref[5], plugin = ref[6], binding = ref[7];
    editBuffer = function(text, options) {
      var range;
      if (options == null) {
        options = {};
      }
      if (options.start != null) {
        if (options.end != null) {
          range = [options.start, options.end];
        } else {
          range = [options.start, options.start];
        }
        editor.setSelectedBufferRange(range);
      }
      editor.insertText(text);
      if (!options.noEvent) {
        return editor.getBuffer().emitter.emit('did-stop-changing');
      }
    };
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.workspace.open('sample.sass').then(function(textEditor) {
          return editor = textEditor;
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          return pigmentsProject = pkg.mainModule.getProject();
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('minimap').then(function(pkg) {
          return minimapPackage = pkg.mainModule;
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('minimap-pigments').then(function(pkg) {
          return plugin = pkg.mainModule;
        });
      });
      runs(function() {
        minimap = minimapPackage.minimapForEditor(editor);
        return colorBuffer = pigmentsProject.colorBufferForEditor(editor);
      });
      waitsFor(function() {
        return binding = plugin.bindingForEditor(editor);
      });
      return runs(function() {
        return spyOn(minimap, 'decorateMarker').andCallThrough();
      });
    });
    return describe("with an open editor that have a minimap", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return colorBuffer.initialize();
        });
      });
      it("creates a binding between the two plugins", function() {
        return expect(binding).toBeDefined();
      });
      it('decorates the minimap with color markers', function() {
        return expect(minimap.decorateMarker).toHaveBeenCalled();
      });
      describe('when a color is added', function() {
        beforeEach(function() {
          editor.moveToBottom();
          editBuffer('  border-color: yellow');
          return waitsFor(function() {
            return minimap.decorateMarker.callCount > 2;
          });
        });
        return it('adds a new decoration on the minimap', function() {
          return expect(minimap.decorateMarker.callCount).toEqual(3);
        });
      });
      describe('when a color is removed', function() {
        beforeEach(function() {
          spyOn(minimap, 'removeAllDecorationsForMarker').andCallThrough();
          editBuffer('', {
            start: [2, 0],
            end: [2, 2e308]
          });
          return waitsFor(function() {
            return minimap.removeAllDecorationsForMarker.callCount > 0;
          });
        });
        return it('removes the minimap decoration', function() {
          return expect(minimap.removeAllDecorationsForMarker.callCount).toEqual(1);
        });
      });
      describe('when the editor is destroyed', function() {
        beforeEach(function() {
          spyOn(binding, 'destroy').andCallThrough();
          return editor.destroy();
        });
        return it('also destroy the binding model', function() {
          expect(binding.destroy).toHaveBeenCalled();
          return expect(plugin.bindingForEditor(editor)).toBeUndefined();
        });
      });
      return describe('when the plugin is deactivated', function() {
        beforeEach(function() {
          spyOn(binding, 'destroy').andCallThrough();
          return plugin.deactivatePlugin();
        });
        return it('removes all the decorations from the minimap', function() {
          return expect(binding.destroy).toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvbWluaW1hcC1waWdtZW50cy9zcGVjL21pbmltYXAtcGlnbWVudHMtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHlCQUFSOztFQU9sQixRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQTtBQUMxQixRQUFBO0lBQUEsTUFBcUcsRUFBckcsRUFBQyx5QkFBRCxFQUFtQixlQUFuQixFQUEyQix1QkFBM0IsRUFBMkMsZ0JBQTNDLEVBQW9ELHdCQUFwRCxFQUFxRSxvQkFBckUsRUFBa0YsZUFBbEYsRUFBMEY7SUFFMUYsVUFBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLE9BQVA7QUFDWCxVQUFBOztRQURrQixVQUFROztNQUMxQixJQUFHLHFCQUFIO1FBQ0UsSUFBRyxtQkFBSDtVQUNFLEtBQUEsR0FBUSxDQUFDLE9BQU8sQ0FBQyxLQUFULEVBQWdCLE9BQU8sQ0FBQyxHQUF4QixFQURWO1NBQUEsTUFBQTtVQUdFLEtBQUEsR0FBUSxDQUFDLE9BQU8sQ0FBQyxLQUFULEVBQWdCLE9BQU8sQ0FBQyxLQUF4QixFQUhWOztRQUtBLE1BQU0sQ0FBQyxzQkFBUCxDQUE4QixLQUE5QixFQU5GOztNQVFBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQWxCO01BQ0EsSUFBQSxDQUE0RCxPQUFPLENBQUMsT0FBcEU7ZUFBQSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBTyxDQUFDLElBQTNCLENBQWdDLG1CQUFoQyxFQUFBOztJQVZXO0lBWWIsVUFBQSxDQUFXLFNBQUE7TUFDVCxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCO01BQ25CLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQjtNQUVBLGVBQUEsQ0FBZ0Is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QXFDLFNBQUE7aUJBQ25DLE1BQUEsQ0FBTyxPQUFPLENBQUMsNkJBQTZCLENBQUMsU0FBN0MsQ0FBdUQsQ0FBQyxPQUF4RCxDQUFnRSxDQUFoRTtRQURtQyxDQUFyQztNQVJrQyxDQUFwQztNQVdBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBO1FBQ3ZDLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsS0FBQSxDQUFNLE9BQU4sRUFBZSxTQUFmLENBQXlCLENBQUMsY0FBMUIsQ0FBQTtpQkFDQSxNQUFNLENBQUMsT0FBUCxDQUFBO1FBRlMsQ0FBWDtlQUlBLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBO1VBQ25DLE1BQUEsQ0FBTyxPQUFPLENBQUMsT0FBZixDQUF1QixDQUFDLGdCQUF4QixDQUFBO2lCQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsTUFBeEIsQ0FBUCxDQUF1QyxDQUFDLGFBQXhDLENBQUE7UUFIbUMsQ0FBckM7TUFMdUMsQ0FBekM7YUFVQSxRQUFBLENBQVMsZ0NBQVQsRUFBMkMsU0FBQTtRQUN6QyxVQUFBLENBQVcsU0FBQTtVQUNULEtBQUEsQ0FBTSxPQUFOLEVBQWUsU0FBZixDQUF5QixDQUFDLGNBQTFCLENBQUE7aUJBRUEsTUFBTSxDQUFDLGdCQUFQLENBQUE7UUFIUyxDQUFYO2VBS0EsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUE7aUJBQ2pELE1BQUEsQ0FBTyxPQUFPLENBQUMsT0FBZixDQUF1QixDQUFDLGdCQUF4QixDQUFBO1FBRGlELENBQW5EO01BTnlDLENBQTNDO0lBekNrRCxDQUFwRDtFQTdDMEIsQ0FBNUI7QUFQQSIsInNvdXJjZXNDb250ZW50IjpbIk1pbmltYXBQaWdtZW50cyA9IHJlcXVpcmUgJy4uL2xpYi9taW5pbWFwLXBpZ21lbnRzJ1xuXG4jIFVzZSB0aGUgY29tbWFuZCBgd2luZG93OnJ1bi1wYWNrYWdlLXNwZWNzYCAoY21kLWFsdC1jdHJsLXApIHRvIHJ1biBzcGVjcy5cbiNcbiMgVG8gcnVuIGEgc3BlY2lmaWMgYGl0YCBvciBgZGVzY3JpYmVgIGJsb2NrIGFkZCBhbiBgZmAgdG8gdGhlIGZyb250IChlLmcuIGBmaXRgXG4jIG9yIGBmZGVzY3JpYmVgKS4gUmVtb3ZlIHRoZSBgZmAgdG8gdW5mb2N1cyB0aGUgYmxvY2suXG5cbmRlc2NyaWJlIFwiTWluaW1hcFBpZ21lbnRzXCIsIC0+XG4gIFt3b3Jrc3BhY2VFbGVtZW50LCBlZGl0b3IsIG1pbmltYXBQYWNrYWdlLCBtaW5pbWFwLCBwaWdtZW50c1Byb2plY3QsIGNvbG9yQnVmZmVyLCBwbHVnaW4sIGJpbmRpbmddID0gW11cblxuICBlZGl0QnVmZmVyID0gKHRleHQsIG9wdGlvbnM9e30pIC0+XG4gICAgaWYgb3B0aW9ucy5zdGFydD9cbiAgICAgIGlmIG9wdGlvbnMuZW5kP1xuICAgICAgICByYW5nZSA9IFtvcHRpb25zLnN0YXJ0LCBvcHRpb25zLmVuZF1cbiAgICAgIGVsc2VcbiAgICAgICAgcmFuZ2UgPSBbb3B0aW9ucy5zdGFydCwgb3B0aW9ucy5zdGFydF1cblxuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UocmFuZ2UpXG5cbiAgICBlZGl0b3IuaW5zZXJ0VGV4dCh0ZXh0KVxuICAgIGVkaXRvci5nZXRCdWZmZXIoKS5lbWl0dGVyLmVtaXQoJ2RpZC1zdG9wLWNoYW5naW5nJykgdW5sZXNzIG9wdGlvbnMubm9FdmVudFxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudClcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLnNhc3MnKS50aGVuICh0ZXh0RWRpdG9yKSAtPlxuICAgICAgICBlZGl0b3IgPSB0ZXh0RWRpdG9yXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdwaWdtZW50cycpLnRoZW4gKHBrZykgLT5cbiAgICAgICAgcGlnbWVudHNQcm9qZWN0ID0gcGtnLm1haW5Nb2R1bGUuZ2V0UHJvamVjdCgpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdtaW5pbWFwJykudGhlbiAocGtnKSAtPlxuICAgICAgICBtaW5pbWFwUGFja2FnZSA9IHBrZy5tYWluTW9kdWxlXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdtaW5pbWFwLXBpZ21lbnRzJykudGhlbiAocGtnKSAtPlxuICAgICAgICBwbHVnaW4gPSBwa2cubWFpbk1vZHVsZVxuXG4gICAgcnVucyAtPlxuICAgICAgbWluaW1hcCA9IG1pbmltYXBQYWNrYWdlLm1pbmltYXBGb3JFZGl0b3IoZWRpdG9yKVxuICAgICAgY29sb3JCdWZmZXIgPSBwaWdtZW50c1Byb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuXG4gICAgd2FpdHNGb3IgLT5cbiAgICAgIGJpbmRpbmcgPSBwbHVnaW4uYmluZGluZ0ZvckVkaXRvcihlZGl0b3IpXG5cbiAgICBydW5zIC0+XG4gICAgICBzcHlPbihtaW5pbWFwLCAnZGVjb3JhdGVNYXJrZXInKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgZGVzY3JpYmUgXCJ3aXRoIGFuIG9wZW4gZWRpdG9yIHRoYXQgaGF2ZSBhIG1pbmltYXBcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIuaW5pdGlhbGl6ZSgpXG5cbiAgICBpdCBcImNyZWF0ZXMgYSBiaW5kaW5nIGJldHdlZW4gdGhlIHR3byBwbHVnaW5zXCIsIC0+XG4gICAgICBleHBlY3QoYmluZGluZykudG9CZURlZmluZWQoKVxuXG4gICAgaXQgJ2RlY29yYXRlcyB0aGUgbWluaW1hcCB3aXRoIGNvbG9yIG1hcmtlcnMnLCAtPlxuICAgICAgZXhwZWN0KG1pbmltYXAuZGVjb3JhdGVNYXJrZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gYSBjb2xvciBpcyBhZGRlZCcsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5tb3ZlVG9Cb3R0b20oKVxuICAgICAgICBlZGl0QnVmZmVyKCcgIGJvcmRlci1jb2xvcjogeWVsbG93JylcblxuICAgICAgICB3YWl0c0ZvciAtPiBtaW5pbWFwLmRlY29yYXRlTWFya2VyLmNhbGxDb3VudCA+IDJcblxuICAgICAgaXQgJ2FkZHMgYSBuZXcgZGVjb3JhdGlvbiBvbiB0aGUgbWluaW1hcCcsIC0+XG4gICAgICAgIGV4cGVjdChtaW5pbWFwLmRlY29yYXRlTWFya2VyLmNhbGxDb3VudCkudG9FcXVhbCgzKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gYSBjb2xvciBpcyByZW1vdmVkJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc3B5T24obWluaW1hcCwgJ3JlbW92ZUFsbERlY29yYXRpb25zRm9yTWFya2VyJykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICAgIGVkaXRCdWZmZXIoJycsIHN0YXJ0OiBbMiwwXSwgZW5kOiBbMiwgSW5maW5pdHldKVxuXG4gICAgICAgIHdhaXRzRm9yIC0+IG1pbmltYXAucmVtb3ZlQWxsRGVjb3JhdGlvbnNGb3JNYXJrZXIuY2FsbENvdW50ID4gMFxuXG4gICAgICBpdCAncmVtb3ZlcyB0aGUgbWluaW1hcCBkZWNvcmF0aW9uJywgLT5cbiAgICAgICAgZXhwZWN0KG1pbmltYXAucmVtb3ZlQWxsRGVjb3JhdGlvbnNGb3JNYXJrZXIuY2FsbENvdW50KS50b0VxdWFsKDEpXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGUgZWRpdG9yIGlzIGRlc3Ryb3llZCcsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHNweU9uKGJpbmRpbmcsICdkZXN0cm95JykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICBlZGl0b3IuZGVzdHJveSgpXG5cbiAgICAgIGl0ICdhbHNvIGRlc3Ryb3kgdGhlIGJpbmRpbmcgbW9kZWwnLCAtPlxuICAgICAgICBleHBlY3QoYmluZGluZy5kZXN0cm95KS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgICBleHBlY3QocGx1Z2luLmJpbmRpbmdGb3JFZGl0b3IoZWRpdG9yKSkudG9CZVVuZGVmaW5lZCgpXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGUgcGx1Z2luIGlzIGRlYWN0aXZhdGVkJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc3B5T24oYmluZGluZywgJ2Rlc3Ryb3knKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgICAgcGx1Z2luLmRlYWN0aXZhdGVQbHVnaW4oKVxuXG4gICAgICBpdCAncmVtb3ZlcyBhbGwgdGhlIGRlY29yYXRpb25zIGZyb20gdGhlIG1pbmltYXAnLCAtPlxuICAgICAgICBleHBlY3QoYmluZGluZy5kZXN0cm95KS50b0hhdmVCZWVuQ2FsbGVkKClcbiJdfQ==
