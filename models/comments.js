module.exports = (sequalize, type) => {
    return sequalize.define('comments', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: type.STRING,
        body: type.TEXT,
        file: type.STRING,
        active: { type: type.BOOLEAN, defaultValue: true }
    })
};