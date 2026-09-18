import { useTranslations } from "next-intl";
import { BankTransferDetails } from "./BankTransferDetails";
import type { PaymentMethod } from "@/types/order";
import type { PublicSettings } from "@/types/settings";

const radioClass = "mt-0.5 accent-primary";

export function PaymentMethodSelector({
  value,
  onChange,
  settings,
}: {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  settings: PublicSettings;
}) {
  const t = useTranslations("PaymentMethodSelector");

  const options: { value: PaymentMethod; label: string; hint: string }[] = [
    {
      value: "TRANSFERENCIA",
      label: t("bankTransferLabel"),
      hint: t("bankTransferHint"),
    },
    {
      value: "EFECTIVO",
      label: t("cashLabel"),
      hint: t("cashHint"),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <div key={option.value}>
          <label
            className={`flex cursor-pointer items-start gap-3 rounded border p-3 text-sm transition-colors ${
              value === option.value
                ? "border-primary bg-primary/5"
                : "border-ink/15 hover:border-ink/30"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              className={radioClass}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>
              <span className="block font-medium">{option.label}</span>
              <span className="text-ink/60">{option.hint}</span>
            </span>
          </label>

          {option.value === "TRANSFERENCIA" && value === "TRANSFERENCIA" && (
            <div className="mt-3">
              <BankTransferDetails settings={settings} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
