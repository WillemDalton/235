const canvas = document.querySelector(".garden");
const context = canvas.getContext("2d");

let isDrawing = false;

let storedX = 0;
let storedY = 0;

// when the mouse is down, we wanna draw.
document.addEventListener("mousedown", () =>
{
    isDrawing = true;
});

document.addEventListener("mouseup", () => {
    isDrawing = false;
})

canvas.addEventListener("mousemove", (event) => {
    const x = event.clientX;
    const y = event.clientY;

    if(isDrawing)
    {
        context.beginPath();

        context.moveTo(0,0);

        console.log(x);
        context.lineTo(x,y);

        context.stroke();
    }

    setInterval(() => {
        storedX = x;
        storedY = y;
    }, 10);
})
