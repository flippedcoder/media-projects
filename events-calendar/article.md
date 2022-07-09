# Make a Community Events Calendar

Raising awareness of things going on in your community is a great way to make people feel more connected and involved in what's going on around them. A community calendar where people can add events can help with that.

We're going to build a calendar that uses Flask on the back-end to interact with a Postgres database and React on the front-end. Users will be able to upload event details, see which days have events, and more.

## Setting up the project

We're going to need a root folder to hold the front-end and back-end of our project, so create a new folder called `events-calendar`. Inside this folder, add a new subfolder called `server`. We'll make the Flask app in the `server` folder.

Now let's set up the local Postgres instance. You can download it [here](https://www.postgresql.org/download/). Make sure you take note of your username and password because we'll need them in the connection string for the back-end. That's all the base setup we need and now we can start making the Flask app.

## Working in the Flask environment

Since the back-end will use a Python framework, you'll need to create a virtual environment before we start installing packages. To do that, open your terminal, go to the `server` directory, and run the following commands:

```bash
$ python3 -m venv .venv
$ source .venv/bin/activate
```

Next, we'll install the [Flask](https://flask.palletsprojects.com/en/2.0.x/) package and some others with the following command:

```bash
$ pip install flask flask_sqlalchemy flask_cors flask_migrate
```

With the environment set up and all of the packages installed, we're ready to create some files for our server.

### Making the Flask API

Inside the `server` folder, add a new file called `api.py`. This is the file that will hold the different endpoints our front-end will call. Open this new file and add the following code.

```python
# api.py
import json
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "postgresql://username:password@localhost:5432/calendar"

db = SQLAlchemy(app)

migrate = Migrate(app, db)
```

This brings in all of the packages we need and it creates the application. We're applying the CORS package to the app so that we can call the endpoint from a different domain. Then we're connecting the app to our Postgres database and getting it ready to migrate the schema. Make sure you put in your username and password for that connection string.

### Database schema

We can add the schema for the one table we need below our app setup. Below the existing code, add the following.

```python
# api.py

...
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
```

This describes the table that we want to add to the database. It will be the `events` table and it'll have six columns to hold details about every event we add. This is all we need to run the database migration. To do that, go to the `server` directory in your terminal and run the following.

```bash
$ flask db init
```

This will add a `migrations` folder to your project. Next we need to generate the migration for our model with the following command.

```bash
$ flask db migrate -m "added events table"
```

Finally, we can run this migration and make these changes in the database with the following command.

```bash
$ flask db upgrade
```

If you take a look in your Postgres instance, you'll see the new table and all of the fields we defined in the model. Now we can start creating the endpoints that will work with the data we store in this table.

### Create an event

Let's start with the endpoint that will allow users to create new events on the calendar. Below the events model, add the following code.

```python
# api.py

...
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
```

When a `POST` request is made to the `/event` endpoint with the correct data, it will add a new record to the events table in the database and send a success message with the event title in the response.

### Get all of the events

We'll need to be able to get all of the events that are in the calendar so that we can render them correctly. To fetch all of the events from the database, add the following code to your `api.py` file below the create event endpoint.

```python
# api.py

...
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
```

This creates a new `GET` route called `/events`. Anytime this endpoint is called with a `GET` request, it will go to the database and retrieve all of the records from the events table and return it as a JSON string.

### Get and update an event

We can take advantage of the request type to use the same endpoint to handle different functionality. There will be times we want to look at or edit a particular event. We could use separate endpoints for this, but we're going to use different request types to distinguish which type of call is being made. Add the following code below the endpoint to get all of the events.

```python
# api.py

...
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

        event.title = data["title"]
        event.date = data["date"]
        event.time = data["time"]
        event.location = data["location"]
        event.description = data["description"]

        db.session.add(event)
        db.session.commit()

        return {"message": f"event {event.title} successfully updated"}
```

This checks that the database has a record for the given event ID or it returns an error. If there is a record, the request type is checked and if it is a `GET` request, it will return a JSON string with that event's details. If it's a `POST` request, it will update the event record and save the changes to the database.

### Run the file correctly

We're going to run this as the main program so we'll add this bit of code at the bottom of our file.

```python
# api.py

...
if __name__ == "__main__":
    app.run()
```

You can test this out by running the app with the following command in your terminal.

```bash
$ python api.py
```

You should see your server start on `localhost:5000` and try sending a request to the `/event` endpoint to make a new record. This is actually everything we need to for the API! We have the database connected and all of the endpoints we need to work with data on the front-end so we can switch our attention there.

## Building the React App

Switching over to the front-end, go to the root directory in the terminal and run the following command.

```bash
$ npx create-react-app client --template typescript
```

This will generate a new React project for you in a new directory called `client`. In your terminal, go to the `client` directory and run the following command to add the packages we'll use.

```bash
$ npm i axios react-calendar react-modal
```

With the packages installed, let's start by making the one component we need for this project.

### Add the event modal

In the `client` folder, add a new subfolder called `components`. Inside that folder, add a new file called `Event.tsx`. This will be the modal that appears when users want to view or edit an individual event. Add the following code to that file.

