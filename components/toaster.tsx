import React from "react";
import { Position, Toaster, IToastProps, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

/** Singleton toaster instance. Create separate instances for different options. */
export const AppToaster =
  typeof window !== "undefined"
    ? Toaster.create({
        // className: "recipe-toaster",
        position: Position.TOP
      })
    : null;

export default {
  show: (props: IToastProps, key?: string): string => {
    if (!AppToaster) return "";
    return AppToaster.show(props, key);
  },

  showError: (message: React.ReactNode): string => {
    if (!AppToaster) return "";
    return AppToaster.show({ message: message, icon: IconNames.ERROR, intent: Intent.DANGER, timeout: 0 });
  },

  showWarning: (message: React.ReactNode): string => {
    if (!AppToaster) return "";
    return AppToaster.show({ message: message, icon: IconNames.WARNING_SIGN, intent: Intent.WARNING });
  },

  showInfo: (message: React.ReactNode): string => {
    if (!AppToaster) return "";
    return AppToaster.show({ message: message, icon: IconNames.INFO_SIGN, intent: Intent.PRIMARY });
  },

  showSuccess: (message: React.ReactNode): string => {
    if (!AppToaster) return "";
    return AppToaster.show({ message: message, icon: IconNames.TICK, intent: Intent.SUCCESS });
  }
};
