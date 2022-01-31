
class Macro extends Model
{
	constructor(type)
	{
		// Call Model.constructor() to setup the controller and reset paused.
		super();
		// A macro model has a list of particles and a list of Membranes, as well as an image that gets updated every frame with a scale value.
		this.particles = [];
		this.membranes=[];
		
		// image does not have to initialised since the scale value changes first frame and gets set.
		this.image;
		this.scale = 0;
		
		Particle.drawText=false;
		Water.sMass=0;
		Salt.sMass=0;
		
		
		// More initial conditions could be set
		switch (type)
		{
			case 'split':
				// Add Water to one side of the model
				Particle.addParticles('w', 20000,'l',this.particles);

				// and salt particles on the other side
				Particle.addParticles('s', 2000,'r',this.particles);
				break;
		}
		

		// Add a large membrane
		this.membranes.push(new CircularMembrane(3*width/4, height/2, 200, 5));
		
		// Add a smaller membrane
		this.membranes.push(new CircularMembrane(width/4, height/4, 100, 2));
		
		// add sliders and buttons for the user to interact with
		// go back to the menu
		this.control.addButton('menu_button',"Menu",load_menu, 400,height-230);
		// reset the model-> remove all particles and membranes
		this.control.addButton('reset_button',"Reset", reset, 400,height-190);
		// add a scale slider to edit the visuals/ make program run faster
		this.control.addSlider('scale_slider', 'Scale Slider',0,4,2,50,height-70);

		this.control.addSlider('drawing_radius', 'Drawing Slider',40,100,50,250,height-70);

		this.control.addSlider('draw_membrane_radius', 'Membrane Radius',100,300,150,450,height-70);

	}
	
	draw()
	{
		let scale_val = this.control.getVal('scale_slider');
		// get scale value from slider
		let scale = pow(2,scale_val);
		// constant colour_palette with help from a (different) third party
		const colour_palette = [ 250, 100, 30, 20, 5 ];
		
		// This change improved the performance BY A LOT
		if (scale_val != this.scale)
		{
			// reset the image
			this.img = createImage(round(width/scale),round(height/scale));
			// load pixels from created image
			this.img.loadPixels();
			// set the scale so the image can be updated later
			this.scale = scale_val;
		}
		
		//Set Image to White
		for (let x = 0; x < this.img.width; x++)
		{
			for (let y = 0; y < this.img.height; y++)
			{
				let index = (x+y*this.img.width)*4;
				
				this.img.pixels[index]=255;
				this.img.pixels[index+1]=255;
				this.img.pixels[index+2]=255;
				this.img.pixels[index+3]=255;
			}
		}
		// Draw Particles
		for (const p of this.particles)
		{

			let index = round( round(p.posX/scale) + round(p.posY/scale) * round(width/scale) )*4;
			
			// 0 is red, 1 is green, 2 is blue, 3 is alpha
			
			let temp = index%4;
			// find black pixel for that index of pixel
			index = index-temp;
			// change different rgb value for type of particle
			if(p.type=='w')
			{
				this.img.pixels[index+0]-= colour_palette[scale_val];
				this.img.pixels[index+1]-= colour_palette[scale_val];

			}
			else if(p.type=='s')
			{
				this.img.pixels[index+1]-=colour_palette[scale_val];
				this.img.pixels[index+2]-= colour_palette[scale_val];
			}
			// Default Red colour
			else
			{
				this.img.pixels[index+1]-= colour_palette[scale_val];
				this.img.pixels[index+2]-= colour_palette[scale_val];
			}
		}
		// Update the pixels to the image that was loaded.
		this.img.updatePixels();
		image(this.img, 0,0,width,height);
		for (const m of this.membranes)
		{
			m.draw();
		}
		this.control.draw();
		// Draw text for keyboard input prompts
		fill(0);
		textSize(20);
		
		text('Press "M" to draw a membrane', 50, height-220);
		text('Press "P" to pause the model', 50, height-180);
		text('Hold "S" to draw salt particles at mouse cursor', 50, height-140);
		text('Hold "W" to draw water particles at mouse cursor', 50, height -100);
	}
	
	update()
	{
		// Check for user input
		if (keyIsPressed)
		{
			if (key == 'w')
			{
				// Add water particles to the screen
				let rad = this.control.getVal('drawing_radius');
				let num = 2*rad;
				
				for (let i=0; i<num; i++)
				{
					let p;
					p = new Water(mouseX + random(-rad, rad), mouseY+ random(-rad, rad));
					p.setRandVel();
					this.particles.push(p);
				}
			}
			if (key == 's')
			{
				// Add Salt particles to the screen
				let rad = this.control.getVal('drawing_radius');
				let num = 2*rad
				for (let i=0; i<num; i++)
				{
					let p;
					p = new Salt(mouseX + random(-rad, rad), mouseY+ random(-rad, rad));
					p.setRandVel();
					this.particles.push(p);
				}
			}
			
		}
		// Allow creating particles but not moving particles while paused
		if (!this.paused)
		{
		// imitate collitions
			if (this.particles.length>0)
			{
				// Number of particles collided per frame = number of particles/200
				
				let num = int(random(0,this.particles.length/200));
				
				for (let i=0; i<num;i++)
				{
					// Select a random particle's index
					const randIndex = int(random(0, this.particles.length));
					// move the particle in a random velocity
					this.particles[randIndex].setRandVel();
				}
			}
		// update every particle
			for (const p of this.particles)
			{
				for (const m of this.membranes)
				{
					m.collide(p);
				}
				p.update();
			}
		}
	}
	reset()
	{
		let len = this.particles.length;
		for (let ind=0; ind<len; ind++)
		{
			this.particles.pop();
		}
		len = this.membranes.length;
		for (let ind=0; ind<len; ind++)
		{
			this.membranes.pop();
		}
	}	
}

// functions to be used when pressing drawing
function load_macro_split()
{
	model.clear();
	model = new Macro('split');
}

function load_macro()
{
	model.clear();
	model = new Macro();
}


