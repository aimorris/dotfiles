(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ex.Planet = (function() {
    function Planet(id, rotation, rotationSpeed) {
      this.id = id != null ? id : 0;
      this.rotation = rotation != null ? rotation : 0;
      this.rotationSpeed = rotationSpeed != null ? rotationSpeed : 20;
      this.orbitables = [];
    }

    Planet.prototype.build = function() {
      this.node = document.createElement('div');
      this.body = document.createElement('div');
      this.node.appendChild(this.body);
      this.node.className = 'planet';
      this.body.className = 'body';
      this.body.setAttribute('style', "background: url(images/" + this.id + ".png);");
      return this.node;
    };

    Planet.prototype.animate = function(t) {
      var dif;
      if ((this.lastTime == null) || t - this.lastTime > 1000) {
        this.lastTime = t;
      }
      this.body.style.backgroundPosition = this.rotation + "px 0";
      dif = (t - this.lastTime) / 1000;
      this.rotation += this.rotationSpeed * dif;
      this.orbitables.forEach(function(orbitable) {
        return orbitable.animate(dif);
      });
      return this.lastTime = t;
    };

    Planet.prototype.addOrbitable = function(orbitable) {
      if (indexOf.call(this.orbitables, orbitable) < 0) {
        this.orbitables.push(orbitable);
      }
      this.node.appendChild(orbitable.node);
      return this.node.appendChild(orbitable.shadowNode);
    };

    return Planet;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC90ZXN0L2V4b3BsYW5ldHMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy9wbGFuZXRzL3BsYW5ldC5qcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFNLEVBQUUsQ0FBQztJQUNNLGdCQUFDLEVBQUQsRUFBUSxRQUFSLEVBQXVCLGFBQXZCO01BQUMsSUFBQyxDQUFBLGtCQUFELEtBQUk7TUFBRyxJQUFDLENBQUEsOEJBQUQsV0FBWTtNQUFHLElBQUMsQ0FBQSx3Q0FBRCxnQkFBZTtNQUNqRCxJQUFDLENBQUEsVUFBRCxHQUFjO0lBREg7O3FCQUdiLEtBQUEsR0FBTyxTQUFBO01BQ0wsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNSLElBQUMsQ0FBQSxJQUFELEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDUixJQUFDLENBQUEsSUFBSSxDQUFDLFdBQU4sQ0FBa0IsSUFBQyxDQUFBLElBQW5CO01BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCO01BQ2xCLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQjtNQUVsQixJQUFDLENBQUEsSUFBSSxDQUFDLFlBQU4sQ0FBbUIsT0FBbkIsRUFBNEIseUJBQUEsR0FBMEIsSUFBQyxDQUFBLEVBQTNCLEdBQThCLFFBQTFEO2FBQ0EsSUFBQyxDQUFBO0lBUkk7O3FCQVVQLE9BQUEsR0FBUyxTQUFDLENBQUQ7QUFFUCxVQUFBO01BQUEsSUFBcUIsdUJBQUosSUFBa0IsQ0FBQSxHQUFJLElBQUMsQ0FBQSxRQUFMLEdBQWdCLElBQW5EO1FBQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxFQUFaOztNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFaLEdBQW9DLElBQUMsQ0FBQSxRQUFGLEdBQVc7TUFFOUMsR0FBQSxHQUFNLENBQUMsQ0FBQSxHQUFJLElBQUMsQ0FBQSxRQUFOLENBQUEsR0FBa0I7TUFFeEIsSUFBQyxDQUFBLFFBQUQsSUFBYSxJQUFDLENBQUEsYUFBRCxHQUFpQjtNQUU5QixJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBb0IsU0FBQyxTQUFEO2VBQWUsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsR0FBbEI7TUFBZixDQUFwQjthQUNBLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFWTDs7cUJBWVQsWUFBQSxHQUFjLFNBQUMsU0FBRDtNQUNaLElBQWtDLGFBQWEsSUFBQyxDQUFBLFVBQWQsRUFBQSxTQUFBLEtBQWxDO1FBQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxJQUFaLENBQWlCLFNBQWpCLEVBQUE7O01BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxXQUFOLENBQWtCLFNBQVMsQ0FBQyxJQUE1QjthQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFrQixTQUFTLENBQUMsVUFBNUI7SUFIWTs7Ozs7QUExQmhCIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyBleC5QbGFuZXRcbiAgY29uc3RydWN0b3I6IChAaWQ9MCwgQHJvdGF0aW9uID0gMCwgQHJvdGF0aW9uU3BlZWQ9MjApIC0+XG4gICAgQG9yYml0YWJsZXMgPSBbXVxuXG4gIGJ1aWxkOiAtPlxuICAgIEBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgIEBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgIEBub2RlLmFwcGVuZENoaWxkIEBib2R5XG4gICAgQG5vZGUuY2xhc3NOYW1lID0gJ3BsYW5ldCdcbiAgICBAYm9keS5jbGFzc05hbWUgPSAnYm9keSdcblxuICAgIEBib2R5LnNldEF0dHJpYnV0ZSAnc3R5bGUnLCBcImJhY2tncm91bmQ6IHVybChpbWFnZXMvI3tAaWR9LnBuZyk7XCJcbiAgICBAbm9kZVxuXG4gIGFuaW1hdGU6ICh0KSAtPlxuXG4gICAgQGxhc3RUaW1lID0gdCBpZiBub3QgQGxhc3RUaW1lPyBvciB0IC0gQGxhc3RUaW1lID4gMTAwMFxuICAgIEBib2R5LnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IFwiI3tAcm90YXRpb259cHggMFwiXG5cbiAgICBkaWYgPSAodCAtIEBsYXN0VGltZSkgLyAxMDAwXG5cbiAgICBAcm90YXRpb24gKz0gQHJvdGF0aW9uU3BlZWQgKiBkaWZcblxuICAgIEBvcmJpdGFibGVzLmZvckVhY2ggKG9yYml0YWJsZSkgLT4gb3JiaXRhYmxlLmFuaW1hdGUoZGlmKVxuICAgIEBsYXN0VGltZSA9IHRcblxuICBhZGRPcmJpdGFibGU6IChvcmJpdGFibGUpIC0+XG4gICAgQG9yYml0YWJsZXMucHVzaCBvcmJpdGFibGUgdW5sZXNzIG9yYml0YWJsZSBpbiBAb3JiaXRhYmxlc1xuICAgIEBub2RlLmFwcGVuZENoaWxkIG9yYml0YWJsZS5ub2RlXG4gICAgQG5vZGUuYXBwZW5kQ2hpbGQgb3JiaXRhYmxlLnNoYWRvd05vZGVcblxuIl19
