// setup p5 variables
p5.disableFriendlyErrors = true;


// every part of the program needs to access the model, to load/ unload so it makes sense for it to be defined globally.
let model; // type Model

// I try to make the main file as clean as possible, so if I wanted to create a new model it would not be difficult.
function setup() {
	createCanvas(windowWidth, windowHeight);
	//background(200);
	//frameRate(30);
	// in this example, Menu is being displayed first
	model = new Menu();
}

// p5 function that gets called every frame
function draw() {
	background(204);
	model.update();
	model.draw();
}

function reset(){
	model.reset();
}

