class Car
{
    constructor(x, y, w, h, controlType, maxSpeed = 400)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.speed = 0;
        this.acceleration = 4;
        this.maxSpeed = maxSpeed;
        this.friction = 0.5;
        this.angle = 0;
        this.damaged = false;

        this.useBrain = controlType == "AI";

        if(controlType != "DUMMY")
        {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        }
        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic, delta)
    {
        if(!this.damaged)
        {
            this.#move(delta);
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }

        if(this.sensor)
        {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(s => s == null ? 0 : 1 - s.offset);
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);

            if(this.useBrain)
            {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    #assessDamage(roadBorders, traffic)
    {
        for(let i = 0; i < roadBorders.length; i++)
        {
            if(polysIntersect(this.polygon, roadBorders[i]))
            {
                return true;
            }
        }

        for(let i = 0; i < traffic.length; i++)
        {
            if(polysIntersect(this.polygon, traffic[i].polygon))
            {
                return true;
            }
        }

        return false;
    }

    #createPolygon()
    {
        const points = [];
        const rad = Math.hypot(this.w, this.h)/2;
        const alpha = Math.atan2(this.w, this.h);
        points.push({
            x: this.x  -Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
            });
        points.push({
            x: this.x  -Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
            });
        points.push({
            x: this.x  -Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
            });
        points.push({
            x: this.x  -Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
            });

        return points;
    }

    draw(ctx, color, drawSensor = false)
    {
        if(this.damaged)
        {
            ctx.fillStyle = "black";
        }
        else{
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i = 1; i < this.polygon.length; i++)
        {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if(this.sensor && drawSensor)
        {
            this.sensor.draw(ctx);
        }
    }


    #move(delta)
    {
        //control handler
        if(this.controls.forward)
        {
            this.speed += this.acceleration;
        }
        if(this.controls.reverse)
        {
            this.speed -= this.acceleration;
        }

        //max forward speed cap
        if(this.speed > this.maxSpeed)
        {
            this.speed = this.maxSpeed;
        }
        //max reverse speed cap
        if(this.speed < -this.maxSpeed/2)
        {
            this.speed = -this.maxSpeed/2;
        }

        //If moving forward, subtract friction from speed
        if(this.speed > 0)
        {
            this.speed -= this.friction;
        }
        //If moving in reverse, add friction to speed
        if(this.speed < 0)
        {
            this.speed += this.friction;
        }
        //If speed is within +/- friction, set speed to zero
        if(Math.abs(this.speed) < this.friction)
        {
            this.speed = 0;
        }

        if(this.speed != 0)
        {
            const flip = this.speed > 0 ? 1: -1;

            if(this.controls.left)
            {
                this.angle += 0.03 * flip;
            }
            if(this.controls.right)
            {
                this.angle -= 0.03 * flip;
            }
        }


        this.x -= Math.sin(this.angle) * (this.speed * delta);
        this.y -= Math.cos(this.angle) * (this.speed * delta);
    }
}