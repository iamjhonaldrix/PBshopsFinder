from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

shops = [
    {"name": "bcofi", "category": "Coffee"},
    {"name": "Bote", "category": "Coffee"},
    {"name": "Stir", "category": "Cofee"},
    {"name": "Pharma•TEA Cafe", "category": "Coffee"},
    {"name": "Joe Brews", "category": "Coffee"},
    {"name": "By Grace Cafe", "category": "Coffee"},
    {"name": "Makoo", "category": "Coffee"},
    {"name": "Wakito's Pizza & Coffee", "category": "Coffee"},
]

@app.route("/api/shops")
def get_shops():
    category = request.args.get("category", "") 
    if category:
        filtered = [shop for shop in shops if shop["category"].lower() == category.lower()]
        return jsonify(filtered)
    return jsonify(shops)

if __name__ == "__main__":
    app.run(debug=True)