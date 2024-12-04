const canvas = document.querySelector(".garden");
const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
canvas.appendChild(svg);

let isDrawing = false;

let storedX;
let storedY;

const rect = canvas.getBoundingClientRect();      


// when the mouse is down, we wanna draw.
document.addEventListener("mousedown", (event) =>
{
    storedX = event.clientX - rect.left;
    storedY = event.clientY - rect.top;

    isDrawing = true;
});

document.addEventListener("mouseup", (event) => {


    isDrawing = false;
})

document.addEventListener("mousemove", (event) => {    
    if(isDrawing)
    {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // if the distance between line is greater than 5px, we wanna draw!
        if(Math.sqrt(Math.pow((x - storedX), 2) + Math.pow((y - storedY), 2)) > 15)
        {
            createLine(storedX, storedY, x, y);
            storedX = x;
            storedY = y;
        }
    }
})


const createLine = (startPosX, startPosY, endPosX, endPosY) =>
{
    let line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute("x1", startPosX);
    line.setAttribute("y1", startPosY);
    line.setAttribute("x2", endPosX);
    line.setAttribute("y2", endPosY);

    svg.appendChild(line);
}

const is_key_down = (() => {
    const state = {};

    window.addEventListener('keyup', (e) => state[e.key] = false);
    window.addEventListener('keydown', (e) => state[e.key] = true);

    return (key) => state.hasOwnProperty(key) && state[key] || false;
})();


document.addEventListener('keydown', function(event) {
    if (event.key === 'z') {
        if(svg.lastChild != undefined)
        {
            svg.removeChild(svg.lastChild);
        }
    }
});