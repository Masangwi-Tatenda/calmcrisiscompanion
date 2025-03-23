
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertSeverity = "critical" | "high" | "medium" | "low";

interface AlertCardProps {
  title: string;
  message: string;
  severity: AlertSeverity;
  time: string;
  onClick?: () => void;
}

const AlertCard = ({ title, message, severity, time, onClick }: AlertCardProps) => {
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

  return (
    <div 
      className={cn("relative", alertClasses[severity])}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          <Bell size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className={severityIndicatorClasses[severity]}></span>
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
