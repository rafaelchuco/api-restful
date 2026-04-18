const NotificationService = require("../services/NotificationService");
const service = new NotificationService();

exports.list = (req, res, next) => {
  try {
    res.status(200).json(service.list());
  } catch (error) {
    next(error);
  }
};
