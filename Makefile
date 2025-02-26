all:
	sed -i s/VERSION/users/ _config.yml
	./makeattribdoc
	./makeman
	jekyll b
	sed -i s/users/VERSION/ _config.yml

beta:
	sed -i s/VERSION/beta/ _config.yml
	./makeattribdoc
	./makeman
	jekyll b
	sed -i s/beta/VERSION/ _config.yml

testupload: all
	rsync -a _site/* taurus:/var/www/html/users

