all:
	jekyll b

testupload:
	rsync -a _site/* taurus.labs.lenovo.com:/var/www/html/hpcsite
