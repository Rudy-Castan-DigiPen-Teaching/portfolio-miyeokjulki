const navToggle = document.querySelector(".nav-toggle")
const navLinks = document.querySelectorAll(".nav__link")

navToggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
})

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        document.body.classList.remove('nav-open')
    })
})

// Help iframe of webgl demos get access to the keyboard by giving them focus when clicked
document.addEventListener("DOMContentLoaded", function () {
    const iframe = document.getElementById("demo");
    if (!iframe) {
        return;
    }
    iframe.addEventListener("load", function () {
        try {
            const iframeDoc = iframe.contentWindow.document;
            iframeDoc.addEventListener("mousedown", function () {
                iframe.contentWindow.Module.canvas.focus();
            });
        } catch (e) {
            console.error(e);
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("fireflyCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width, height;
    let mouse = { x: -9999, y: -9999 };
    const dots = [];

    const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--clr-accent')
        .trim();

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
    }

    function createDots(count = 70) {   //count
        dots.length = 0;

        for (let i = 0; i < count; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;

            dots.push({
                x,
                y,
                homeX: x,
                homeY: y,
                vx: 0,
                vy: 0,
                radius: 1 + Math.random() * 1.8, // size
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    function updateDots() {
        dots.forEach(dot => {

            const dx = dot.x - mouse.x;
            const dy = dot.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const hoverRadius = 80;

            if (dist < hoverRadius) {
                const force = (hoverRadius - dist) / hoverRadius;
                const angle = Math.atan2(dy, dx);

                dot.vx += Math.cos(angle) * force * 0.5;
                dot.vy += Math.sin(angle) * force * 0.5;
            }

            const floatX = Math.cos(Date.now() * 0.001 + dot.phase) * 8;
            const floatY = Math.sin(Date.now() * 0.001 + dot.phase) * 8;

            const targetX = dot.homeX + floatX;
            const targetY = dot.homeY + floatY;

            dot.vx += (targetX - dot.x) * 0.01;
            dot.vy += (targetY - dot.y) * 0.01;

            dot.vx *= 0.92;
            dot.vy *= 0.92;

            dot.x += dot.vx;
            dot.y += dot.vy;
        });
    }

    function drawDots() {
        ctx.clearRect(0, 0, width, height);

        dots.forEach(dot => {

            const glowSize = dot.radius * 4; // size

            const gradient = ctx.createRadialGradient(
                dot.x, dot.y, 0,
                dot.x, dot.y, glowSize
            );

            // color 
            gradient.addColorStop(0, "rgba(174, 140, 243, 0.55)");
            gradient.addColorStop(0.35, "rgba(187, 157, 248, 0.17)");
            gradient.addColorStop(1, "rgba(197, 172, 248, 0)");

            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(dot.x, dot.y, glowSize, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function animate() {
        updateDots();
        drawDots();
        requestAnimationFrame(animate);
    }

    canvas.addEventListener("mousemove", e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener("mouseleave", () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    canvas.addEventListener("click", e => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        dots.forEach(dot => {
            const dx = dot.x - clickX;
            const dy = dot.y - clickY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const clickRadius = 120;

            if (dist < clickRadius) {
                const force = (clickRadius - dist) / clickRadius;
                const angle = Math.atan2(dy, dx);

                dot.vx += Math.cos(angle) * force * 5;
                dot.vy += Math.sin(angle) * force * 5;
            }
        });
    });

    window.addEventListener("resize", () => {
        resizeCanvas();
        createDots();
    });

    resizeCanvas();
    createDots();
    animate();
});