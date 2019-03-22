const Redis = require('ioredis');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const fs = require('fs');
//const UsersModel = require('../../../models/UsersModel');
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
        this.UsersModel = 'model';//UsersModel;
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
   async execRemoteServer(cwdFilePath, filePath, logFile, userId, serverId,sharedServers, state) {
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

           await this._publishFileData(logFile, filePath, userId, serverId, sharedServers, state);
       } catch (e) {
           console.log('STDERR: ' + exec.stderr)
       }
   }
   /*
    private method
   */
   async _publishFileData(logFile, filePath, userId, serverId, sharedServers, state) {
       console.log(state)
    
       console.log(sharedServers)
       if (this.logState) {

           try {
               this.logState = false;
               await this.ssh.getFile(`./log_ssh/${userId}/${serverId}/${logFile}`, filePath);
               this.fs.readFile(`./log_ssh/${userId}/${serverId}/${logFile}`, {
                   encoding: 'utf-8'
               }, (err, data) => {
                   if (!err) {
                       let convertData = {fileData: data.toString().split("\n"), userId};
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