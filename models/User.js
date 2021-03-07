const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create the User model
class User extends Model { 
    // set up method to run on instance data (per user) to check password
    // this will compare plaintext loginPw to the hashed password
    checkPassword(loginPw){
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// define table columns and configuration
User.init(
    {
        // define an id column
        id: {
            // use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL 'NOT NULL'
            allowNull: false,
            // instruct that this is the primary key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        // define username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validator before creating table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least 4 characters
                len: [4]
            }
        }
    },
    // this second object will hash the password using bcrypt
    {
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                // 10 is the saltRound value, will use 10 rounds to encrypt the password
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // set up beforeUpdate lifecycle 'hook' functionality
            async beforeUpdate(updatedUserData){
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // table config options go here(https://sequelize.org/v5/manual/models-definition.html#configuration))

        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create createdAt/ updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camelCasing
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    },
);

module.exports = User;
