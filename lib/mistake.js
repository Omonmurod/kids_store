class Definer {
  /* General Errors */
  static general_err1 = "att: Something went wrong!";
  static general_err2 = "att: There is no data with that params!";
  static general_err3 = "att: File upload error!";

  /* Member auth related errors */
  static auth_err1 = "att: Your inserted nick or phone already used!";
  static auth_err2 = "att: No member with that mb_nick!";
  static auth_err3 = "att: Your credentials do not match!";
  static auth_err4 = "att: JWT creation error!";
  static auth_err5 = "att: You are not Authenticated!";

  /* Product related errors */
  static product_err1 = "Att: Product creation is failed!";

  /* Orders related errors */
  static order_err1 = "att: Order creation failed!";
  static order_err2 = "att: Order item creation failed!";
  static order_err3 = "att: No order with this params exists!";

  /* Articles related errors */
  static article_err1 = "att: Author member for articles not provided!";
  static article_err2 = "att: No articles fund for this member!";
  static article_err3 = "att: No articles fund for this target!";

  /* Follow related errors */
  static follow_err1 = "att: Self subscription is denied!";
  static follow_err2 = "att: New follow subscription is failed!";
  static follow_err3 = "att: No follow data found!";

  /* Mongoo validation error */
  static mongo_validation_err1 = "att: MongoDB validation is failed!";
}

module.exports = Definer;
