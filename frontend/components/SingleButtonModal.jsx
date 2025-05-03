"use client";

import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function SingleButtonModal({
  open,
  setOpen,
  title,
  message,
  buttonText = "OK",
  variant = "error",
}) {
  const variantSettings = {
    error: {
      icon: ExclamationTriangleIcon,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600",
      buttonHover: "hover:bg-red-700",
      buttonFocus: "focus:ring-red-500",
    },
    success: {
      icon: CheckCircleIcon,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      buttonBg: "bg-green-600",
      buttonHover: "hover:bg-green-700",
      buttonFocus: "focus:ring-green-500",
    },
  };
  const settings = variantSettings[variant] || variantSettings.error;
  const IconComponent = settings.icon;

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={setOpen}>
        <TransitionChild
          as={Fragment}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div
                      className={`mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${settings.iconBg} sm:mx-0 sm:h-10 sm:w-10`}
                    >
                      <IconComponent
                        className={`h-6 w-6 ${settings.iconColor}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {title}
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{message}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className={`inline-flex w-full justify-center rounded-md ${settings.buttonBg} px-4 py-2 text-base font-medium text-white shadow-sm ${settings.buttonHover} focus:outline-none focus:ring-2 ${settings.buttonFocus} focus:ring-offset-2 sm:text-sm`}
                  >
                    {buttonText}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
