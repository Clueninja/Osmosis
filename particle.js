
// Particle is an abstract class
// It is only used as a building block to make Water and Salt Particles
// No Instance of a particle should occur
class Particle
{
    static drawText = false;
    static max_Vel = 20;
    static min_Vel = 10;
	constructor(posX, posY)
	{
		// every particle has position and velocity as well as a type and mass
		this.posX=posX;
		this.posY=posY;
		this.velX=0;
		this.velY=0;
		this.forceX =0;
		this.forceY=0;
		this.type='p';
	}
	// to be overwritten by inherited particles
	mass(){ return 10;}
	charge(){return 0;}
	
	// setter function for velocity
	setVel(x,y)
	{
		this.velX=x;
		this.velY=y;
	}
	// set random velocity with magnitude speed
	setRandVel()
	{
		let speed = random(Particle.min_Vel, Particle.max_Vel);
		let theta = random(0,360);
		this.velX=speed*cos(theta);
		this.velY=speed*sin(theta);
	}
	
	// used to add many particles at a time
	static addParticles(type,num,side,list)
	{
        // If the number of particles is being increased
		if (num>0)
		{
		    // for each particle to be added...
			for (let pind=0;pind<int(num);pind++)
			{
				let p;
				let posX,posY;
				// top and bottom quadrants do not need to be checked
				// set x postion depending on the side of the membrane
				switch (side)
				{
					// TODO: fix bug if mass > 30
					case 'l': 
						posX = random(0,width/2-100); break;
					case 'r':
						posX = random(width/2+100,width-30); break;
					default:
						posX = random(100,width);
				}
				// set type of the particle depending on the type parameter
				switch (type)
				{
					case 's':
						posY = random(Salt.sMass, height-Salt.sMass);
						p = new Salt(posX,posY);
						break;
					case 'w':
						posY = random(Water.sMass, height-Water.sMass);
						p = new Water(posX,posY);
						break;
					default:
						p = new Particle(posX,posY);
				}
				// set the particle to a random velocity
				p.setRandVel();
				// push the new particle to the list passed in by reference so it is added
				list.push(p);
			}
		}
		else{
			//remove salt and water from one side
			// for each particle to be removed
			let n=0;let i=0;
			// while the number of particles removed is less than the number of particles to be removed and the index of particle is less than the total number of particles
			while(n<-num && i<list.length)
			{
				// get the particle at the index
				let p = list[i];
				// check if it is in the correct area of the screen

				let onside=false;
				if (side =='l' &&(p.posX)<width/2)
					onside = true;
				if (side =='r' &&(p.posX)>width/2)
					onside = true;


				if ( onside && type == p.type){
				// remove the particle from the simulation
					list.splice(i,1);
				// the number of particles removed is incremented
					n++;
				// quick fix for skipping a particle
					i--;

				}

				i++;
			}
		}
	}
	
	
	draw()
	{
	    circle(this.posX, this.posY, 2*this.mass());
	    if (Particle.drawText)
	    {
	        fill(0);
		    textAlign(LEFT);
		    textSize(20);
		    text(round(pow(pow(this.velX,2)+pow(this.velY,2), 1/2), 2), this.posX, this.posY);
	    }
	}
	update_force()
	{
	    this.velX+=this.forceX;
		this.velY+=this.forceY;
		this.forceX=0;
		this.forceY=0;
	}
	update()
	{
		// checks if the particle's position next frame will be out of bounds
		if (this.posX + this.velX*deltaTime/100< this.mass())
			this.velX *= -1;

		if (this.posX + this.velX*deltaTime/100 > width-this.mass())
			this.velX *= -1;

		
		if (this.posY + this.velX*deltaTime/100 < this.mass())
			this.velY *= -1;
		
		if (this.posY + this.velY*deltaTime/100 > height-this.mass())
			this.velY *= -1;
		
		// check if the particle is intersecting with the wall in the current frame
		// should only happen if the particle is intersecting at creation or a collision with another particle moved it into the wall
		
		if (this.posX<this.mass())
			this.posX= this.mass();
		
		if (this.posX > width-this.mass())
			this.posX = width-this.mass();
		
		if (this.posY<this.mass())
			this.posY= this.mass();
		
		if (this.posY> height-this.mass())
			this.posY = height-this.mass();
		
		this.posX += this.velX*deltaTime/100;
		this.posY += this.velY*deltaTime/100;
		
	}
	
