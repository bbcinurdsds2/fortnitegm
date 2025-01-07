const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player settings
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    speed: 5,
    color: "blue"
};

// Bullets array
const bullets = [];

// Weapon settings
const weapons = {
    pump: {
        damage: 50,
        fireRate: 1000, // 1 second cooldown
        lastShot: 0
    },
    scar: {
        damage: 20,
        fireRate: 200, // 0.2 seconds cooldown
        lastShot: 0
    }
};

let currentWeapon = "scar";

// Movement keys
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

// Handle keydown events
window.addEventListener("keydown", (e) => {
    if (e.key === "w") keys.w = true;
    if (e.key === "a") keys.a = true;
    if (e.key === "s") keys.s = true;
    if (e.key === "d") keys.d = true;
});

// Handle keyup events
window.addEventListener("keyup", (e) => {
    if (e.key === "w") keys.w = false;
    if (e.key === "a") keys.a = false;
    if (e.key === "s") keys.s = false;
    if (e.key === "d") keys.d = false;
});

// Handle mouse click (shooting)
window.addEventListener("mousedown", (e) => {
    const now = Date.now();
    const weapon = weapons[currentWeapon];

    if (now - weapon.lastShot >= weapon.fireRate) {
        weapon.lastShot = now;
        shootBullet(e.clientX, e.clientY);
    }
});

// Shoot a bullet
function shootBullet(mouseX, mouseY) {
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    const speed = 10;

    bullets.push({
        x: player.x,
        y: player.y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        color: currentWeapon === "pump" ? "yellow" : "red"
    });
}

// Update game state
function update() {
    // Move player
    if (keys.w) player.y -= player.speed;
    if (keys.a) player.x -= player.speed;
    if (keys.s) player.y += player.speed;
    if (keys.d) player.x += player.speed;

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].x += bullets[i].dx;
        bullets[i].y += bullets[i].dy;

        // Remove bullets that go off-screen
        if (
            bullets[i].x < 0 ||
            bullets[i].x > canvas.width ||
            bullets[i].y < 0 ||
            bullets[i].y > canvas.height
        ) {
            bullets.splice(i, 1);
        }
    }
}

// Draw everything
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);

    // Draw bullets
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();