const Sequalize = require( 'sequelize');
const UserModel = require( './models/user');
const BotUsersModel = require('./models/bot-users');
const BotUsersMessagesModel = require('./models/user-messages');
const ArticleModel = require('./models/articles');
const CategoryModel = require('./models/categories');
const CommentModel = require('./models/comments');
const TagsModel = require('./models/tags');
const ArticleFilesModel = require('./models/articles_files');
const ArticleTagModel = require('./models/articles_tags');
const config = require( './config/config');

const sequalize = new Sequalize(config.pdb.dbname, config.pdb.user, config.pdb.pass, {
    host: config.pdb.host,
    dialect: 'postgres'
});

const User = UserModel(sequalize, Sequalize);
const Article = ArticleModel(sequalize, Sequalize);
const BotUsers = BotUsersModel(sequalize, Sequalize);
User.hasOne(BotUsers);
BotUsers.belongsTo(User);
User.hasMany(Article);
Article.belongsTo(User);

const BotUsersMessages = BotUsersMessagesModel(sequalize, Sequalize);
BotUsers.hasMany(BotUsersMessages);
BotUsersMessages.belongsTo(BotUsers);

const Category = CategoryModel(sequalize, Sequalize);
Category.hasMany(Article);
Article.belongsTo(Category);

const Comment = CommentModel(sequalize, Sequalize);
Article.hasMany(Comment);
Comment.belongsTo(Article);

//many-to-many
const ArticleTag = ArticleTagModel(sequalize, Sequalize);
const Tag = TagsModel(sequalize, Sequalize);
Tag.belongsToMany(Article, { through: ArticleTag });
Article.belongsToMany(Tag, { through: ArticleTag });

const ArticleFile = ArticleFilesModel(sequalize, Sequalize);
Article.hasMany(ArticleFile);
ArticleFile.belongsTo(Article);

sequalize.sync()
    .then(()=> {
        console.log('database user created')
    });

module.exports = {User, BotUsers, BotUsersMessages, sequalize};