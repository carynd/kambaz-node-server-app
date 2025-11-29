export const requireAuth = (req, res, next) => {
  const currentUser = req.session["currentUser"];
  if (!currentUser) {
    res.sendStatus(401);
    return;
  }
  next();
};

export const requireRole = (role) => {
  return (req, res, next) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    if (currentUser.role !== role && currentUser.role !== "ADMIN") {
      res.sendStatus(403);
      return;
    }
    next();
  };
};

export const requireFaculty = (req, res, next) => {
  const currentUser = req.session["currentUser"];
  if (!currentUser) {
    res.sendStatus(401);
    return;
  }
  if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
    res.sendStatus(403);
    return;
  }
  next();
};

export const requireStudent = (req, res, next) => {
  const currentUser = req.session["currentUser"];
  if (!currentUser) {
    res.sendStatus(401);
    return;
  }
  if (currentUser.role !== "STUDENT" && currentUser.role !== "ADMIN") {
    res.sendStatus(403);
    return;
  }
  next();
};
