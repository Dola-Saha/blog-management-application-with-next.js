import { photoUrl } from "@/utils/api";

export default function Avatar({ user, size = "md", imageSrc }) {
  const sizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-20 w-20" };
  const initials = `${user?.firstname?.[0] || ""}${user?.lastname?.[0] || ""}`.toUpperCase() || "U";
  const src = imageSrc || (user?.profileImage ? photoUrl(user.profileImage) : null);

  return src ? (
    <img
      src={src}
      alt="Profile"
      className={`${sizes[size]} rounded-full object-cover ring-2 ring-white transition-transform duration-300`}
    />
  ) : (
    <span className={`${sizes[size]} flex items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white ring-2 ring-white`}>
      {initials}
    </span>
  );
}
