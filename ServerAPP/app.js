require("dotenv").config();
const express = require("express");
const path = require("path");
const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/authRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const tablesController = require("./controllers/tablesController");
const requireAuth = require("./middleware/requireAuth");

const app = express();
const PORT = process.env.PORT || 3000;

// trust proxy (required for cookies/session behind Render/HTTPS)
app.set("trust proxy", 1);

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static files
app.use(express.static(path.join(__dirname, "public")));

// sessions
app.use(sessionMiddleware);

// make user available in views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// debug: log every request and session state
app.use((req, res, next) => {
    const hasUser = !!req.session?.user;
    console.log(`[DEBUG] ${req.method} ${req.path} | session.user: ${hasUser ? `id=${req.session.user.id} ${req.session.user.email}` : "none"}`);
    next();
});

// routes
app.use(authRoutes);
app.use("/favorites", favoritesRoutes);

// table data (protected)
app.get("/tables", requireAuth, (req, res) => tablesController.showTables(req, res));

// protected home
app.get("/", requireAuth, (req, res) => {
    res.render("home", { user: req.session.user });
});

// health check for Render
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});

// fallback
app.use((req, res) => {
    res.status(404).send("Not Found");
});

app.listen(PORT, () => {
    console.log(`[DEBUG] Server started | PORT=${PORT} NODE_ENV=${process.env.NODE_ENV || "undefined"}`);
    console.log(`http://localhost:${PORT}`);
});
