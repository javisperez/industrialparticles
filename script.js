(function(document,window){
    var d=document,
        c=d.getElementById('canvas'),
        cx=c.getContext('2d'),
        pAmount=1000,
        particles=[],
        m=Math,
        mouseX,
        mouseY,
        oldMouseX,
        oldMouseY,
        mvel,
        mouseDown=false,
        alpha=1,
        g=0;


    function makeParticles(amount){
        if(amount > pAmount){
            amount = pAmount;
        }

        while(amount--){
            var p = new particle(mouseX, mouseY);
            g+=0.01

            p.velX = m.cos(g+amount)*2;
            p.velY = m.sin(g+amount)*2;

            p.velX *= mvel * 0.3;
            p.velY *= mvel * 0.3;

            p.dragX *= mvel * (m.random()*0.05);
            p.dragY *= mvel * (m.random()*0.05);

            p.size = 1.5 * mvel;
            p.shrink = 15;
            p.color = '0,0,0';

            particles.push(p);
        }
        while(particles.length > pAmount){
            particles.shift();
        }
    }

    function draw(){

        if(mouseDown) {
            alpha = 0.004;
        } else {
            alpha = 1;
        }

        cx.fillStyle = "rgba(248,246,184,"+alpha+")";
        cx.fillRect(0,0,c.width,c.height);

        makeParticles(16);

        i=particles.length;

        while(i--){
            particles[i].render(cx);

            particles[i].update();
        }
    }

    d.onmousemove =function(e){

        oldMouseX = mouseX;
        oldMouseY = mouseY;

        mouseX = e.pageX;
        mouseY = e.pageY;

        mvel = m.sqrt( m.pow(mouseX - oldMouseX,2) + m.pow(mouseY - oldMouseY, 2) ) * .5;
    }

    d.onmousedown = function(){
        mouseDown = true;
    }

    d.onmouseup = function(){
        mouseDown = false;
    }

    setInterval(draw,30);

    /**
       particle class
    */
    function particle(posX, posY){
        this.size = 1;
        this.shrink = 0;

        this.posX = posX;
        this.posY = posY;

        this.oldX = posX;

        this.oldY = posY;

        this.dragX = 1;
        this.dragY = 1;

        this.velX = 1;
        this.velY = 1;

        this.alpha = 1;
        this.fade  = 0;

        this.gravity = 0;

        this.color = '0,0,0';

        this.floor = 0;
    }

    particle.prototype.update = function(){
        this.oldX = this.posX;
        this.oldY = this.posY;

        this.velX *= this.dragX;
        this.velY *= this.dragY;

        this.posX += this.velX;
        this.posY += this.velY;

        this.velY += this.gravity;

        this.alpha -= this.fade;

        this.size -= this.shrink;

        this.size = Math.max(0, this.size);
    }

    particle.prototype.render = function(context){
        context.fillStyle = "rgba("+this.color+","+Math.max(0, this.alpha)+")";

        context.beginPath();
        //context.arc(this.posX, this.posY, this.size, 0, Math.PI*2, true);
        context.lineWidth = this.size;
        context.moveTo(this.oldX, this.oldY);
        context.lineTo(this.posX, this.posY);
        context.closePath();

        context.stroke();
        context.fill();
    }

    c.width = window.innerWidth;
    c.height = window.innerHeight;
})(document, window);