import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#3D7FE0]">VTUBER EXPO 2026</h1>
          <p className="mt-1 text-sm text-gray-500">管理画面へログイン</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
