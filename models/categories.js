module.exports = (sequalize, type) => {
    return sequalize.define('categories', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: type.STRING,
        image: type.STRING,
        active: { type: type.BOOLEAN, defaultValue: true }
    })
};