import { useState } from 'react'
import Kalend, { CalendarView } from 'kalend'
import 'kalend/dist/styles/index.css'

function Calendar() {
    const [selectedView, setSelectedView] = useState()
    const onEventClick = () => {}
    const onNewEventClick = () => {}
    const onSelectView = () => {}
    const onPageChange = () => {}

    const events = [
        {
            id: 1,
            startAt: '2022-04-21T18:00:00.000Z',
            endAt: '2021-04-21T19:00:00.000Z',
            summary: 'test',
            color: 'blue',
            calendarID: 'work'
        },
        {
            id: 2,
            startAt: '2022-04-05T18:00:00.000Z',
            endAt: '2022-04-05T19:00:00.000Z',
            summary: 'void test',
            color: 'blue',
        }
    ]
    
    return (
        <Kalend
            onEventClick={onEventClick}
            onNewEventClick={onNewEventClick}
            events={events}
            initialDate={new Date().toISOString()}
            hourHeight={60}
            initialView={CalendarView.MONTH}
            onSelectView={onSelectView}
            selectedView={selectedView}
            onPageChange={onPageChange}
            timeFormat={'24'}
            weekDayStart={'Monday'}
            calendarIDsHidden={['work']}
            language={'en'}
        />
    )
}

export default Calendar