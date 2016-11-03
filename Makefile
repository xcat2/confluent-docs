all:
	jekyll b

testupload:
	rsync -a _site/* taurus.labs.lenovo.com:/var/www/html/web

produpload: all
	rsync -a _site/* ru3gkpgr@10.38.87.83:/var/www/html/web
