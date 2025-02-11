"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { login } from "@/db/users"
import { redirect, RedirectType } from "next/navigation"
import Link from "next/link"

const formSchema = z.object({
    username: z.string().min(4, { message: "At least 4 chars username" }),
    password: z.string().min(4, { message: "At least 8 chars password" })
});

export default function LoginComponent() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            username: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await login({
            password: values.password,
            username: values.username
        })
        if (!res) return alert("mali")
        redirect("/dashboard", RedirectType.push)
    }

    return (
        <Form {...form}>
            <div className="text-2xl">Login Page</div>
            <hr className="mb-2" />
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem>
                        {/* <FormLabel>Username</FormLabel> */}
                        <FormControl className="mb-2">
                            <Input placeholder="Username" type="text"{...field} />
                        </FormControl>
                        {/* <FormDescription>This is your public display     name.</FormDescription> */}
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        {/* <FormLabel>Password</FormLabel> */}
                        <FormControl className="mb-2">
                            <Input type="password" placeholder="Password" {...field} />
                        </FormControl>
                        {/* <FormDescription>Enter your password.</FormDescription> */}
                        <FormMessage />
                    </FormItem>
                )} />
                <Button className="mt-2" type="submit">Submit</Button>
                <div className="text-right text-blue-700">
                    <Link href={"/auth/register"}>Register</Link>
                </div>
            </form>
        </Form>
    )
}