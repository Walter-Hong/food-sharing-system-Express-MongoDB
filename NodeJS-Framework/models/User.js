"use strict";
/**
 * user model
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|Model}
 */
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'id',
            autoIncrement: true,
            unique: true
        },
        username: {
            type: DataTypes.INTEGER,
            field: 'username',
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            field: 'email',
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            field: 'password'
        },
        avatar: {
            defaultValue: "images/user/avatar/default/0.png",
            type: DataTypes.STRING,
            field: 'avatar'
        },
        nick: {
            type: DataTypes.STRING,
            field: 'nick',
        },
        sign: {
            type: DataTypes.STRING,
            field: 'sign',
        },
        login_count: {
            defaultValue: 0,
            type: DataTypes.INTEGER,
            field: 'login_count',
        }

    }, {
        timestamps: true,
        createdAt: 'create_at',
        deletedAt: 'delete_at',
        paranoid: true,
        freezeTableName: true,

        classMethods: {
            insert: function (data, models) {
                return new models.sequelize.Promise(function (resolve, reject) {
                    var err = false;
                    var password = data.password;
                    if (password) {
                        var salt = crypto.randomBytes(8);
                        var recievedHash = crypto.createHash('md5')
                            .update(password)
                            .update(salt)
                            .digest('hex');
                        var hashedPassword = recievedHash + ',' + salt.toString('hex');
                        data.password = hashedPassword;
                    }
                    models.User.create(data).then(function (user) {
                        resolve(user);
                    }).catch(reject);
                });
            },
            getByUsername: function (username, models) {
                return models.User.findOne({
                    where: {
                        $or: [{username: username}, {email: username}]
                    },
                });
            },
            getById: function (id, models) {
                return models.User.findOne({
                    where: {
                        id: id
                    },
                    attributes: {
                        exclude: ['password']
                    }
                });
            },
            getByEmail: function (email, models) {
                return models.User.findOne({
                    where: {
                        email: email
                    },
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
        }
    });

    return User;
};
