module.exports = (sequalize, type) => {
    return sequalize.define('articles_files', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        path: type.STRING
    })
};