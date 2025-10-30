all:
	./makeattribdoc
	./makeman
	python3 -m mkdocs build

testupload: all
	rsync -a _site/* taurus:/var/www/html/users

