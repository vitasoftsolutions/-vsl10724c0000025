import { jwtDecode } from "jwt-decode";
import { mode } from "../configs/base_url";

export const verifyToken = (token) => {
  // var jwt = require("jsonwebtoken");

  // //console.log(token);
  // //console.log(api_key);

  if (mode !== "local") {
    try {
      // const decodedData = jwtDecode(token);

      // return decodedData?.data;
      return token;
    } catch (error) {
      console.error("Error decrypting token:", error);
    }
  } else {
    return token;
  }
};
