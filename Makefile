all:
	./makeattribdoc
	jekyll b

testupload:
	rsync -a _site/* taurus.labs.lenovo.com:/var/www/html/hpc/users

produpload: all
	rsync -a _site/* ru3gkpgr@10.38.87.83:/var/www/html/hpc/users
