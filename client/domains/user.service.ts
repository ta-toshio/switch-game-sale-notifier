import { fetch, register, getUserId } from './user'

export const userRegister = async () => {
  const userId = await getUserId()

  if (!userId) {
    return Promise.resolve()
  }

  try {
    const user = await fetch(userId)
    if (user) {
      return Promise.resolve()
    }
  } catch(e) {}

  try {
    return register(userId)
  } catch(e) {
    console.log(e)
  }

  return Promise.resolve()
}