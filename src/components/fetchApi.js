export const FetchApi = () => {
  const api = "https://cloud.etica-inc.com/api/huachen_status";

  const results = fetch(api)
    .then((data) => data.json())
    .then((res) => console.log(res));

  return results;
};
