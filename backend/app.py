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
        
        # ✅ FIXED: Get from React request (NOT localStorage!)
        parent_identifier = data.get('parent_identifier')
        
        if not parent_identifier:
            return jsonify({'error': 'Missing parent_identifier (email/username)'}), 400
        
        # ✅ FIXED: Table = 'parents', Column = 'id' (not 'uid')
        parent_query = supabase.table('parents').select('id').eq('email', parent_identifier).execute()
        
        if len(parent_query.data) == 0:
            return jsonify({'error': f'Parent not found with identifier: {parent_identifier}'}), 404
        
        # ✅ FIXED: Use 'id' from parents table (primary key)
        parent_id = parent_query.data[0]['id']
        
        print(f"Found parent ID: {parent_id}")
        
        # Insert child with REAL parent_id
        child_response = supabase.table('children').insert({
            'parent_id': parent_id,  # ✅ Real UUID from parents.id
            'name': data['name'],
            'age': data['age'],
            'gender': data['gender'],
            'language': data['language'],
            'dyslexia_level': None,
            'dyslexia_profile': None,
            'created_at': datetime.utcnow()
        }).execute()
        
        if len(child_response.data) > 0:
            return jsonify({
                'success': True,
                'child_id': child_response.data[0]['id'],
                'parent_id': parent_id,
                'message': 'Child added successfully'
            }), 201
        else:
            return jsonify({'error': 'Failed to add child'}), 400
            
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

# ─────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────
@app.route("/")
def home():
    return jsonify({"status": "Backend running"})

if __name__ == "__main__":
    app.run(debug=True)
