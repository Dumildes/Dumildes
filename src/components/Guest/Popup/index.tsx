import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

type ComponentParams = {
  content: React.ReactNode;
  isOpen: boolean;
  closePopup: () => void;
};

export default function Popup({ content, isOpen, closePopup }: ComponentParams) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        closePopup();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closePopup]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex flex-col gap-0 p-4 items-center justify-center bg-black/50 bg-opacity-50 z-50">
          <div
            ref={popupRef}
            className="relative rounded-md md:w-[80vw] w-[90vw] xl:w-[50vw] bg-white p-4 shadow-lg"
          >
            <div className="absolute flex items-center justify-end md:w-[76vw] w-[85vw] xl:w-[48vw]">
              <div className="p-1 hover:scale-110 cursor-pointer duration-300">
                <FiX className="text-xl" onClick={closePopup} />
              </div>
            </div>

            <div className="py-2 md:w-[76vw] w-[80vw] xl:w-[48vw] h-full max-h-[76vh] lg:h-full">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
