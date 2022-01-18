class Micro extends Model
{
	constructor(type)
	{
		// run Model.constructor()
		super();
		
		// a micro model contains a list of particles (Water or Salt) and a membrane that has some dimensions
		this.particles = [];
		this.membrane = new Membrane(10,55,10);
		Particle.drawText = false;
		// starting initial conditions
		switch (type)
		{
			case 'isotonic':
				// particles spawned on left							particles spawned on right
				Particle.addParticles('w', 150,'l',this.particles);		Particle.addParticles('w', 150,'r',this.particles);
				Particle.addParticles('s', 10,'l',this.particles);		Particle.addParticles('s', 10,'r',this.particles);
				break;
			case 'hypertonic':
				Particle.addParticles('w', 300,'l',this.particles);		Particle.addParticles('w', 20,'r',this.particles);
				Particle.addParticles('s', 2,'l',this.particles);		Particle.addParticles('s', 30,'r',this.particles);
				break;
			case 'hypotonic':
				Particle.addParticles('w', 20,'l',this.particles);		Particle.addParticles('w', 300,'r',this.particles);
				Particle.addParticles('s', 20,'l',this.particles);		Particle.addParticles('s', 2,'r',this.particles);
				break;
				
			case 'advanced':
				// if the advanced model is loaded
				this.control.addSlider('water_mass_slider','Water Mass', 5,40,5,width/2-200,height-100);
				this.control.addSlider('salt_mass_slider','Salt Mass', 10,40,30,width/2+200,height-100);
			
				this.control.addButton('reset_membrane_button', 'Reset Membrane',reset_membrane, width-200,130);
				
				this.control.addSlider('membrane_width_slider','Membrane Width', 10,100,30,width-200,50);
				this.control.addSlider('membrane_num_slider','Number Of Rects', 2,20,10,width-200,80);
				this.control.addSlider('membrane_gap_slider','Gap Between Rects', 1,100,55,width-200,110);
				
				//Particle.drawText = true;
				break;
				
		}
		// set control gui items like sliders and buttons to interact with
		
		this.control.addButton('menu_button', 'Menu',load_menu, 300,height-150);
		this.control.addButton('reset_button', 'Reset',reset, 300,height-100);
		
		
		this.control.addSlider('water_right_slider','Water Number Right', 0,300,0,width-200,height-150);
		this.control.addSlider('salt_right_slider','Salt Number Right', 0,50,0,width-200,height-100);
	
		
		this.control.addSlider('water_left_slider','Water Number Left', 0,300,0,100,height-150);
		this.control.addSlider('salt_left_slider','Salt Number Left', 0,50,0,100,height-100);
		
		
	}
	
	
	updateSliders()
	{
		// edit micro model to utilise particles
		let num = this.control.getDiff('salt_left_slider');
		// always check if the slider exists before trying to use the value
		if (num !=null)
			Particle.addParticles('s',num,'l', this.particles);
		
		num = this.control.getDiff('salt_right_slider');
		if (num !=null)
			Particle.addParticles('s',num,'r', this.particles);
		
		num = this.control.getDiff('water_left_slider');
		if (num !=null)
			Particle.addParticles('w',num,'l', this.particles);
			
		num = this.control.getDiff('water_right_slider');
		if (num !=null)
			Particle.addParticles('w',num,'r', this.particles);
		
		// update salt and water mass so slow function isnt called a lot
		
		let mass =this.control.getVal('water_mass_slider');
		if (mass != null)
			Water.sMass = mass;

		mass =this.control.getVal('salt_mass_slider');
		if (mass != null)
			Salt.sMass = mass;
	}
	
	// draws the particle count on the screen
	drawText()
	{
		// function that needs improvement
		// Big O complexity of n, which is fine as computation is low
		let left_water =0;
		let left_salt =0;
		let right_water =0;
		let right_salt=0;
		for (const p of this.particles)
		{
			if (p.posX<width/2)
			{
				switch (p.type)
				{
					case 'w': left_water++;break;
					case 's': left_salt++;break;
				}
			}
			else
			{
				switch (p.type)
				{
					case 'w': right_water++;break;
					case 's': right_salt++;break;
				}
			}
		}
		// draw number of particles on either side
		fill('blue');
		textSize(40);
		text(left_water, width/4,50);
		text(right_water, 3*width/4,50);
		fill('red');
		text(left_salt, width/4,100);
		text(right_salt, 3*width/4,100);
	}
	
	
	update()
	{
		// update mass of particles and add particles
		this.updateSliders();
		
		if (!this.paused)
		{
			// perform collisions between each particle
			// Big O Complexity of n^2
			for (const a of this.particles)
			{
				for (const b of this.particles)
				{
					if (a != b)
					{
						// its a constant variable yet I'm editing it in the collide method, this shouldn't be possible
						a.collide(b);
					}
				}
				// check collisions with membrane 
				this.membrane.collide(a);
				// update particle's position
				a.update();
			}
		}
	}
	// reset the model
	reset()
	{
		// remove all particles
		let len = this.particles.length;
		for (let i=0; i<len;i++){
			this.particles.pop();
		}
		
	}
	
	draw()
	{
	// draw each particle
		for (const p of this.particles){
			p.draw();
		}
	// draw membrane
		this.membrane.draw();
		
	// draw text for sliders
		this.control.draw();
		
	// draw text for particle count
		this.drawText();

		fill(0);
		textAlign(LEFT);
		textSize(20);
		text('Press "P" to pause the model', 100, height-200);
		text('Press "T" to dislay particle speed', 100, height-180);
		
	}
	
	
}
// a really hacky solution because reset_membrane needs to be globally defined
function reset_membrane()
{
	model.membrane = new Membrane(
		model.control.getVal('membrane_num_slider'),
		model.control.getVal('membrane_gap_slider'),
		model.control.getVal('membrane_width_slider')
	);
}

// depreciated for Particles.addParticles()
function micro_slider(value)
{
	for (let i=0; i<value;i++)
	{
		let p = new Particle(random(0,width), random(0,height));
		p.setRandVel(micro_water_speed/10);
		model.particles.push(p)
	}
}
// for these it is required as models need to be loaded from outside the model, at least in this paradigm these functions are inside the models file rather than in main.

//technically I could just remove all the particles and add particles in but this way I could restrict sliders/buttons if needed.

// to load a different state of Micro the model must be cleared (remove all gui items) and then the new model must be loaded
function load_iso()
{
	model.clear();
	model = new Micro('isotonic');
}
function load_hypo()
{
	model.clear();
	model = new Micro('hypotonic');
}
function load_hyper()
{
	model.clear();
	model = new Micro('hypertonic');
}

function load_micro()
{
	model.clear();
	model = new Micro();
}
function load_advmicro()
{
	model.clear();
	model = new Micro('advanced');
}

