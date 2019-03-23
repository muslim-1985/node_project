module.exports = (sequalize, type) => {
    return sequalize.define ('server_logs', {
        id : {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: type.STRING,
        text: type.TEXT,
        log_file_size: type.INTEGER
    })
};