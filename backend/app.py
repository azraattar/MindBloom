from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from datetime import datetime
import uuid

# Load .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# ─────────────────────────────────────────────
# Supabase Configuration
# ─────────────────────────────────────────────
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("❌ Supabase credentials missing in .env file")

print("✅ Supabase URL Loaded:", SUPABASE_URL)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────
@app.route("/get-scores/<child_id>", methods=["GET"])
def get_scores(child_id):
    try:
        print("\n🔎 Fetching scores for child_id:", child_id)

        response = (
            supabase
            .table("child_daily_scores")
            .select("*")
            .eq("child_id", child_id)
            .order("day_number", desc=False)
            .execute()
        )

        print("📦 Full Supabase response:", response)

        if response.data is None:
            print("⚠ Supabase returned None")
            return jsonify([])

        print("✅ Supabase DATA:", response.data)

        return jsonify(response.data)

    except Exception as e:
        print("❌ ERROR fetching scores:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/add-child', methods=['POST'])
def add_child():
    try:
        data = request.get_json()

        parent_id = data.get('parent_id')
        if not parent_id:
            return jsonify({'error': 'Missing parent_id'}), 400

        print(f"Using parent ID: {parent_id}")

        child_response = supabase.table('children').insert({
            'parent_id': parent_id,   # ✅ DIRECT FK
            'name': data['name'],
            'age': data['age'],
            'gender': data['gender'],
            'language': data['language'],
            'dyslexia_level': None,
            'dyslexia_profile': None,
            
        }).execute()

        if child_response.data:
            return jsonify({
                'success': True,
                'child_id': child_response.data[0]['id'],
                'parent_id': parent_id,
                'message': 'Child added successfully'
            }), 201

        return jsonify({'error': 'Failed to add child'}), 400

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-children/<parent_id>', methods=['GET'])
def get_children(parent_id):
    try:
        print("──────────────────────────────")
        print("📥 /api/get-children HIT")
        print("➡️ parent_id (UUID):", parent_id)
        print("➡️ type:", type(parent_id))

        response = supabase.table('children') \
            .select('*') \
            .eq('parent_id', parent_id) \
            .execute()

        print("📦 Supabase data:", response.data)
        print("📊 Count:", len(response.data))
        print("──────────────────────────────")

        return jsonify(response.data), 200

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({'error': str(e)}), 500
# ─────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────
@app.route("/")
def home():
    return jsonify({"status": "Backend running"})

if __name__ == "__main__":
    app.run(debug=True)
