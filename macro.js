
class Macro extends Model{
	constructor(type){
		// call Model.constructor()
		super();
		// A macro model has a list of particles and a list of Membranes, as well as an image that gets updated every frame
		this.particles = [];
		this.membranes=[];
		this.draw_particles = false;
		this.draw_membrane = false;
		this.is_water = true;

		switch (type){
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
		this.control.addButton('menu_button',"Menu",load_menu, 100,200);
		// reset the model-> remove all particles
		this.control.addButton('reset_button',"Reset", reset, 100,100);
		// add a scale slider to edit the visuals/ make program run faster
		this.control.addSlider('scale_slider', 'Scale Slider',0,4,2,100,50);

		this.control.addSlider('drawing_radius', 'Drawing Slider',20,50,30,300,50);

		this.control.addButton('toggle_type', ' Toggle Type', macro_toggle_type, 300, 100);
		this.control.addButton('add_particles', 'Add Particles', macro_add_particles ,300,70 );

		// this is not working properly
		this.control.addButton('add_membrane', 'Add Membrane', macro_add_membrane, 500, 70);
		this.control.addSlider('draw_membrane_radius', 'Membrane Radius',100,300,150,500,50);

	}
	
	draw(){
		// get scale value from slider
		let scale = pow(2,this.control.getVal('scale_slider'));
		
		let img = createImage(round(width/scale),round(height/scale));
		// load pixels from created image
		img.loadPixels();
		//Set Image to White
		for (let x = 0; x < img.width; x++) {
			for (let y = 0; y < img.height; y++) {
				let index = (x+y*img.width)*4;
				
				img.pixels[index]=255;
				img.pixels[index+1]=255;
				img.pixels[index+2]=255;
				img.pixels[index+3]=255;
			}
		}
		// draw particles
		for (const p of this.particles){

			let index = round( round(p.posX/scale) + round(p.posY/scale) * (width/scale) )*4;
			
			// 0 is red, 1 is green, 2 is blue, 3 is alpha
			
			let temp = index%4;
			// find black pixel for that index of pixel
			index = index-temp;
			// change different rgb value for type of particle
			if(p.type=='w'){
				img.pixels[index+0]-= 255/pow(scale,2);
				img.pixels[index+1]-= 255/pow(scale,2);
			}
			else if(p.type=='s'){
				img.pixels[index+1]-= 255/pow(scale,2);
				img.pixels[index+2]-= 255/pow(scale,2);
			}
			// default red colour
			else{
				img.pixels[index+1]-= 255/pow(scale,2);
				img.pixels[index+2]-= 255/pow(scale,2);
			}
			// test
			//circle(p.posX, p.posY, 1);
		}
		// update the pixels to the image I just loaded
		img.updatePixels();
		image(img, 0,0,width,height);
		for (const m of this.membranes){
			m.draw();
		}
		this.control.draw();
	}
	
	update(){
		if (this.draw_particles && mouseIsPressed){
			// get currently used particles
			let rad = this.control.getVal('drawing_radius');
			let num = pow(rad, 2);
			
			for (let i=0; i<num; i++){
				let p;
				if (this.is_water){
					p = new Water(mouseX + random(-rad, rad), mouseY+ random(-rad, rad));
				}
				else{
					p = new Salt(mouseX + random(-rad, rad), mouseY+ random(-rad, rad));
				}
				
				p.setRandVel(2);
				this.particles.push(p);
			}
		}
		if (this.draw_membrane && this.control.mouseReleased){
			let rad = this.control.getVal('draw_membrane_radius');
			this.membranes.push(new CircularMembrane(mouseX, mouseY, rad, 5));
			this.draw_membrane = false;
			
		}
	// imitate collitions
		if (this.particles.length>0){
			let num = int(random(0,this.particles.length/200));
			for (let i=0; i<num;i++){
				const randIndex = int(random(0, this.particles.length));

				this.particles[randIndex].setRandVel(random(1,2));
			}
		}
	// update every particle
		for (const p of this.particles){
			for (const m of this.membranes){
				m.collide(p);
			}
			p.update();
		}
		// update controller to reset whether the mouse is relesed
		// I don't care if the mouse was released the frame before, or ever released
		this.control.update();

	}
	reset(){
		let len = this.particles.length;
		for (let ind=0; ind<len; ind++){
			this.particles.pop();
		}
		len = this.membranes.length;
		for (let ind=0; ind<len; ind++){
			this.membranes.pop();
		}
	}	
}

// functions to be used when pressing drawing
function macro_add_particles(){
	model.draw_particles = !model.draw_particles;
	model.draw_membrane = false;
}
function macro_add_membrane(){
	model.draw_membrane = !model.draw_particles;
	model.draw_particles = false;
}
function macro_toggle_type(){
	model.is_water= !model.is_water;
}
function load_macro_split(){
	model.clear();
	model = new Macro('split');
}

function load_macro(){
	model.clear();
	model = new Macro();
}


