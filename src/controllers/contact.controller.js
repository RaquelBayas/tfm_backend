const db = require("../models");
const Contact = db.contact;

exports.submitForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });
    res.status(200).json({ message: "Mensaje guardado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Se produjo un error al guardar el mensaje" });
  }
};
