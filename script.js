// ===== NEXORA MENU =====

const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
}

// ===== REVEAL ANIMATION =====

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(element => {
  observer.observe(element);
});

// ===== CURSOR GLOW =====

const glow = document.createElement("div");
glow.className = "cursor-glow";
document.body.appendChild(glow);

document.addEventListener("mousemove", event => {
  glow.style.left = event.clientX + "px";
  glow.style.top = event.clientY + "px";
});

// ===== 3D SERVICE CARDS =====

document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("mousemove", event => {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = (rect.height / 2 - y) / 12;
    const rotateY = (x - rect.width / 2) / 12;

    card.style.transform =
      `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ===== ORB INTERACTION =====

const orbScene = document.querySelector(".orb-scene");

if (orbScene) {
  orbScene.addEventListener("mousemove", event => {
    const rect = orbScene.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const isMobile = window.innerWidth <= 650;

    const basePosition = isMobile
      ? "translateX(50%)"
      : "translateY(-50%)";

    orbScene.style.transform =
      `${basePosition} rotateX(${-y * 25}deg) rotateY(${x * 25}deg)`;
  });

  orbScene.addEventListener("mouseleave", () => {
    orbScene.style.transform = "";
  });
}
// ===== MAGNETIC BUTTONS =====

document.querySelectorAll(".button-primary").forEach(button => {
  button.addEventListener("mousemove", event => {
    const rect = button.getBoundingClientRect();

    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    button.style.transform =
      `translate(${x * 0.08}px, ${y * 0.08}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

// ===== DIGITAL NETWORK =====

(() => {
  const canvas = document.getElementById("network-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const section = canvas.parentElement;

  let width, height;
  let particles = [];
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    width = section.clientWidth;
    height = section.clientHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(Math.floor(width / 9), 140);

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distanceMouse = Math.sqrt(dx * dx + dy * dy);

      if (distanceMouse < 130 && distanceMouse > 0) {
        p.x -= dx * 0.003;
        p.y -= dy * 0.003;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "#b9a0ff";
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#8b5cf6";
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);

          ctx.strokeStyle =
            `rgba(139,92,246,${1 - distance / 120})`;

          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  canvas.addEventListener("mousemove", event => {
    const rect = canvas.getBoundingClientRect();

    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });

  canvas.addEventListener("mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener("resize", resize);

  resize();
  draw();
})();