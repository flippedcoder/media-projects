import json
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "postgresql://flippedcoder:123qwe!!!@localhost:5432/calendar"

db = SQLAlchemy(app)
migrate = Migrate(app, db)


class EventsModel(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String())
    date = db.Column(db.Date())
    time = db.Column(db.Time())
    location = db.Column(db.String())
    description = db.Column(db.String())

    def __init__(self, title, date, time, location, description):
        self.title = title
        self.date = date
        self.time = time
        self.location = location
        self.description = description

    def __repr__(self):
        return f"<Event {self.title}>"


@app.route("/events", methods=["GET"])
def get_events():
    eventsData = EventsModel.query.all()
    events = [
        {
            "id": event.id,
            "title": event.title,
            "date": event.date,
            "time": event.time,
            "location": event.location,
            "description": event.description,
        }
        for event in eventsData
    ]
    
    return {"events": json.dumps(events, default=str)}


@app.route("/event/<event_id>", methods=["GET", "PUT"])
def event(event_id):
    event = EventsModel.query.get_or_404(event_id)

    if request.method == "GET":
        response = {
            "id": event.id,
            "title": event.title,
            "date": event.date,
            "time": event.time,
            "location": event.location,
            "description": event.description,
        }

        return {"message": "success", "event": json.dumps(response, default=str)}
    else:
        data = request.get_json()
        
        event.title = data['title']
        event.date = data['date']
        event.time = data['time']
        event.location = data['location']
        event.description = data['description']
        
        db.session.add(event)
        db.session.commit()
        
        return {"message": f"event {event.title} successfully updated"}


@app.route("/event", methods=["POST"])
def create_event():
    if request.is_json:
        data = request.get_json()

        new_event = EventsModel(
            title=data["title"],
            date=data["date"],
            time=data["time"],
            location=data["location"],
            description=data["description"],
        )

        db.session.add(new_event)
        db.session.commit()

        return {"message": f"event {new_event.title} has been created successfully."}
    else:
        return {"error": "The request payload is not in JSON format"}


if __name__ == "__main__":
    app.run()
