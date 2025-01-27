import LoginComponent from "@/features/LoginPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RegisterComponent from "@/features/RegisterPage";


export default function Home() {
  return (
    <div className="h-dvh flex justify-center items-center">
      <div className="border rounded-sm shadow-lg p-4">
        <Tabs defaultValue="Login" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="Login">Login</TabsTrigger>
            <TabsTrigger value="Register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="Login">
            <LoginComponent />
          </TabsContent>
          <TabsContent value="Register">
            <RegisterComponent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
