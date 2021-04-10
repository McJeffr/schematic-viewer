import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Shadows } from "@material-ui/core/styles/shadows";
import { Route, BrowserRouter as Router } from "react-router-dom";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#577399",
    },
    secondary: {
      main: "#BDD5EA",
    },
    error: {
      main: "#FE5F55",
    },
  },
  shadows: Array(25).fill("none") as Shadows,
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Router basename="/schematic-viewer">
      <Route path="/">
        <App />
      </Route>
    </Router>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
