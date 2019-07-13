module.exports = (sequalize, type) => {
    return sequalize.define ('articles_tags', {
        articleId: {
            type: type.INTEGER,
            allowNull: false,
            references: {
                model: 'Article',
                key: 'id'
            }
        },
        tagId: {
            type: type.INTEGER,
            allowNull: false,
            references: {
                model: 'Tag',
                key: 'id'
            }
        }
    })
};