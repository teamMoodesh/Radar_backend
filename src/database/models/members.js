const { DataTypes } = require("sequelize");
const { sequelize } = require("../index");
const roles = require("./roles");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const members = sequelize.define("members", {
  member_id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  member_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  member_role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "roles",
      key: "role_id",
    },
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  member_user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: null,
  },
});

members.belongsTo(roles, { foreignKey: "member_role_id" });

members.beforeCreate(async (member, options) => {
  if (member.changed("password")) {
    member.password = await bcrypt.hash(member.password, 10);
  }
});

members.beforeUpdate(async (member, options) => {
  if (member.changed("password")) {
    member.password = await bcrypt.hash(member.password, 10);
  }
});

members.prototype.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

members.prototype.generateAccessToken = function () {
  return jwt.sign(
    {
      member_id: this.member_id,
      email: this.email,
      username: this.member_user_name,
      fullName: this.member_name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

members.prototype.generateRefreshToken = function () {
  return jwt.sign(
    {
      member_id: this.member_id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

module.exports = members;
