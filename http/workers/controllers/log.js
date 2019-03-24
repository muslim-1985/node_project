const Redis = require('ioredis');
const node_ssh = require('node-ssh');
const {UserServersLogs} = require('../../../sequalize');
const ssh = new node_ssh();
const pub = new Redis();

module.exports = class Log {
    constructor (channel) {
        this.pub = pub;
        this.channel = channel;
        this.exec;
        this.log;
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

   async execute (cwdFilePath, logFile,) {
       return await ssh.execCommand(`wc -c < ${logFile}`, {
           cwd: cwdFilePath,
           stream: 'stdout',
           options: {
               pty: true
           }
       });
   }
   async tailFile (cwdFilePath, logFile) {
       return await ssh.execCommand(`tail < ${logFile}`, {
           cwd: cwdFilePath,
           stream: 'stdout',
           options: {
               pty: true
           }
       });
   }


    async execRemoteServer(cwdFilePath, filePath, logFile, userId, serverId) {
        try {
            //check change error.log file size from remote server
            this.exec = this.execute(cwdFilePath, logFile);
            this.log = this.tailFile(cwdFilePath, logFile);

            const logFileSizeDb = await UserServersLogs.findOne({
                attributes: ['log_file_size'],
                where: {userServerId: serverId},
                order: [['id', 'DESC']]
            });

            if (logFileSizeDb == null || logFileSizeDb.log_file_size < this.exec.stdout) {
                await this.createAndPublish(serverId, userId, this);
            }

        } catch (e) {
            console.log('STDERR: ' + exec.stderr)
        }
   }
   async createAndPublish (id, userid, self) {
       try {
           await UserServersLogs.create({
               type: 'apache',
               text: self.log.stdout,
               userServerId: id,
               log_file_size: self.exec.stdout,
           });
           let convertData = await {fileData: self.log.stdout, userId: userid};
           let obj = await JSON.stringify(convertData);
           await self.pub.publish(self.channel, obj);
       } catch(e) {
           console.log(e)
       }
   }
};