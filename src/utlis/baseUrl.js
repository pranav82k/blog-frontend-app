const hostname = window.location.hostname;

const baseUrl = hostname === "localhost" ? "http://localhost:5000" : "https://pk-mern-blog-apis.herokuapp.com";
// console.log(baseUrl);
export default baseUrl;