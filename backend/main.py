# main.py  –  Flask application entry point
import sys
import os

# Ensure backend/ is on the path so relative imports work in Vercel's serverless runtime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from controllers.account_controller import account_bp
from controllers.auth_controller import auth_bp
from controllers.admin_controller import admin_bp
from controllers.customer_controller import customer_bp

load_dotenv()

app = Flask(__name__)

# CORS_ORIGINS env var lets you whitelist your Vercel URL in production.
# Falls back to localhost for local development.
_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
_origins = [o.strip() for o in _raw_origins.split(",")] if "," in _raw_origins else _raw_origins
CORS(app, resources={r"/api/*": {"origins": _origins}})

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
