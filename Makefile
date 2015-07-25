macpush: beauty back push
beautyandpush: beauty all
all: mini back
beauty: 
	node speed_up.js ./source/_posts
mini:
	rm -rf public
	hexo g
	cp ./fis-conf.js ./public/fis-conf.js
	cd ./public && fis release -mopd ../test && cd ..
	rm -rf public
	mv -f ./test/ public/
	hexo d
push: 
	hexo clean
	hexo g
	hexo d
back:
	git add -A
	git commit -m "backup"
	git push origin master:backup
qn: mini
	./qrsync --check-exist conf.json

