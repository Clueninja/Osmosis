
class Macro extends Model
{
	constructor(type)
	{
		// call Model.constructor()
		super();
		// A macro model has a list of particles and a list of Membranes, as well as an image that gets updated every frame
		this.particles = [];
		this.membranes=[];
		
		Particle.drawText=false;

		switch (type)
		{
			case 'split':
				// Add Water to one side of the model
				Particle.addParticles('w', 200000,'l',this.particles);

				// and salt particles on the other side
				Particle.addParticles('s', 20000,'r',this.particles);
				break;
		}
		

		// add a large membrane
		this.membranes.push(new CircularMembrane(3*width/4, height/2, 200, 5));
		// add a small membrane
		this.membranes.push(new CircularMembrane(width/4, height/4, 100, 2));
		// add sliders and buttons for the user to interact with
		// go back to the menu
		this.control.addButton('menu_button',"Menu",load_menu, 350,height-230);
		// reset the model-> remove all particles
		this.control.addButton('reset_button',"Reset", reset, 350,height-190);
		// add a scale slider to edit the visuals/ make program run faster
		this.control.addSlider('scale_slider', 'Scale Slider',0,4,2,50,height-70);
		this.control.addSlider('colour_slider', 'Colour Slider',0,255,0,50,height-50);

		this.control.addSlider('drawing_radius', 'Drawing Slider',40,100,50,210,height-70);

		this.control.addSlider('draw_membrane_radius', 'Membrane Radius',100,300,150,370,height-70);

	}
	
	draw()
	{
		let scale_val = this.control.getVal('scale_slider');
		// get scale value from slider
		let scale = pow(2,scale_val);
		const colour_palette = [ 250, 100, 30, 20, 5 ];
		
		let img = createImage(round(width/scale),round(height/scale));
		// load pixels from created image
		img.loadPixels();
		//Set Image to White
		for (let x = 0; x < img.width; x++)
		{
			for (let y = 0; y < img.height; y++)
			{
				let index = (x+y*img.width)*4;
				
				img.pixels[index]=255;
				img.pixels[index+1]=255;
				img.pixels[index+2]=255;
				img.pixels[index+3]=255;
			}
		}
		// draw particles
		for (const p of this.particles)
		{

			let index = round( round(p.posX/scale) + round(p.posY/scale) * round(width/scale) )*4;
			let col = this.control.getVal('colour_slider');
			
			// 0 is red, 1 is green, 2 is blue, 3 is alpha
			
			let temp = index%4;
			// find black pixel for that index of pixel
			index = index-temp;
			// change different rgb value for type of particle
			if(p.type=='w'){
			// scale 4: col 5-8
			// scale 3: col 15-25
			// scale 2: col 25-36
			// scale 1: col 80-120
			// scale 0: col 200-255
				img.pixels[index+0]-= colour_palette[scale_val];
				img.pixels[index+1]-= colour_palette[scale_val];

			}
			else if(p.type=='s'){
				img.pixels[index+1]-=colour_palette[scale_val];
				img.pixels[index+2]-= colour_palette[scale_val];
			}
			// default red colour
			else{
				img.pixels[index+1]-= colour_palette[scale_val];
				img.pixels[index+2]-= colour_palette[scale_val];
			}
		}
		// update the pixels to the image I just loaded
		img.updatePixels();
		image(img, 0,0,width,height);
		for (const m of this.membranes)
		{
			m.draw();
		}
		this.control.draw();
		// draw text for keyboard input prompts
		fill(0);
		textSize(20);
		
		text('Press "M" to draw a membrane', 50, height-220);
		text('Press "P" to pause the model', 50, height-180);
		text('Hold "S" to draw salt particles at mouse cursor', 50, height-140);
		text('Hold "W" to draw water particles at mouse cursor', 50, height -100);
	}
	
	update(){
		if (keyIsPressed)
		{
			if (key == 'w')
			{
				// get currently used particles
				let rad = this.control.getVal('drawing_radius');
				let num = 2*rad;
				
				for (let i=0; i<num; i++)
				{
					let p;
					p = new Water(mouseX + random(-rad, rad), mouseY+ random(-rad, rad));
					p.setRandVel(1);
					this.particles.push(p);
				}
			}
			if (key == 's')
			{
				// get currently used particles
				let rad = this.control.getVal('drawing_radius');
				let num = 2*rad
				for (let i=0; i<num; i++)
				{
					let p;
					p = new Salt(mouseX + random(-rad, rad), mouseY+ random(-rad, rad));
					p.setRandVel(1);
					this.particles.push(p);
				}
			}
			
		}
		// allow creating particles but not moving particles
		if (!this.paused)
		{
		// imitate collitions
			if (this.particles.length>0)
			{
				let num = int(random(0,this.particles.length/200));
				for (let i=0; i<num;i++)
				{
					const randIndex = int(random(0, this.particles.length));

					this.particles[randIndex].setRandVel(random(1,2));
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


