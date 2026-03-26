# main.py  –  Flask application entry point
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from controllers.account_controller import account_bp
from controllers.auth_controller import auth_bp
from controllers.admin_controller import admin_bp
from controllers.customer_controller import customer_bp
import os

load_dotenv()

app = Flask(__name__)

# Allow requests from the React dev server
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# ── Register blueprints ───────────────────────────────────────
app.register_blueprint(account_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(customer_bp)


# ── Health check ──────────────────────────────────────────────
@app.get("/health")
def health():
    return jsonify({"status": "ok"})


# ── 404 fallback ──────────────────────────────────────────────
@app.errorhandler(404)
def not_found(_):
    return jsonify({"error": "Route not found."}), 404


if __name__ == "__main__":
    port  = int(os.getenv("FLASK_PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    app.run(port=port, debug=debug)
