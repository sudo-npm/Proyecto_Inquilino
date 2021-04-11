async function fetchApi(path, config) {
  const BASE_URL = "http://localhost:3001/";
  const fetchOptions = {
    headers: {
      Accept: "application/json",
    },
    method: config.method || "GET",
  };
  if (!config.isFormData) {
    fetchOptions.headers["Content-Type"] = "application/json";
  }
  if (config.token) {
    fetchOptions.headers.Authorization = `${config.token}`;
  }
  if (config.body) {
    fetchOptions.body = config.body;
  }
  let url = BASE_URL + path;
  if (config.query) {
    url = `${url}?${config.query}`;
  }
  const response = await fetch(url, fetchOptions);
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(response.status);
  }
}

export default fetchApi;
