let apiUrl =
	location.hostname === "localhost" ||
	location.hostname === "127.0.0.1" ||
	location.hostname === "5500"
		? "http://localhost:3000"
		: "https://projet-kanak.herokuapp.com";
