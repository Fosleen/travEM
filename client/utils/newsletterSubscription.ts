import { Dispatch, SetStateAction } from "react";
import { notifyFailure, notifyInfo } from "@/components/atoms/Toast/Toast";
import {
  COMMON_DOMAINS,
  isBasicValidEmail,
  normalizeEmail,
  suggestEmailCorrection,
} from "@/utils/email";
import { addSubscriber } from "@/utils/subscribers";

type HandleSubscriptionClickParams = {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setAnimateTrigger: Dispatch<SetStateAction<number>>;
  successMessage: string;
  onSuccess?: () => void;
};

export const handleSubscriptionClick = async ({
  email,
  setEmail,
  setAnimateTrigger,
  successMessage,
  onSuccess,
}: HandleSubscriptionClickParams) => {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    notifyFailure("Molimo unesite email adresu");
    return;
  }

  if (!isBasicValidEmail(normalized)) {
    notifyFailure("Molimo unesite valjanu email adresu");
    return;
  }

  setAnimateTrigger((prev) => prev + 1);

  const suggestion = suggestEmailCorrection(normalized, COMMON_DOMAINS);
  const finalEmail = suggestion ?? normalized;

  if (suggestion) {
    notifyInfo(`Ispravili smo domenu: ${normalized} -> ${finalEmail}`);
    setEmail(finalEmail);
  }

  try {
    await addSubscriber(finalEmail);
    notifyInfo(successMessage);
    setEmail("");
    onSuccess?.();
  } catch {
    notifyFailure("Došlo je do greške prilikom pretplate");
  }
};
