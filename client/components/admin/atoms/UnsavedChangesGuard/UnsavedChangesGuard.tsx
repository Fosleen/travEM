"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const CONFIRM_MESSAGE =
  "Imate nespremljene promjene. Jeste li sigurni da želite napustiti ovu stranicu?";

export const confirmDiscardChanges = async () => {
  if (typeof window === "undefined") return true;

  const result = await Swal.fire({
    title: "Napustiti uređivanje?",
    text: CONFIRM_MESSAGE,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#AC2B2B",
    cancelButtonColor: "#2BAC82",
    confirmButtonText: "Da, napusti",
    cancelButtonText: "Nastavi uređivati",
    reverseButtons: true,
  });

  return result.isConfirmed;
};

type UnsavedChangesGuardProps = {
  active?: boolean;
};

const UnsavedChangesGuard = ({ active = true }: UnsavedChangesGuardProps) => {
  const router = useRouter();
  const allowNavigationRef = useRef(false);

  useEffect(() => {
    if (!active) return;

    const guardedUrl = window.location.href;
    const guardState = { ...window.history.state, unsavedChangesGuard: true };

    // A duplicate history entry lets us stop Back before Next.js changes route.
    if (!window.history.state?.unsavedChangesGuard) {
      window.history.pushState(guardState, "", guardedUrl);
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowNavigationRef.current) return;
      event.preventDefault();
      event.returnValue = true;
    };

    const handleDocumentClick = async (event: MouseEvent) => {
      if (allowNavigationRef.current || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
        return;
      }

      const target = event.target as Element | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      if (destination.href === window.location.href) return;

      event.preventDefault();
      event.stopPropagation();

      if (!(await confirmDiscardChanges())) return;

      allowNavigationRef.current = true;

      if (destination.origin === window.location.origin) {
        router.push(
          `${destination.pathname}${destination.search}${destination.hash}`
        );
      } else {
        window.location.assign(destination.href);
      }
    };

    const handlePopState = async () => {
      if (allowNavigationRef.current) return;

      if (await confirmDiscardChanges()) {
        allowNavigationRef.current = true;
        window.history.back();
      } else {
        window.history.pushState(guardState, "", guardedUrl);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [active, router]);

  return null;
};

export default UnsavedChangesGuard;
