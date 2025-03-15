export const getSecureImageUrl = (url: string | undefined) => {
  if (typeof url === "string" && url !== "") {
    return url.replace("http://", "https://").replace("&edge=curl", "");
  }
  return require("../../assets/images/noCover.jpg");
};
