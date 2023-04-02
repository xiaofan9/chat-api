const isSlash = (url) => {
  return url[0] === "/";
};

const urlResolve = (...urls) => {
  let nUrl = "";
  for(let url of urls) {
    nUrl += isSlash(url) ? url.slice(1) : url;
  }

  return nUrl;
};

const getSingleExample = (Cls, ctx) => {
  let instance;

  if (!instance) {
    instance = new Cls();
  }

  instance.ctx = ctx;

  return instance;
};

module.exports = {
  urlResolve,
  getSingleExample,
};
