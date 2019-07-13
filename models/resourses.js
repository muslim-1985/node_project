module.exports = (sequalize, type) => {
    return sequalize.define ('resourses', {
        id : {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        watch: { type: type.BOOLEAN, defaultValue: false }
    })
};