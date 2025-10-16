import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const UpgradeAccountBanner = ({ isAnonymous }: { isAnonymous: boolean }) => {
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem("upgrade-banner-dismissed") === "true";
  });
  const navigate = useNavigate();

  if (!isAnonymous || isDismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem("upgrade-banner-dismissed", "true");
    setIsDismissed(true);
  };

  return (
    <Alert className="relative mb-4 border-primary/20 bg-primary/5">
      <AlertDescription className="flex items-center justify-between gap-4 pr-8">
        <span className="text-sm">
          💾 Want to access your budget from other devices? Link your email to sync across devices.
        </span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/auth")}
        >
          Link Email
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-6 w-6"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
