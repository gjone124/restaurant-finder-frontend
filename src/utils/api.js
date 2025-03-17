// Google Places API Data Fields (https://developers.google.com/maps/documentation/places/web-service/data-fields)

// https://maps.googleapis.com/maps/api/place/nearbysearch/output?parameters

// https://maps.googleapis.com/maps/api/place/textsearch/output?parameters

// https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#0

// export const getRestaurant = ({latitude, longitude}, APIkey) => {
//     fetch {
//         https://maps.googleapis.com/maps/api/place/nearbysearch/output?parameters
//     }
// };

const baseUrl = "http://localhost:4001";

// get all items
export function getItems() {
  return fetch(`${baseUrl}/items`).then(handleServerResponse);
}

// add new item
export function postItem({ name, cuisine, address, image, website }) {
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    body: JSON.stringify({
      name: name,
      cuisine: cuisine,
      address: address,
      image: image,
      website: website,
    }),
    headers: { "Content-Type": "application/json" },
  }).then(handleServerResponse);
}

export function deleteItem(id) {
  return fetch(`${baseUrl}/items/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(handleServerResponse);
}

export function handleServerResponse(response) {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(`Error: ${response.status}`);
}
