"use client";

import { HeaderProps, useChatContext } from "@copilotkit/react-ui";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import "@copilotkit/react-ui/styles.css";

export function Header({ }: HeaderProps) {
  const { setOpen, icons, labels } = useChatContext();

  return (
    <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <div className="w-24">
        <Link href="/">
          <BookOpen className="w-6 h-6" />
        </Link>
      </div>
      <div className="text-lg">{labels.title}</div>
      <div className="w-24 flex justify-end">
        <button onClick={() => setOpen(false)} aria-label="Close">
          {icons.headerCloseIcon}
        </button>
      </div>
    </div>
  );
}
