import { validateUser } from '../middleware/validationMiddleware.js';

// user registration
export const register = [
  validateUser,
  async (req, res) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        photo: req.body.photo,
      });

      await newUser.save();

      res.status(200).json({ success: true, message: 'Successfully created' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to create. Try again', error: err.message });
    }
  },
];

// user login
export const login = [
  validateUser,
  async (req, res) => {
    const email = req.body.email;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password);
      if (!checkCorrectPassword) {
        return res.status(401).json({ success: false, message: 'Incorrect email or password' });
      }

      const { password, role, ...rest } = user._doc;

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRATION || '15d',
      });

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days expiration
      }).status(200).json({
        token,
        data: { ...rest },
        role,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to login. Try again', error: err.message });
    }
  },
];
