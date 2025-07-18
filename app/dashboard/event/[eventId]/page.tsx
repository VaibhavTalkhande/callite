"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import AddSlotsForm from "@/components/AddSlotsForm";

type Event = {
  id?: string;
  title: string;
  description: string | null;
  price: number;
  dateSlot: {
    id?: string;
    date: Date;
    timeSlot: {
      id?: string;
      time: Date;
      isBooked?: boolean;
    }[];
  }[];
};

export default function EditEventPage() {
  const { eventId } = useParams()
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event|null>(
    {
      title: "",
      description: null,
      price: 0,
      dateSlot: [],
    } as Event
  );
  
  const fetchEvent = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/event/${eventId}`);
    const data = await res.json();
    console.log(eventId, "event id");
    setEvent(data);
    console.log("Fetched event:", data);
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvent((prev) => {
      if (!prev) return prev;
      if (name === "title") {
        return { ...prev, title: value };
      }
      if (name === "description") {
        return { ...prev, description: value };
      }
      if (name === "price") {
        // Convert value to number for price to match Event type
        const num = Number(value);
        return { ...prev, price: isNaN(num) ? 0 : num };
      }
      return prev;
    });
  };


  const handleSubmit = async () => {
  const res = await fetch(`/api/event/${eventId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      title: event?.title,
      description: event?.description,
      price: Number(event?.price ?? 0)
    }),
  });

  if (res.ok) {
    toast.success("Event updated");
    fetchEvent(); // Refresh event data after update
  } else {
    toast.error("Failed to update event");
  }
};

  const handleDeleteSlot = async (slotId: string) => {
    const res = await fetch(`/api/slots/${slotId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Slot deleted");
      fetchEvent(); 
    } else {
      const { error } = await res.json();
      toast.error(error || "Failed to delete");
    }
  };

  const handleEditSlot = async (slot: { id: string; time: string }) => {
    const currentTime = new Date(slot.time).toISOString().slice(11, 16);
    const newTime = prompt("Enter new time (HH:MM)", currentTime);
    if (!newTime) return;

    const todayDate = new Date(slot.time).toISOString().slice(0, 10);
    const updatedDateTime = new Date(`${todayDate}T${newTime}:00`);
  
    const res = await fetch(`/api/slots/${slot.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time: updatedDateTime }),
    });
  
    if (res.ok) {
      toast.success("Slot updated");
      fetchEvent();
    } else {
      const { error } = await res.json();
      toast.error(error || "Update failed");
    }
  };
  
  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>
      <input
        name="title"
        className="w-full p-2 border mb-3"
        value={event?.title || ""}
        onChange={handleChange}
        placeholder="Event Title"
      />
      <textarea
        name="description"
        className="w-full p-2 border mb-3"
        value={event?.description || ""}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        name="price"
        type="number"
        className="w-full p-2 border mb-3"
        value={event?.price ?? ""}
        onChange={handleChange}
        placeholder="Price"
      />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Update
      </button>
      <h3 className="text-lg font-semibold mt-8 mb-2">Existing Slots</h3>
      {event?.dateSlot?.map((date) => (
        <div key={date.id} className="mb-4 border rounded p-3">
          <div className="font-medium">{new Date(date.date).toDateString()}</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {date.timeSlot?.map((slot) => (
              <div key={slot.id} className="flex justify-between items-center border rounded px-2 py-1 bg-gray-50">
                <span>{new Date(slot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {slot.isBooked ? (
                  <span className="text-sm text-red-500">Booked</span>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleEditSlot({
                          id: slot.id as string,
                          time: typeof slot.time === "string" ? slot.time : slot.time.toISOString(),
                        })
                      }
                      className="text-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSlot(slot.id as string)}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}


      <AddSlotsForm eventId={eventId as string} onSlotsAdded={fetchEvent} />
    </div>
  );
}