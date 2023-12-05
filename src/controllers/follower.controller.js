const db = require("../models");
const User = db.user;
const Follower = db.follower;

exports.followUser = async (req, res) => {
  const followedUserId = req.params.followedUserId;
  const followerId = req.params.followerId;
  console.log("followUser-controller:", req.params);
  try {
    // Comprueba si el usuario a seguir existe
    const followedUser = await User.findOne({ where: { id: followedUserId } });
    if (!followedUser) {
      return res.status(404).json({ error: "El usuario no existe." });
    }

    // Verifica si ya se está siguiendo al usuario
    const isAlreadyFollowing = await Follower.findOne({
      where: { followerId, followedUserId: followedUserId },
    });
    if (isAlreadyFollowing) {
      return res
        .status(400)
        .json({ error: "Ya estás siguiendo a este usuario." });
    }

    // Crea una nueva relación de seguimiento
    await Follower.create({ followerId, followedUserId: followedUserId });

    res.status(200).json({ message: "Has comenzado a seguir a este usuario." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ha ocurrido un error al intentar seguir al usuario." });
  }
};

exports.isFollowingUser = async (req, res) => {
  const followedUserId = req.params.followedUserId;
  const followerId = req.params.followerId;
  console.log("isFollowing-controller:", req.params);
  try {
    // Verifica si ya se está siguiendo al usuario
    const isAlreadyFollowing = await Follower.findOne({
      where: { followerId, followedUserId },
    });
    console.log("ISFOLLOWING. TRY");
    if (isAlreadyFollowing) {
      console.log("YA ESTAS SIGUIENDOLO");
      return res.status(200).json({
        isFollowing: true,
        message: "Ya estás siguiendo a este usuario.",
      });
    } else {
      return res.status(200).json({
        isFollowing: false,
        message: "No estás siguiendo a este usuario.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "Ha ocurrido un error al intentar verificar el estado de seguimiento.",
    });
  }
};

exports.unfollowUser = async (req, res) => {
  const followedUserId = req.params.followedUserId;
  const followerId = req.params.followerId;

  try {
    // Eliminar la relación de seguimiento
    const result = await Follower.destroy({
      where: { followerId, followedUserId },
    });

    if (result === 1) {
      // La relación de seguimiento se eliminó correctamente
      return res.status(200).json({
        message: "Has dejado de seguir a este usuario.",
      });
    } else {
      // No se encontró la relación de seguimiento
      return res.status(404).json({
        message: "No estás siguiendo a este usuario.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ha ocurrido un error al intentar dejar de seguir al usuario.",
    });
  }
};

exports.getTotalFollowed = async (req, res) => {
  const userId = req.params.followerId;
  try {
    // Obtiene el número de personas a las que el usuario sigue
    const count = await Follower.count({ where: { followerId: userId } });
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "Ha ocurrido un error al intentar obtener el número de personas a las que sigue el usuario.",
    });
  }
};

exports.getFollowedList = (req, res) => {};

exports.getTotalFollowers = async (req, res) => {
  const userId = req.params.followerId;
  try {
    // Obtener el número de seguidores del usuario
    const count = await Follower.count({ where: { followedUserId: userId } });
    console.log("getTOTALFOLLOWERS:", count, "-", userId);
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "Ha ocurrido un error al intentar obtener el número de seguidores del usuario.",
    });
  }
};

exports.getFollowingList = async (req, res) => {
  const userId = req.params.userId;
  try {
    const following = await db.user.findAll({
      include: [
        {
          model: db.follower,
          as: "UserFollowedUsers",
          where: { followerId: userId },
        },
      ],
    });
    console.log("FOLLOWING:",following);
    const followingList = following.map((following) => {
      return {
        id: following.id,
      };
    });
    res.status(200).json(followingList);
  } catch (error) {
    console.error("Error al obtener la lista de seguidos", error);
    res.status(500).json({ message: "Error al obtener la lista de seguidos" });
  }
};

exports.getFollowersList = async (req, res) => {
  const userId = req.params.userId;
  try {
    const followers = await db.user.findAll({
      include: [
        {
          model: db.follower,
          as: "UserFollowers",
          where: { followedUserId: userId },
        },
      ],
    });

    const followersList = followers.map((follower) => {
      return {
        id: follower.id,
      };
    });
    res.status(200).json(followersList);
  } catch (error) {
    console.error("Error al obtener la lista de seguidores", error);
    res
      .status(500)
      .json({ message: "Error al obtener la lista de seguidores" });
  }
};
