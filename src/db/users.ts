"use server"

import { setSession } from "@/lib/cookies_setter"
import { delay } from "@/lib/utils"

export async function login(username: string, password: string): Promise<boolean> {
    console.log("Serrver: selectByUsernamePassword_____")
    await delay(1000)
    const found = username === "drihnz" && password === "1234"
    if (found) {
        await setSession({ userId: "drihnz" })
    }
    return found
}