const canvas = document.querySelector(".garden");
const controls = document.querySelectorAll(".control > *");
const rect = canvas.getBoundingClientRect();
const input = document.querySelector("#spacing");
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
const stencil = document.createElementNS('http://www.w3.org/2000/svg', 'g');
stencil.setAttribute("id", "stencil");
svg.appendChild(stencil);
canvas.appendChild(svg);


let lineMode = "draw";
let isDrawing = false;
let storedX;
let storedY;

let circleR = 25;
let spacing = 25;



controls[0].addEventListener("click", () => {
    ShowSelected(controls[0]);
    lineMode = "draw";
})

controls[1].addEventListener("click", () => {
    ShowSelected(controls[1]);
    lineMode = "circle";
})

controls[2].addEventListener("click", () => {
    lineMode = "";
    ShowSelected(controls[2]);
    Clear();
})

// when the mouse is down, we wanna draw.
document.addEventListener("mousedown", (event) => {
    storedX = event.clientX - rect.left;
    storedY = event.clientY - rect.top;

    // we only want to start drawing IF the player clicks in the rectangle.
    if (
        event.clientX >= rect.x &&
        event.clientX <= rect.x + rect.width &&
        event.clientY >= rect.y &&
        event.clientY <= rect.y + rect.height) {
        isDrawing = true;
    }

    if (lineMode === "circle") {
        createCircle(storedX, storedY);
    }
});

document.addEventListener("mouseup", (event) => {
    isDrawing = false;
})

document.addEventListener("mousemove", (event) => {
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isDrawing) {

        if (lineMode === "draw") {
            // if the distance between line is greater than 5px, we wanna draw!
            if (Math.sqrt(Math.pow((x - storedX), 2) + Math.pow((y - storedY), 2)) > 15) {
                createLine(storedX, storedY, x, y, spacing);
                storedX = x;
                storedY = y;
            }
        }
    }
    if (lineMode === "circle") {
        createStencilCircle(x, y)
    }
});

const createCircle = (x, y) => {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y)
    circle.setAttribute("r", circleR);

    svg.appendChild(circle);
}

const createStencilCircle = (x, y) => {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

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


const createLine = (startPosX, startPosY, endPosX, endPosY, spacing) => {
    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // line 1
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    line.setAttribute("x1", startPosX);
    line.setAttribute("y1", startPosY);
    line.setAttribute("x2", endPosX);
    line.setAttribute("y2", endPosY);

    let angle = Math.atan2(endPosY - startPosY, endPosX - startPosX);

    // line 2
    let rLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rLine.setAttribute("x1", startPosX - spacing * Math.cos(angle + Math.PI / 2));
    rLine.setAttribute("y1", startPosY - spacing * Math.sin(angle + Math.PI / 2));
    rLine.setAttribute("x2", endPosX - spacing * Math.cos(angle + Math.PI / 2));
    rLine.setAttribute("y2", endPosY - spacing * Math.sin(angle + Math.PI / 2));

    let lLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lLine.setAttribute("x1", startPosX - spacing * Math.cos(angle - Math.PI / 2));
    lLine.setAttribute("y1", startPosY - spacing * Math.sin(angle - Math.PI / 2));
    lLine.setAttribute("x2", endPosX - spacing * Math.cos(angle - Math.PI / 2));
    lLine.setAttribute("y2", endPosY - spacing * Math.sin(angle - Math.PI / 2));



    group.appendChild(line);
    group.appendChild(lLine);
    group.appendChild(rLine);

    svg.appendChild(group);
}

const Clear = () => {
    while (svg.children.length > 1) {
        svg.removeChild(svg.lastChild);
    }
}

const is_key_down = (() => {
    const state = {};

    window.addEventListener('keyup', (e) => state[e.key] = false);
    window.addEventListener('keydown', (e) => state[e.key] = true);

    return (key) => state.hasOwnProperty(key) && state[key] || false;
})();

const ShowSelected = (selectedElement) => {
    for (let element of controls) {
        if (element === selectedElement) {
            element.classList.add("selected");
        }
        else if (element.classList.contains("selected")) {
            element.classList.remove("selected")
        }
    }

    console.log("i be running")
}



document.addEventListener('keydown', function (event) {
    if (event.key === 'z') {
        if (svg.lastChild != undefined) {
            svg.removeChild(svg.lastChild);
        }
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'e') {
        if (circleR < 250) {
            circleR += 25;
        }
        if (spacing < 50) {
            spacing += 3
        }
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'q') {
        if (circleR > 25) {
            circleR -= 25;
        }
        if (spacing > 1) {
            spacing -= 3
        }
    }
});