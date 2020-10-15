module.exports = function (req, res) {
  return res.json({
    code: 200,
    rdm: Math.floor(Math.random() * 500000 + 1),
    message: "ok"
  });
};
