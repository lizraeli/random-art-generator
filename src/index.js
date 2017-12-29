const canvas = document.querySelector("canvas");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const crumbCount = 10;
const pathCount = 30;
const startX = 40;
const startY = 40;
const rectSide = 10;
const radius = 6;
const colors = [
  "#0074D9",
  "#7FDBFF",
  "#39CCCC",
  "#B10DC9",
  "#3D9970",
  "#2ECC40",
  "#01FF70",
  "#FF851B",
  "#FF4136",
  "#85144b",
  "#F012BE",
  "#FFDC00"
];
const CIRCLE = "circle",
  SQUARE = "square";
const speedDict = {
  "0": "fastest",
  "10": "fast",
  "20": "medium",
  "30": "slow",
  "40": "slowest"
};

const ctx = canvas.getContext("2d");
let interval = 10;
let shape = CIRCLE;

document.getElementById("speed").innerHTML = speedDict[interval];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

// Returns a random angle non-straight angle
function getRandomAngle() {
  const angle = Math.floor(Math.random() * 80 + 10);
  return angle % 6 !== 0 ? angle : getRandomAngle();
}

function drawCrumb(x, y) {
  switch (shape) {
    case CIRCLE:
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case SQUARE:
      ctx.fillRect(x, y, rectSide, rectSide);
      break;
    default:
      ctx.fillRect(x, y, rectSide, rectSide);
      break;
  }
}

function drawPath(x, y, angle, count) {
  return new Promise(resolve => {
    if (count === 0) {
      return resolve();
    }

    drawCrumb(x, y);

    // Move registration point to the center of the canvas
    ctx.translate(canvasWidth / 2, canvasWidth / 2);

    // Rotate
    ctx.rotate(angle * Math.PI / 180);

    // Move registration point back to the edge of the canvas
    ctx.translate(-canvasWidth / 2, -canvasWidth / 2);
    setTimeout(() => {
      drawPath(x + radius * 2 - 1, y + radius * 2 - 1, angle, count - 1).then(
        () => {
          resolve();
        }
      );
    }, interval);
  });
}

function drawRandom(count, angle) {
  if (count === 0) {
    setTimeout(() => {
      // Reset and clear the canvas
      ctx.resetTransform();
      ctx.rotate(0);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      setTimeout(() => {
        const angle = getRandomAngle();
        drawRandom(pathCount, angle);
      }, 100);
    }, 500);
  } else {
    const color = getRandomColor();
    ctx.fillStyle = color;
    drawPath(startX, startY, angle, crumbCount).then(() => {
      setTimeout(function() {
        drawRandom(count - 1, angle);
      }, 10);
    });
  }
}

document.getElementById("faster").addEventListener("click", e => {
  interval = interval <= 0 ? 0 : interval - 10;
  document.getElementById("speed").innerHTML = speedDict[interval];
});

document.getElementById("slower").addEventListener("click", e => {
  interval = interval >= 40 ? 40 : interval + 10;
  document.getElementById("speed").innerHTML = speedDict[interval];
});

const circleElem = document.getElementById("circle");
const squareElem = document.getElementById("square");

squareElem.addEventListener("click", e => {
  setTimeout(() => {
    if (shape === CIRCLE) {
      shape = SQUARE;
      squareElem.classList.remove("outline");
      circleElem.classList.add("thin");
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
  }, 0);
});

circleElem.addEventListener("click", e => {
  setTimeout(() => {
    if (shape === SQUARE) {
      shape = CIRCLE;
      circleElem.classList.remove("thin");
      squareElem.classList.add("outline");
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
  }, 0);
});

drawRandom(pathCount, getRandomAngle());
