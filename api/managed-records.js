import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
const retrieve = ({ page = 1, colors = [] } = {}) => {

  return fetch(recordsPath(page, colors))
    .then((response)=> {
      checkStatus(response);
      return response.json();
    })
    .then(function(response) {
      const pageItems = response.slice(0, 10);
      const hasNextPage = response.length > 10;

      return {
        ids: pageItems.map((item) => item.id),
        previousPage: page === 1 ? null : page - 1,
        nextPage: hasNextPage ? page + 1 : null,
        closedPrimaryCount: itemsWithClosedDispositionAndPrimaryColor(pageItems).length,
        open: itemsWithOpenDisposition(pageItems)
      };
    })
    .catch((error) => {
      console.log(error);

      return {
        ids: [],
        previousPage: null,
        nextPage: null,
        closedPrimaryCount: 0,
        open: []
      };
    });
};

// helper functions
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

const recordsPath = (page, colors) => {
  let queryParams = {
    limit: 11, /* fetch an extra item to check for presence of nextPage */
    offset: (page - 1) * 10,
    "color[]": colors
  };

  return new URI(window.path).search(queryParams);
};

const itemsWithOpenDisposition = (pageItems) => {
  let items = pageItems.filter((item) => item.disposition === "open");
  items.forEach((item) => item.isPrimary = ["red", "blue", "yellow"].includes(item.color));
  return items;
};

const itemsWithClosedDispositionAndPrimaryColor = (pageItems) => {
  return pageItems.filter((item) => item.disposition === "closed" && ["red", "blue", "yellow"].includes(item.color))
};

export default retrieve;
