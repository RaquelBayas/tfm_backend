const axios = require("axios");
const db = require("../models");
const List = db.list;
const User = db.user;
const { apiKey } = require("../config/auth.config");

// Añade películas o series a la lista
exports.addMovieToList = async (req, res) => {
  const { name, description, movies } = req.body;

  try {
    // Obtener detalles de la película desde la API de TMDb
    const tmdbRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-ES`
    );
    const movieData = tmdbRes.data;

    // Agregar la película a la lista
    const list = await List.findById(id);
    list.movies.push(movieData);
    await list.save();

    res
      .status(200)
      .json({ message: "Película agregada correctamente a la lista." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al agregar la película a la lista." });
  }
};

// Crear una nueva lista
/*router.post('/lists', async (req, res) => {
    try {
      const newList = new List({
        name: req.body.name,
        description: req.body.description,
        userId: req.user.id,
        movies: req.body.movies
      });
  
      await newList.save();
  
      res.status(200).json({ message: 'Lista creada correctamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al crear la lista.' });
    }
  });
*/

// Busca todas las listas del usuario
exports.findAll = (req, res) => {
  const userId = req.userId;

  List.findAll({ where: { userId: userId } })
    .then((lists) => {
      res.status(200).json(lists);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error al obtener las listas del usuario" });
    });
};

// Crea una lista
exports.createList = async (req, res) => {
  const { title, description, privacy, userId, selectedContent } = req.body;

  try {
    const list = await db.list.create({
      title,
      description,
      privacy,
      userId,
      selectedContent,
    });

    return res.status(201).json({ list });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

exports.getListsByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("USERID.", userId);
    const lists = await List.findAll({
      where: {
        userId: userId,
      },
    });
    res.json(lists);
  } catch (error) {
    res.status(500).send("Hubo un error al obtener las listas del usuario");
  }
};

// Devuelve una lista con ID
exports.getListByIdAndUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const listId = req.params.listId;
    const list = await List.findOne({
      where: {
        id: listId,
        userId: userId,
      },
    });
    if (!list) {
      return res.status(404).send("No se encontró la lista solicitada");
    }
    res.json(list);
  } catch (error) {
    res.status(500).send("Hubo un error al obtener los detalles de la lista");
  }
};

exports.deleteList = async (req, res) => {
  const listId = req.params.listId;
  try {
    // Busca la lista por su ID y el ID del usuario actual
    const list = await List.findOne({
      where: {
        id: listId,
        userId: req.params.id, // Asume que tienes la información del usuario en req.user después de la autenticación
      },
    });

    if (!list) {
      return res.status(404).json({ message: "Lista no encontrada" });
    }

    try {
      await list.destroy();
    } catch (err) {
      console.log(err);
    }
    return res.json({ message: "Lista eliminada exitosamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocurrió un error al eliminar la lista" });
  }
};

exports.getListMeGusta = async (req, res) => {
  const { title, userId } = req.params;
  console.log("userid:::",req.params);
  try {
    const list = await List.findOne({ where: {
      title: title,
      userId: userId
    } });

    if (list) {
      console.log(list);
      return res.json(list);
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la lista" });
  }
};

exports.addContentToList = (req, res) => {
  const userId = req.params.userId;
  const listId = req.params.listId;
  const content = req.body.content;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "No se ha encontrado el usuario" });
      }

      List.findOne({
        where: { id: listId, userId: userId }
      })
        .then((list) => {
          if (!list) {
            // Crear una nueva lista
            List.create({
              title: 'Me gusta',
              description: '',
              privacy: 'private',
              userId: userId,
              selectedContent: content
            })
              .then((createdList) => {
                // Agregar contenido a la lista creada
                createdList
                  .update({ selectedContent: [...createdList.selectedContent, ...content] })
                  .then(() => {
                    res.status(200).json({ message: "Lista creada y actualizada" });
                  })
                  .catch((error) => {
                    res.status(500).json({ error: "Ocurrió un error al actualizar la lista" });
                  });
              })
              .catch((error) => {
                res.status(500).json({ error: "Ocurrió un error al crear la lista" });
              });
          } else {
            const updatedSelectedContent = [...list.selectedContent, ...content];
            list
              .update({ selectedContent: updatedSelectedContent })
              .then(() => {
                res.status(200).json({ message: "Lista actualizada" });
              })
              .catch((error) => {
                res.status(500).json({ error: "Ocurrió un error al actualizar la lista" });
              });
          }
        })
        .catch((error) => {
          res.status(500).json({ error: "Ocurrió un error al buscar la lista" });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Ocurrió un error al buscar el usuario" });
    });
};


exports.updateContentList = (req, res) => {
  const listId = req.params.listId;
  const content = req.body;
  List.findByPk(listId)
    .then((list) => {
      if (list) {
        list
          .update({
            selectedContent: content,
          })
          .then((updatedList) => {
            res.status(200).json(updatedList);
          })
          .catch((error) => {
            res
              .status(500)
              .json({
                message: "Error al actualizar el contenido de la lista",
              });
          });
      } else {
        res.status(404).json({ message: "Lista no encontrada" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error al obtener la lista" });
    });
};
