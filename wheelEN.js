const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;
const radius = 230;
const popup = document.querySelector('.popup');

window.addEventListener('load', () => {
    const storage = window.localStorage.getItem('wheel')
    if (storage === 'spin-done') {
        popup.classList.add('active');
        document.querySelector('body').classList.add('blur');
    }

});


const sectors = [
    "1 BTC", "500% AND 777 FS", "€10.000", "TRY AGAIN",
    "PSS PRO", "500%", "TRY AGAIN", "777 FS"
];

const chances = [0, 70, 0, 30, 0, 0, 0, 0]; // сума = 100

let angle = 0;
let spinning = false;
let selectedIndex = -1;

function getWeightedIndex(weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    const rand = Math.random() * total;
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (rand < sum) return i;
    }
}

function drawOuterRing() {
    const outerRadius = radius + 30;
    const innerRadius = radius;

    const grad = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius);
    grad.addColorStop(0, "#fff4a3");
    grad.addColorStop(0.3, "#ffd700");
    grad.addColorStop(0.6, "#b8860b");
    grad.addColorStop(1, "#3e2c00");

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, true);
    ctx.fillStyle = grad;
    ctx.fill();
}

function drawHighlight() {
    let highlightGrad = ctx.createLinearGradient(centerX, centerY - radius, centerX, centerY);
    highlightGrad.addColorStop(0, "rgba(255,255,255,1)");
    highlightGrad.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 30, Math.PI * 1.1, Math.PI * 1.9);
    ctx.fillStyle = highlightGrad;
    ctx.fill();
}

function drawWheel() {

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    drawOuterRing();

    const anglePerSector = (2 * Math.PI) / sectors.length;

    for (let i = 0; i < sectors.length; i++) {
        const start = angle + i * anglePerSector;
        const end = start + anglePerSector;

        let grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        if (i % 2 === 0) {
            grad.addColorStop(0, "#A76119");
            grad.addColorStop(0.5, "#B7703E");
            grad.addColorStop(1, "#B96528");
        } else {
            grad.addColorStop(0, "#4A4A41");
            grad.addColorStop(0.5, "#676D6A");
            grad.addColorStop(1, "#202322");
        }

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, start, end);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "#000";
        // ctx.stroke();

        if (!spinning && i === selectedIndex) {
            ctx.fillStyle = "rgba(255,255,255,0.1)";
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, start, end);
            ctx.fill();
        }

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(start + anglePerSector / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 22px sans-serif";
        wrapText(ctx, sectors[i], radius - 15, 0, 150, 28);
        ctx.restore();
    }

    // drawHighlight();
    drawPointer();
    ctx.restore();
}

function drawPointer() {
    ctx.fillStyle = "#ffcc00";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 10);
    ctx.lineTo(centerX - 15, centerY - radius - 40);
    ctx.lineTo(centerX + 15, centerY - radius - 40);
    ctx.closePath();
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function spin() {
    if (spinning) return;

    const anglePerSector = (2 * Math.PI) / sectors.length;
    const targetIndex = getWeightedIndex(chances);
    selectedIndex = targetIndex;

    const extraSpins = 5 + Math.floor(Math.random() * 2);
    const targetAngle = 3 * Math.PI / 2 - (targetIndex + 0.5) * anglePerSector;
    const totalAngle = extraSpins * 2 * Math.PI + targetAngle;

    const duration = 3000;
    const start = performance.now();
    spinning = true;

    // document.getElementById("result").textContent = "";

    function animateSpin(time) {
        let progress = (time - start) / duration;
        if (progress > 1) progress = 1;

        const eased = 1 - Math.pow(1 - progress, 3);
        angle = totalAngle * eased;

        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            spinning = false;
            showResult();
        }
    }

    requestAnimationFrame(animateSpin);
}

function showResult() {
    if (sectors[selectedIndex] === '500% AND 777 FS') {
        popup.classList.add('active');
        document.body.classList.add('blur');
        window.localStorage.setItem('wheel', 'spin-done');
    }
    drawWheel();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

document.getElementById("spin-btn").addEventListener("click", spin);
drawWheel();

