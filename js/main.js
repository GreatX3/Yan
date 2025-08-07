/* ------------------------------------------------------------
/**
 * Hover-to-show-controls for all videos
 * 鼠标悬停显示控件，移开隐藏（未播放时）
 */
document.addEventListener("DOMContentLoaded", function () {
  // 选中所有页面内 video 元素，排除首页背景视频（class="bg-video"）
  const allVideos = Array.from(document.querySelectorAll("video:not(.bg-video)"));
  allVideos.forEach(video => {
    // 初始隐藏controls
    video.controls = false;
    // 悬停显示controls
    video.addEventListener("mouseenter", () => {
      video.controls = true;
    });
    // 离开隐藏controls（如果没在播放）
    video.addEventListener("mouseleave", () => {
      if (video.paused) video.controls = false;
    });
    // 点击播放/暂停
    video.addEventListener("click", () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
    // 播放时保持controls
    video.addEventListener("play", () => {
      video.controls = true;
    });
    // 暂停时如果鼠标不在上面则隐藏controls
    video.addEventListener("pause", () => {
      if (!video.matches(":hover")) video.controls = false;
    });
  });

  // -------- Dropdown menu logic (header right) --------
  const dropdownBtn = document.getElementById("dropdownMenuBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");
  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });
    // 点击外部关闭
    document.addEventListener("click", function (e) {
      if (dropdownMenu.classList.contains("show")) {
        // 如果点击的不是按钮或菜单本身
        if (!dropdownMenu.contains(e.target) && e.target !== dropdownBtn) {
          dropdownMenu.classList.remove("show");
        }
      }
    });
    // ESC键关闭
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        dropdownMenu.classList.remove("show");
      }
    });
  }
});

/* ------------------------------------------------------------
   GameVerse – main.js
   • Fade-in animation via IntersectionObserver
   • Active-link highlighting in nav
   • Optional “Back to Top” button (auto-inject)
------------------------------------------------------------- */

(() => {
  // ---------- Fade-in section animation --------------------
  const fadeObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.15 }
  );

  document
    .querySelectorAll("[data-fade]")
    .forEach((el) => fadeObserver.observe(el));

  // ---------- Smooth scroll / nav active state -------------
  const navLinks = Array.from(document.querySelectorAll("header nav a"));
  const sections = navLinks.map((link) =>
    document.querySelector(link.getAttribute("href"))
  );

  const setActive = (idx) => {
    navLinks.forEach((lnk, i) =>
      lnk.classList.toggle("active", i === idx)
    );
  };

  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = sections.indexOf(entry.target);
          if (idx >= 0) setActive(idx);
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((sec) => scrollObserver.observe(sec));

  // ---------- Back to Top button ---------------------------
  const backBtn = document.createElement("button");
  backBtn.innerHTML = "↑";
  backBtn.setAttribute("aria-label", "Back to top");
  Object.assign(backBtn.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    padding: "10px 14px",
    fontSize: "1.1rem",
    borderRadius: "50%",
    border: "1px solid var(--clr-accent)",
    background: "var(--bg-secondary)",
    color: "var(--clr-text)",
    cursor: "pointer",
    opacity: "0",
    transform: "translateY(20px)",
    transition: "opacity 0.3s var(--easing), transform 0.3s var(--easing)",
    zIndex: "90",
  });
  document.body.appendChild(backBtn);

  const toggleBackBtn = () => {
    const show = window.scrollY > 300;
    backBtn.style.opacity = show ? "1" : "0";
    backBtn.style.transform = show ? "translateY(0)" : "translateY(20px)";
  };
  window.addEventListener("scroll", toggleBackBtn);
  backBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Initial state
  toggleBackBtn();
})();

/**
 * 视频懒加载：teaser.mp4首页视频优先加载，其他视频滚动到视口时再加载
 */
document.addEventListener("DOMContentLoaded", function() {
  const lazyVideos = document.querySelectorAll('video.lazy-video');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          if (!video.src && video.dataset.src) {
            video.src = video.dataset.src;
            video.load();
          }
          obs.unobserve(video);
        }
      });
    }, { rootMargin: "200px" });
    lazyVideos.forEach(video => observer.observe(video));
  } else {
    // Fallback: 直接加载所有
    lazyVideos.forEach(video => {
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
        video.load();
      }
    });
  }
});
