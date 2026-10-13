(function () {
  // 读取本地存储，判断用户上次选择的模式
  var savedTheme = localStorage.getItem('theme');
  // 判断系统是否偏好暗色
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 初始主题：优先本地存储，否则跟随系统
  var currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  // 设置根元素的 data-theme 属性
  document.documentElement.setAttribute('data-theme', currentTheme);

  // 页面加载完成后，绑定切换按钮
  document.addEventListener('DOMContentLoaded', function () {
    var toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // 更新按钮图标
    function updateButton(theme) {
      toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    updateButton(currentTheme);

    // 点击切换
    toggleBtn.addEventListener('click', function () {
      var newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateButton(newTheme);
    });
  });
})();
