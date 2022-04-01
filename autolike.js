const Insta = require('node-insta-web-api/lib/')
const fs = require('fs')
const read = require('readline-sync')
const chalk = require('chalk');
const moment = require('moment');
const Instagram = require('node-insta-web-api/lib');

const waktu = read.question(chalk.green(`[${moment().format("HH:mm:ss")}] Masukan delay (menit) : `));
const askComments = read.question(chalk.green(`[${moment().format("HH:mm:ss")}] use random comment in text ? (yes/no)`));
const delayLimit = read.question(chalk.green(`[${moment().format("HH:mm:ss")}] Masukan limit per aksi (detik) : `));
async function limit() {
    return new Promise((resolve) => setTimeout(resolve , delayLimit * 1000))
}

async function sleep() {
    return new Promise((resolve) => setTimeout(resolve , waktu * 60000))
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

async function readComments() {
    const user = fs.readFileSync('comments.txt' , 'utf-8')
    const readFile = user.split("\n")
    const pickedComment = readFile[getRandomInt(0, readFile.length)]
    return pickedComment;
}

async function login() {
try {
        const ig = new Insta();
        //if(check_cookie) {
        const login = await ig.useExistingCookie()
            if (login) {
                console.log(`Login berhasil dengan akun ${login.username}`);
                while(true) {
                    try {
                    const getTimeline = await ig.scrollTimeline();
                    const getId = getTimeline.feed_items;
                    for (let index = 1; index < getId.length -1; index++) {
                        const id = getId[index];
                        const mediaId = id.media_or_ad.pk
                            if (id.media_or_ad.has_liked == true) {
                                console.log(chalk.red(`[${moment().format("HH:mm:ss")}] Url : https://instagram.com/p/${id.media_or_ad.code} . already liked`));
                                
                            } else {
                                const likes = await ig.likeMediaById(`${mediaId}`)
                                if (likes.status == 'ok') {
                                    console.log(chalk.cyan(`[${moment().format("HH:mm:ss")}] Berhasil Likes Url : https://instagram.com/p/${id.media_or_ad.code} . Total Success : ${index}`));
                                    await limit()
                                    if(askComments == 'yes') {
                                        const comments = await readComments()
                                        const comment = await ig.commentToMediaByMediaId({mediaId :`${mediaId}` , commentText:`${comments}`})
                                            if (comment.status == 'ok') {
                                            console.log(chalk.green(`[${moment().format("HH:mm:ss")}] Berhasil Comments : https://instagram.com/p/${id.media_or_ad.code} . isi komentar : ${comments}`));
                                            await limit()
                                                
                                            } else {
                                            console.log(chalk.red(`[${moment().format("HH:mm:ss")}] Gagal komentar` , comment.message));
                                                
                                            }
                                    }
                    

                                } else {
                                    console.log(chalk.red(`[${moment().format("HH:mm:ss")}] Gagal Likes` , likes.message));
                    
                                }
                            }
                    }
                    console.log(chalk.blue(`[${moment().format("HH:mm:ss")}] Delay ${waktu} Menit`));
                    await sleep()
                    console.log(chalk.blue(`[${moment().format("HH:mm:ss")}] Memulai Proses kembali ..`));
                } catch (error) {
                    console.log("Error" , error.message);
                        
                }
            
                }
                


            } else {
                console.log("Login gagal ...");
            }
        //}
} catch (error) {
        console.log(`Error` , error.message);
    }
}

(async() => {
    try {
            const check_cookie = fs.existsSync('./Cookies.json')
            if (!check_cookie) {
                const ig2 = new Instagram();
                const username = read.question(chalk.green(`[${moment().format("HH:mm:ss")}] Masukan Username kamu (ex:ryn.andri) : `))
                const password = read.question(chalk.green(`[${moment().format("HH:mm:ss")}] Masukan password kamu : `))
                const preLogin = await ig2.login(username,password);
                    if (preLogin.userId) {
                        console.log(`${username} Berhasil Login` , preLogin);
                        await login();
                    } else {
                        console.log(`${username} Gagal Login` , preLogin.message);
                    }
                }
            if (check_cookie) {
                await login();
                
            }
        } catch (error) {
            console.log("error" , error.message);
        
        }

})()