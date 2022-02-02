// Setup p5 variables.
p5.disableFriendlyErrors = true;


// Every part of the program needs to access the model, to load/ unload so it makes sense for it to be defined globally.
let model; // type Model

// Keeping the main program clean is good so that new models could be made easily.
function setup()
{
    textAlign(LEFT);
	createCanvas(windowWidth, windowHeight);
	//background(200);
	//frameRate(30);
	// Menu is being displayed first
	model = new Menu();
}

// p5 function that gets called every frame.
function draw()
{
	background(204);
	model.update();
	model.draw();
}

// reset button calls this function to reset the current model.
function reset()
{
	model.reset();
}

