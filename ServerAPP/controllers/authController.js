const authService = require("../services/authService");

class AuthController {
    showRegister(req, res) {
        console.log("[DEBUG] Auth: showRegister");
        res.render("register", { error: null });
    }

    async register(req, res) {
        console.log("[DEBUG] Auth: register start", { email: req.body?.email });
        try {
            const { email, fullName, password } = req.body;
            const user = await authService.register({ email, fullName, password });
            console.log("[DEBUG] Auth: register user created", { id: user.id, email: user.email });

            req.session.user = { id: user.id, email: user.email, fullName: user.fullName };

            req.session.save((err) => {
                if (err) {
                    console.error("[DEBUG] Auth: register session.save ERROR", err);
                    return res.status(500).render("register", { error: "Registration failed. Try again." });
                }
                console.log("[DEBUG] Auth: register session.save OK, redirecting to /");
                res.redirect("/");
            });
        } catch (err) {
            console.log("[DEBUG] Auth: register error", err.message);
            res.status(400).render("register", { error: err.message });
        }
    }

    showLogin(req, res) {
        console.log("[DEBUG] Auth: showLogin");
        res.render("login", { error: null });
    }

    async login(req, res) {
        console.log("[DEBUG] Auth: login start", { email: req.body?.email });
        try {
            const { email, password } = req.body;
            const user = await authService.login({ email, password });
            console.log("[DEBUG] Auth: login user found", { id: user.id, email: user.email });

            req.session.user = { id: user.id, email: user.email, fullName: user.fullName };

            req.session.save((err) => {
                if (err) {
                    console.error("[DEBUG] Auth: login session.save ERROR", err);
                    return res.status(500).render("login", { error: "Login failed. Try again." });
                }
                console.log("[DEBUG] Auth: login session.save OK, redirecting to /");
                res.redirect("/");
            });
        } catch (err) {
            console.log("[DEBUG] Auth: login error", err.message);
            res.status(400).render("login", { error: err.message });
        }
    }

    logout(req, res) {
        console.log("[DEBUG] Auth: logout");
        req.session.destroy(() => {
            res.redirect("/login");
        });
    }
}

module.exports = new AuthController();
