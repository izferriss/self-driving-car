//Canvas
const carCanvas=
{
    w: 300,
    h: window.innerHeight,
    html: document.getElementById("carCanvas")
};
const netCanvas=
{
    w: window.innerWidth - carCanvas.w - 40,
    h: window.innerHeight,
    html: document.getElementById("netCanvas")
};

const CTX_CAR = carCanvas.html.getContext("2d");
const CTX_NET = netCanvas.html.getContext("2d");

var numLanes = 3;
var numCars = 1000;
const road = new Road(carCanvas.w/2, carCanvas.w * .9, numLanes);
const cars = generateCars(numCars);
let bestCar = cars[0];

const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",350),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",350),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",350),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",350),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",350),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",350),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",350),
];

//Timing/FPS
var lastFrame = 0;
var fpsTime = 0;
var frameCount = 0;
var fps = 0;
var delta = 0;

var gameSpeed = 10;

window.onload = init();

function init()
{
    carCanvas.html.setAttribute("width", carCanvas.w);
    carCanvas.html.setAttribute("height", carCanvas.h);
    netCanvas.html.setAttribute("width", netCanvas.w);
    netCanvas.html.setAttribute("height", netCanvas.h);
    carCanvas.html.focus = true;

    checkForSave();

    loop(0);
}

function loop(time)
{
    calcFPS(time);
    update(delta);
    draw();
    requestAnimationFrame(loop);
}

function update(time)
{
    for(let i = 0; i < traffic.length; i++)
    {
        traffic[i].update(road.borders, [], time);
    }
    for(let i = 0; i < cars.length; i++)
    {
        cars[i].update(road.borders, traffic, time);
    }

    getBestCar();
}

function save()
{
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard()
{
    localStorage.removeItem("bestBrain");
}

function reload()
{
    window.location.reload();
}

function calcFPS(time)
{
    delta = (time - lastFrame) / 1000;
    lastFrame = time;

    if(fpsTime > .25)
    {
        fps = Math.round(frameCount / fpsTime);
        fpsTime = 0;
        frameCount = 0;
    }

    fpsTime += delta;
    frameCount++;
}

function draw()
{
    clearCanvas();
    drawCanvasBG("#565656");
    drawFPS();

    //fitness function
    
    CTX_CAR.save();
    CTX_CAR.translate(0, -bestCar.y+carCanvas.h * .85);

    road.draw(CTX_CAR);

    for(let i = 0; i < traffic.length; i++)
    {
        traffic[i].draw(CTX_CAR, "red");
    }

    CTX_CAR.globalAlpha = 0.2;

    for(let i = 0; i < cars.length; i++)
    {
        cars[i].draw(CTX_CAR, "blue");
    }

    CTX_CAR.globalAlpha = 1;

    bestCar.draw(CTX_CAR, "yellow", true);

    CTX_CAR.restore();
    drawNetwork();
    
}

function clearCanvas()
{
    CTX_CAR.clearRect(0,0, carCanvas.w, carCanvas.h);
    CTX_NET.clearRect(0,0, netCanvas.w, netCanvas.h);
}

function drawCanvasBG(fill)
{
    CTX_CAR.fillStyle = fill;
    CTX_CAR.fillRect(0, 0, carCanvas.w, carCanvas.h);
    CTX_NET.fillStyle = "black";
    CTX_NET.fillRect(0,0, netCanvas.w, netCanvas.h);
}

function drawFPS()
{
    CTX_NET.fillStyle = "white";
    CTX_NET.font = "15px Arial";
    CTX_NET.fillText("FPS: " + fps, 30, 20);
    CTX_NET.closePath();
}

function drawNetwork()
{
    Visualizer.drawNetwork(CTX_NET, bestCar.brain);
}

function generateCars(N)
{
    const cars = [];
    for(let i = 0; i < N; i++)
    {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }

    return cars;
}

function getBestCar()
{
    bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)));
}

function checkForSave()
{
    if(localStorage.getItem("bestBrain"))
    {
        for(let i = 0; i < cars.length; i++)
        {
            cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
            if(i != 0)
            {
                NeuralNetwork.mutate(cars[i].brain, .3);
            }
        }
    }
}
