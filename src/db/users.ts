"use server"

import { setCookie } from "@/lib/cookies_setter"
import { delay } from "@/lib/utils"
import { prisma } from "@/lib/prisma"
import { User } from "@prisma/client"
import bcrypt from "bcrypt"

type RegisterResponse = {
    error?: string,
    user?: User | null
}

export async function login(values: Pick<User, "username" | "password">): Promise<boolean> {
    const user = await prisma.user.findFirst({
        where: { username: values.username }
    })
    if (user) {
        const match = await bcrypt.compare(values.password, user.password);
        if (match) {
            await setCookie({ userId: user.id }, "token")
            await setCookie({ userId: user.id }, "refresh-token")
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}
export async function registerUser(value: Omit<User, "id">): Promise<RegisterResponse> {
    await delay(1000)
    const exist = await prisma.user.findFirst({ where: { username: value.username } })
    if (exist) return { error: "Username is already registered from another user. Please try different username.", user: null }
    const hashed = await hashPassword(value.password)
    if (hashed.hashed) {
        const inserted = await prisma.user.create({
            data: {
                name: value.name,
                password: hashed.hashed,
                surename: value.surename,
                username: value.username
            }
        })
        return { user: inserted, error: "" }
    } else {
        return { error: "Failed", user: null }
    }
}

export async function hashPassword(password: string): Promise<{ error?: any, hashed?: string }> {
    const saltRounds = 10;
    let hashedPassword = null
    let error = null
    try {
        hashedPassword = await bcrypt.hash(password, saltRounds);
        return { hashed: hashedPassword, error: null }
    } catch (err) {
        error = err
    }
    return { error: error, hashed: "" }
}