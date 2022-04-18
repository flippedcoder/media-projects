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
