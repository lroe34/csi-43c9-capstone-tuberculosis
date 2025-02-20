import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="flex w-full max-w-5xl items-center">
        <div className="flex-1">
          <LoginForm />
        </div>
        <div className="flex-1 flex justify-end pl-10">
          <Image
            src="/login-image.png"
            alt="Login Illustration"
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
