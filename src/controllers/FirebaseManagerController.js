const FirebaseService = require("../services/Firebase");

class FirebaseManagerControler {
  static async connect(request) {
    try {
      const { first_name, last_name, email, id } = request.decoded.user;
      const { stage, path } = request.body;

      const result = await FirebaseService.save(
        {
          user: { first_name, last_name, email },
          stage,
          path
        },
        "connect-users",
        id
      );

      return result;
    } catch (error) {
      throw new Error(err);
    }
  }

  static async disconnect(request) {
    try {
        const { id } = request.decoded.user;

        const result = await FirebaseService.delete("connect-users", id);

        return result;
    } catch(error) {
        throw new Error(err);
    }
    
  }
}

module.exports = FirebaseManagerControler;
