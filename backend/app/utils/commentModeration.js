const normalizeText = (value = "") =>
  value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const compactText = (value = "") => normalizeText(value).replace(/\s/g, "");

const getConfiguredPatterns = (envName) => {
  const rawValue = process.env[envName] || "";

  return rawValue
    .split(",")
    .map((pattern) => pattern.trim())
    .filter(Boolean)
    .map((pattern) => new RegExp(pattern, "i"));
};

const reservedUsernames = [
  "putujem s travem",
  "putuj em s travem",
  "putujemstravem",
  "putujems travem",
  "travem",
  "putujem s travEM",
  "ema i matija",
  "admin",
  "administrator",
  "travem team",
  "putujem s travem team",
  "matija i ema",
];

const suspiciousPhrasePatterns = [
  /\b(mrzim|ubiti|protjerati|istrijebiti|ocistiti)\s+(sve\s+)?[a-z]+/i,
  /\b(death to|kill all|remove all|wipe out)\s+[a-z]+/i,
  /\b(nazi|hitler|ustas|cetnik)\b/i,
];

const strongProfanityPatterns = [
  /\b(jebem|jebo|jebes|jebes)\s+(ti\s+)?(majku|mater|mamu|oca|tatu)\b/i,
  /\b(majku|mater|mamu)\s+(ti|vam|mu|joj|im)\b/i,
  /\b(picka|picko|picku|pizda|pizdo|pizdu|kurac|kurca|kurcem)\b/i,
  /\b(pusikurac|pusikurac|popusi|popusis)\b/i,
  /\b(odjebi|odjebite|odjebo|odjebala)\b/i,
  /\b(govno|govna|govnar|govnaru|govnari|smece|smecaru)\b/i,
  /\b(retard|retardu|debil|debilu|idiot|idiote|budala|budalo)\b/i,
  /\b(kuja|kurva|kurvo|drolja|droljo)\b/i,
];

const spamPatterns = [
  /\b(crypto|casino|viagra|betting|free money)\b/i,
  /(https?:\/\/|www\.)/i,
];

const hasRepeatedNoise = (text) => /(.)\1{8,}/.test(text);

export const isReservedUsername = (username) => {
  const normalizedUsername = normalizeText(username);
  const compactUsername = compactText(username);

  return reservedUsernames.some((reserved) => {
    return (
      normalizeText(reserved) === normalizedUsername ||
      compactText(reserved) === compactUsername
    );
  });
};

export const moderateComment = ({ username, body }) => {
  const normalizedBody = normalizeText(body);
  const rejectPatterns = getConfiguredPatterns("COMMENT_REJECT_PATTERNS");
  const pendingPatterns = getConfiguredPatterns("COMMENT_PENDING_PATTERNS");

  if (isReservedUsername(username)) {
    return {
      status: "rejected",
      reason: "Rezervirani nadimak",
    };
  }

  if (rejectPatterns.some((pattern) => pattern.test(body))) {
    return {
      status: "rejected",
      reason: "Blokirani sadržaj",
    };
  }

  if (pendingPatterns.some((pattern) => pattern.test(body))) {
    return {
      status: "pending",
      reason: "Potreban pregled",
    };
  }

  const linkMatches = body.match(/https?:\/\/|www\./gi) || [];

  if (linkMatches.length >= 2) {
    return {
      status: "pending",
      reason: "Više poveznica",
    };
  }

  if (spamPatterns.some((pattern) => pattern.test(body))) {
    return {
      status: "pending",
      reason: "Mogući spam",
    };
  }

  if (
    suspiciousPhrasePatterns.some((pattern) => pattern.test(normalizedBody))
  ) {
    return {
      status: "pending",
      reason: "Potencijalno neprimjeren sadržaj",
    };
  }

  if (strongProfanityPatterns.some((pattern) => pattern.test(normalizedBody))) {
    return {
      status: "pending",
      reason: "Grube psovke",
    };
  }

  if (hasRepeatedNoise(body)) {
    return {
      status: "pending",
      reason: "Ponavljanje znakova",
    };
  }

  return {
    status: "published",
    reason: null,
  };
};
