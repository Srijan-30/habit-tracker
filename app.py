from flask import Flask, jsonify, request, send_from_directory
import os

app = Flask(__name__, static_folder='static')

# In-memory habit store
habits = [
    {"id": 1, "title": "2 Hours Python Coding", "completed": False},
    {"id": 2, "title": "1 Hour Korean Language Study", "completed": False},
    {"id": 3, "title": "5 Min Breathing Meditation", "completed": False},
    {"id": 4, "title": "Exercise / Workout", "completed": False}
]

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/habits', methods=['GET'])
def get_habits():
    return jsonify(habits)

@app.route('/api/habits', methods=['POST'])
def add_habit():
    data = request.json
    new_habit = {
        "id": len(habits) + 1,
        "title": data.get("title", ""),
        "completed": False
    }
    habits.append(new_habit)
    return jsonify(new_habit), 201

@app.route('/api/habits/<int:habit_id>/toggle', methods=['POST'])
def toggle_habit(habit_id):
    for habit in habits:
        if habit["id"] == habit_id:
            habit["completed"] = not habit["completed"]
            return jsonify(habit)
    return jsonify({"error": "Habit not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)