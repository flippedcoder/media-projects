import Container from "@mui/material/Container";
import anime from "animejs";
import { useState, useRef, useEffect } from "react";
import "../Fireworks.css";
import CustomizeForm from "./CustomizeForm";

export interface CustomizationProps {
  color: string;
  size: number;
  duration: number;
  sparkAmount: number[];
}

const Player = () => {
  const [customizations, setCustomizations] = useState<CustomizationProps>({
    color: "bf6d20",
    size: 450,
    duration: 750,
    sparkAmount: Array.from(Array(10)),
  });

  const animation = useRef(null);

  const handleClick = () => {
    // @ts-ignore
    animation.current.play();
  };

  useEffect(() => {
    // @ts-ignore
    animation.current = anime.timeline({
      direction: "alternate",
      duration: customizations.duration,
      autoplay: false,
      easing: "easeInOutSine",
    });

    for (const spark in customizations.sparkAmount) {
      // @ts-ignore
      animation.current.add(
        {
          targets: `.dots li:nth-child(${Number(spark) + 1})`,
          scaleY: -(1.5 + Math.random() * 4),
          duration:
            customizations.duration + Math.random() * customizations.duration,
        },
        Math.random() * customizations.duration
      );
    }
  }, [customizations]);

  return (
    <Container>
      <CustomizeForm
        customizations={customizations}
        setCustomizations={setCustomizations}
      />
      <div className="player">
        <ul className="dots">
          {customizations.sparkAmount.map((_, i) => (
            <li
              style={{
                backgroundColor: `#${customizations.color}`,
                height: `${customizations.size + Math.random() * 3}px`,
                maxHeight: "100%",
                maxWidth: "100%",
                width: `${customizations.size}px`,
              }}
              key={i}
            />
          ))}
        </ul>
        <button onClick={handleClick}>Play</button>
      </div>
    </Container>
  );
};

export default Player;
