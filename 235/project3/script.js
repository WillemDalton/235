const canvas = document.querySelector(".garden");
const controls = document.querySelectorAll(".control > *");
const rect = canvas.getBoundingClientRect();
const input = document.querySelector("#spacing");
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
const stencil = document.createElementNS('http://www.w3.org/2000/svg', 'g');
const intro = document.querySelector(".intro");
stencil.setAttribute("id", "stencil");
svg.appendChild(stencil);
canvas.appendChild(svg);

// sfx
const sandSound = new Audio('sounds/sand.wav'); 
sandSound.volume = 0.1;
const buttonClick = new Audio('sounds/click.wav');
buttonClick.volume = 0.1;
const gameMusic = new Audio('sounds/music.mp3');
gameMusic.volume = 0.25;
gameMusic.loop = true;

// some brush controls
let lineMode = "draw";
let isDrawing = false;
let storedX;
let storedY;
let circleR = 25;
let spacing = 25;

// button logic
controls[0].addEventListener("click", () => {
    showSelected(controls[0]);
    lineMode = "draw";
    buttonClick.play();
})

controls[1].addEventListener("click", () => {
    showSelected(controls[1]);
    lineMode = "circle";
    buttonClick.play();
})

controls[2].addEventListener("click", () => {
   clear();
   buttonClick.play();
})

// when the mouse is down, we wanna draw.
document.addEventListener("mousedown", (event) => {
    storedX = event.clientX - rect.left;
    storedY = event.clientY - rect.top;

    // we only want to start drawing IF the player clicks in the rectangle.
    if (event.clientX >= rect.x &&
        event.clientX <= rect.x + rect.width &&
        event.clientY >= rect.y &&
        event.clientY <= rect.y + rect.height) 
    {
        isDrawing = true;
        if (lineMode === "circle") {
            svg.appendChild(createCircle(storedX, storedY));
        }
        // remove the intro text when we draw
        if(intro.classList.contains("removed") === false)
        {
            intro.classList.add("removed");
        }
    }

});

// when the mouse is up we stop drawing, and play the game music
document.addEventListener("mouseup", (event) => {
    isDrawing = false;
    gameMusic.play();
});

// wehn the mouse is moving, handle certain drawing logic
document.addEventListener("mousemove", (event) => {
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isDrawing) {
        sandSound.play(); 
        if (lineMode === "draw") {
            // if the distance between line is greater than 5px, we wanna draw!
            if (Math.sqrt(Math.pow((x - storedX), 2) + Math.pow((y - storedY), 2)) > 15) {
                svg.appendChild(createLine(storedX, storedY, x, y, spacing));
                storedX = x;
                storedY = y;
            }
        }
    }
    if (lineMode === "circle") {
        createStencilCircle(x, y);
        storedX = x;
        storedY = y;
    }
    else if (lineMode === "draw" && !isDrawing) {
        createStencilLine(x, y, spacing);
        storedX = x;
        storedY = y;
    }
    // remove existing stencil drawings
    else if (stencil.lastElementChild != null) {
        stencil.removeChild(stencil.lastElementChild);
    }

});

// draw a circle centered at (x,y)
const createCircle = (x, y) => {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y)
    circle.setAttribute("r", circleR);

    return circle;
}

// create a placeholder circle at (x,y), for the player to see what their drawing is like
const createStencilCircle = (x, y) => {
    let circle = createCircle(x, y);

    let child = stencil.lastElementChild;
    while (child) {
        stencil.removeChild(child);
        child = stencil.lastElementChild;
    }
    stencil.appendChild(circle);
}

//create a line going from (x1,y1) to (x2, y2) with spacing 
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

    // line 3
    let lLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lLine.setAttribute("x1", startPosX - spacing * Math.cos(angle - Math.PI / 2));
    lLine.setAttribute("y1", startPosY - spacing * Math.sin(angle - Math.PI / 2));
    lLine.setAttribute("x2", endPosX - spacing * Math.cos(angle - Math.PI / 2));
    lLine.setAttribute("y2", endPosY - spacing * Math.sin(angle - Math.PI / 2));

    group.appendChild(line);
    group.appendChild(lLine);
    group.appendChild(rLine);

    return group;
}

// create a stencil of what the  player's line and spacing will look like
const createStencilLine = (startPosX, startPosY, spacing) => {
    const group = createLine(startPosX, startPosY, startPosX, startPosY + 1, spacing);

    let child = stencil.lastElementChild;
    while (child) {
        stencil.removeChild(child);
        child = stencil.lastElementChild;
    }
    stencil.appendChild(group);
}

// clear the svg elements
const clear = () => {
    while (svg.children.length > 1) {
        svg.removeChild(svg.lastChild);
    }
}

// show selected buttons
const showSelected = (selectedElement) => {
    for (let element of controls) {
        if (element === selectedElement) {
            element.classList.add("selected");
        }
        else if (element.classList.contains("selected")) {
            element.classList.remove("selected")
        }
    }
}

// when the user presses z, undo
document.addEventListener('keydown', function (event) {
    if (event.key === 'z') {
        if (svg.lastChild != undefined) {
            svg.removeChild(svg.lastChild);
        }
    }
});

// when the user presses e, increase brush radius
document.addEventListener('keydown', function (event) {
    if (event.key === 'e') {
        if (circleR < 250) {
            circleR += 25;
        }
        if (spacing < 50) {
            spacing += 3
        }
    }
    if(lineMode === "circle")
    {
        createStencilCircle(storedX, storedY);
    }
    else if(lineMode === "draw")
    {
        createStencilLine(storedX, storedY, spacing);
    }
});

// when the user presses q, shrink brush
document.addEventListener('keydown', function (event) {
    if (event.key === 'q') {
        if (circleR > 25) {
            circleR -= 25;
        }
        if (spacing > 1) {
            spacing -= 3
        }
    }
    if(lineMode === "circle")
    {
        createStencilCircle(storedX, storedY);
    }
    else if(lineMode === "draw")
    {
        createStencilLine(storedX, storedY, spacing);
    }
});