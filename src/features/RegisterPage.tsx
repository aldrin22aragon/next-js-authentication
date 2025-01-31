"use client"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { registerUser } from "@/db/users"

const formSchema = z.object({
    fname: z.string().min(4, "Minimum of 4 characters"),
    surname: z.string().min(4, "Minimum of 4 characters"),
    username: z.string().min(4, "Minimum of 4 characters"),
    password: z.string().min(4, "Minimum of 4 characters"),
    c_password: z.string().min(4, "Minimum of 4 characters")
}).refine(data => data.password === data.c_password,
    { message: "Passwords does not matched each other.", path: ["c_password"] });
//
export default function RegisterComponent() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            c_password: "",
            fname: "",
            password: "",
            surname: "",
            username: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const register = await registerUser({
            name: values.fname,
            password: values.password,
            surename: values.fname,
            username: values.username
        })
        if (register.user) {
            alert("Saved")
        } else {
            alert(register.error)
        }
    }

    return (
        <Form {...form}>
            <div className="text-2xl">Register</div>
            <hr className="mb-2" />
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <FormField
                    control={form.control}
                    name="fname"
                    render={({ field }) => (
                        <FormItem>
                            {/* <FormLabel>Name</FormLabel> */}
                            <FormControl className="mb-2">
                                <Input
                                    placeholder="First name"
                                    type="text"
                                    {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                        <FormItem>
                            {/* <FormLabel>Surename</FormLabel> */}
                            <FormControl className="mb-2">
                                <Input
                                    placeholder="Last Name"

                                    type=""
                                    {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            {/* <FormLabel>Username</FormLabel> */}
                            <FormControl className="mb-2">
                                <Input
                                    placeholder="Username"

                                    type=""
                                    {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            {/* <FormLabel>Password</FormLabel> */}
                            <FormControl className="mb-2">
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name="c_password" render={({ field }) => (
                    <FormItem>
                        {/* <FormLabel>Confirm password</FormLabel> */}
                        <FormControl className="mb-2">
                            <Input
                                placeholder="Confirm password"
                                type="password"
                                {...field} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" className="mt-2">Submit</Button>
            </form>
        </Form>
    )
}