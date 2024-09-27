'use client';
import { useState, useEffect, useRef } from 'react';
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
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const loader = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (loading) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/events?limit=${limit}&offset=${offset}&sortBy=${sortBy}&sortOrder=${sortOrder}`
        );
        const newEvents = await response.json();

        if (newEvents.length < limit) {
          setHasMore(false);
        }

        setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [offset, sortOrder, sortBy]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setOffset((prevOffset) => prevOffset + limit);
      }
    });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore, loading]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setEvents([]);
    setOffset(0);
    setHasMore(true);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setEvents([]);
    setOffset(0);
    setHasMore(true);
  };

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-6'>Events</h1>
      <div className='mb-4 flex space-x-4'>
        <label>
          Sort by:
          <select
            value={sortBy}
            onChange={handleSort}
            className='ml-2 p-2 border rounded-md'
          >
            <option value='title'>Title</option>
            <option value='date'>Event Date</option>
            <option value='organizer'>Organizer</option>
          </select>
        </label>

        <label>
          Order:
          <select
            value={sortOrder}
            onChange={handleOrderChange}
            className='ml-2 p-2 border rounded-md'
          >
            <option value='asc'>Ascending</option>
            <option value='desc'>Descending</option>
          </select>
        </label>
      </div>

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

      {loading && <p className='text-center mt-4'>Loading more events...</p>}

      <div ref={loader} className='h-10'></div>

      {!hasMore && <p className='text-center mt-4'>No more events to load.</p>}
    </div>
  );
};

export default EventsPage;
