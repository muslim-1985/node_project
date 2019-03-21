
module.exports = (sequalize, type) => {
    return sequalize.define ('user', {
        id : {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        email: type.STRING,
        password: {
            type: type.STRING,
            allowNull: false
        },
        role: type.STRING,
        watch: { type: type.BOOLEAN, defaultValue: false }
    })
}