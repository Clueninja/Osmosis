
// object that stores the id and p5.slider of a slider
// this is useful since a list of p5 sliders cannot distinguish between each of them
// hence I would have to define each slider as a variable in the model which would be a pain to manage
class slider{
	constructor(id, string, min,max,def,x, y){
		this.id =id; this.string = string; this.posX=x; this.posY=y;
		
		this.slider = createSlider(min,max,def);
		this.slider.position(x,y);
		this.prevalue = def;
	}
	value(){
		this.prevalue = this.slider.value();
		return this.prevalue;
	}
	// sometimes the value isnt useful on its own so this returns the displacement from its previous value so the old value doesn't have to be stored
	diff(){
		let temp = this.prevalue;
		this.prevalue = this.slider.value();
		return this.prevalue-temp;}
}
// gui element button class that stores an id, and a p5 button
// Makes gui management easier

class button{
	constructor(id, string,func, x,y){
		this.id = id;
		this.button = createButton(string);
		this.button.position(x,y);
		this.button.mousePressed(func);
	}
}
// controller contains sliders and buttons and methods to retreive values
class controller{
	constructor(){
		// lists of slider and button objects
		this.sliders=[];
		this.buttons=[];

	}
	draw(){
		// atm only needs to update the sliders to display the text
		
		fill('black');
		textAlign(CENTER);
		textSize(12);
		for (const s of this.sliders){
			text(s.string,s.posX,s.posY-8,120);
			text(s.slider.value(),s.posX+140,s.posY,10);
		}
	}
	
	// these functions should only be called once per frame due to inefficiencies, could use hashtables or any other better list type like Binary tree, set etc
	getVal(id){
		for (const s of this.sliders){
			if (s.id ==id)
				return s.value()
		}
		return null;
	}
	
	getDiff(id){
		for (const s of this.sliders){
			if (s.id ==id)
				return s.diff()
		}
		return null;
	}
	// DEPRECIATED not needed anymore since I pass in functions
	getPressed(id){
		for (const b of this.buttons){
			if (b.id ==id)
				return b.value()
		}
		return null;
	}
	// functions to create a new Slider and button to display onto screen
	addButton(id,string,func, x,y){this.buttons.push(new button(id,string,func,x,y));}
	
	addSlider(id,string, min,max,def, x,y){this.sliders.push(new slider(id,string,min,max,def,x,y));}

	// update only here for resetting variables that only apply for one frame
	
	clear(){
		for (const s of this.sliders){
			s.slider.remove();
		}
		for (const b of this.buttons){
			b.button.remove();
		}
		this.sliders=[];
		this.buttons=[];
	}

}

// a model contains a button/slider controller and basic functions for compatability
class Model{
	constructor(){
		this.control = new controller();
		this.paused = false;
	}
	// virtual draw
	draw(){}
	// virtual update
	update(){}
	// virtual reset
	reset(){}

	// virtual pause
	
	//remove buttons and sliders
	clear(){this.control.clear();}
}

function keyPressed(){
	if (key == 'p'){
		model.paused = !model.paused;
	}
}

