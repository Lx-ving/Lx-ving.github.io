(function () {
  var savedTheme = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  document.addEventListener('DOMContentLoaded', function () {
    // 1. 暗色模式切换
    var toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      function updateButton(theme) { toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙'; }
      updateButton(currentTheme);
      toggleBtn.addEventListener('click', function () {
        var newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateButton(newTheme);
      });
    }

    // 2. 移动端汉堡菜单
    var menuToggle = document.getElementById('mobile-menu-toggle');
    var mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', function () {
        mainNav.classList.toggle('active');
        menuToggle.textContent = mainNav.classList.contains('active') ? '✕' : '☰';
      });
    }

    // 3. 阅读进度条
    var progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    document.body.appendChild(progressBar);

    // 4. 回到顶部按钮
    var backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', '回到顶部');
    document.body.appendChild(backToTopBtn);

    // 5. 滚动监听
    window.addEventListener('scroll', function () {
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progressBar.style.width = ((winScroll / height) * 100) + '%';
      backToTopBtn.classList.toggle('visible', winScroll > 400);
    });
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 6. TOC 滚动高亮
    var tocLinks = document.querySelectorAll('.post-toc a');
    var headings = document.querySelectorAll('.post-content h2, .post-content h3');
    if (tocLinks.length > 0 && headings.length > 0 && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            tocLinks.forEach(function (link) {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + id) link.classList.add('active');
            });
          }
        });
      }, { rootMargin: '0px 0px -80% 0px' });
      headings.forEach(function (h) { observer.observe(h); });
    }

    // 7. 图片懒加载 + 骨架屏效果
    var images = document.querySelectorAll('.post-content img');
    if (images.length > 0) {
      // 灯箱
      var lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = '<span class="lightbox-close">&times;</span>< img class="lightbox-img" src="" alt="预览图">';
      document.body.appendChild(lightbox);
      var lightboxImg = lightbox.querySelector('.lightbox-img');
      var lightboxClose = lightbox.querySelector('.lightbox-close');

      images.forEach(function (img) {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
        img.style.cursor = 'zoom-in';

        // 如果图片没加载完，加上骨架屏类
        if (!img.complete) {
          img.classList.add('skeleton');
        }
        // 加载完成后移除骨架屏并淡入
        img.addEventListener('load', function () {
          img.classList.remove('skeleton');
          img.classList.add('loaded');
        });
        // 兜底：如果图片加载失败也移除
        img.addEventListener('error', function () {
          img.classList.remove('skeleton');
        });

        img.addEventListener('click', function () {
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
        });
      });

      lightbox.addEventListener('click', function (e) { if (e.target !== lightboxImg) lightbox.classList.remove('active'); });
      lightboxClose.addEventListener('click', function () { lightbox.classList.remove('active'); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lightbox.classList.remove('active'); });
    }

    // 8. 代码复制
    var preBlocks = document.querySelectorAll('.post-content pre');
    preBlocks.forEach(function (pre) {
      var wrapper = document.createElement('div');
      wrapper.className = 'code-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      var btn = document.createElement('button');
      btn.className = 'copy-code-btn';
      btn.textContent = '复制';
      wrapper.appendChild(btn);
      btn.addEventListener('click', function () {
        var codeElement = pre.querySelector('code');
        var textToCopy = codeElement ? codeElement.innerText : pre.innerText;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(textToCopy).then(function () {
            btn.textContent = '已复制!'; btn.classList.add('copied');
            setTimeout(function () { btn.textContent = '复制'; btn.classList.remove('copied'); }, 2000);
          });
        } else {
          var textArea = document.createElement('textarea');
          textArea.value = textToCopy; textArea.style.position = 'fixed'; textArea.style.top = '-9999px';
          document.body.appendChild(textArea); textArea.select();
          try { document.execCommand('copy'); btn.textContent = '已复制!'; btn.classList.add('copied'); }
          catch (e) { btn.textContent = '失败'; }
          document.body.removeChild(textArea);
          setTimeout(function () { btn.textContent = '复制'; btn.classList.remove('copied'); }, 2000);
        }
      });
    });

    // 9. 分享按钮
    var shareData = window.SHARE_DATA || {};
    var nativeBtn = document.getElementById('share-native');
    var copyBtn = document.getElementById('share-copy');
    if (nativeBtn && navigator.share) {
      nativeBtn.addEventListener('click', function () { navigator.share({ title: shareData.title, url: shareData.url }).catch(function () {}); });
    } else if (nativeBtn) { nativeBtn.style.display = 'none'; }
    document.querySelectorAll('[data-share="twitter"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareData.title) + '&url=' + encodeURIComponent(shareData.url), '_blank', 'width=600,height=500');
      });
    });
    document.querySelectorAll('[data-share="weibo"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.open('https://service.weibo.com/share/share.php?title=' + encodeURIComponent(shareData.title) + '&url=' + encodeURIComponent(shareData.url), '_blank', 'width=600,height=500');
      });
    });
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(shareData.url).then(function () { copyBtn.textContent = '✅ 已复制'; setTimeout(function () { copyBtn.innerHTML = '🔗 复制链接'; }, 2000); });
        } else {
          var ta = document.createElement('textarea'); ta.value = shareData.url; ta.style.position = 'fixed'; ta.style.top = '-9999px';
          document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); copyBtn.textContent = '✅ 已复制'; } catch (e) { copyBtn.textContent = '复制失败'; }
          document.body.removeChild(ta);
          setTimeout(function () { copyBtn.innerHTML = '🔗 复制链接'; }, 2000);
        }
      });
    }
  });
})();
