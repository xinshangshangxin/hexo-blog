commitandpush:
	git add -A
	git commit -m "auto"
	git push design DesignPattern
push:
	git push design DesignPattern --force
force:
	git add -A
	git commit --amend --no-edit
	git push design DesignPattern --force
clean:
	rm -rf .git