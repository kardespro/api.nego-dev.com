const req = require("axios")
const cfg = require("./config.json")

class softwareer_node {
  // Get Skills 
  async loadSkills(token){
    const response = await (await req.get(`${cfg.baseUrl}/skills`, {
            headers: {
                Authorization: token
            }
        }).catch(err => {
            throw new Error(err?.response?.data?.message || "Something went wrong!");
        }))?.data || null;
        if (!response)
            throw new Error("Key is not valid!");
        if (!response.success)
            throw new Error(response.message);
        return response.data || [];
  }
  
}
// By Nego
module.exports = softwareer_node;