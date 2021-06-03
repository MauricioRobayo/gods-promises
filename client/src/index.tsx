import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import * as serviceWorker from "./serviceWorker";
import { ReactQueryDevtools } from "react-query/devtools";
import { GlobalStyle } from "./styles";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <GlobalStyle />
        <App />
        <ReactQueryDevtools />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
