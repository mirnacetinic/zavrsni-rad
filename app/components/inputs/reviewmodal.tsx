"use client";
import toast from "react-hot-toast";
import ModalBase from "../cards/modalbase";
import { useState } from "react";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { useRouter } from "next/navigation";

interface ModalProps {
  reservationId: number;
}

const ReviewModal: React.FC<ModalProps> = ({ reservationId }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hostRating, setHostRating] = useState(0);
  const [hoverHost, setHoverHost] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [experience, setExperience] = useState("");

  const handleSubmitReview = async () => {
    if (!rating || !hostRating || experience.length === 0) {
      toast.error("Missing data");
      return;
    }
    const data = {
      reservationId: reservationId,
      rating: rating,
      hostRating: hostRating,
      experience: experience,
    };

    const response = await fetch("/api/review", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast.success("Review posted successfully");
      setIsOpen(false);
      router.refresh();
    } else {
      const errorMessage = response.headers.get("message");
      toast.error(errorMessage || "Review posting failed");
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => { setIsOpen(true); }} className="form_button">
          Leave a review
        </button>
      </div>
      <ModalBase isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="text-center">
          <label>Tell us about your experience</label>
          <textarea className="form-input" value={experience} onChange={(e) => setExperience(e.target.value)}>
          </textarea>
          <label>Rate the unit</label>
          <div className="flex justify-center mt-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <MdOutlineStarPurple500
                key={value}
                className={`cursor-pointer ${value <= (hoverRating || rating) ? "text-purple-500" : "text-gray-400"}`}
                size={30}
                onClick={() => setRating(value)}
                onMouseOver={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
          <label>Rate your host</label>
          <div className="flex justify-center mt-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <MdOutlineStarPurple500
                key={value}
                className={`cursor-pointer ${value <= (hoverHost || hostRating) ? "text-purple-500" : "text-gray-400"}`}
                size={30}
                onClick={() => setHostRating(value)}
                onMouseOver={() => setHoverHost(value)}
                onMouseLeave={() => setHoverHost(0)}
              />
            ))}
          </div>
          <button onClick={handleSubmitReview} className="form_button mt-4">
            Submit
          </button>
        </div>
      </ModalBase>
    </div>
  );
};

export default ReviewModal;
