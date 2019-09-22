import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// from https://github.com/github/fetch
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response;
    throw error
  }
}

// Your retrieve function plus any additional functions go here ...
const retrieve = (options) => {
  //TODO: confirm they are sending an error / it makes sense
  options = Object.assign({
    limit: 10,
    offset: 0,
    color: []
  }, options);

  //support these keys
  // options = { page: <1, 2>, colors: [],  }
  console.log('fetch!', fetch);
  return fetch(path, options)
    .then((response)=> {
      return response.json();4
    })
    .then(function(responseJson) {
      let page = 1;
      let previousPage = page - 1;
      let startingIndex = (page - 1) * 10;
      let pageItems = responseJson.slice(startingIndex, startingIndex + 10);


      let getOpen = (pageItems) => {
        let thing = pageItems.filter((item) => item.disposition === "open");
        thing.forEach((item) => item.isPrimary = ["red", "blue", "yellow"].includes(item.color));
        return thing;
      };

      let transformedData = {
        ids: pageItems.map((item) => item.id),
        previousPage: previousPage === 0 ? null : previousPage,
        nextPage: page + 1,
        closedPrimaryCount: pageItems.filter((item) => item.disposition === "closed" && ["red", "blue", "yellow"].includes(item.color)).length,
        open: getOpen(pageItems)
      };



      return transformedData;
    })
    .catch(error => console.log(error));
};

export default retrieve;
