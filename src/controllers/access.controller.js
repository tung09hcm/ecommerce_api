const AccessService = require("../services/access.service");

class AccessController {
  signup = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const result = await AccessService.signup(name, email, password);
      const statusCode = typeof result.code === "number" ? result.code : 400;

      return res.status(statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
