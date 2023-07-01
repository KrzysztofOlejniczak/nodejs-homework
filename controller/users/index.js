const User = require("../../service/schemas/user");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const nanoid = require("nanoid");
require("dotenv").config();
const secret = process.env.SECRET;
const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const randomstring = require("randomstring");
const fs = require("fs/promises");
const { sendVerificationEmail } = require("../../utils/mailsender");

const validationUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

const validationEmail = Joi.object({
  email: Joi.string().email().required(),
});

const validationUserSubscription = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const verificationToken = nanoid.nanoid(15);
  const avatarURL = gravatar.url(
    email,
    { s: "200", r: "pg", d: "identicon" },
    true
  );

  try {
    const { error } = validationUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "Bad request",
        code: 400,
        message: error.message,
        data: "Bad request",
      });
    } else {
      const user = await User.findOne({ email });
      if (user) {
        return res.status(409).json({
          status: "error",
          code: 409,
          message: "Email in use",
          data: "Conflict",
        });
      }
      try {
        const newUser = new User({ email, avatarURL, verificationToken });
        newUser.setPassword(password);
        await newUser.save();

        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({
          status: "created",
          code: 201,
          data: {
            user: {
              email: newUser.email,
              subscription: newUser.subscription,
            },
          },
        });
      } catch (error) {
        next(error);
      }
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { error } = validationUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "Bad request",
        code: 400,
        message: error.message,
        data: "Bad request",
      });
    } else {
      const user = await User.findOne({ email });

      if (!user || !user.validPassword(password)) {
        return res.status(401).json({
          status: "Unauthorized",
          code: 401,
          message: "Email or password is wrong",
          data: "Bad request",
        });
      }

      if (user.verify === false) {
        return res.status(401).json({
          status: "Unauthorized",
          code: 401,
          message: "User not verified",
          data: "Bad request",
        });
      }

      const payload = {
        id: user.id,
      };

      const token = jwt.sign(payload, secret, { expiresIn: "1h" });

      user.setToken(token);
      await user.save();

      res.json({
        status: "success",
        code: 200,
        data: {
          token: user.token,
          user: {
            email: user.email,
            subscription: user.subscription,
          },
        },
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findOne({ _id });

  if (!user) {
    return res.status(401).json({
      status: "Unauthorized",
      code: 401,
      message: "Not authorized",
      data: "Bad request",
    });
  }

  user.setToken(null);
  await user.save();

  return res.status(204).send();
};

const getCurrent = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({
      status: "success",
      code: 200,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const setSubscription = async (req, res, next) => {
  try {
    const { error } = validationUserSubscription.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "Bad request",
        code: 400,
        message: error.message,
        data: "Bad request",
      });
    } else {
      const { subscription } = req.body;
      const user = req.user;
      user.setSubscription(subscription);
      await user.save();

      res.json({
        status: "success",
        code: 200,
        data: {
          user: {
            email: user.email,
            subscription: user.subscription,
          },
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const setAvatar = async (req, res, next) => {
  try {
    const { path: temporaryName } = req.file;
    const ext = path.extname(temporaryName);
    const avatarName = randomstring.generate() + ext;
    const storeImage = path.join(
      process.cwd(),
      "public",
      "avatars",
      avatarName
    );

    try {
      Jimp.read(temporaryName).then((avatar) => {
        return avatar
          .cover(
            250,
            250,
            Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
          )
          .quality(60)
          .write(storeImage);
      });
    } catch (err) {
      await fs.unlink(temporaryName);
      next(err);
    }
    await fs.unlink(temporaryName);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Not authorized",
        data: "Bad request",
      });
    }

    user.avatarURL = `/avatars/${avatarName}`;
    await user.save();

    res.status(200).json({
      status: "success",
      code: 200,
      data: { avatarURL: user.avatarURL },
    });
  } catch (err) {
    next(err);
  }
};

const verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({
        status: "Not found",
        code: 404,
        message: "User not found",
        data: "Not found",
      });
    }

    user.verificationToken = "null";
    user.verify = true;
    await user.save();

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Verification successful",
    });
  } catch (err) {
    next(err);
  }
};

const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const { error } = validationEmail.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "Bad request",
        code: 400,
        message: error.message,
        data: "Bad request",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "Not found",
        code: 404,
        message: "User not found",
        data: "Not found",
      });
    }

    if (user.verify === true) {
      return res.status(400).json({
        status: "Bad request",
        code: 400,
        message: "Verification has already been passed",
        data: "Bad request",
      });
    }

    await sendVerificationEmail(user.email, user.verificationToken);

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Verification email sent",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getCurrent,
  setSubscription,
  setAvatar,
  verifyUser,
  resendVerificationEmail,
};
