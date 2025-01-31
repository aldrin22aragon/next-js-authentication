"use server"

import { setCookie } from "@/lib/cookies_setter"
import { delay } from "@/lib/utils"

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