const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");
const assert = require("assert");

class Member {
  constructor() {
    this.memberModel = MemberModel; // Membermodel is a mongodb class
  }

  async signupData(input) {
    try {   /* We are using SchemaeModel inside ServiceModel */
      const new_member = new this.memberModel(input); 
      let result;
      try {
        result = await new_member.save();
      } catch(mongo_err) {
        console.log(mongo_err);
        throw new Error(Definer.auth_err1);
      }

      result.mb_password = "";
      return result;
    } catch(err) {
      throw err;
    }
  }

  async loginData(input) {  /* Member infos come here as an JSON format */
    try {
      const member = await this.memberModel
        .findOne(
          { mb_nick: input.mb_nick },
          {mb_nick: 1, mb_password: 1, _id: 0})
        .exec();  /* Static Method */

      assert.ok(member, Definer.auth_err2);

      const isMatch = input.mb_password === member.mb_password;
      assert.ok(isMatch, Definer.auth_err3);

      return await this.memberModel
        .findOne({mb_nick: input.mb_nick})
        .exec();
    } catch(err) {
      throw err;
    }
  }
}

module.exports = Member;