	apply_forces(other)
	{
		let dis_sqrd = pow(this.posX-other.posX,2)+pow(this.posY-other.posY,2);
	    let multiplier = attractive_constant * (other.charge() * this.charge())/dis_sqrd;
        let nX = (other.posX-this.posX)/sqrt(dis_sqrd);
        let nY = (other.posY-this.posY)/sqrt(dis_sqrd);
        this.forceX -= nX * multiplier / this.mass();
        this.forceY -= nY * multiplier / this.mass();
	}
	
	// particle collide with particle
	// membrane.collide handles collisions between particles and membranes
	
	collide(other)
	{
		
		let dis_sqrd = pow(this.posX-other.posX,2)+pow(this.posY-other.posY,2);
		
		// if next frame, the particles are colliding
		// minimal computation if the particles are not colliding
		if ( pow(this.posX+this.velX*deltaTime/100 - other.posX-other.velX*deltaTime/100,2) + pow(this.posY+this.velX*deltaTime/100-other.posY-other.velY*deltaTime/100,2) < pow(this.mass()+other.mass(),2))
		{
			
			let mag_vel = sqrt(pow(this.velX,2)+pow(this.velY,2));
			
			let dot = (this.velX-other.velX) * (this.posX-other.posX) + (this.velY-other.velY) * (this.posY-other.posY); // dot product of velocities and position vectors
			
			let this_mass_dd = ((2*other.mass())/(this.mass()+other.mass())) * (dot/dis_sqrd); // mass fraction multiplied by (dot product divided by displacement squared)
			
			let other_mass_dd=((2*this.mass())/(this.mass()+other.mass())) * (dot/dis_sqrd); // same as above but slightly different mass fraction
			
			this.velX = this.velX - this_mass_dd * (this.posX-other.posX);
			this.velY = this.velY - this_mass_dd * (this.posY-other.posY);
			
			
			other.velX = other.velX - other_mass_dd * (other.posX-this.posX);
			other.velY = other.velY - other_mass_dd * (other.posY-this.posY);

			// I dont need to calculate new positions if the particles aren't intersecting
			// If the particles are intersecting (they spawned colliding), then move the particles away from each other
			if ( pow(this.posX-other.posX,2)+pow(this.posY-other.posY,2) < pow(this.mass()+other.mass(),2))
			{
				// sort out position stuff
				// find distance one particle has to be moved
				let distance_to_be_moved = ((this.mass()+other.mass())-sqrt(dis_sqrd))/2;
				let thisposX = this.posX; let thisposY = this.posY; let otherposX = other.posX; let otherposY = other.posY;
				
				// do stuff figured out using maths
				this.posX = distance_to_be_moved * (thisposX-otherposX)/sqrt(dis_sqrd) +thisposX;
				this.posY = distance_to_be_moved * (thisposY-otherposY)/sqrt(dis_sqrd)+thisposY;
				
				other.posX = distance_to_be_moved * (otherposX-thisposX)/sqrt(dis_sqrd) +otherposX;
				other.posY = distance_to_be_moved * (otherposY-thisposY)/sqrt(dis_sqrd)+otherposY;
			}
		}
		
		
	}
}
// statically defined mass makes sense since all water particles have the same size/mass
// the main difference is different mass variables and colour/draw methods
class Water extends Particle
{
	static sMass=5;
	static sCharge=-1;
	constructor(posX,posY)
	{
		super(posX,posY);
		this.type='w';
	}
	mass(){return Water.sMass;}
	charge(){return Water.sCharge;}
	// draw blue circle
	draw()
	{
		fill('blue');
		strokeWeight(2);
		super.draw();
	}
}
class Salt extends Particle
{
	static sMass=30;
	static sCharge = 6;
	constructor(posX,posY)
	{
		super(posX,posY);
		this.type='s';
	}
	mass(){return Salt.sMass;}
	charge(){return Salt.sCharge;}
	// draw red circle
	draw()
	{
		fill('red');
		strokeWeight(2);
		super.draw();
	}
}
