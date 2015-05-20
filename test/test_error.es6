class View {
	constructor(options) {
		this.options = options;
	}

	render() {
		return "whatever " + this.options.name;
	}
}

var a = new View({ name: "Tit Petric" });
console.log(a.render()));

var b = new View({ name: "Anonymous" });
console.log(b.render());