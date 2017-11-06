import * as React from "react";
import { Provider } from "react-redux";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { replace } from "react-router-redux";
import { createMemoryHistory } from "history";
import { createServerRenderer, RenderResult } from "aspnet-prerendering";
import { addTask } from "domain-task";
import { routes } from "./routes";
import configureStore from "./configureStore";
import SearchContext, { findResultsState } from "./Components/SearchContext";

export default createServerRenderer(params => {
  return new Promise<RenderResult>((resolve, reject) => {
    // Prepare Redux store with in-memory history, and dispatch a navigation event
    // corresponding to the incoming URL
    const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash
    const urlAfterBasename = params.url.substring(basename.length);
    const store = configureStore(createMemoryHistory());
    store.dispatch(replace(urlAfterBasename));

    // Prepare an instance of the application and perform an inital render that will
    // cause any async tasks (e.g., data access) to begin
    const routerContext: any = {};
    let searchContextProps = {};

    const App = (props: any) => (
      <Provider store={store}>
        <StaticRouter
          basename={basename}
          context={routerContext}
          location={params.location.path}
        >
          <SearchContext
            resultsState={props.resultsState ? props.resultsState : null}
          >
            {routes}
          </SearchContext>
        </StaticRouter>
      </Provider>
    );

    // All this junk doesn't work.
    // let resultsState: any = null;
    // const getInitialState = async () => {
    //   let returnValue = null;
    //   await findResultsState(App)
    //     .then((results: any) => {
    //       returnValue = results;
    //     })
    //     .catch((error: any) => {
    //       // do nothing
    //     });
    //   return returnValue;
    // };
    // resultsState = getInitialState();
    // addTask(resultsState);
    // const initialState = { resultsState };
    // if (resultsState !== undefined) {
    //   initialState = { resultsState };
    // }

    let resultsState: any;
    // addTask(resultsState);
    const getInitialSearchResults = findResultsState(App).then(
      (results: any) => (resultsState = results)
    );
    addTask(getInitialSearchResults);

    renderToString(<App resultsState={resultsState} />);

    // If there's a redirection, just send this information back to the host application
    if (routerContext.url) {
      resolve({ redirectUrl: routerContext.url });
      return;
    }

    // Once any async tasks are done, we can perform the final render
    // We also send the redux store state, so the client can continue execution where the server left off
    params.domainTasks.then(() => {
      resolve({
        html: renderToString(<App resultsState={resultsState} />),
        globals: { initialReduxState: store.getState() }
      });
    }, reject); // Also propagate any errors back into the host application
  });
});
