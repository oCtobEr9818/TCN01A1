export const formatDate = (input = null) => {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const time = input?.split(", ")[1];
  return `${year}/${month}/${day}, ${time ? time : "00:00:00"}`;
};
