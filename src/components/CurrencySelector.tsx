import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, IndianRupee } from "lucide-react";

interface CurrencySelectorProps {
  selectedCurrency: "USD" | "INR";
  onCurrencyChange: (currency: "USD" | "INR") => void;
}

export function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
  return (
    <Select value={selectedCurrency} onValueChange={(value) => onCurrencyChange(value as "USD" | "INR")}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USD">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>USD ($)</span>
          </div>
        </SelectItem>
        <SelectItem value="INR">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            <span>INR (₹)</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
