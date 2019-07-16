const FirebaseService = require("../services/Firebase");

class FirebaseManagerControler {
  static async connect(request) {
    try {
      const { first_name, last_name, email, id } = request.decoded.user;
      const { stage, path, page, pathArray } = request.body;

      const enviroment = process.env.NODE_ENV;

      const connected = await FirebaseService.childExist("connect-users", id);

      if (connected) return connected;

      const result = await FirebaseService.save(
        {
          user: { first_name, last_name, email },
          stage,
          path,
          page,
          enviroment,
          pathArray,
          online: true
        },
        "connect-users",
        id
      );

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async update(request) {
    try {
      const { id } = request.decoded.user;
      const data = request.body;

      const result = await FirebaseService.update(data, "connect-users", id);

      return result;
    } catch (error) {
      throw new Error(err);
    }
  }

  static async disconnect(request) {
    try {
      const { id } = request.decoded.user;

      const connected = await FirebaseService.childExist("connect-users", id);

      if (connected) {
        const result = await FirebaseService.update(
          { online: false },
          "connect-users",
          id
        );
        return result;
      }

      return null;
    } catch (error) {
      throw new Error(err);
    }
  }
}

module.exports = FirebaseManagerControler;
