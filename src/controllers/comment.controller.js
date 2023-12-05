const db = require("../models");

// Ruta POST para guardar un comentario de película
exports.addCommentMovie = async (req, res) => {
  const { content, username } = req.body;
  const contentId = req.params.contentId;
  try {
    const comment = await db.comment.create({
      content,
      contentId,
      username,
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error("Error al guardar el comentario de película:", error);
    res
      .status(500)
      .json({ error: "Error al guardar el comentario de película" });
  }
};

exports.addCommentSerie = async (req, res) => {
  const { content, contentId, username } = req.body;
  try {
    const comment = await db.comment.create({
      content,
      contentId,
      username,
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error("Error al guardar el comentario de la serie:", error);
    res
      .status(500)
      .json({ error: "Error al guardar el comentario de la serie" });
  }
};

exports.getcommentsMovie = async (req, res) => {
  const contentId = req.params.contentId;

  try {
    const comments = await db.comment.findAll({
      where: { contentId },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error al obtener los comentarios de la película:", error);
    res.status(500).json({
      message: "Ocurrió un error al obtener los comentarios de la película",
    });
  }
};

exports.getcommentsSerie = async (req, res) => {
  const contentId = req.params.contentId;

  try {
    const comments = await db.comment.findAll({
      where: { contentId },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error al obtener los comentarios de la película:", error);
    res.status(500).json({
      message: "Ocurrió un error al obtener los comentarios de la película",
    });
  }
};

exports.reportComment = async (req, res) => {
  const commentId = req.params.commentId;
  const reportData = req.body;

  try {
    const comment = await db.comment.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    const report = await db.report.create({
      userId: reportData.userId,
      commentId,
      reason: reportData.reason,
    });
    return res.status(200).json(report);
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
