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
  rows: number[];
}

const Player = () => {
  const [customizations, setCustomizations] = useState<CustomizationProps>({
    color: "bf6d20",
    size: 450,
    duration: 150,
    sparkAmount: Array.from(Array(10)),
    rows: Array.from(Array(3)),
  });

  const animation = useRef(null);

  const handleClick = () => {
    // @ts-ignore
    animation.current.play();
  };

  useEffect(() => {
    // @ts-ignore
    animation.current = anime.timeline({
      direction: "normal",
      duration: customizations.duration,
      autoplay: false,
      easing: "easeInOutSine",
    });

    // @ts-ignore
    animation.current.add(
      {
        targets: `.dots li`,
        translateX: anime.stagger(10, {
          grid: [customizations.rows.length, customizations.sparkAmount.length],
          from: "center",
          axis: "x",
        }),
        translateY: anime.stagger(10, {
          grid: [customizations.rows.length, customizations.sparkAmount.length],
          from: "center",
          axis: "y",
        }),
        rotateZ: anime.stagger([0, 90], {
          grid: [customizations.rows.length, customizations.sparkAmount.length],
          from: "center",
          axis: "x",
        }),
        delay: anime.stagger(200, {
          grid: [customizations.rows.length, customizations.sparkAmount.length],
          from: "center",
        }),
        easing: "easeInOutQuad",
      },
      Math.random() * customizations.duration
    );
  }, [customizations]);

  return (
    <Container>
      <CustomizeForm
        customizations={customizations}
        setCustomizations={setCustomizations}
      />
      <div className="player">
        {customizations.rows.map((_, i) => (
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
        ))}
        <button onClick={handleClick}>Play</button>
      </div>
    </Container>
  );
};

export default Player;
