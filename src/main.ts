import App from "./app/App";
import CVState from "./typecv/CVState";

CVState.init().then(() => {
    new App()
})