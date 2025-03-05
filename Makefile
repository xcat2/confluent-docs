all:
	./makeattribdoc
	./makeman
	mkdocs build

testupload: all
	rsync -a _site/* taurus:/var/www/html/users

