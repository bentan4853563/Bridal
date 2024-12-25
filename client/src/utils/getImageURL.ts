export const getImageURL = (url: string) => {
  const src = `${import.meta.env.VITE_BACKEND_URL}${url.replace(
    "uploads",
    ""
  )}`;
  return src;
};
