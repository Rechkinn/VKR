import { BASE_URL } from "./consts";

function checkResponse(response) {
  console.log("doRequest response");
  console.log(response);
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(`Ошибка ${response.status}`);
}

export async function doRequest(endPoint, option) {
  return fetch(`${BASE_URL}${endPoint}`, option).then(checkResponse);
}
