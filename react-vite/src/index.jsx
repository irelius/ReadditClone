import React from "react";
import ReactDOM from "react-dom/client";

import "./reset.css";
import "./index.css";

import configureStore from "./redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as sessionActions from "./redux/session";
import App from "./App";

const store = configureStore();

if (import.meta.env.MODE !== "production") {
	window.store = store;
	window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);
