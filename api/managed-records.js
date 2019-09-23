import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// from https://github.com/github/fetch
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

// Your retrieve function plus any additional functions go here ...
const retrieve = ({ page = 1, colors = [] } = {}) => {
  //TODO: confirm they are sending an error / it makes sense


  let fetchOptions = {
    limit: 11,
    offset: (page - 1) * 10,
    "color[]": colors
  };

  let uri = new URI(window.path);
  return fetch(uri.search(fetchOptions))
    .then((response)=> {
      checkStatus(response);

      return response.json();
    })
    .then(function(response) {

      let pageItems = response.slice(0, 10);
      let previousPage = page - 1;
      let nextPage = response.length === 11 ? page + 1 : null;


      let getOpen = (pageItems) => {
        let thing = pageItems.filter((item) => item.disposition === "open");
        thing.forEach((item) => item.isPrimary = ["red", "blue", "yellow"].includes(item.color));
        return thing;
      };

      let transformedData = {
        ids: pageItems.map((item) => item.id),
        previousPage: previousPage === 0 ? null : previousPage,
        nextPage: nextPage,
        closedPrimaryCount: pageItems.filter((item) => item.disposition === "closed" && ["red", "blue", "yellow"].includes(item.color)).length,
        open: getOpen(pageItems)
      };


      return transformedData;
    })
    .catch((error) => {
      console.log(error);
      //TODO: refactor - transformedData
      return {
        ids: [],
        previousPage: null,
        nextPage: null,
        closedPrimaryCount: 0,
        open: []
      }
    });
};

export default retrieve;
