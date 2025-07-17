"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import AddSlotsForm from "@/components/AddSlotsForm";

export default function EditEventPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState({ title: "", description: "", price: 0 });

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(`/api/event/${id}`);
      const data = await res.json();
      setEvent(data);
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEvent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const res = await fetch(`/api/event/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...event, price: Number(event.price) }),
    });

    if (res.ok) {
      toast.success("Event updated");
    } else {
      toast.error("Failed to update event");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>
      <input
        name="title"
        className="w-full p-2 border mb-3"
        value={event.title}
        onChange={handleChange}
        placeholder="Event Title"
      />
      <textarea
        name="description"
        className="w-full p-2 border mb-3"
        value={event.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        name="price"
        type="number"
        className="w-full p-2 border mb-3"
        value={event.price}
        onChange={handleChange}
        placeholder="Price"
      />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Update
      </button>

      <AddSlotsForm eventId={id as string} />
    </div>
  );
}
