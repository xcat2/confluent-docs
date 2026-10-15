all:
	./makeattribdoc
	bash makeman
	zensical build --strict

testupload: all
	rsync -a _site/* taurus:/var/www/html/users

