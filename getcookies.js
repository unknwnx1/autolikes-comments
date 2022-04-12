const Insta = require("./lib");
const fs = require("fs");
const read = require("readline-sync");
const chalk = require("chalk");
const moment = require("moment");
const path = require("path");

(async () => {
  const ig = new Insta();
  const username = read.question(
    `[${moment().format("HH:mm:ss")}] [?] Masukan username (ex:ryn.andri) : `
  );
  const password = read.question(
    `[${moment().format("HH:mm:ss")}] [?] Masukan password : `
  );
  const login = await ig.login(username, password);
  if (login.userId) {
    const profile = await ig.getProfileData();
    console.log(
      `[${moment().format("HH:mm:ss")}] Username : ${
        profile.username
      } Berhasil saving cookie`
    );
  }
})();
