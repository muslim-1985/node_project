const Redis = require('ioredis');
const node_ssh = require('node-ssh');
const {UserServersLogs} = require('../../../sequalize');
const ssh = new node_ssh();
const fs = require('fs');
const pub = new Redis();

module.exports = class Log {
    constructor (channel) {
        this.fs = fs;
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
   async execRemoteServer(cwdFilePath, filePath, logFile, userId, serverId, sharedServers) {
       try {
           //check change error.log file size from remote server
           let exec = await ssh.execCommand(`wc -c < ${logFile}`, {
               cwd: cwdFilePath,
               stream: 'stdout',
               options: {
                   pty: true
               }
           });
           let log = await ssh.execCommand(`tail < ${logFile}`, {
               cwd: cwdFilePath,
               stream: 'stdout',
               options: {
                   pty: true
               }
           });
            const logFileSizeDb = await UserServersLogs.findOne({ attributes:['log_file_size'], where: {userServerId: serverId}, order:[['id','DESC']]});

           if(logFileSizeDb == null || logFileSizeDb.log_file_size < exec.stdout) {
               if(sharedServers.length > 0) {
                   for (let servers of sharedServers) {
                       console.log(servers.userId);
                       try {
                           await UserServersLogs.create({
                               type: 'apache',
                               text: log.stdout,
                               userServerId: servers.id,
                               log_file_size: exec.stdout,
                           });
                           let convertData = await {fileData: log.stdout, userId: servers.userId};
                           let obj = await JSON.stringify(convertData);
                           await this.pub.publish(this.channel, obj);
                       } catch(e) {
                           console.log(e)
                       }
                   }
               } else {
                   try {
                       await UserServersLogs.create({
                           type: 'apache',
                           text: log.stdout,
                           userServerId: serverId,
                           log_file_size: exec.stdout,
                       });
                       let convertData = await {fileData: log.stdout, userId};
                       let obj = await JSON.stringify(convertData);
                       await this.pub.publish(this.channel, obj);
                   } catch(e) {
                       console.log(e)
                   }
               }
           }
       } catch (e) {
           console.log('STDERR: ' + exec.stderr)
       }
   }
   async _createAndPublish (id, userid) {
       try {
           await UserServersLogs.create({
               type: 'apache',
               text: log.stdout,
               userServerId: id,
               log_file_size: exec.stdout,
           });
           let convertData = await {fileData: log.stdout, userid};
           let obj = await JSON.stringify(convertData);
           await this.pub.publish(this.channel, obj);
       } catch(e) {
           console.log(e)
       }
   }
};