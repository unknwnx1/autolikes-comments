const Insta = require("./lib");
const fs = require("fs");
const read = require("readline-sync");
const chalk = require("chalk");
const moment = require("moment");
const path = require("path");

// const target = read.question(
//   chalk.green(
//     `[${moment().format("HH:mm:ss")}] Masukan Username Target (ex:ryn.andri) : `
//   )
// );
const waktu = read.question(
  chalk.green(`[${moment().format("HH:mm:ss")}] Masukan delay (menit) : `)
);
async function sleep() {
  return new Promise((resolve) => setTimeout(resolve, waktu * 60000));
}

async function readUsers() {
  const directoryPath = path.join(__dirname, "./cookies");
  const getPath = await fs.readdirSync(directoryPath);
  const listPath = [];
  getPath.map((file) => {
    listPath.push(file);
  });

  const imageName = listPath[Math.floor(Math.random() * listPath.length)];
  const photo = path.join(__dirname, `./cookies/${imageName}`);
  return photo;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

async function readComments() {
  const user = fs.readFileSync("comments.txt", "utf-8");
  const readFile = user.toString().split("\n");
  const pickedComment = readFile[getRandomInt(0, readFile.length)];
  //console.log(pickedComment);
  return pickedComment;
}

async function readTarget() {
  const user = fs.readFileSync("target.txt", "utf-8");
  const readFile = user.toString().split("\n");
  const pickedComment = readFile[getRandomInt(0, readFile.length)];
  //console.log(pickedComment);
  return pickedComment;
}

async function firtsComment() {
  try {
    while (true) {
      const target = await readTarget();
      const users = await readUsers();
      const ig = new Insta();
      const login = await ig.useExistingCookie(users);
      const getUsers = await ig.getImageByUser(target);
      const { user } = getUsers;
      const cek = user.edge_owner_to_timeline_media.edges[0].node.id;
      const link = user.edge_owner_to_timeline_media.edges[0].node.shortcode;
      console.log(
        chalk.green(
          `[${moment().format("HH:mm:ss")}] waiting for new post to ${target}`
        )
      );
      const data = fs.readFileSync("mediakomen.txt", "utf-8");
      const file = data.split("\n");
      const media = file.slice(-2);
      const mediaData = media[0];
      if (cek == mediaData) {
        console.log(
          chalk.red(`[${moment().format("HH:mm:ss")}] Already Comments ...`)
        );
        console.log(
          chalk.blue(
            `[${moment().format("HH:mm:ss")}] sleep ${waktu} Menit ...`
          )
        );
        await sleep();
      } else {
        const randomKomen = await readComments();
        console.log(
          chalk.green(
            `[${moment().format("HH:mm:ss")}] mendapatkan id : ${cek}`
          )
        );
        const comment = await ig.commentToMediaByMediaId({
          mediaId: `${cek}`,
          commentText: `${randomKomen}`,
        });
        if (comment.status == "ok") {
          const save = fs.appendFileSync("./mediakomen.txt", cek + "\n");
          console.log(
            chalk.green(
              `[${moment().format(
                "HH:mm:ss"
              )}] Berhasil komentar : ${randomKomen}`
            )
          );
          console.log(
            chalk.green(
              `[${moment().format(
                "HH:mm:ss"
              )}] [!] link : https://instagram.com/p/${link}`
            )
          );
          console.log(
            chalk.blue(
              `[${moment().format("HH:mm:ss")}] sleep ${waktu} Menit ...`
            )
          );
          await sleep();
        } else {
          console.log(
            chalk.red(
              `[${moment().format("HH:mm:ss")}] Gagal komentar`,
              comment.message
            )
          );
        }
      }
      console.log(
        chalk.bgCyan(
          `[${moment().format("HH:mm:ss")}] melanjutkan proses kembali`
        )
      );
    }
  } catch (error) {
    console.log("error", error.message);
  }
}
firtsComment();
