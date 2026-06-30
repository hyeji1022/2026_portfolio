document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // PORTF() 슬라이드 티커 (항목 수 무관 무한 루프)
  // ===============================
  const tickerWrap = document.querySelector(".portf-ticker-wrap");
  const ticker = document.querySelector(".portf-ticker");

  if (tickerWrap && ticker) {
    document.fonts.ready.then(() => {
      const items = [...ticker.children];
      if (items.length < 2) return;

      // 첫 항목 복제 → 끝에 붙여 seamless 루프
      ticker.appendChild(items[0].cloneNode(true));

      const itemH = items[0].getBoundingClientRect().height;
      tickerWrap.style.height = itemH + "px";

      let current = 0;
      const total = items.length; // 복제 전 원본 개수

      const advance = () => {
        current++;
        ticker.style.transition = "transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)";
        ticker.style.transform = `translateY(${-current * itemH}px)`;

        // 마지막(복제) 도달 시 트랜지션 없이 첫 항목으로 점프
        if (current >= total) {
          setTimeout(() => {
            ticker.style.transition = "none";
            ticker.style.transform = "translateY(0)";
            current = 0;
          }, 680);
        }
      };

      setInterval(advance, 2800);
    });
  }

  // ===============================
  // 이미지 모달 (work-card 클릭)
  // ===============================
  const modal = document.getElementById("imageModal");

  if (modal) {
    const modalImg = modal.querySelector("img");
    const overlay = modal.querySelector(".modal-overlay");
    const loader = modal.querySelector(".loader");
    const backBtn = modal.querySelector(".modal-back");

    document.querySelectorAll("a.work-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        e.preventDefault();

        const imgSrc = card.getAttribute("href");
        if (!imgSrc) return;

        modal.classList.add("active");
        if (loader) loader.style.display = "block";
        if (modalImg) {
          modalImg.style.display = "none";
          modalImg.src = imgSrc;
        }
      });
    });

    if (modalImg) {
      modalImg.onload = () => {
        if (loader) loader.style.display = "none";
        modalImg.style.display = "block";
      };
    }

    function closeModal() {
      modal.classList.remove("active");
      setTimeout(() => {
        if (modalImg) {
          modalImg.src = "";
          modalImg.style.display = "none";
        }
      }, 300);
    }

    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    backBtn?.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // ===============================
  // 네비게이션 활성 섹션 표시
  // ===============================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".top-nav-links a[href^='#']");

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === `#${id}`
              );
            });
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // ===============================
  // 워크 카드 진입 애니메이션
  // ===============================
  const cards = document.querySelectorAll(".work-card");

  if (cards.length) {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("card-visible");
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => cardObserver.observe(card));
  }
});
