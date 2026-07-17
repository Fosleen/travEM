import { FC, useEffect, useRef, useState } from "react";
import Button from "../../../atoms/Button";
import "./NewsletterSubmitButton.scss";

interface NewsletterSubmitButtonProps {
  onClick: () => void | Promise<void>;
  text?: string;
  animateTrigger?: number;
}

const NewsletterSubmitButton: FC<NewsletterSubmitButtonProps> = ({
  onClick,
  text = "pretplati se",
  animateTrigger = 0,
}) => {
  const [planeState, setPlaneState] = useState<"idle" | "armed" | "flying">(
    "idle"
  );
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    setPlaneState("armed");

    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setPlaneState("flying");
      });

      resetTimeoutRef.current = setTimeout(() => {
        setPlaneState("idle");
      }, 720);

      return () => cancelAnimationFrame(raf2);
    });

    return () => {
      cancelAnimationFrame(raf1);
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, [animateTrigger]);

  return (
    <Button primary onClick={onClick}>
      <span className="newsletter-submit-button-inner">
        <span className="newsletter-submit-button-text">{text}</span>

        <span className="newsletter-submit-button-plane-slot" aria-hidden="true">
          <span
            className={`newsletter-submit-button-plane ${planeState}`}
          >
            ✈︎
          </span>
        </span>
      </span>
    </Button>
  );
};

export default NewsletterSubmitButton;