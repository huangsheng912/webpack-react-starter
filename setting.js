const env = process.env.NULS_ENV;
let config = {};
switch (env) {
  case "development":
    config = {
      API_ROOT: "/api",
      API_URL: "",
      API_TIME: 9000
    };
    break;
  case "beta":
    config = {
      API_ROOT: "",
      API_URL: "",
      API_TIME: 9000
    };
    break;
  case "production":
    config = {
      API_ROOT: "",
      API_URL: "",
      API_TIME: 8000
    };
    break;
}
export default config;
