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
			  __vX__|______	# (pX,pY)		  |
			  |		|	   /|				  |
			  |		|	  /	|				  |
			  |		|  __/	|				  |
			vY|		|   /|	| l*vY			  |
			  | 	|  /	|			      |
			  | 	| /		|				  |
			  | 	|/		|				  |
  1:X = pX - l* vX  #_______|				  |
			  |    /|	l*vX				  |
			  | __/_|_________________________|
			  |  #	2: Y = pY - l * vY 		(X + W, Y + H)
			  | /
			  |/ 
			  #	(preX, preY) or (pX-vX, pY-vY)
      
      
      
      pX - l * vX = X
	  
	  l = (pX-X) / vX
	  
	  mag l is less than 1 if it was previously outside the rectangle
	  if l is greater than 0 and less than 1 then at some point along the prevous timestep it hit the boundary
	  
	  if l is less than 0 but greater than -1 then during then the particle collided from inside the rectangle
	  
	  Now check if the Y value for this is within the bounds

	  (Y + H) > pY - l * vY and Y < pY - l * vY
	  
	  if it is then 1 is true
	  
	  
	  
			
			*/
			// check left side
			let l = ((pX-X)/vX);
			
			if ( Y < pY - l * vY && (Y+H) > pY - l * vY && abs(l)<1){

				// if approaching from outside the rectangle
				//if (l>0)
				//{
					// reflect along the y axis
					other.posX = X;
					other.velX *=-1;
				//}
				// if approaching from inside the rectangle 
				//else 
				//{
					// move the particle to the other side of the rectangle with a reflected velocity 
					
				//	other.posX = X+W;
				//}
			}
			// check right side
			l = ((pX-(X+W))/vX);
			if ( Y < pY - l*vY && (Y+H) > pY - l*vY && abs(l)<1){
				
				//if (l>0)
				//{
					other.posX = X+W;
					other.velX *=-1;
				//}
				//else 
				//{
					// move the particle to the other side of the rectangle with a reflected velocity 
					
				//	other.posX = X;
				//}
			}
			// check top
			l = ((pY-Y)/vY);
			if (X < pX - l*vX && (X+W) > pX - l * vX && abs(l)<1) {
				
				//if (l>0)
				//{
					other.posY = Y;
					other.velY *=-1;
				//}
				//else 
				//{
					// move the particle to the other side of the rectangle with a reflected velocity 
					
				//	other.posX = Y+H;
				//}
			}
			// check bottom
			l = ((pY-(Y+H))/vY);
			if( X < pX - l*vX && (X + W) > pX - l*vX && abs(l) < 1){				
				
				//if (l>0)
				//{
					other.posY = Y+H;
					other.velY *=-1;
				//}
				//else 
				//{
					// move the particle to the other side of the rectangle with a reflected velocity 
					
				//	other.posX = Y;
				//}
					


			}
			
			
			

		}
	}
}

class Membrane{
	constructor(num, gap, rect_width){
		this.rects = [];
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
		
		//other.posX = this.x - this.rad * nX;
		//other.posY = this.y - this.rad * nY;

	}
	
	collide(other){
		let pX=other.posX; let pY=other.posY;
		let vY = other.velY; let vX = other.velX;
		// if particle is inside membrane edge
		let inside = pow(pX-this.x,2) + pow(pY-this.y,2) < pow(this.rad,2);
		let outside = pow(pX-this.x,2) + pow(pY-this.y,2) > pow(this.rad,2);

		let inside_after = pow(pX+vX-this.x,2) + pow(pY+vY-this.y,2) < pow(this.rad,2);
		let outside_after = pow(pX+vX-this.x,2) + pow(pY+vY-this.y,2) > pow(this.rad,2);

		if((inside && outside_after) ||(outside && inside_after)){
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



