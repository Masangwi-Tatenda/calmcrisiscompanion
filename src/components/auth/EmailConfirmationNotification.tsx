
import { AlertCircle } from "lucide-react";

interface EmailConfirmationNotificationProps {
  email: string;
}

const EmailConfirmationNotification = ({ email }: EmailConfirmationNotificationProps) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Email verification required
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Please check your email at <strong>{email}</strong> and confirm your registration to access all features.
            </p>
            <p className="mt-2">
              If you don't receive an email within a few minutes, please check your spam folder or contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationNotification;
