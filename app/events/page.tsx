'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  organizer: string;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/api/events?page=${page}&limit=6`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events);
        setTotalPages(data.totalPages);
      });
  }, [page]);

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-6'>Events</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {events.map((event) => (
          <div key={event.id} className='border p-4 rounded-lg shadow'>
            <h2 className='text-xl font-semibold'>{event.title}</h2>
            <p>{event.description}</p>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>Organizer: {event.organizer}</p>
            <div className='flex justify-between mt-4'>
              <Link href={`/register/${event.id}`}>
                <div className='text-blue-500'>Register</div>
              </Link>
              <Link href={`/events/${event.id}`}>
                <div className='text-blue-500'>View</div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-8 flex justify-center'>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className='px-4 py-2 bg-blue-400'
        >
          Prev
        </button>
        <p className='mx-4'>
          Page {page} of {totalPages}
        </p>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className='px-4 py-2 bg-blue-400 '
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EventsPage;
