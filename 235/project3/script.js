const canvas = document.querySelector(".garden");
const controls = document.querySelectorAll(".control > *");
const rect = canvas.getBoundingClientRect();      
const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
const stencil = document.querySelector("#stencil");
canvas.appendChild(svg);


let lineMode = "draw";
let isDrawing = false;
let storedX;
let storedY;

let circleR = 25;


controls[0].addEventListener("click", () =>
{
    lineMode = "draw";
})

controls[1].addEventListener("click", () =>
{
    lineMode = "line";
})

controls[2].addEventListener("click", () =>
{
    lineMode = "circle";
})

// when the mouse is down, we wanna draw.
document.addEventListener("mousedown", (event) =>
{
    storedX = event.clientX - rect.left;
    storedY = event.clientY - rect.top;

    isDrawing = true;

    if(lineMode === "circle")
    {
        createCircle(storedX, storedY);
    }
});

document.addEventListener("mouseup", (event) => {
    isDrawing = false;
})

document.addEventListener("mousemove", (event) => {    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if(isDrawing)
    {
        
        if(lineMode === "draw")
        {
            // if the distance between line is greater than 5px, we wanna draw!
            if(Math.sqrt(Math.pow((x - storedX), 2) + Math.pow((y - storedY), 2)) > 15)
            {
                createLine(storedX, storedY, x, y, 25);
                storedX = x;
                storedY = y;
            }
        }
    }
    if(lineMode === "circle")
    {
        createStencilCircle(x,y)
    }
});

const createCircle = (x, y) => {
    let circle = document.createElementNS('http://www.w3.org/2000/svg','circle');

    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y)
    circle.setAttribute("r", circleR);

    svg.appendChild(circle);
}

const createStencilCircle = (x, y) => {
    let circle = document.createElementNS('http://www.w3.org/2000/svg','circle');

    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y)
    circle.setAttribute("r", circleR);

    let child = stencil.lastElementChild;
    while (child) {
        stencil.removeChild(child);
        child = stencil.lastElementChild;
    }
    stencil.appendChild(circle);
}


const createLine = (startPosX, startPosY, endPosX, endPosY, spacing) =>
{
    let group = document.createElementNS("http://www.w3.org/2000/svg","g");
    // line 1
    let line = document.createElementNS('http://www.w3.org/2000/svg','line');

    line.setAttribute("x1", startPosX);
    line.setAttribute("y1", startPosY);
    line.setAttribute("x2", endPosX);
    line.setAttribute("y2", endPosY);

    let angle =  Math.atan2(endPosY - startPosY, endPosX - startPosX);

    // line 2
    let rLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    rLine.setAttribute("x1", startPosX - spacing * Math.cos(angle + Math.PI / 2));
    rLine.setAttribute("y1", startPosY - spacing * Math.sin(angle + Math.PI / 2));
    rLine.setAttribute("x2", endPosX - spacing * Math.cos(angle + Math.PI / 2));
    rLine.setAttribute("y2", endPosY - spacing * Math.sin(angle + Math.PI / 2));

    let lLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    lLine.setAttribute("x1", startPosX - spacing * Math.cos(angle - Math.PI / 2));
    lLine.setAttribute("y1", startPosY - spacing * Math.sin(angle - Math.PI / 2));
    lLine.setAttribute("x2", endPosX - spacing * Math.cos(angle - Math.PI / 2));
    lLine.setAttribute("y2", endPosY - spacing * Math.sin(angle - Math.PI / 2));



    group.appendChild(line);
    group.appendChild(lLine);
    group.appendChild(rLine);

    svg.appendChild(group);
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

document.addEventListener('keydown', function(event) {
    if (event.key === 'e') {
        if(circleR < 500)
        {
            circleR += 5;
        }
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === '1') {
        if(circleR > 1)
        {
            circleR -= 5;
        }
    }
});