import Image from "next/image"
function Avatar({ user, size = 40 }) {
  const firstLetter = user?.name?.[0]?.toUpperCase() || "U"

  if (user?.avatar) {
    return (
      <Image
        src={user.avatar}
        alt={user.name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    )
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full flex items-center justify-center bg-gray-300 text-gray-800 font-semibold"
    >
      {firstLetter}
    </div>
  )
}

export default Avatar
