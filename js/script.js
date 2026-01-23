document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // 게이지바 애니메이션
  // ===============================
  const gaugeContainers = document.querySelectorAll(".gauge-container");

  if (gaugeContainers.length) {
    const gaugeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const gaugeFill = entry.target.querySelector(".gauge-fill");
            if (!gaugeFill) return;

            const fillPercent =
              entry.target.getAttribute("data-percent") || "70%";

            gaugeFill.style.width = fillPercent;
          }
        });
      },
      { threshold: 0.5 }
    );

    gaugeContainers.forEach((container) => gaugeObserver.observe(container));
  }

  // ===============================
  // 타이틀 타이핑 애니메이션
  // ===============================
  const text = "2026 Portf()lio";
  const target = document.getElementById("text");
  const cursor = document.getElementById("cursor");

  if (target && cursor) {
    let index = 0;
    let blinkCount = 0;
    const maxBlink = 3;
    let blinkInterval;

    function typeEffect() {
      if (index < text.length) {
        target.textContent += text[index];
        index++;

        const speed = 60 + Math.random() * 80;
        setTimeout(typeEffect, speed);
      } else {
        startBlink();
      }
    }

    function startBlink() {
      // 깜빡임 시작 시 액센트 컬러 적용
      cursor.style.color = "#00ca62";

      blinkInterval = setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";

        blinkCount++;

        if (blinkCount >= maxBlink * 2) {
          clearInterval(blinkInterval);
          cursor.style.opacity = "1";
          // 깜빡임 종료 시에도 액센트 컬러 유지
          cursor.style.color = "#00ca62";
        }
      }, 300);
    }

    setTimeout(typeEffect, 500);
  }

  // ===============================
  // 사이드 메뉴 토글
  // ===============================
  const toggleBtn = document.getElementById("menuToggle");
  const sideNav = document.getElementById("sideNav");

  if (toggleBtn && sideNav) {
    toggleBtn.addEventListener("click", () => {
      sideNav.classList.toggle("open");
    });

    const navLinks = document.querySelectorAll(".side-nav a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        sideNav.classList.remove("open");
      });
    });
  }

  // ===============================
  // 이미지 모달
  // ===============================
  const modal = document.getElementById("imageModal");

  if (modal) {
    const modalImg = modal.querySelector("img");
    const overlay = modal.querySelector(".modal-overlay");
    const loader = modal.querySelector(".loader");
    const backBtn = modal.querySelector(".modal-back");

    document.querySelectorAll(".project-thumb").forEach((link) => {
      link.addEventListener("click", (e) => {
        // .soon 클래스가 있는 경우 클릭 비활성화
        if (link.querySelector(".soon")) {
          e.preventDefault();
          return;
        }

        e.preventDefault();

        const imgSrc = link.getAttribute("href");

        // href가 비어있거나 없는 경우도 처리
        if (!imgSrc || imgSrc === "") {
          e.preventDefault();
          return;
        }

        modal.classList.add("active");
        loader && (loader.style.display = "block");
        modalImg && (modalImg.style.display = "none");

        if (modalImg) modalImg.src = imgSrc;
        modal.scrollTop = 0;
      });
    });

    if (modalImg) {
      modalImg.onload = () => {
        const naturalWidth = modalImg.naturalWidth;
        const viewportWidth = window.innerWidth;

        // 원본 사이즈의 100%까지만 보이도록 설정 (뷰포트보다 크면 100%로 제한)
        if (naturalWidth > viewportWidth) {
          modalImg.style.maxWidth = "100%";
          modalImg.style.width = "auto";
        } else {
          modalImg.style.maxWidth = `${naturalWidth}px`;
          modalImg.style.width = "auto";
        }

        loader && (loader.style.display = "none");
        modalImg.style.display = "block";
      };
    }

    function closeModal() {
      modal.classList.remove("active");

      setTimeout(() => {
        if (modalImg) {
          modalImg.src = "";
          modalImg.style.maxWidth = "";
        }
      }, 300);
    }

    overlay && overlay.addEventListener("click", closeModal);
    backBtn && backBtn.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // ===============================
  // 스크롤 Reveal 애니메이션
  // ===============================
  const reveals = document.querySelectorAll(".reveal");

  if (reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01 }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // ===============================
  // Contact Form
  // ===============================
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const phone = formData.get("phone");
      const subject = formData.get("subject");
      const message = formData.get("message");

      // mailto 링크로 메일 보내기
      const mailtoLink = `mailto:hyejii1022@naver.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(
        `이름: ${name}\n이메일: ${email}\n전화번호: ${
          phone || "없음"
        }\n\n메시지:\n${message}`
      )}`;

      window.location.href = mailtoLink;
    });
  }

  // ===============================
  // Dark Mode Toggle
  // ===============================
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const html = document.documentElement;

  // localStorage에서 테마 설정 불러오기
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    html.setAttribute("data-theme", "dark");
  } else {
    html.setAttribute("data-theme", "light");
  }

  // 테마 토글 기능
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = html.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      html.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // ===============================
  // Navigation Active State
  // ===============================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".side-nav a[href^='#']");

  // 모든 sup 태그의 기본 색상 복원
  function resetNavSupColors() {
    navLinks.forEach((link) => {
      const sup = link.querySelector("sup");
      if (sup) {
        sup.style.color = "";
      }
    });
  }

  // 특정 섹션의 네비게이션 sup 색상 변경
  function setActiveNavSup(sectionId) {
    resetNavSupColors();
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${sectionId}`) {
        const sup = link.querySelector("sup");
        if (sup) {
          sup.style.color = "#00ca62";
        }
      }
    });
  }

  // Intersection Observer로 섹션 감지
  if (sections.length && navLinks.length) {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("id");
          setActiveNavSup(sectionId);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });

    // 페이지 로드 시 첫 번째 섹션 활성화
    if (sections.length > 0) {
      const firstSectionId = sections[0].getAttribute("id");
      setActiveNavSup(firstSectionId);
    }
  }

  // ===============================
  // 해상도 안내 모달
  // ===============================
  const resolutionModal = document.getElementById("resolutionModal");
  const resolutionModalClose = document.getElementById("resolutionModalClose");

  // 페이지 로드 시 모달 표시
  if (resolutionModal) {
    setTimeout(() => {
      resolutionModal.classList.add("active");
    }, 500);
  }

  // X 버튼 클릭 시 모달 닫기
  if (resolutionModalClose) {
    resolutionModalClose.addEventListener("click", () => {
      if (resolutionModal) {
        resolutionModal.classList.remove("active");
      }
    });
  }
});
