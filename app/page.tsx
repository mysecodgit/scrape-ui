"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface Response {
  influencerName: string;
  data: DayData[];
}

interface DayData {
  date: string;
  urls: Url[];
  isImportant: boolean | undefined;
}

interface Url {
  type: string;
  src: string;
}

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState<Response[]>([]);
  const [urls, setUrls] = useState<Url[]>([]);

  useEffect(() => {
    async function fetchThem() {
      const { data } = await axios.get<Response[]>(
        "https://encouraging-elk-trunks.cyclic.app/fetch"
      );
      setResult(data);
    }

    fetchThem();
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseEnter2 = () => {
    setIsHovered2(true);
  };

  const handleMouseLeave2 = () => {
    setIsHovered2(false);
  };

  function getRelativeTime(dateString: string) {
    const currentDate = new Date();
    const targetDate = new Date(dateString);

    // Calculate the time difference in milliseconds
    const timeDiffMs = currentDate - targetDate;

    // Convert the time difference to days
    const timeDiffDays = Math.floor(timeDiffMs / (1000 * 60 * 60 * 24));

    if (timeDiffDays === 0) {
      return "Today";
    } else if (timeDiffDays === 1) {
      return "Yesterday";
    } else if (timeDiffDays > 1) {
      return timeDiffDays + " days ago";
    } else {
      return "Invalid date";
    }
  }

  return (
    <div className="flex">
      <div className="w-[45vh] h-[90vh]  py-[6vh]">
        <div className="bg-[#3a3e41] h-full w-full rounded-[20px] p-3 ">
          <div className="relative">
            {urls.length > 0 && urls[current].type === "image" && (
              <img src={urls[current].src} className="rounded-[12px]" />
            )}
            {urls.length > 0 && urls[current].type === "video" && (
              <video
                className="rounded-[12px]"
                src={urls[current].src}
                autoPlay
                onEnded={() => {
                  if (current < urls.length - 1) {
                    setCurrent(current + 1);
                  }
                }}
              >
                Your browser does not support the video tag.
              </video>
            )}

            <div
              className="absolute  w-[30%] top-0 bottom-0 flex items-center pl-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {isHovered && (
                <button
                  onClick={() => {
                    if (current > 0) {
                      setCurrent(current - 1);
                    }
                  }}
                  className="h-10 w-10 p-2 rounded-full bg-[rgb(0 0 0 / 50%)] hover:bg-[hsla(0,0%,100%,.45)]"
                >
                  &lt;
                </button>
              )}
            </div>
            <div
              className="absolute  w-[30%] top-0 bottom-0 right-0 flex items-center justify-end pr-2"
              onMouseEnter={handleMouseEnter2}
              onMouseLeave={handleMouseLeave2}
            >
              {isHovered2 && (
                <button
                  className="h-10 w-10 p-2 rounded-full bg-[rgb(0 0 0 / 50%)] hover:bg-[hsla(0,0%,100%,.45)]"
                  onClick={() => {
                    if (current < urls.length - 1) {
                      setCurrent(current + 1);
                    }
                  }}
                >
                  &gt;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="py-[6vh] pl-12 flex-1 h-[100vh] overflow-auto pr-3 scroll-container">
        {result.map((influencer) => {
          return (
            <div className="bg-[#3a3e41] w-full px-5 py-3 rounded mb-3">
              <h4 className="mb-2">{influencer.influencerName}</h4>
              <div className="flex gap-3 max-w-[624px] overflow-x-auto custom-scrollbar pb-3">
                {influencer.data.map((day) => {
                  return (
                    <div className="min-w-[100px] cursor-pointer relative">
                      {day.isImportant && (
                        <span className="absolute  bg-yellow-300 h-5 w-5 rounded-full text-black flex justify-center items-center">
                          &#9733;
                        </span>
                      )}
                      <img
                        src={
                          day.urls.find((x) => x.type == "image")?.src ||
                          "https://cf-st.sc-cdn.net/i/6NQGnXtQwbtkdndGBKB46.1023.IRZXSOY?mo=GnwaEBoAGgAyAQk6AX1IAlBLYAFaEVBvcHVsYXJJbWFnZVN0b3J5ogEaCP8HIhUKCEIGCJqTwq8GEgAqB0lSWlhTT1miARoI5wciFQoIQgYImpPCrwYSACoHSVJaWFNPWaIBGgjUByIVCghCBgibk8KvBhIAKgdJUlpYU09Z&uc=75"
                        }
                        alt=""
                        className="w-[100px] h-[140px] rounded"
                        onClick={() => {
                          setUrls(day.urls);
                          setCurrent(0);
                        }}
                      />
                      <p className="text-sm mt-1">{day.date.split("T")[0]}</p>
                      <p className="text-sm">
                        {getRelativeTime(day.date.split("T")[0])}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
