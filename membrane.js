class Rect{
	constructor(x,y,w,h){this.x=x;this.y=y;this.w=w;this.h=h;}
	
	draw(){rect(this.x,this.y,this.w,this.h);}
	
	collide(other){

		/*
		create a larger rectangle
		This means it is easier to calculate since I only need to consider a point and a rectangle rather than a circle and a rectangle
		 _  _____________
		/.\|			|
		\_/|			|
		   |			|
		   |____________|
		   		||
		   _____\/_________
		  |				  | difference in length for all sides is twice the radius
		 .|				  | so the top left corner is posX - radius
		  |				  | width is width + radius*2, same with height
		  |				  |
		  |				  |
		  |_______________| 		
		*/
		let pX=other.posX;
		let pY= other.posY;
		let vY = other.velY;
		let vX = other.velX;
		
		
		let X = this.x-other.mass();
		let Y= this.y-other.mass();
		let W = this.w+other.mass()*2;
		let H = this.h+other.mass()*2;

		// check if the particle is colliding next frame
		if ( pX+vX > X && pX+vX < X + W && pY+vY > Y && pY+vY < Y + H ){
			
			
		
			/*
			l is the fraction of the velocity that causes the particle to hit the edge of the rectangle
			
			
			  (X,Y)	___________________________
					|						  |
					|						  |
					|						  |
					|						  |
					|						  |
			  		|						  |
			  __vX__|______	# (pX+vX,pY+vY)   |
			  |		|	   /|				  |
			  |		|	  /	|				  |
			  |		|  __/	|				  |
			vY|		|   /|	| l*vY			  |
			  | 	|  /	|			      |
			  | 	| /		|				  |
			  | 	|/		|				  |
			  |		#_______|				  |
			  |    /|	l*vX				  |
			  | __/_|_________________________|
			  |  #						 		(X + W, Y + H)
			  | /
			  |/ 
			  #	(pX, pY)
      
      
      
      pX - l * vX = X
	  
	  l = (pX-X) / vX
	  
	  mag l is less than 1 if it was previously outside the rectangle
	  if l is greater than 0 and less than 1 then at some point along the prevous timestep it hit the boundary
	  
	  if l is less than 0 but greater than -1 then during then the particle collided from inside the rectangle
	  
	  Now check if the Y value for this is within the bounds

	  (Y + H) > pY - l * vY and Y < pY - l * vY
	  
	  if it is then 1 is true
	  
	no more need to edit positions as the particle is being checked before it is intersecting


	  
			
			*/
			// check left side
			let l = ((pX-X)/vX);
			
			if ( Y < pY - l * vY && (Y+H) > pY - l * vY && abs(l)<1){
				other.velX *=-1;
			}
			// check right side
			l = ((pX-(X+W))/vX);
			if ( Y < pY - l*vY && (Y+H) > pY - l*vY && abs(l)<1){
				other.velX *=-1;
			}
			// check top
			l = ((pY-Y)/vY);
			if (X < pX - l*vX && (X+W) > pX - l * vX && abs(l)<1) {
				other.velY *=-1;
			}
			// check bottom
			l = ((pY-(Y+H))/vY);
			if( X < pX - l*vX && (X + W) > pX - l*vX && abs(l) < 1){				
				other.velY *=-1;
		
			}
		}
	}
}

class Membrane{
	constructor(num, gap, rect_width){
		// a membrane contains a list of rectangles that the particles can collide with
		this.rects = [];
		// calculate the position and height of each rectangle
		let height_rect = (height-(num-1)*gap)/num;
		if (height_rect>1){
			let tlx=(width/2)-(rect_width/2);
			let tly=0;

			for (let n=0;n<num; n++){
				this.rects[n] = new Rect(tlx, tly, rect_width, height_rect);
				tly= tly + height_rect + gap;
			}
		}
	}
	draw(){
		// draw individual rectangles
		fill('purple');
		for (const r of this.rects){
			r.draw();
		}
	}
	
	// membrane collides with particle
	collide(other){
		for (const r of this.rects){
			r.collide(other);
		}
	}
}



class CircularMembrane{
	constructor(x,y, rad, edge){this.x=x;this.y=y,this.rad=rad; this.edge= edge;}
	
	draw(){fill(color(0,0,0,0));strokeWeight(this.edge);circle(this.x, this.y, this.rad*2);}
	
	reflect(other){
		let pX=other.posX; let pY=other.posY;
		let vY = other.velY; let vX = other.velX;
		// create normal vector from the centre of the circle to the particle
		// then reflect along this vector 
		let nX=pX-this.x;
		let nY=pY-this.y;
		
		// r = d - 2* (d dot n) n
		// where n is the normal vector to the surface normalised and d is the vector of incidence
		
		// normalise normal
		let ndis = sqrt(pow(nX, 2) + pow(nY, 2));
		
		nX = nX/ndis;
		nY = nY/ndis;
	
		
		other.velX = vX - 2 * (nX*vX + vY*nY) * nX;
		other.velY = vY - 2 * (nX*vX + vY*nY) * nY;
		

	}
	
	collide(other){
		let pX=other.posX; let pY=other.posY;
		let vY = other.velY; let vX = other.velX;
		// if particle is inside membrane edge
		let is_inside = pow(pX-this.x,2) + pow(pY-this.y,2) < pow(this.rad,2);

		let is_inside_next_frame = pow(pX+vX-this.x,2) + pow(pY+vY-this.y,2) < pow(this.rad,2);

		if((is_inside && !is_inside_next_frame) ||(!is_inside && is_inside_next_frame)){
		// if the partcle is water
			if (other.type == 'w'){
				// then there is a probability of passing through the membrane
				// if the particle is reflected
				if (int(random(0,10))!=1){
					this.reflect(other);
				}
			}
			else if (other.type == 's'){
				// always reflect salt particles
				this.reflect(other);
			
			}
			
		}
	}
}



