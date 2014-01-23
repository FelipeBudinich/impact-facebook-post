/***
	This is a dumby game example to show how the FB post could work.
	The game is only an image randomnly bouncing around
	The game pauses when the post options come up, and then will unpause when successfully posted.
***/
ig.module( 
	'game.games.gamestart' 
)
.requires(
        'impact.game'
)
.defines(function(){
	GameStart = ig.Game.extend({
		pos:{x:0,y:0},
		paused:false,
	    init: function() {
			// setting the HTML actions during game init.
			$('#facebook-block').remove();

			$('#close-message').click(function(){
				ig.game.playGame();
				$('#facebook-message').fadeOut('slow');
			});

			$('#post-to-fb').click(function(){
				PostImageToFacebook(window.authToken,$('#post-message').val(), 'canvas');
				$('#facebook-message').fadeOut('slow');
				ig.game.playGame();
			});
			$('#facebook-share').delay(1500).fadeIn('slow').click(function(){
				$('#facebook-message').fadeIn('slow');
			 	ig.game.pauseGame();
				
			});
		},
		pauseGame:function(){
			 this.paused = true;
		},
		playGame:function(){
			 this.paused = false;
		},
		update: function() {
			this.parent();
			// makes image bounce around all crazy
			if(!this.paused){
				var min = -200;
				var max = 0;
				this.pos.x = (Math.floor(Math.random() * (max - min + 1) + min));
				this.pos.y = (Math.floor(Math.random() * (max - min + 1) + min));
			}
			
		},
		draw: function() {
			this.parent();
			// draw images for testing
			var prop;
            prop = new ig.Image('media/example.jpg');
            prop.draw( this.pos.x, this.pos.y );
		}
	});
});