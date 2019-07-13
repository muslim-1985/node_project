module.exports = (sequalize, type) => {
    return sequalize.define('articles', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: type.STRING,
        body: type.TEXT,
        image: type.STRING,
        active: { type: type.BOOLEAN, defaultValue: true }
    })
};