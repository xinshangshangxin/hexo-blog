commitandpush:
	git add -A
	git commit -m "auto"
	git push design master:DesignPattern
push:
	git push design master:DesignPattern --force
force:
	git add -A
	git commit --amend --no-edit
	git push design master:DesignPattern --force
clean:
	rm -rf .git