
import React from "react";
import { Bell, AlertTriangle, Info, CloudRain, CloudLightning } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertSeverity = "critical" | "high" | "medium" | "low";

interface AlertCardProps {
  title: string;
  message: string;
  severity: AlertSeverity;
  time: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

const AlertCard = ({ title, message, severity, time, icon: Icon, onClick }: AlertCardProps) => {
  const alertClasses: Record<AlertSeverity, string> = {
    critical: "alert-critical",
    high: "alert-high",
    medium: "alert-medium",
    low: "alert-low",
  };

  const severityIndicatorClasses: Record<AlertSeverity, string> = {
    critical: "severity-critical",
    high: "severity-high",
    medium: "severity-medium",
    low: "severity-low",
  };

  // Default icon based on severity if no specific icon is provided
  const DefaultIcon = () => {
    if (severity === "critical" || severity === "high") {
      return <AlertTriangle size={18} />;
    }
    return <Info size={18} />;
  };

  return (
    <div 
      className={cn("relative p-3 border border-border rounded-lg mb-3 hover:bg-muted/30 cursor-pointer", alertClasses[severity])}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          {Icon ? <Icon size={18} /> : <DefaultIcon />}
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className={cn("w-2 h-2 rounded-full mr-2", severityIndicatorClasses[severity])}></span>
            <h3 className="font-semibold">{title}</h3>
          </div>
          <p className="text-sm opacity-90 mb-1">{message}</p>
          <span className="text-xs opacity-70">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
