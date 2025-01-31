"use server"

import { setCookie } from "@/lib/cookies_setter"
import { delay } from "@/lib/utils"
import { prisma } from "@/lib/prisma"
import { User } from "@prisma/client"

type RegisterResponse = {
    error?: string,
    user?: User
}

export async function login(username: string, password: string): Promise<boolean> {
    console.log("Serrver: selectByUsernamePassword_____")
    await delay(1000)
    const found = username === "drihnz" && password === "1234"
    if (found) {
        await setCookie({ userId: "drihnz" }, "token")
        await setCookie({ userId: "drihnz" }, "refresh-token")
    }
    return found
}
export async function registerUser(value: Omit<User, "id">): Promise<RegisterResponse> {
    await delay(1000)
    const exist = await prisma.user.findFirst({ where: { username: value.username } })
    if (exist) return { error: "Username is already registered from another user. Please try different username." }
    const hashed = value.password
    const inserted = await prisma.user.create({
        data: {
            name: value.name,
            password: hashed,
            surename: value.surename,
            username: value.username
        }
    })
    return { user: inserted }
}

// export async function hashPassword(password: string): Promise<{ error?: any, hashed?: string }> {
//     const saltRounds = 10;
//     let hashedPassword = null
//     let error = null
//     try {
//         hashedPassword = await bcrypt.hash(password, saltRounds);
//         return { hashed: hashedPassword }
//     } catch (err) {
//         error = err
//     }
//     return { error: error }
// }