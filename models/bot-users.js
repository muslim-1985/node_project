module.exports = (sequalize, type) => {
    return sequalize.define('bot_users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        chatId: type.INTEGER,
        username: type.STRING,
        firstName: type.STRING,
        lastName: type.STRING,
        avatar: type.STRING,
        watch: type.BOOLEAN
    })
};