```tsx
// Event.tsx
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function Event({
  showModal,
  setShowModal,
  event,
}: {
  showModal: boolean;
  setShowModal: () => void;
  event?: any;
}) {
  const saveEvent = async (event: any) => {
    event.preventDefault();
    const eventData = {
      title: event.target.title.value,
      date: event.target.date.value,
      time: event.target.time.value,
      location: event.target.location.value,
      description: event.target.description.value,
    };

    if (!event) {
      await axios.post("http://localhost:5000/event", eventData);
    } else {
      await axios.put(`http://localhost:5000/event/${event.id}`, eventData);
    }
  };

  return (
    <>
      <Modal
        isOpen={showModal}
        onRequestClose={setShowModal}
        contentLabel="Event"
      >
        <div>Event</div>
        <form onSubmit={saveEvent}>
          <div>
            <label htmlFor="title">Event title</label>
            <input
              name="title"
              type="text"
              id="title"
              defaultValue={event?.title}
            />
          </div>
          <div>
            <label htmlFor="date">Event dateime</label>
            <input
              name="date"
              type="text"
              id="date"
              defaultValue={event?.date}
            />
          </div>
          <div>
            <label htmlFor="time">Event time</label>
            <input
              name="time"
              type="text"
              id="time"
              defaultValue={event?.time}
            />
          </div>
          <div>
            <label htmlFor="location">Event location</label>
            <input
              name="location"
              type="text"
              id="location"
              defaultValue={event?.location}
            />
          </div>
          <div>
            <label htmlFor="description">Event title</label>
            <input
              name="description"
              type="text"
              id="description"
              defaultValue={event?.description}
            />
          </div>
          <button onClick={setShowModal}>Close modal</button>
          <button type="submit">Save event</button>
        </form>
      </Modal>
    </>
  );
}
```

This imports a few packages and sets up the modal element to target the root element. Then we have the `Event` component which takes a few props. Then there is a `saveEvent` method that will take the values from the form we have and either update or create a new event based on if there is any current event data available.

Then we have the form that will either be blank or display the event information in the fields depending on if the `event` prop was passed to the modal. We also decide whether the modal should currently be showing or if it should be hidden based on the `showModal` prop.

That's all for the modal to show, update, or create new events. Now we need the page that shows the calendar and all of the events we have.

### The calendar page

We're going to modify the existing `App.tsx` file to render our calendar and the events. Here's what the new code will look like. There's a lot going on here so we'll walk through it.

```tsx
// App.tsx

import axios from "axios";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Event from "./components/Event";

export default function App() {
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [event, setEvent] = useState({});
  const [events, setEvents] = useState<any>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/events").then((res) => {
      setEvents(JSON.parse(res.data.events));
    });
  }, []);

  function tileContent({ date, view }: any) {
    const display = events.map((event: any) => {
      const eventDate = new Date(event.date);
      eventDate.setDate(eventDate.getDate() + 1);

      if (date.toDateString() === eventDate.toDateString()) {
        return " " + event.title + " ";
      }
      return "";
    });
    return display;
  }

  return (
    <div>
      <h1>Event Calendar</h1>
      <Calendar
        onChange={setDate}
        value={date}
        onClickDay={() => setShowModal(true)}
        tileContent={tileContent}
      />
      <>
        {events &&
          events.map((event: any) => (
            <div
              key={event.title}
              onClick={() => {
                setEvent(event);
                setShowEditModal(true);
              }}
              style={{ borderBottom: "1px solid grey", padding: "18px" }}
            >
              <div>{event.title}</div>
              <div>
                {event.date} - {event.time}
              </div>
              <div>{event.location}</div>
              <div>{event.description}</div>
            </div>
          ))}
      </>
      {showEditModal && (
        <Event
          showModal={showEditModal}
          setShowModal={() => setShowEditModal(false)}
          event={event}
        />
      )}
      {showModal && (
        <Event showModal={showModal} setShowModal={() => setShowModal(false)} />
      )}
    </div>
  );
}
```

We start off by importing the packages we need to get the calendar and the events data. Inside of the `App` component we have some states that will control how elements are rendered on the page. After that, we have a `useEffect` hook that fetches all of the events from the database when the page is loaded.

Then there's a function that adds the title of an event to the date on the calendar. Next we render the `Calendar` component and pass it a few props. After that, we display a list of all of the events that are currently on the calendar. Finally, we conditionally show the event modal based on current states.

The last thing we need to edit is the CSS so this looks a _little_ better.

### Style the calendar

There will be a lot of things you need to change stylistically before this goes to production, but we'll at least add a few things to get this to an MVP stage. Find the `index.scss` file in `client > src` and add the following code at the bottom.

```css
// index.scss

... .react-calendar {
  width: 100% !important;
  border: solid 1px white;
  border-radius: 12px;
}
```

This will at least make the calendar the full width of the page so people can see the event titles. Here's what the calendar page will look like if you run the front-end and back-end at the same time.

![calendar page with events](https://res.cloudinary.com/mediadevs/image/upload/v1650304252/e-603fc55d218a650069f5228b/wllg1728asy1a3l4rpfv.png)

Now you have a full-stack application ready to handle all of the events in your community!

## Finished code

You can find the code for the finished project in [the `events-calendar` folder of this repo](https://github.com/flippedcoder/media-projects/tree/main/events-calendar). You can also check out [this Code Sandbox](https://codesandbox.io/s/frosty-grass-bh34cq) for the front-end.

<CodeSandBox
  title="frosty-grass-bh34cq"
  id="frosty-grass-bh34cq"
/>

## Conclusion

Planning events is hard enough without trying to figure out how to spread the word. This might be a way to encourage people to let others know what is going on and how they can participate. This project should be flexible enough that you can style it and exapand the functionality in a number of ways.
