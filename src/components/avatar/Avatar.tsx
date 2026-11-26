import React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { Users } from "lucide-react";

import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  isGroup?: boolean;
  online?: boolean;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  isGroup = false,
  online,
  className,
}) => (
  <span className="relative flex shrink-0">
    <AvatarPrimitive.Root
      className={cn(
        "flex aspect-square size-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-lg",
        className,
      )}
    >
      <AvatarPrimitive.Image
        src={src ?? undefined}
        alt={`${name}'s avatar`}
        className="size-full object-cover object-center"
      />
      <AvatarPrimitive.Fallback
        className={cn(
          "flex size-full items-center justify-center font-semibold select-none",
          isGroup
            ? "bg-neutral text-neutral-content"
            : "bg-secondary text-secondary-content",
        )}
      >
        {isGroup ? (
          <Users className="size-1/2" aria-hidden="true" />
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
    {online !== undefined && (
      <span
        aria-label={online ? "online" : "offline"}
        className={cn(
          "pointer-events-none absolute right-0 bottom-0 z-10 size-3 rounded-full ring-2 ring-base-100",
          online ? "bg-success" : "bg-base-content/30",
        )}
      />
    )}
  </span>
);

export default Avatar;
