const {default:axios}= require("axios");
export const BASE_URL="https://netpro-7bve.onrender.com/"
export const clientServer= axios.create({
    baseURL: BASE_URL,
});
