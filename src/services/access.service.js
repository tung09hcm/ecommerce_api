const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils/index");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailedError,
} = require("../core/error.response");
const { findByEmail } = require("../services/shop.service");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /*
    1 - check email in dbs
    2 - match password
    3 - create AT vs GT and save
    4 - generate tokens
    5 - get data return login
   */
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = findByEmail(email);
    // 1.check email in dbs
    if (!foundShop) {
      throw new BadRequestError("Shop not registered");
    }
    // 2.match password
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailedError("Authen Error");
    }
    // 3.create AT vs GT and save
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    // 4.generate tokens
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey,
    );
    // 5.get data return login
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId: foundShop._id,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signup = async ({ name, email, password }) => {
    try {
      if (!name || !email || !password) {
        throw new BadRequestError("Missing required signup fields");
      }

      // step 1: check email existence
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new ConflictRequestError("Error: Shop already registered");
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: hashPassword,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // create privateKey, publicKey
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        // });
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        console.log({ privateKey, publicKey });
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          throw new BadRequestError("publicKeyString error");
        }
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey,
        );
        console.log("Created token successfully", tokens);
        return {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        };
      } else {
        throw new BadRequestError("Create shop failed");
      }
    } catch (error) {
      throw error;
    }
  };
}

module.exports = AccessService;
