import { BASE_URL } from "./consts";

function checkResponse(response) {
  if (response.ok) {
    console.log("Успешный респонс");
    console.log(response);
    return response?.json() ?? response;
  }
  console.log("неУспешный респонс");
  return Promise.reject(`Ошибка ${response.status}`);
}

export async function doRequest(endPoint, option) {
  return fetch(`${BASE_URL}${endPoint}`, option).then(checkResponse);
}
