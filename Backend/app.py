from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shop_users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# =========================
# MODELS
# =========================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    shops = db.relationship('Shop', backref='owner', lazy=True)


class Shop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Reaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    shop_id = db.Column(db.Integer, db.ForeignKey('shop.id'), nullable=False)


class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    shop_id = db.Column(db.Integer, db.ForeignKey('shop.id'), nullable=False)
    value = db.Column(db.Integer, nullable=False)


with app.app_context():
    db.create_all()

# =========================
# AUTH
# =========================

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json

    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"message": "Username and password are required"}), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "Username already exists"}), 400

    user = User(
        username=data["username"],
        password_hash=generate_password_hash(data["password"])
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created", "user_id": user.id}), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json

    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"message": "Username and password are required"}), 400

    user = User.query.filter_by(username=data["username"]).first()

    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"message": "Invalid username or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": user.id,
        "username": user.username
    }), 200

# =========================
# SHOPS
# =========================

@app.route("/api/shops", methods=["GET"])
def get_shops():
    category = request.args.get("category", "").strip()

    if category:
        shops = Shop.query.filter(Shop.category.ilike(f"%{category}%")).all()
    else:
        shops = Shop.query.all()

    result = []

    for s in shops:
        ratings = Rating.query.filter_by(shop_id=s.id).all()
        avg = sum([r.value for r in ratings]) / len(ratings) if ratings else 0

        result.append({
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "rating": round(avg, 1)
        })

    return jsonify(result), 200


@app.route("/api/shops", methods=["POST"])
def create_shop():
    data = request.json

    if not data or not data.get("name") or not data.get("category") or not data.get("user_id"):
        return jsonify({"message": "name, category, and user_id are required"}), 400

    user = User.query.get(data["user_id"])

    if not user:
        return jsonify({"message": "User not found"}), 404

    new_shop = Shop(
        name=data["name"],
        category=data["category"],
        user_id=data["user_id"]
    )

    db.session.add(new_shop)
    db.session.commit()

    return jsonify({
        "message": "Shop created",
        "shop": {
            "id": new_shop.id,
            "name": new_shop.name,
            "category": new_shop.category
        }
    }), 201

# =========================
# USER SHOPS
# =========================

@app.route("/api/shops/<int:user_id>", methods=["GET"])
def get_user_shops(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "username": user.username,
        "shops": [
            {"id": s.id, "name": s.name, "category": s.category}
            for s in user.shops
        ]
    }), 200

# =========================
# UPDATE
# =========================

@app.route("/api/shops/<int:shop_id>", methods=["PUT"])
def update_shop(shop_id):
    shop = Shop.query.get(shop_id)

    if not shop:
        return jsonify({"message": "Shop not found"}), 404

    data = request.json

    if data.get("name"):
        shop.name = data["name"]
    if data.get("category"):
        shop.category = data["category"]

    db.session.commit()

    return jsonify({
        "message": "Shop updated",
        "shop": {
            "id": shop.id,
            "name": shop.name,
            "category": shop.category
        }
    }), 200

# =========================
# DELETE
# =========================

@app.route("/api/shops/<int:shop_id>", methods=["DELETE"])
def delete_shop(shop_id):
    shop = Shop.query.get(shop_id)

    if not shop:
        return jsonify({"message": "Shop not found"}), 404

    db.session.delete(shop)
    db.session.commit()

    return jsonify({"message": "Shop deleted"}), 200

# =========================
# REACTION (TOGGLE)
# =========================

@app.route("/api/shops/<int:shop_id>/react", methods=["POST"])
def react_shop(shop_id):
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"message": "user_id required"}), 400

    existing = Reaction.query.filter_by(
        user_id=user_id,
        shop_id=shop_id
    ).first()

    if existing:
        db.session.delete(existing)
        db.session.commit()
        count = Reaction.query.filter_by(shop_id=shop_id).count()
        return jsonify({"reacted": False, "count": count})

    new_reaction = Reaction(user_id=user_id, shop_id=shop_id)
    db.session.add(new_reaction)
    db.session.commit()

    count = Reaction.query.filter_by(shop_id=shop_id).count()
    return jsonify({"reacted": True, "count": count})

# =========================
# RATING (1–5 STAR)
# =========================

@app.route("/api/shops/<int:shop_id>/rate", methods=["POST"])
def rate_shop(shop_id):
    data = request.json
    user_id = data.get("user_id")

    try:
        value = int(data.get("value", 0))
    except:
        return jsonify({"message": "Invalid rating"}), 400

    if not user_id or value < 1 or value > 5:
        return jsonify({"message": "Invalid data"}), 400

    rating = Rating.query.filter_by(
        user_id=user_id,
        shop_id=shop_id
    ).first()

    if rating:
        rating.value = value
    else:
        db.session.add(Rating(
            user_id=user_id,
            shop_id=shop_id,
            value=value
        ))

    db.session.commit()

    ratings = Rating.query.filter_by(shop_id=shop_id).all()
    avg = sum([r.value for r in ratings]) / len(ratings) if ratings else 0

    return jsonify({
        "average": round(avg, 1),
        "user_rating": value
    })

# =========================
# RUN
# =========================

if __name__ == "__main__":
    app.run(debug=True)