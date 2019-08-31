
module.exports = (sequalize, type) => {
    return sequalize.define ('user', {
        id : {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        email: type.STRING,
        avatar: type.STRING,
        password: {
            type: type.STRING,
            allowNull: false
        },
        role_id: {type: type.INTEGER, defaultValue: 1},
        watch: { type: type.BOOLEAN, defaultValue: false }
    })
};