module.exports = (sequalize, type) => {
    return sequalize.define('tags', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: type.STRING
    })
};