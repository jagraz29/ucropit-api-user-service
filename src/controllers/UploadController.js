class UploadController {
  static async create(file) {
    if (!file) {
      throw new Error("Debe adjuntar un archivo de imagen o documento");
    }

    //Se guarda en la Base de datos

    //Se envía el url de la dirección del archivo
    return `${process.env.BASE_URL}/uploads/${file.filename}`;
  }
}
module.exports = UploadController;
