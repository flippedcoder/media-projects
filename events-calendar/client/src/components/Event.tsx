import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Event({
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

export default Event;
