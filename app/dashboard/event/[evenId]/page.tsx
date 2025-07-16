"use client";
import AddSlotsForm from '@/components/AddSlotsForm';
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {    
  const params = useParams();
    const eventId = params.evenId as string;
  return (
    <div>page
        <h1 className='text-2xl font-bold'>Event Details for {eventId}</h1>
        {/* Here you would typically fetch and display event details using the eventId */}
        <p>Details for event ID: {eventId}</p>
        {/* You can add more components or logic to handle event details */}
        <AddSlotsForm eventId={eventId} />
    </div>
  )
}

export default page