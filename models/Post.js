const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create Post model
// class Post extends Model { }

// refactored code
class Post extends Model{
    // passing in req.body(as body) and object of the models (as models)
    static upvote(body, models){
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = votes.post_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            // this references the User model
            // key is the primary key, and user_id is the foreign key
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        // this is metadata including the naming conventions
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;