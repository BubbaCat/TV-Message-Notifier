import React, { PropsWithChildren, useEffect, useState } from "react";
import { useTrail, a } from "@react-spring/web";
import axios, { AxiosResponse } from "axios";

import styles from "./styles.module.css";

interface MessageDTO {
  id: number;
  type: string;
  name: string;
  message: string;
  image: string;
}

const startMessage = {
  id: 0,
  type: "text",
  image: "",
  message: "Привет, Creative!",
  name: "Легендарный бот",
};

export const isURL = (str: string): boolean => {
  const pattern = new RegExp(
    "^(http(s|)?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return pattern.test(str);
};

const INTERVAL = 10000;

const Trail: React.FC<PropsWithChildren<{ open: boolean; rows: number, height?: number }>> = ({
  open,
  children,
  rows,
  height = 140
}) => {
  const items = React.Children.toArray(children);
  const textTrail = useTrail(items.length, {
    config: { mass: 1, tension: 1000, friction: 400 },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    height: open ? rows * height : 0,
    from: { opacity: 0, x: 20, height: 0 },
  });

  return (
    <div>
      {textTrail.map(({ height, ...style }, index) => (
        <a.div key={index} className={styles.trailsText} style={style}>
          <a.div style={{ height }}>{items[index]}</a.div>
        </a.div>
      ))}
    </div>
  );
};

const TrailName: React.FC<PropsWithChildren<{ open: boolean }>> = ({
  open,
  children,
}) => {
  const items = React.Children.toArray(children);
  const textTrail = useTrail(items.length, {
    config: { mass: 1, tension: 800, friction: 600 },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    height: open ? 90 : 0,
    from: { opacity: 0, x: 20, height: 0 },
  });

  return (
    <div>
      {textTrail.map(({ height, ...style }, index) => (
        <a.div key={index} className={styles.trailsAuthor} style={style}>
          <a.div style={{ height }}>{items[index]}</a.div>
        </a.div>
      ))}
    </div>
  );
};

export default function App() {
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState<MessageDTO>(startMessage);
  useEffect(() => {
    const timer = setInterval(async () => {
      const response: AxiosResponse<MessageDTO> = await axios(
        (window as any).apiUrl
      );
      const data = response.data;

      if (data === null) {
        return;
      }

      setOpen(false);

      setTimeout(() => {
        setMessage(data);
        setOpen(true);
      }, 700);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.container}>
      {
        <div className={styles.msgContainer}>
          <div>
            {message.message && (
              <Trail open={open} rows={message.message.length > 25 ? 2 : 1}>
                {message.message.length > 25 ? (
                  <>
                    <span>{message.message.slice(0, 23)}</span>
                    <span>
                      {message.message.slice(23, message.message.length - 1) +
                        "..."}
                    </span>
                  </>
                ) : (
                  message.message
                )}
              </Trail>
            )}
            {message.name && <TrailName open={open}>{message.name}</TrailName>}
          </div>
          {message.type !== "Animation" && message.image && (
            <Trail open={open} rows={1}>
              {message.image && <img className={styles.image} src={message.image} alt="" />}
            </Trail>
          )}
          {message.type === "Animation" && message.image && (
            <Trail open={open} rows={1} height={240}>
              {message.image && <video className={styles.video} autoPlay loop src={message.image} />}
            </Trail>
          )}
        </div>
      }
    </div>
  );
}
