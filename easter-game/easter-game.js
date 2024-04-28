window.addEventListener( 'load', function(){
	//canvas setup
	const canvas = document.getElementById('canvas_game');
	const ctx = canvas.getContext('2d');

	/*create the size of the board*/
	if( window.innerWidth > 900 ){
		canvas.width = 896; 
	}else{
		canvas.width = canvas.style.width = window.innerWidth;
	}

	canvas.height = canvas.style.height = window.innerHeight;

	/*if the window resized*/ 
	window.addEventListener("resize", function() {
		if( window.innerWidth > 900 ){
			canvas.width = 896; 
		}else{
			canvas.width = canvas.style.width = window.innerWidth;
		}
			
		canvas.height = window.innerHeight;
	});

	let canvasPosition = canvas.getBoundingClientRect();
	let gameOver = false;
	let lastTime = 0;
	let score = 0;
	let life = 3;
	let start = false;
	let place;
				
	const mouse = {
		x: canvas.width,
		y: canvas.height,
		click: false
	};

	class InputHandler{
		constructor(game){
			this.game = game; 
			canvas.addEventListener('mousedown', (e) => {
				start = true;
				mouse.click = true;
				mouse.x = e.x - canvasPosition.left;
				mouse.y = e.y - canvasPosition.top;
			});

			canvas.addEventListener('mousemove', function (e) {

				mouse.x = e.x  - canvasPosition.left;
				mouse.y = e.y - canvasPosition.top;
				place = change_dn( mouse.x );
				
			});

			canvas.addEventListener('touchmove', function (event) {

				mouse.x = event.changedTouches[0].pageX - canvasPosition.left;
				mouse.y = event.changedTouches[0].pageY - canvasPosition.top;;
			    place = change_dn( mouse.x );

			});		
		}
		
	}

	   
	function change_dn( position ){
				if ( position  > 195 ){ //right w.r.t mouse down position
						return 'right';
				} else if ( position  < 165 ) {
						return 'left';
				}else{
						return 'center';
				}
			}
	
	
	

	class Player{

		constructor(game){
			this.game = game;
			this.x = canvas.width/2;
			this.y = canvas.height/2;
			this.radius = 30;
			this.angle = 10;
		} 
		update(){
			const dx = this.x - mouse.x;
			const dy = this.y - mouse.y;

			if(mouse.x != this.x){
				this.x-= dx/10;
			}
			if(mouse.y != this.y){
				this.y-= dy/10;
			}
		}
		
		draw(context){

			if(mouse.click){
				context.lineWidth = 0.9;			
				context.moveTo(this.x, this.y);		
			}

			context.beginPath();
			//context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			if( life === 3  && place === 'center'){
				context.drawImage(document.getElementById("dn1_fornt"), this.x, this.y, 80, 80);
			}else if( life === 3 && place === 'left'){
				context.drawImage(document.getElementById("dn1_left"), this.x, this.y, 80, 80);	
			}else if( life === 3 && place === 'right'){
				context.drawImage(document.getElementById("dn1_right"), this.x, this.y, 80, 80);	
			}else if( life === 2  && place === 'center'){
				context.drawImage(document.getElementById("dn3_fornt"), this.x, this.y, 80, 80);	
			}else if( life === 2  && place === 'left'){
				context.drawImage(document.getElementById("dn2_left"), this.x, this.y, 80, 80);	
			}else if( life === 2  && place === 'right'){
				context.drawImage(document.getElementById("dn2_right"), this.x, this.y, 80, 80);	
			}else if( life === 1  && place === 'center'){
				context.drawImage(document.getElementById("dn4_fornt"), this.x, this.y, 80, 80);	
			}else if( life === 1  && place === 'left'){
				context.drawImage(document.getElementById("dn3_left"), this.x, this.y, 80, 80);	
			}else if( life === 1  && place === 'right'){
				context.drawImage(document.getElementById("dn3_right"), this.x, this.y, 80, 80);	
			}
				
			context.fill();
			context.closePath();	
		}
	}


	class Eggs{
		constructor(game){
			this.game = game;
			this.x = 0;
			this.radius = 30;
			this.y = Math.random() * this.game.width;
			this.speedx = Math.random() * 5 + 2;
			this.markedForDeletion = false;
			//from html file get random gifts
			this.image_gifts = document.getElementById("gift"+ Math.floor(Math.random() * (5 - 1 + 1) + 1));			
		}
		update(){
			this.y += this.speedx;
			const dx_c = this.x - this.game.player.x;
			const dy_c = this.y - this.game.player.y;
			this.distance = Math.sqrt(dx_c*dx_c + dy_c*dy_c);
			
			if( this.y + this.x < 0 ){
				this.markedForDeletion = true;
			} 
		}
		draw(context){
			context.beginPath();
			context.drawImage(this.image_gifts, this.x, this.y, this.width, this.height);
			context.closePath();
		}
	}

	class Egg_first extends Eggs{
		constructor(game){
			super(game);
			this.y = 0;
			this.width = this.image_gifts.width/8;
			this.height = this.image_gifts.height/8;
			this.x = Math.random() * (this.game.width * 0.9 - this.width);
		}
	}

	class Enemy{
		constructor(game){
			this.game = game;
			this.x = 0;
			this.y = Math.random() * this.game.width;
			this.radius = 30;
			this.speedx = Math.random() * 3 + 2;
			this.markedForDeletion = false;
			this.image = document.getElementById("bad_egg");
		}
		update(){
			this.y += this.speedx;
			const dx = this.x - this.game.player.x;
			const dy = this.y - this.game.player.y;
			this.distance = Math.sqrt(dx*dx + dy*dy);
			if( this.y + this.x < 0 ){
				this.markedForDeletion = true;
			} 
		}
		draw(context){
			context.fillStyle = "white";			
			context.beginPath();
			/*Create a circle*/
			context.drawImage(this.image, this.x, this.y, this.width, this.height);
			context.closePath();
		}
	}

	class Enemy_first extends Enemy{
		constructor(game){
			super(game);
			this.width = this.image.width/8;
			this.height = this.image.height/8;
			this.y = 0;
			this.x = Math.random() * (this.game.width * 0.9 - this.width);
		}
	}

	class Layer {
		constructor(game, image, speedMod){
			this.game = game;
			this.image = image;
			this.speedMod = speedMod;
			this.width = canvas.width;
			this.height = 1000;
			this.x = 0;
			this.y = 0;
		}
		update(){
			if(this.y <= -this.height) this.y = 0;
			this.y -= this.game.speed * this.speedMod;
		}
		draw(context){
			context.drawImage( this.image, this.x, this.y, this.width, this.height );
			context.drawImage( this.image, this.x, this.y + this.height, this.width, this.height );

			// overlay
			context.fillStyle = 'rgb(255 255 255 / 15%)';
			context.fillRect(0, 0, canvas.width, this.height);

		}
	}

	class Background{	
		constructor(game){
			this.game = game;
			this.image1 = document.getElementById("layer1");

			this.layer1 = new Layer(this.game, this.image1, 4);

			this.layers = [this.layer1];
		}
		update(){
			this.layers.forEach(layer => layer.update());			
		}
		draw(context){
			this.layers.forEach(layer => layer.draw(context));
		}
	}

  

	class Game{
		constructor(width, height){
			this.width = width;
			this.height = height;
			this.background = new Background(this);
			this.image_start = document.getElementById("start");
			this.image_end = document.getElementById("gameover");
			this.lifes = document.getElementById("life");
			this.gifts = document.getElementById("gift8");
			/*player change when a snowball collect*/
			this.player = new Player(this);
			this.input = new InputHandler(this);			
			/*eggs*/
			this.eggs = [];
			this.eggTimer = 0;
			this.eggInterval = 1500;
			/*snowball*/
			this.enemies = [];
			this.enemyTimer = 0;
			this.enemyInterval = 3500;
			this.speed = 1;		
		}
		update(deltaTime){
			
			this.background.update();
			
			if( start === true && gameOver != true ){
				
				this.player.update();						
				this.eggs.forEach(egg => { 
				egg.update(); 
				
				if(this.checkCollision_score(this.player, egg)){
					egg.markedForDeletion = true;
					/*Dif*/
						if(score > 5 ){							
							this.enemyInterval = 2500;
							this.background.layer1.speedMod = 5;
						}else if(score > 10 ){
							this.background.layer1.speedMod = 8;
							this.enemyInterval = 1500;
						}
					}
				});
				this.eggs = this.eggs.filter(egg => !egg.markedForDeletion);
					
				if(this.eggTimer > this.eggInterval && !gameOver){
					this.addEggs();
					this.eggTimer = 0;
				}else{
					this.eggTimer += deltaTime;
				}

				this.enemies.forEach(enemy => { 
					enemy.update(); 
					if(this.checkCollision_life(this.player, enemy)){
						enemy.markedForDeletion = true;
					}
				});

				this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
					
				if(this.enemyTimer > this.enemyInterval && !gameOver){
					this.addEnemy();
					this.enemyTimer = 0;
				}else{
					this.enemyTimer += deltaTime;
				}
			}			
			if( gameOver == true ){
				
				canvas.addEventListener('click', gameOverEvent);		
			}

			function gameOverEvent(e) {
				mouse.x = e.x - canvasPosition.left;
				mouse.y = e.y - canvasPosition.top;
				
				if( ( mouse.x > (canvas.width / 2) - 131 &&  mouse.x < (canvas.width / 2) + 131 ) && ((canvas.height / 2) + 166 < mouse.y &&  mouse.y < (canvas.height / 2) + 216) && gameOver == true){										
					start = false,	gameOver = false;
					life = 3;
					score = 0;
					/*eggs*/
					this.eggs = [];
					/*egg*/
					this.enemies = [];
				}
			}
		}

		

		draw(context){
			this.background.draw(context);
			if( start === false && !gameOver){				
				context.drawImage(this.image_start, (canvas.width - 265 ) / 2 , (canvas.height - 428 ) / 2, this.image_start.width/4, this.image_start.height/4);
			}else if(!gameOver){
				this.player.draw(context);			
				this.eggs.forEach(egg =>{ 
					egg.draw(context);
				});
				this.enemies.forEach(enemy =>{ 
					enemy.draw(context);
				});
			}			
		}

		addEggs(){
			this.eggs.push(new Egg_first(this));
		}

		addEnemy(){
			this.enemies.push(new Enemy_first(this));
		}

		checkCollision_score (play, egg) {
			if(egg.distance < egg.radius + play.radius){
				score++;
				return true;
			}
			else{
				return false;
			}
		}

		checkCollision_life (play, badegg) {
			if(badegg.distance < badegg.radius + play.radius){
				if(life === 1){
					/*Game over*/
					gameOver = true;		
				}
				life--;
				return true;
			}
			else{
				return false;
			}
		}

		
	}
	
	const game = new Game(canvas.width, canvas.height);

	function drawGameOver() {
		image_end = document.getElementById("gameover");
		game.draw(ctx);
		game.update();
		ctx.beginPath()
		ctx.drawImage(this.image_end,  (canvas.width - 265 ) / 2 , (canvas.height - 428 ) / 2, this.image_end.width/4, this.image_end.height/4);
		ctx.font = '100px Comfortaa';
		ctx.fillStyle = 'white';
		ctx.textAlign = "center";
		ctx.fillText(score, canvas.width / 2 , (canvas.height / 2 ) + 90, 500);	
		start = false;
	}

	//loop for animation
	function animate(timeStamp){

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if ( gameOver === true ) {

			drawGameOver();	

		} else {

			const deltaTime = timeStamp - lastTime;
			lastTime = timeStamp;
			
			game.update(deltaTime);
			game.draw(ctx);

			ctx.beginPath();
			ctx.font = '50px Open Sans';
			ctx.fillStyle = 'white';
			
			ctx.drawImage(game.gifts, canvas.width - 95, canvas.height - 95, 90, 90);	
			ctx.textAlign = "center";
			ctx.fillText(score, canvas.width - 50 , canvas.height - 10);
			
			if(life === 3){				
				ctx.drawImage(game.lifes, 10, canvas.height - 90 , game.lifes.width/18, game.lifes.height/18);
				ctx.drawImage(game.lifes, 65, canvas.height - 90, game.lifes.width/18, game.lifes.height/18);
				ctx.drawImage(game.lifes, 120, canvas.height - 90, game.lifes.width/18, game.lifes.height/18);
				
			}else if(life === 2){
				ctx.drawImage(game.lifes, 10, canvas.height - 90, game.lifes.width/18, game.lifes.height/18);
				ctx.drawImage(game.lifes, 65, canvas.height - 90, game.lifes.width/18, game.lifes.height/18);
			}else{
				ctx.drawImage(game.lifes, 10, canvas.height - 90, game.lifes.width/18, game.lifes.height/18);
			}

			ctx.closePath();	
		}	
		requestAnimationFrame(animate);
	}

	animate(0);

});