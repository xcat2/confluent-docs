all:
	./makeattribdoc
	./makeman
	python3 -m properdocs build

testupload: all
	rsync -a _site/* taurus:/var/www/html/users

