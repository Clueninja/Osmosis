
// Another way to do this project without this kind of management would be to create different pages with its own program to run.
// So menu.html contains html buttons that redirect you to the micro.html webpage. An issue with this is that it would be more difficult to pass in arguements
// to set the layout of the micro model.


// object that stores the id and p5.slider of a slider
// this is useful since a list of p5 sliders cannot distinguish between each of them
// hence I would have to define each slider as a variable in the model which would be a pain to manage
class slider
{
	constructor(id, string, min,max,def,x, y)
	{
		this.id =id; this.string = string; this.posX=x; this.posY=y;
		
		this.slider = createSlider(min,max,def);
		this.slider.position(x,y);
		this.prevalue = def;
	}
	value()
	{
		this.prevalue = this.slider.value();
		return this.prevalue;
	}
	// Returns the displacement from its previous value.
	// Old value gets changed once called ie only use once!
	diff()
	{
		let temp = this.prevalue;
		this.prevalue = this.slider.value();
		return this.prevalue-temp;
	}
}

// GUI element button class that stores an id, and a p5 button
// Makes gui management easier
class button
{
	constructor(id, string,func, x,y)
	{
		this.id = id;
		this.button = createButton(string);
		this.button.position(x,y);
		this.button.mousePressed(func);
	}
}

// Controller used to store GUI elements
class controller
{
	constructor()
	{
		// lists of slider and button objects
		this.sliders=[];
		this.buttons=[];
	}
	draw()
	{
		// atm only needs to update the sliders to display the text
		fill('black');
		textSize(12);
		for (const s of this.sliders)
		{
			text(s.string,s.posX,s.posY-8,120);
			text(s.slider.value(),s.posX+140,s.posY,10);
		}
	}
	
	// these functions should only be called once per frame due to inefficiencies, could use hashtables or any other better list type like Binary tree, set etc
	getVal(id)
	{
		for (const s of this.sliders)
		{
			if (s.id ==id)
				return s.value()
		}
		return null;
	}
	
	getDiff(id)
	{
		for (const s of this.sliders)
		{
			if (s.id ==id)
				return s.diff()
		}
		return null;
	}
	// DEPRECIATED not needed anymore since I pass in functions
	getPressed(id)
	{
		for (const b of this.buttons)
		{
			if (b.id ==id)
				return b.value()
		}
		return null;
	}
	// functions to create a new Slider and button to display onto screen
	addButton(id,string,func, x,y)
	{
		this.buttons.push(new button(id,string,func,x,y));
	}
	
	addSlider(id,string, min,max,def, x,y)
	{
		this.sliders.push(new slider(id,string,min,max,def,x,y));
	}

	// update only here for resetting variables that only apply for one frame
	
	clear()
	{
		for (const s of this.sliders)
		{
			s.slider.remove();
		}
		for (const b of this.buttons)
		{
			b.button.remove();
		}
		this.sliders=[];
		this.buttons=[];
	}

}

// Model has a controller to store GUI elements and virtual functions for inherited models to implement
class Model
{
	constructor()
	{
		this.control = new controller();
		this.paused = false;
	}
	// virtual draw
	draw(){}
	// virtual update
	update(){}
	// virtual reset
	reset(){}
	
	//remove buttons and sliders
	clear(){this.control.clear();}
}
// handle keys being pressed and NOT held
function keyPressed()
{
	if (key == 'p')
	{
		model.paused = !model.paused;
	}
	if (key == 't')
	{
		Particle.drawText = !Particle.drawText;
	}
	// yes
	if (key == 'm' && model instanceof Macro)
	{
		let rad = model.control.getVal('draw_membrane_radius');
		model.membranes.push(new CircularMembrane(mouseX, mouseY, rad, 5));
			
	}
}

