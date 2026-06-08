import React from "react";

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  margin: "24px 0",
};

const cardStyle = (isdo) => ({
  borderRadius: "4px",
  padding: "10px 16px",
  backgroundColor: isdo ? "#e1ffe0" : "#fff2f0",
});

const labelStyle = (isdo) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "14px",
  fontWeight: 700,
  lineHeight: "22px",
  color: isdo ? "#00470a" : "#e2262a",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

const textStyle = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#1e1e24",
  margin: 0,
};

const checkIcon = React.createElement(
  "svg",
  { width: 14, height: 14, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" },
  React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM7.56066 10.9393L10.5 13.8787L16.4393 7.93934C17.0251 7.35355 17.9749 7.35355 18.5607 7.93934C19.1464 8.52513 19.1464 9.47487 18.5607 10.0607L11.5607 17.0607C10.9749 17.6464 10.0251 17.6464 9.43934 17.0607L5.43934 13.0607C4.85355 12.4749 4.85355 11.5251 5.43934 10.9393C6.02513 10.3536 6.97487 10.3536 7.56066 10.9393Z",
  }),
);

const timesIcon = React.createElement(
  "svg",
  { width: 14, height: 14, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" },
  React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12 9.87596L8.81394 6.6899C8.2274 6.10337 7.27644 6.10337 6.6899 6.6899C6.10337 7.27644 6.10337 8.2274 6.6899 8.81394L9.87596 12L6.6899 15.1861C6.10337 15.7726 6.10337 16.7236 6.6899 17.3101C7.27644 17.8966 8.2274 17.8966 8.81394 17.3101L12 14.124L15.1861 17.3101C15.7726 17.8966 16.7236 17.8966 17.3101 17.3101C17.8966 16.7236 17.8966 15.7726 17.3101 15.1861L14.124 12L17.3101 8.81394C17.8966 8.2274 17.8966 7.27644 17.3101 6.6899C16.7236 6.10337 15.7726 6.10337 15.1861 6.6899L12 9.87596Z",
  }),
);

export default function DoDont({ do: doText, dont }) {
  return React.createElement("div", { style: gridStyle }, [
    React.createElement("div", { key: "do", style: cardStyle(true) }, [
      React.createElement("span", { key: "label", style: labelStyle(true) }, [checkIcon, "Do"]),
      React.createElement("p", { key: "text", style: textStyle }, doText),
    ]),
    React.createElement("div", { key: "dont", style: cardStyle(false) }, [
      React.createElement("span", { key: "label", style: labelStyle(false) }, [timesIcon, "Don't"]),
      React.createElement("p", { key: "text", style: textStyle }, dont),
    ]),
  ]);
}
