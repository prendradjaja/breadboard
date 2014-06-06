game.js: public/js/game.js
	cp public/js/game.js game.js
	printf "\nexports.Game = Game;\n" >> game.js
