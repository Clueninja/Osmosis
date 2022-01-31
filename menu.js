// Object that is a type of model since it contains gui elements

class Menu extends Model
{
	constructor()
	{
		super();
		
		// Add the buttons so the user can control which model to be loaded
		let s=100;
		let g = 25;
		this.control.addButton('micro_model',"Micro Model",load_micro, 100,s);
		this.control.addButton('isotonic',"Load Isotonic Solution",load_iso, 100,s+g);
		this.control.addButton('hypotonic',"Load Hypotonic Solution",load_hypo, 100,s+2*g);
		this.control.addButton('hypertonic',"Load Hypertonic Solution",load_hyper, 100,s+3*g);
		this.control.addButton('ad_micro_model',"Advanced Micro Model",load_advmicro, 100,s+4*g);

		
		this.control.addButton('macro_model',"Choose Macro Model",load_macro,100,s+6*g);
		this.control.addButton('macro_model_split',"Split Macro Model",load_macro_split,100,s+7*g);
	}
	
}


function load_menu()
{
	model.clear();
	model = new Menu();
}

