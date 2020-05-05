(function() {
  window.initCards = function() {
    return $('.card .back').each(function() {
      var $card, $toggle;
      $card = $(this).parents('.card');
      $toggle = $('<i class="icon-refresh"></i>');
      $toggle.click(function() {
        return $card.toggleClass('flipped');
      });
      return $card.append($toggle);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC90ZXN0L2V4b3BsYW5ldHMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy9jYXJkcy5qcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBQSxNQUFNLENBQUMsU0FBUCxHQUFtQixTQUFBO1dBQ2pCLENBQUEsQ0FBRSxhQUFGLENBQWdCLENBQUMsSUFBakIsQ0FBc0IsU0FBQTtBQUVwQixVQUFBO01BQUEsS0FBQSxHQUFRLENBQUEsQ0FBRSxJQUFGLENBQUksQ0FBQyxPQUFMLENBQWEsT0FBYjtNQUNSLE9BQUEsR0FBVSxDQUFBLENBQUUsOEJBQUY7TUFDVixPQUFPLENBQUMsS0FBUixDQUFjLFNBQUE7ZUFBRyxLQUFLLENBQUMsV0FBTixDQUFrQixTQUFsQjtNQUFILENBQWQ7YUFDQSxLQUFLLENBQUMsTUFBTixDQUFhLE9BQWI7SUFMb0IsQ0FBdEI7RUFEaUI7QUFBbkIiLCJzb3VyY2VzQ29udGVudCI6WyJcbndpbmRvdy5pbml0Q2FyZHMgPSAtPlxuICAkKCcuY2FyZCAuYmFjaycpLmVhY2ggLT5cblxuICAgICRjYXJkID0gJChAKS5wYXJlbnRzKCcuY2FyZCcpXG4gICAgJHRvZ2dsZSA9ICQoJzxpIGNsYXNzPVwiaWNvbi1yZWZyZXNoXCI+PC9pPicpXG4gICAgJHRvZ2dsZS5jbGljayAtPiAkY2FyZC50b2dnbGVDbGFzcygnZmxpcHBlZCcpXG4gICAgJGNhcmQuYXBwZW5kICR0b2dnbGVcbiJdfQ==
