
import { useState } from "react";
import ChinhoiWeatherWidget from "./ChinhoiWeatherWidget";

const LiveWeatherWidget = () => {
  // We'll no longer need to detect user location since we're always showing Chinhoyi weather
  return <ChinhoiWeatherWidget />;
};

export default LiveWeatherWidget;
