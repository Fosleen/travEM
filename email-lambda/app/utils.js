const jwt = require("jsonwebtoken");

const generateUnsubscribeToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const getArticleTypeBadge = (articleTypeId) => {
  const types = {
    1: { icon: "🌍", text: " DESTINACIJA" },
    2: { icon: "✈️", text: " AVIOKARTE" },
    3: { icon: "🎒", text: " PAKIRANJE" },
    4: { icon: "✈️", text: " LET AVIONOM" },
    5: { icon: "📋", text: " NOVOSTI I ORGANIZACIJA PUTA" },
    6: { icon: "📱", text: " APLIKACIJE" },
    7: { icon: "🏨", text: " SMJEŠTAJ" },
    8: { icon: "💳", text: " REVOLUT" },
  };
  return types[articleTypeId] || { icon: "✈️", text: "PUTOVANJE" };
};

module.exports = {
  generateUnsubscribeToken,
  getArticleTypeBadge,
};
