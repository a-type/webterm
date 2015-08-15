Scripts
=======

[ This is a work-in-progress spec. I just want to formalize what I'd like this to look like. ]

Scripts are written in Javascript (I know!). They don't contain all the functionality you're probably used to, yet. I'm working on it. But hopefully, they are less esoteric and easier to pick up and use.

```javascript
var Command = Shell.Command;
var currentBranch = "";

Command("git status")
.run()
.then(function (result) {
	if (result.code === 0) {
		currentBranch = /On branch (w+)/.exec(result.output)[1];
	}
	return Command("export GIT_BRANCH=" + currentBranch).run();
});
```

```javascript
var C = Shell.Command;
C("cat ./log.txt")
.pipe(C("grep 'ERROR'"))
.pipe(C("echo")); // perhaps not necessary, but shows pipe chaining
```
