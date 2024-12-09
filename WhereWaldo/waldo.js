const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");

// Buttons
const playBtn = document.getElementById("start-btn");
const howToBtn = document.getElementById("howTo-btn");
const backBtn = document.getElementById("backbtn");
const lvl1Btn = document.getElementById("lvl1");
const lvl2Btn = document.getElementById("lvl2");
const lvl3Btn = document.getElementById("lvl3");

let isFound = false;

const images = {};
let imagesLoaded = 0;
const imagePaths = {
    title: "Images/title.png",
    level1: "Images/level1.png",
    level2: "Images/level2.jpg",
    level3: "Images/level3.jpg",
    bubble: "Images/bubble.png",
    waldo: "Images/waldo.png",
};

// Preload images
function preloadImages(callback) {
    const totalImages = Object.keys(imagePaths).length;

    for (const [key, src] of Object.entries(imagePaths)) {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            images[key] = img;
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                callback();
            }
        };

        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
        };
    }
}

// Initialize game
function init() {
    preloadImages(() => {
        console.log("All images loaded successfully!");
        showTitle();
    });
}

// Show title screen
function showTitle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images.title, 10, 10);
    ctx.font = "20px Arial";
    ctx.fillText("By: Nao Kawano", 10, 380);
}

// Start game
function startGame() {
    howToBtn.style.display = "none";
    playBtn.style.display = "none";
    backBtn.style.display = "block";
    showLevelMenu();
}

// Show level menu
function showLevelMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backBtn.hidden = false;

    ctx.drawImage(images.bubble, 90, 30);
    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillText("Select a level below!", 210, 180);

    lvl1Btn.hidden = false;
    lvl2Btn.hidden = false;
    lvl3Btn.hidden = false;
}

// Handle level start
function startLevel(level) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const levelImage = images[`level${level}`];
    ctx.drawImage(levelImage, 0, 0);

    detectClick(level);
}

// Detect click for Waldo
function detectClick(level) {
    const positions = {
        1: { x: [430, 480], y: [250, 310] },
        2: { x: [610, 630], y: [53, 80] },
        3: { x: [603, 616], y: [235, 254] },
    };

    document.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const posX = e.clientX - rect.left; // Adjusted for canvas position
        const posY = e.clientY - rect.top;

        // Log the x and y coordinates
        console.log(`Mouse clicked at: X=${posX}, Y=${posY}`);

        const { x, y } = positions[level];
        ctx.clearRect(0, canvas.height - 30, canvas.width, 30); // Clear the message area at the bottom
        if (posX > x[0] && posX < x[1] && posY > y[0] && posY < y[1]) {
            isFound = true;
            showPassScreen();
        } else {
            showTryAgainMessage();
        }
    });
}

// Show "Try Again" message
function showTryAgainMessage() {
    ctx.clearRect(0, canvas.height - 30, canvas.width, 30); // Clear previous message
    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Try again!", canvas.width / 2, canvas.height - 10);

    // Clear the message after 1 second
    setTimeout(() => {
        ctx.clearRect(0, canvas.height - 30, canvas.width, 30);
    }, 1000);
}

// Show pass screen
function showPassScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(images.bubble, 90, 30);
    ctx.fillStyle = "black";
    ctx.font = "22px Arial";
    ctx.fillText("Well done! You found Waldo!", 330, 180);

    backBtn.hidden = false;
}

// Add event listeners
playBtn.addEventListener("click", startGame);
lvl1Btn.addEventListener("click", () => startLevel(1));
lvl2Btn.addEventListener("click", () => startLevel(2));
lvl3Btn.addEventListener("click", () => startLevel(3));
backBtn.addEventListener("click", () => {
    location.reload(); // Reload the page to reset the game
});

// Initialize
init();
