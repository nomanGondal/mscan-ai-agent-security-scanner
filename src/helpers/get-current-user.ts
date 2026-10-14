import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { UserModel } from "@/entities"
import { connect_db } from "@/settings"
import { getServerSession } from "next-auth"

const getCurrentUser = async () => {
  await connect_db()

  const session = await getServerSession(authOptions)
  if (!session || !session?.user?._id) {
    return null
  }

  const uid = session?.user?._id
  const user = await UserModel.findById(uid)
  if (!user) return null

  return user
}

export { getCurrentUser }
