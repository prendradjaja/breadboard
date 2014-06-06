.PHONY: clean all

all: game.js public/css/styles.css

game.js: public/js/game.js
	cp public/js/game.js game.js
	printf "\nexports.Game = Game;\n" >> game.js

public/css/styles.css: public/scss/styles.scss
	scss public/scss/styles.scss public/css/styles.css

clean:
	rm game.js public/css/styles.css
