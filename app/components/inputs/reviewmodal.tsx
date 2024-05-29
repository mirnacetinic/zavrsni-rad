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
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleMouseOver = (value: number) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleSubmitReview = async () => {
    const data = {
     reservationId,
      rating,
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
        <button
          onClick={() => {
            setIsOpen(true);
          }}
          className="form_button"
        >
          Leave a review
        </button>
      </div>
      <ModalBase isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="text-center">
          <label>Tell us about your experience</label>
          <input type="text" className="form-input"></input>
          <div className="flex justify-center mt-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <MdOutlineStarPurple500
                key={value}
                className={`cursor-pointer ${
                  value <= (hoverRating || rating) ? "text-purple-500" : "text-gray-400"
                }`}
                size={30}
                onClick={() => handleStarClick(value)}
                onMouseOver={() => handleMouseOver(value)}
                onMouseLeave={handleMouseLeave}
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
