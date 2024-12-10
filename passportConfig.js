const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbconfig");
const bcrypt = require("bcrypt");

function initialize(passport) {
  console.log("Initialized");

  const authenticateUser = async (email, password, done) => {
    console.log("Authenticating user:", email);

    try {
      const { rows } = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );

      if (rows.length > 0) {
        const user = rows[0];

        // Compare passwords using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          // Password is incorrect
          return done(null, false, { message: "Password is incorrect" });
        }
      } else {
        // No user found
        return done(null, false, { message: "No user with that email address" });
      }
    } catch (err) {
      console.error("Error authenticating user:", err);
      return done(err);
    }
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );

  // Store user details inside the session
  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.id);
    done(null, user.id);
  });

  // Fetch user details from the session
  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
      if (err) {
        return done(err);
      }
      console.log(`Deserialized user ID: ${id}`);
      done(null, results.rows[0]);
    });
  });
}

module.exports = initialize;
