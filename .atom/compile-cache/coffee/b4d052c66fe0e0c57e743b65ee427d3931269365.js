(function() {
  var CompositeDisposable, MinimapPigmentsBinding,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = MinimapPigmentsBinding = (function() {
    function MinimapPigmentsBinding(arg) {
      this.editor = arg.editor, this.minimap = arg.minimap, this.colorBuffer = arg.colorBuffer;
      this.displayedMarkers = [];
      this.decorationsByMarkerId = {};
      this.subscriptionsByMarkerId = {};
      this.subscriptions = new CompositeDisposable;
      this.colorBuffer.initialize().then((function(_this) {
        return function() {
          return _this.updateMarkers();
        };
      })(this));
      if (this.colorBuffer.editor.onDidTokenize != null) {
        this.subscriptions.add(this.colorBuffer.editor.onDidTokenize((function(_this) {
          return function() {
            return _this.updateMarkers();
          };
        })(this)));
      } else {
        this.subscriptions.add(this.colorBuffer.editor.displayBuffer.onDidTokenize((function(_this) {
          return function() {
            return _this.updateMarkers();
          };
        })(this)));
      }
      this.subscriptions.add(this.colorBuffer.onDidUpdateColorMarkers((function(_this) {
        return function() {
          return _this.updateMarkers();
        };
      })(this)));
      this.decorations = [];
    }

    MinimapPigmentsBinding.prototype.updateMarkers = function() {
      var decoration, i, j, len, len1, m, markers, ref, ref1, ref2;
      markers = this.colorBuffer.findValidColorMarkers();
      ref = this.displayedMarkers;
      for (i = 0, len = ref.length; i < len; i++) {
        m = ref[i];
        if (indexOf.call(markers, m) < 0) {
          if ((ref1 = this.decorationsByMarkerId[m.id]) != null) {
            ref1.destroy();
          }
        }
      }
      for (j = 0, len1 = markers.length; j < len1; j++) {
        m = markers[j];
        if (!(((ref2 = m.color) != null ? ref2.isValid() : void 0) && indexOf.call(this.displayedMarkers, m) < 0)) {
          continue;
        }
        decoration = this.minimap.decorateMarker(m.marker, {
          type: 'highlight',
          color: m.color.toCSS(),
          plugin: 'pigments'
        });
        this.decorationsByMarkerId[m.id] = decoration;
        this.subscriptionsByMarkerId[m.id] = decoration.onDidDestroy((function(_this) {
          return function() {
            var ref3;
            if ((ref3 = _this.subscriptionsByMarkerId[m.id]) != null) {
              ref3.dispose();
            }
            delete _this.subscriptionsByMarkerId[m.id];
            return delete _this.decorationsByMarkerId[m.id];
          };
        })(this));
      }
      return this.displayedMarkers = markers;
    };

    MinimapPigmentsBinding.prototype.destroy = function() {
      this.destroyDecorations();
      return this.subscriptions.dispose();
    };

    MinimapPigmentsBinding.prototype.destroyDecorations = function() {
      var decoration, id, ref, ref1, sub;
      ref = this.subscriptionsByMarkerId;
      for (id in ref) {
        sub = ref[id];
        if (sub != null) {
          sub.dispose();
        }
      }
      ref1 = this.decorationsByMarkerId;
      for (id in ref1) {
        decoration = ref1[id];
        if (decoration != null) {
          decoration.destroy();
        }
      }
      this.decorationsByMarkerId = {};
      return this.subscriptionsByMarkerId = {};
    };

    return MinimapPigmentsBinding;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvbWluaW1hcC1waWdtZW50cy9saWIvbWluaW1hcC1waWdtZW50cy1iaW5kaW5nLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMkNBQUE7SUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxnQ0FBQyxHQUFEO01BQUUsSUFBQyxDQUFBLGFBQUEsUUFBUSxJQUFDLENBQUEsY0FBQSxTQUFTLElBQUMsQ0FBQSxrQkFBQTtNQUNqQyxJQUFDLENBQUEsZ0JBQUQsR0FBb0I7TUFDcEIsSUFBQyxDQUFBLHFCQUFELEdBQXlCO01BQ3pCLElBQUMsQ0FBQSx1QkFBRCxHQUEyQjtNQUUzQixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BRXJCLElBQUMsQ0FBQSxXQUFXLENBQUMsVUFBYixDQUFBLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxhQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0I7TUFFQSxJQUFHLDZDQUFIO1FBQ0UsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBTSxDQUFDLGFBQXBCLENBQWtDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ25ELEtBQUMsQ0FBQSxhQUFELENBQUE7VUFEbUQ7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQW5CLEVBREY7T0FBQSxNQUFBO1FBSUUsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFsQyxDQUFnRCxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNqRSxLQUFDLENBQUEsYUFBRCxDQUFBO1VBRGlFO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxDQUFuQixFQUpGOztNQU9BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsV0FBVyxDQUFDLHVCQUFiLENBQXFDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDdEQsS0FBQyxDQUFBLGFBQUQsQ0FBQTtRQURzRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckMsQ0FBbkI7TUFHQSxJQUFDLENBQUEsV0FBRCxHQUFlO0lBbkJKOztxQ0FxQmIsYUFBQSxHQUFlLFNBQUE7QUFDYixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxXQUFXLENBQUMscUJBQWIsQ0FBQTtBQUVWO0FBQUEsV0FBQSxxQ0FBQTs7WUFBZ0MsYUFBUyxPQUFULEVBQUEsQ0FBQTs7Z0JBQ0YsQ0FBRSxPQUE5QixDQUFBOzs7QUFERjtBQUdBLFdBQUEsMkNBQUE7OzhDQUE2QixDQUFFLE9BQVQsQ0FBQSxXQUFBLElBQXVCLGFBQVMsSUFBQyxDQUFBLGdCQUFWLEVBQUEsQ0FBQTs7O1FBQzNDLFVBQUEsR0FBYSxJQUFDLENBQUEsT0FBTyxDQUFDLGNBQVQsQ0FBd0IsQ0FBQyxDQUFDLE1BQTFCLEVBQWtDO1VBQUEsSUFBQSxFQUFNLFdBQU47VUFBbUIsS0FBQSxFQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBUixDQUFBLENBQTFCO1VBQTJDLE1BQUEsRUFBUSxVQUFuRDtTQUFsQztRQUViLElBQUMsQ0FBQSxxQkFBc0IsQ0FBQSxDQUFDLENBQUMsRUFBRixDQUF2QixHQUErQjtRQUMvQixJQUFDLENBQUEsdUJBQXdCLENBQUEsQ0FBQyxDQUFDLEVBQUYsQ0FBekIsR0FBaUMsVUFBVSxDQUFDLFlBQVgsQ0FBd0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtBQUN2RCxnQkFBQTs7a0JBQThCLENBQUUsT0FBaEMsQ0FBQTs7WUFDQSxPQUFPLEtBQUMsQ0FBQSx1QkFBd0IsQ0FBQSxDQUFDLENBQUMsRUFBRjttQkFDaEMsT0FBTyxLQUFDLENBQUEscUJBQXNCLENBQUEsQ0FBQyxDQUFDLEVBQUY7VUFIeUI7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCO0FBSm5DO2FBU0EsSUFBQyxDQUFBLGdCQUFELEdBQW9CO0lBZlA7O3FDQWlCZixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxrQkFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7SUFGTzs7cUNBSVQsa0JBQUEsR0FBb0IsU0FBQTtBQUNsQixVQUFBO0FBQUE7QUFBQSxXQUFBLFNBQUE7OztVQUFBLEdBQUcsQ0FBRSxPQUFMLENBQUE7O0FBQUE7QUFDQTtBQUFBLFdBQUEsVUFBQTs7O1VBQUEsVUFBVSxDQUFFLE9BQVosQ0FBQTs7QUFBQTtNQUVBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QjthQUN6QixJQUFDLENBQUEsdUJBQUQsR0FBMkI7SUFMVDs7Ozs7QUE5Q3RCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTWluaW1hcFBpZ21lbnRzQmluZGluZ1xuICBjb25zdHJ1Y3RvcjogKHtAZWRpdG9yLCBAbWluaW1hcCwgQGNvbG9yQnVmZmVyfSkgLT5cbiAgICBAZGlzcGxheWVkTWFya2VycyA9IFtdXG4gICAgQGRlY29yYXRpb25zQnlNYXJrZXJJZCA9IHt9XG4gICAgQHN1YnNjcmlwdGlvbnNCeU1hcmtlcklkID0ge31cblxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBjb2xvckJ1ZmZlci5pbml0aWFsaXplKCkudGhlbiA9PiBAdXBkYXRlTWFya2VycygpXG5cbiAgICBpZiBAY29sb3JCdWZmZXIuZWRpdG9yLm9uRGlkVG9rZW5pemU/XG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGNvbG9yQnVmZmVyLmVkaXRvci5vbkRpZFRva2VuaXplID0+XG4gICAgICAgIEB1cGRhdGVNYXJrZXJzKClcbiAgICBlbHNlXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGNvbG9yQnVmZmVyLmVkaXRvci5kaXNwbGF5QnVmZmVyLm9uRGlkVG9rZW5pemUgPT5cbiAgICAgICAgQHVwZGF0ZU1hcmtlcnMoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBjb2xvckJ1ZmZlci5vbkRpZFVwZGF0ZUNvbG9yTWFya2VycyA9PlxuICAgICAgQHVwZGF0ZU1hcmtlcnMoKVxuXG4gICAgQGRlY29yYXRpb25zID0gW11cblxuICB1cGRhdGVNYXJrZXJzOiAtPlxuICAgIG1hcmtlcnMgPSBAY29sb3JCdWZmZXIuZmluZFZhbGlkQ29sb3JNYXJrZXJzKClcblxuICAgIGZvciBtIGluIEBkaXNwbGF5ZWRNYXJrZXJzIHdoZW4gbSBub3QgaW4gbWFya2Vyc1xuICAgICAgQGRlY29yYXRpb25zQnlNYXJrZXJJZFttLmlkXT8uZGVzdHJveSgpXG5cbiAgICBmb3IgbSBpbiBtYXJrZXJzIHdoZW4gbS5jb2xvcj8uaXNWYWxpZCgpIGFuZCBtIG5vdCBpbiBAZGlzcGxheWVkTWFya2Vyc1xuICAgICAgZGVjb3JhdGlvbiA9IEBtaW5pbWFwLmRlY29yYXRlTWFya2VyKG0ubWFya2VyLCB0eXBlOiAnaGlnaGxpZ2h0JywgY29sb3I6IG0uY29sb3IudG9DU1MoKSwgcGx1Z2luOiAncGlnbWVudHMnKVxuXG4gICAgICBAZGVjb3JhdGlvbnNCeU1hcmtlcklkW20uaWRdID0gZGVjb3JhdGlvblxuICAgICAgQHN1YnNjcmlwdGlvbnNCeU1hcmtlcklkW20uaWRdID0gZGVjb3JhdGlvbi5vbkRpZERlc3Ryb3kgPT5cbiAgICAgICAgQHN1YnNjcmlwdGlvbnNCeU1hcmtlcklkW20uaWRdPy5kaXNwb3NlKClcbiAgICAgICAgZGVsZXRlIEBzdWJzY3JpcHRpb25zQnlNYXJrZXJJZFttLmlkXVxuICAgICAgICBkZWxldGUgQGRlY29yYXRpb25zQnlNYXJrZXJJZFttLmlkXVxuXG4gICAgQGRpc3BsYXllZE1hcmtlcnMgPSBtYXJrZXJzXG5cbiAgZGVzdHJveTogLT5cbiAgICBAZGVzdHJveURlY29yYXRpb25zKClcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICBkZXN0cm95RGVjb3JhdGlvbnM6IC0+XG4gICAgc3ViPy5kaXNwb3NlKCkgZm9yIGlkLHN1YiBvZiBAc3Vic2NyaXB0aW9uc0J5TWFya2VySWRcbiAgICBkZWNvcmF0aW9uPy5kZXN0cm95KCkgZm9yIGlkLGRlY29yYXRpb24gb2YgQGRlY29yYXRpb25zQnlNYXJrZXJJZFxuXG4gICAgQGRlY29yYXRpb25zQnlNYXJrZXJJZCA9IHt9XG4gICAgQHN1YnNjcmlwdGlvbnNCeU1hcmtlcklkID0ge31cbiJdfQ==
