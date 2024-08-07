import axios from "axios";
import { camelCase } from "lodash";
import Navigo from "navigo";
import { footer, header, main, nav } from "./components";
import * as store from "./store";

const router = new Navigo("/");

function render(state = store.home) {
  document.querySelector("#root").innerHTML = `
    ${header(state)}
    ${nav(store.nav)}
    ${main(state)}
    ${footer()}
  `;
  router.updatePageLinks();
}

router.hooks({
  // We pass in the `done` function to the before hook handler to allow the function to tell Navigo we are finished with the before hook.
  // The `match` parameter is the data that is passed from Navigo to the before hook handler with details about the route being accessed.
  // https://github.com/krasimir/navigo/blob/master/DOCUMENTATION.md#match
  before: (done, match) => {
    console.log("before", match.url);
    // We need to know what view we are on to know what data to fetch
    const view = camelCase(match?.data?.view) || "home";
    // Add a switch case statement to handle multiple routes
    switch (view) {
      // Add a case for each view that needs data from an API
      case "pizza":
        // New Axios get request utilizing already made environment variable
        axios
          .get(`https://sc-pizza-api.onrender.com/pizzas`)
          .then(response => {
            // We need to store the response to the state, in the next step but in the meantime let's see what it looks like so that we know what to store from the response.
            console.log("pizza-response", response);
            store.pizza.pizzas = response.data;
          })
          .catch(error => {
            console.log("It puked", error);
          })
          .finally(() => done());
        break;
      default:
        // We must call done for all views so we include default for the views that don't have cases above.
        done();
      // break is not needed since it is the last condition, if you move default higher in the stack then you should add the break statement.
    }
  },
  already: match => {
    const view = match?.data?.view ? camelCase(match.data.view) : "home";
    console.log("already", match.url);

    render(store[view]);
  },
  after: match => {
    console.log("after", match.url);

    document.querySelector(".fa-bars").addEventListener("click", () => {
      document.querySelector("nav > ul").classList.toggle("hidden--mobile");
    });

    router.updatePageLinks();
  },
});

router
  .on({
    "/": () => render(),
    ":view": match => {
      const view = match.data.view ? camelCase(match.data.view) : "home";

      if (view in store) {
        render(store[view]);
      } else {
        render(store.viewNotFound);
        console.log(`View ${view} not defined`);
      }
    },
  })
  .resolve();
