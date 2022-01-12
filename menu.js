// Object that is a type of model since it contains gui elements

class Menu extends Model{
	constructor(){
		super();
		
		// Add the buttons so the user can control which model to be loaded

		this.control.addButton('micro_model',"Micro Model",load_micro, 100,100);
		this.control.addButton('isotonic',"Load Isotonic Solution",load_iso, 100,120);
		this.control.addButton('hypotonic',"Load Hypotonic Solution",load_hypo, 100,140);
		this.control.addButton('hypertonic',"Load Hypertonic Solution",load_hyper, 100,160);
		this.control.addButton('ad_micro_model',"Advanced Micro Model",load_advmicro, 100,180);

		
		this.control.addButton('macro_model',"Choose Macro Model",load_macro,100,220);
		this.control.addButton('macro_model_split',"Split Macro Model",load_macro_split,100,240);
	}
	
}


function load_menu(){
	model.clear();
	model = new Menu();
}

