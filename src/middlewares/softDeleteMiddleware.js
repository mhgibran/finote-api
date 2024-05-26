const softDeleteMiddleware = (params, next) => {
  // List of model names that use soft deletes
  const modelsUsingSoftDeletes = ["User", "Wallet", "Category", "Transaction"];

  // Check if the model is in the list
  if (modelsUsingSoftDeletes.includes(params.model)) {
    // Add `deleted_at` condition if it is not already set
    if (!params.args) {
      params.args = {};
    }
    // If method is not insert
    if (!params.action.includes("create")) {
      if (!params.args.where) {
        params.args.where = {};
      }
      // Asign deletedAt = null into where args
      if (!params.args.where.deleted_at) {
        params.args.where.deletedAt = null;
      }
    }
    // Change method delete -> update & set data deletedAt = now()
    if (params.action === "delete") {
      params.action = "update";
      params.args["data"] = { deletedAt: new Date() };
    }
    // Change method deleteMany -> updateMany & set data deletedAt = now()
    if (params.action === "deleteMany") {
      params.action = "updateMany";
      if (params.args.data != undefined) {
        params.args.data["deletedAt"] = new Date();
      } else {
        params.args["data"] = { deletedAt: new Date() };
      }
    }
  }

  return next(params);
};

module.exports = softDeleteMiddleware;
