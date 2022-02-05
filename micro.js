class Micro extends Model
{
	constructor(type)
	{
		// Run Model.constructor()
		super();
		
		// A micro model contains a list of Particle(s) (Water or Salt) and a Membrane.
		this.particles = [];
		this.membrane = new Membrane(10,55,10);
		Particle.drawText = false;
		// Starting initial conditions.
		// Set static water and salt masses.
		Water.sMass=5;
		Salt.sMass=30;
		switch (type)
		{
			// equal number of particles on either side
			case 'isotonic':
				// Particles spawned on left							Particles spawned on right
				Particle.addParticles('w', 150,'l',this.particles);		Particle.addParticles('w', 150,'r',this.particles);
				Particle.addParticles('s', 10,'l',this.particles);		Particle.addParticles('s', 10,'r',this.particles);
				break;
			//more salt particles on the right side and more water particles on the left side
			case 'hypertonic':
				Particle.addParticles('w', 300,'l',this.particles);		Particle.addParticles('w', 20,'r',this.particles);
				Particle.addParticles('s', 2,'l',this.particles);		Particle.addParticles('s', 30,'r',this.particles);
				break;
			// same number of salt and water particles on the left side, more water particles on the right side
			case 'hypotonic':
				Particle.addParticles('w', 20,'l',this.particles);		Particle.addParticles('w', 300,'r',this.particles);
				Particle.addParticles('s', 20,'l',this.particles);		Particle.addParticles('s', 2,'r',this.particles);
				break;
				
			case 'advanced':
				// If the advanced model is loaded...
				// Setup mass sliders
				this.control.addSlider('water_mass_slider','Water Mass', 5,40,5,width/2-200,height-100);
				this.control.addSlider('salt_mass_slider','Salt Mass', 10,40,30,width/2+200,height-100);
				
				// Set reset Membrane button
				this.control.addButton('load_membrane_button', 'Load Membrane',load_membrane, width-200,130);
				this.control.addButton('reset_membrane_button', 'Reset Membrane',reset_membrane, width-200,155);
				
				// Setup sliders for membrane dimensions
				this.control.addSlider('membrane_width_slider','Membrane Width', 10,100,30,width-200,50);
				this.control.addSlider('membrane_num_slider','Number Of Rects', 2,20,10,width-200,80);
				this.control.addSlider('membrane_gap_slider','Gap Between Rects', 1,100,55,width-200,110);
				
				// set water and salt sliders for either side
				// water and salt sliders for right hand side
				this.control.addSlider('water_right_slider','Water Number Right', 0,150,0,width-200,height-150);
				this.control.addSlider('salt_right_slider','Salt Number Right', 0,40,0,width-200,height-100);
			
				// water and salt particles for left hand side
				this.control.addSlider('water_left_slider','Water Number Left', 0,150,0,100,height-150);
				this.control.addSlider('salt_left_slider','Salt Number Left', 0,40,0,100,height-100);
				
				
				this.control.addSlider('attractive_force','Attractive Force', 0,10000,1500,100,height-50);
				
				break;
			case 'default':
				// if the default model is loaded
				// set water and salt sliders for either side
				// water and salt sliders for right hand side
				this.control.addSlider('water_right_slider','Water Number Right', 0,150,0,width-200,height-150);
				this.control.addSlider('salt_right_slider','Salt Number Right', 0,40,0,width-200,height-100);
			
				// water and salt particles for left hand side
				this.control.addSlider('water_left_slider','Water Number Left', 0,150,0,100,height-150);
				this.control.addSlider('salt_left_slider','Salt Number Left', 0,40,0,100,height-100);
				break;
					
		}
		
		// add return to menu and reset buttons
		
		this.control.addButton('menu_button', 'Menu',load_menu, 300,height-150);
		this.control.addButton('reset_button', 'Reset',reset, 300,height-100);
		
		
		
	}
	
	
	updateSliders()
	{
		// Edit micro model to utilise particles
		let num = this.control.getDiff('salt_left_slider');
		// Always check if the slider exists before trying to use the value
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
		
		// Update salt and water mass so slow function is not called a lot.
		
		let mass =this.control.getVal('water_mass_slider');
		if (mass != null)
			Water.sMass = mass;

		mass =this.control.getVal('salt_mass_slider');
		if (mass != null)
			Salt.sMass = mass;
		mass =this.control.getVal('attractive_force');
		if (mass != null)
			Particle.attractive_force = mass;
	}
	
	// Draws the particle count on the screen
	drawText()
	{
		// Big O complexity of n, which is fine as computation is low
		let left_water =0;
		let left_salt =0;
		let right_water =0;
		let right_salt=0;
		for (const p of this.particles)
		{
			if (p.posX<width/2)
			{
				// if the particles are on the left hand side
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
		// Update mass of particles and add particles
		this.updateSliders();
		
		if (!this.paused)
		{
			// Perform collisions between each particle
			// Big O Complexity of n^2
			for (const a of this.particles)
			{
				for (const b of this.particles)
				{
					if (a != b)
					{
						a.collide(b);
					}
				}
				// Check collisions with membrane 
				this.membrane.collide(a);
				
				// Update particle's position
				a.update();
			}
		}
	}
	// Reset the model
	reset()
	{
		// Remove all particles
		let len = this.particles.length;
		for (let i=0; i<len;i++)
		{
			this.particles.pop();
		}
		
	}
	
	draw()
	{
	// Draw each particle in particles
		for (const p of this.particles)
		{
			p.draw();
		}
	// Draw membrane
		this.membrane.draw();
		
	// Draw text for sliders
		this.control.draw();
		
	// Draw text for particle count
		this.drawText();

		fill(0);
		textAlign(LEFT);
		textSize(20);
		text('Press "P" to pause the model', 100, height-200);
		text('Press "T" to display particle speed', 100, height-180);
		
	}
	
	
}
// The button to reset membrane needs to be globally defined, so this function has undefined behaviour if called in the macro model.
// (model.membrane is not defined)
function load_membrane()
{
	model.membrane = new Membrane(
		model.control.getVal('membrane_num_slider'),
		model.control.getVal('membrane_gap_slider'),
		model.control.getVal('membrane_width_slider'),
	);
}

function reset_membrane()
{
	model.membrane = new Membrane(
		10,
		55,
		10,
	);
}

// For these it is required as models need to be loaded from outside the model, at least in this paradigm.


// To load a different state of Micro, the model must be cleared (remove all gui items) and then the new model must be loaded
// This is important in the case of changing from the advanced mode to the simple mode where sliders may remain.
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
	model = new Micro('default');
}
function load_advmicro()
{
	model.clear();
	model = new Micro('advanced');
}

