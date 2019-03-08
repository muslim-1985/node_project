const Redis = require('ioredis');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const fs = require('fs');
const UsersModel = require('../../../models/UsersModel');
const pub = new Redis();
/*
     set data structure contains only unique elements,
     and therefore it is impossible to write the same data
    **/
let logFileSize = new Set();
let logState = false;

module.exports = class Log {
    constructor (channel) {
        this.ssh = ssh;
        this.fs = fs;
        this.UsersModel = UsersModel;
        this.logFileSize = logFileSize;
        this.logState = logState;
        this.pub = pub;
        this.channel = channel;
    }

   async sshConnect(userData) {
       let {
           ip,
           username,
           privateKey,
           passphrase
       } = userData;
       await ssh.connect({
           host: ip,
           username,
           privateKey,
           passphrase,
           agent: process.env.SSH_AUTH_SOCK
       })
   }
   async execRemoteServer(cwdFilePath, filePath, logFile) {
       try {
           //check change error.log file size from remote server
           let exec = await ssh.execCommand(`wc -c < ${logFile}`, {
               cwd: cwdFilePath,
               stream: 'stdout',
               options: {
                   pty: true
               }
           });
           await this.logFileSize.add(exec.stdout)
           for await (let item of this.logFileSize) {
               if (this.logFileSize.size > 1) {
                   //change global state
                   this.logState = true;
                   this.logFileSize.delete(item)
               }
           }
           console.log(this.logFileSize.size)

           this._publishFileData(logFile, filePath);
       } catch (e) {
           console.log('STDERR: ' + exec.stderr)
       }
   }
   /*
    private method
   */
   async _publishFileData(logFile, filePath) {
       if (this.logState) {
           try {
               this.logState = false;
               await this.ssh.getFile(`./log_ssh/${logFile}`, filePath);
               this.fs.readFile(`./log_ssh/${logFile}`, {
                   encoding: 'utf-8'
               }, (err, data) => {
                   if (!err) {
                       let convertData = data.toString().split("\n")
                       let obj = JSON.stringify(convertData);
                       this.pub.publish(this.channel, obj);
                   } else {
                       console.log(err);
                       this.pub.disconnect();
                   }
               });
           } catch (e) {
               console.log(e)
           }
       }
   }
}