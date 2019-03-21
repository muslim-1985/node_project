module.exports = (sequalize, type) => {
    return sequalize.define ('user_servers', {
        id : {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: type.STRING,
        key: type.TEXT,
        passpharse: {
            type: type.STRING,
            allowNull: false
        },
        ip: type.INET,
        type: type.STRING,
        watch: type.BOOLEAN
    })
}