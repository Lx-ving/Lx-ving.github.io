(function () {
  // 读取本地存储，判断用户上次选择的模式
  var savedTheme = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  document.addEventListener('DOMContentLoaded', function () {
    // 1. 暗色模式切换
    var toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      function updateButton(theme) {
        toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
      updateButton(currentTheme);
      toggleBtn.addEventListener('click', function () {
        var newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateButton(newTheme);
      });
    }

    // 2. 图片懒加载
    var images = document.querySelectorAll('.post-content img');
    images.forEach(function (img) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });
  });
})();
