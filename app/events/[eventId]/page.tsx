'use client';

import { useEffect, useState } from 'react';

interface Participant {
  fullName: string;
  email: string;
}

interface EventData {
  eventName: string;
  participants: Participant[];
}

const ParticipantsPage = ({ params }: { params: { eventId: string } }) => {
  const { eventId } = params;

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (eventId) {
      const fetchEventData = async () => {
        try {
          const response = await fetch(
            `/api/events/${eventId}?searchQuery=${debouncedSearchQuery}`
          );
          const data = await response.json();
          console.log(data);
          if (response.ok) {
            setEventData(data);
          } else {
            setError('Failed to load event details.');
          }
        } catch (err) {
          console.log(err);
          setError('An error occurred. Please try again later.');
        }
      };

      fetchEventData();
    }
  }, [eventId, debouncedSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className='container mx-auto py-8'>
      {eventData ? (
        <>
          <h1 className='text-3xl font-bold mb-6'>
            {eventData.eventName} Participants
          </h1>

          <div className='mb-6 w-1/3'>
            <input
              type='text'
              placeholder='Search participants by name or email'
              value={searchQuery}
              onChange={handleSearchChange}
              className='p-2 border rounded-md w-full'
            />
          </div>

          <div className='grid grid-cols-3 gap-4'>
            {eventData.participants.length > 0 ? (
              eventData.participants.map((participant, index) => (
                <div key={index} className='border p-4 rounded-md shadow'>
                  <h2 className='text-xl font-semibold'>
                    {participant.fullName}
                  </h2>
                  <p>{participant.email}</p>
                </div>
              ))
            ) : (
              <p>No participants found.</p>
            )}
          </div>
        </>
      ) : (
        <p>{error || 'Loading...'}</p>
      )}
    </div>
  );
};

export default ParticipantsPage;
