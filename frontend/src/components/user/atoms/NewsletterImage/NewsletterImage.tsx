import { useEffect, useState } from "react";
import "./NewsletterImage.scss";
import { getFooter } from "../../../../api/footer";
import { FooterData, Nullable } from "../../../../common/types";

const NewsletterImage = () => {
  const [footerContent, setFooterContent] =
    useState<Nullable<FooterData>>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const content = await getFooter();
      setFooterContent(content);
    } catch (error) {
      console.error(
        "Error occured while fetching newsletter image data:",
        error
      );
    }
  };
  return (
    <div className="newsletter-image-container">
      {footerContent && (
        <img src={footerContent.image_url} alt="footer-image" />
      )}
      <svg className="clippy">
        <defs>
          <clipPath id="clip-custom">
            <path
              d="M397.5 160.5C367.9 62.5 283.5 23.0001 245 15.5001C198.833 3.00005 95.7 -11.3999 52.5 31.0001C-1.49999 84.0001 0.999947 159.066 0.999938 168.5C0.999839 274.5 -1.03505 254.5 3.99979 284.5C9.03463 314.5 27.5 355.847 38.4999 351C78.0565 333.571 226.5 329.5 264.5 335.5C302.5 341.5 434.5 283 397.5 160.5Z"
              fill="#D9D9D9"
            />
            <path
              d="M301 1.00008C315 0.600078 318.5 13.8334 318.5 20.5001C318.708 23.5002 310.5 31.5 309 25.5C307.8 20.7 289.5 21.5 280.5 22.5C276.667 21.8334 269.4 19.0001 271 13C273 5.49992 283.5 1.50008 301 1.00008Z"
              fill="#D9D9D9"
            />
            <path
              d="M374.5 322.5C369.3 326.9 358 330.333 353 331.5C351 332.333 346.6 332.4 345 326C344.5 310 356.5 308 361.5 306.5C366.5 305 381 317 374.5 322.5Z"
              fill="#D9D9D9"
            />
            <path
              d="M141.5 345C88.3 344.2 65.5 360 64 364.5C62.5 369 74.5 372 82.5 370C96.6422 366.464 107 359 123.5 356.5C140 354 201 376.5 207 378C213 379.5 235 380.5 245.5 370C256 359.5 208 346 141.5 345Z"
              fill="#D9D9D9"
            />
            <path
              d="M397.5 160.5C367.9 62.5 283.5 23.0001 245 15.5001C198.833 3.00005 95.7 -11.3999 52.5 31.0001C-1.49999 84.0001 0.999947 159.066 0.999938 168.5C0.999839 274.5 -1.03505 254.5 3.99979 284.5C9.03463 314.5 27.5 355.847 38.4999 351C78.0565 333.571 226.5 329.5 264.5 335.5C302.5 341.5 434.5 283 397.5 160.5Z"
              stroke="#D9D9D9"
            />
            <path
              d="M301 1.00008C315 0.600078 318.5 13.8334 318.5 20.5001C318.708 23.5002 310.5 31.5 309 25.5C307.8 20.7 289.5 21.5 280.5 22.5C276.667 21.8334 269.4 19.0001 271 13C273 5.49992 283.5 1.50008 301 1.00008Z"
              stroke="#D9D9D9"
            />
            <path
              d="M374.5 322.5C369.3 326.9 358 330.333 353 331.5C351 332.333 346.6 332.4 345 326C344.5 310 356.5 308 361.5 306.5C366.5 305 381 317 374.5 322.5Z"
              stroke="#D9D9D9"
            />
            <path
              d="M141.5 345C88.3 344.2 65.5 360 64 364.5C62.5 369 74.5 372 82.5 370C96.6422 366.464 107 359 123.5 356.5C140 354 201 376.5 207 378C213 379.5 235 380.5 245.5 370C256 359.5 208 346 141.5 345Z"
              stroke="#D9D9D9"
            />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default NewsletterImage;
