"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const timeRegex = /^\d{2}:\d{2}$/;

const schema = z.object({
  dates: z.array(
    z.object({
      date: z.string(),
      timeSlots: z.array(z.string().regex(timeRegex, "Invalid time format")),
    })
  ),
});

export default function AddSlotsForm({ eventId }: { eventId: string }) {
  const [dates, setDates] = useState([{ date: "", timeSlots: [""] }]);
  const router = useRouter();

  const handleDateChange = (i: number, value: string) => {
    const newDates = [...dates];
    newDates[i].date = value;
    setDates(newDates);
  };

  const handleTimeChange = (i: number, j: number, value: string) => {
    const newDates = [...dates];
    newDates[i].timeSlots[j] = value;
    setDates(newDates);
  };

  const addDate = () => {
    setDates([...dates, { date: "", timeSlots: [""] }]);
  };

  const addTimeSlot = (i: number) => {
    const newDates = [...dates];
    newDates[i].timeSlots.push("");
    setDates(newDates);
  };

  const onSubmit = async () => {
    const parse = schema.safeParse({ dates });
    if (!parse.success) {
      toast.error("Invalid input. Please check your time format (HH:MM).");
      return;
    }

    const res = await fetch(`/api/event/${eventId}/slots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parse.data),
    });

    if (res.ok) {
      toast.success("Slots added successfully");
      router.refresh();
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl bg-white shadow">
      <h2 className="text-lg font-semibold">Add Slots</h2>

      {dates.map((d, i) => (
        <div key={i} className="border p-3 rounded-md space-y-2">
          <input
            type="date"
            className="border px-3 py-1 rounded w-full"
            value={d.date}
            min={new Date().toISOString().split("T")[0]} // Prevent past dates
            onChange={(e) => handleDateChange(i, e.target.value)}
          />

          {d.timeSlots.map((t, j) => (
            <input
              key={j}
              type="time"
              className="border px-3 py-1 rounded w-full"
              value={t}
              onChange={(e) => handleTimeChange(i, j, e.target.value)}
            />
          ))}

          <button
            onClick={() => addTimeSlot(i)}
            className="text-blue-600 text-sm mt-1"
          >
            + Add Time
          </button>
        </div>
      ))}

      <div className="flex gap-3">
        <button
          onClick={addDate}
          className="text-sm text-green-600 underline"
        >
          + Add Another Date
        </button>

        <button
          onClick={onSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Slots
        </button>
      </div>
    </div>
  );
}
