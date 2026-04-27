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
      { threshold: 0.5 },
    );

    gaugeContainers.forEach((container) => gaugeObserver.observe(container));
  }

  // ===============================
  // 타이틀 타이핑 애니메이션
  // ===============================
  const text = "2026\nPortf()lio";
  const target = document.getElementById("text");
  const cursor = document.getElementById("cursor");

  if (target && cursor) {
    let index = 0;
    let blinkCount = 0;
    const maxBlink = 3;
    let blinkInterval;
    // h1에 min-height: 2lh로 두 줄 공간 예약 → 커서는 첫 줄에서 시작
    let tightKernSpan = null;

    function typeEffect() {
      if (index < text.length) {
        const ch = text[index];

        if (ch === "\n") {
          // 줄바꿈: br 삽입
          target.appendChild(document.createElement("br"));
          index++;
          const speed = 60 + Math.random() * 80;
          setTimeout(typeEffect, speed);
          return;
        }

        // 'f'(index 9)부터 tight-kern 스팬 생성해서 f()l 묶음
        if (index === 9) {
          tightKernSpan = document.createElement("span");
          tightKernSpan.className = "tight-kern";
          target.appendChild(tightKernSpan);
        }

        let node;
        if (ch === "(" || ch === ")") {
          node = document.createElement("span");
          node.className = "paren-squeeze";
          node.textContent = ch;
        } else {
          node = document.createTextNode(ch);
        }

        if (tightKernSpan) {
          tightKernSpan.appendChild(node);
        } else {
          target.appendChild(node);
        }

        // 'l'(index 12) 이후로 tight-kern 종료
        if (index === 12) {
          tightKernSpan = null;
        }

        index++;
        const speed = 60 + Math.random() * 80;
        setTimeout(typeEffect, speed);
      } else {
        startBlink();
      }
    }

    function startBlink() {
      cursor.style.color = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-color")
        .trim();

      blinkInterval = setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";

        blinkCount++;

        if (blinkCount >= maxBlink * 2) {
          clearInterval(blinkInterval);
          cursor.style.opacity = "1";
          cursor.style.color = getComputedStyle(document.documentElement)
            .getPropertyValue("--accent-color")
            .trim();
        }
      }, 300);
    }

    setTimeout(typeEffect, 500);
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

    document.querySelectorAll(".work-thumb").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (link.querySelector(".soon")) {
          e.preventDefault();
          return;
        }

        e.preventDefault();

        const imgSrc = link.getAttribute("href");

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

    overlay &&
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          closeModal();
        }
      });

    backBtn && backBtn.addEventListener("click", closeModal);

    const modalContent = modal.querySelector(".modal-content");
    if (modalContent) {
      modalContent.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // ===============================
  // 스크롤 Reveal 애니메이션 (about, contact)
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
      { threshold: 0.01 },
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // ===============================
  // Works 컬럼 스크롤 애니메이션 (lerp smooth)
  // ===============================
  const worksSection = document.getElementById("works");
  const worksCardsInner = document.querySelector(".works-cards-inner");
  const worksCardsContainer = document.querySelector(".works-cards"); // 마스크 역할의 부모 요소 추가

  let SCROLL_MAX = 0;
  const PAD_BOTTOM = 200; // 마지막 카드 이후 남길 여백 (px 단위, 원하는 만큼 수정 가능)

  // 동적으로 스크롤 거리를 계산하는 함수
  function updateScrollMax() {
    if (
      !worksSection ||
      !worksCardsInner ||
      !worksCardsContainer ||
      window.innerWidth <= 768
    ) {
      if (worksSection) worksSection.style.height = "auto";
      return;
    }

    const innerHeight = worksCardsInner.scrollHeight;
    const containerHeight = worksCardsContainer.clientHeight;

    // 마지막 카드 이후 남길 여백
    const PAD_BOTTOM = 80;

    // 💡 마지막 카드가 올라온 후 머무는(걸리는) 스크롤 구간 (픽셀)
    const PAUSE_HEIGHT = 500;

    // 카드가 움직일 최대 거리 계산 (이 값은 그대로 둡니다)
    SCROLL_MAX = Math.max(0, innerHeight - containerHeight + PAD_BOTTOM);

    // 섹션 스크롤 높이 설정: 카드가 움직일 거리 + 화면 높이 + 💡머무는 구간 추가
    worksSection.style.height =
      SCROLL_MAX + window.innerHeight + PAUSE_HEIGHT + "px";
  }

  // 화면 크기가 변하거나 렌더링이 완료될 때마다 높이 재계산
  window.addEventListener("resize", updateScrollMax);
  window.addEventListener("load", updateScrollMax);
  updateScrollMax(); // 초기 실행

  // lerp 상태
  let targetY = 0;
  let currentY = 300;
  let rafActive = false;

  function lerpStep() {
    const diff = targetY - currentY;
    if (Math.abs(diff) < 0.5) {
      worksCardsInner.style.transform = `translateY(${currentY}px)`;
      rafActive = false;
      return;
    }
    currentY += diff * 0.1; // 10% lerp — 부드러운 관성
    worksCardsInner.style.transform = `translateY(${currentY}px)`;
    requestAnimationFrame(lerpStep);
  }

  function onScroll() {
    if (!worksSection || !worksCardsInner || window.innerWidth <= 768) return;
    const scrolledPastTop = -worksSection.getBoundingClientRect().top;

    // 스크롤 상한선을 동적으로 계산된 SCROLL_MAX로 제한
    targetY = Math.max(-SCROLL_MAX, Math.min(0, -scrolledPastTop));

    if (!rafActive) {
      rafActive = true;
      requestAnimationFrame(lerpStep);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // 초기 위치 설정
  onScroll();

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

      const mailtoLink = `mailto:hyejii1022@naver.com?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(
        `이름: ${name}\n이메일: ${email}\n전화번호: ${
          phone || "없음"
        }\n\n메시지:\n${message}`,
      )}`;

      window.location.href = mailtoLink;
    });
  }

  // ===============================
  // Dark Mode Toggle
  // ===============================
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;

  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    html.setAttribute("data-theme", "dark");
  } else {
    html.setAttribute("data-theme", "light");
  }

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
  const navLinks = document.querySelectorAll(".top-nav-links a[href^='#']");

  function resetNavSupColors() {
    navLinks.forEach((link) => {
      const sup = link.querySelector("sup");
      if (sup) {
        sup.style.color = "";
      }
      link.classList.remove("is-active");
    });
  }

  function setActiveNavSup(sectionId) {
    resetNavSupColors();
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${sectionId}`) {
        link.classList.add("is-active");
        const sup = link.querySelector("sup");
        if (sup) {
          sup.style.color = "";
        }
      }
    });
  }

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

    if (sections.length > 0) {
      const firstSectionId = sections[0].getAttribute("id");
      setActiveNavSup(firstSectionId);
    }
  }
});
