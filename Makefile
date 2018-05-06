.PHONY: depcheck prune install test lint clean

ZIP_NAME = slack-tfl.zip
ZIP_FILES = node_modules src package.json

all: depcheck lint test zip

prune:
	npm prune

install: prune
	npm install

depcheck: install
	depcheck

test: install
	npm test

lint: install
	npm run lint

clean:
	rm -f $(ZIP_NAME)

zip: clean
	zip -qrT $(ZIP_NAME) $(ZIP_FILES)
	@echo OUTPUT: $(ZIP_NAME)
