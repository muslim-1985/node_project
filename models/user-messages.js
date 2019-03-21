module.exports = (sequalize, type) => {
    return sequalize.define ('user_messages', {
        id : {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        subject: type.TEXT,
        username: type.STRING,
        chat_id: type.INTEGER
    })
}