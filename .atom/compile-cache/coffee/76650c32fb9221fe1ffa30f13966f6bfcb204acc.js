(function() {
  (function(module) {
    return module.Random = (function() {
      function Random(seed) {
        this.seed = seed;
      }

      Random.prototype.get = function() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280.0;
      };

      return Random;

    })();
  })(typeof window !== "undefined" && window !== null ? window : module.exports);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC90ZXN0L2V4b3BsYW5ldHMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy9wbGFuZXRzL3JhbmRvbS5qcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBQSxDQUFDLFNBQUMsTUFBRDtXQUNPLE1BQU0sQ0FBQztNQUNFLGdCQUFDLElBQUQ7UUFBQyxJQUFDLENBQUEsT0FBRDtNQUFEOzt1QkFDYixHQUFBLEdBQUssU0FBQTtRQUNILElBQUMsQ0FBQSxJQUFELEdBQVEsQ0FBQyxJQUFDLENBQUEsSUFBRCxHQUFRLElBQVIsR0FBZSxLQUFoQixDQUFBLEdBQXlCO2VBQ2pDLElBQUMsQ0FBQSxJQUFELEdBQVE7TUFGTDs7Ozs7RUFIUixDQUFELENBQUEsQ0FPSyxnREFBSCxHQUFnQixNQUFoQixHQUE0QixNQUFNLENBQUMsT0FQckM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuKChtb2R1bGUpIC0+XG4gIGNsYXNzIG1vZHVsZS5SYW5kb21cbiAgICBjb25zdHJ1Y3RvcjogKEBzZWVkKSAtPlxuICAgIGdldDogLT5cbiAgICAgIEBzZWVkID0gKEBzZWVkICogOTMwMSArIDQ5Mjk3KSAlIDIzMzI4MFxuICAgICAgQHNlZWQgLyAyMzMyODAuMFxuXG4pKGlmIHdpbmRvdz8gdGhlbiB3aW5kb3cgZWxzZSBtb2R1bGUuZXhwb3J0cylcbiJdfQ==
