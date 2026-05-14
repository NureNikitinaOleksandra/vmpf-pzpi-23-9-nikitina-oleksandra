import { useState } from "react";

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "login" : "register";

    const res = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
        onClose();
      } else {
        setIsLogin(true);
        alert("Реєстрація успішна, тепер увійдіть");
      }
    } else {
      alert(data.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? "Вхід" : "Реєстрація"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Ваше ім'я"
              required
              className="w-full p-3 border rounded-xl"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          )}
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Пароль"
            required
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
            {isLogin ? "Увійти" : "Створити акаунт"}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-gray-500 text-sm"
        >
          {isLogin ? "Немає акаунту? Реєстрація" : "Вже є акаунт? Увійти"}
        </button>
        <button onClick={onClose} className="w-full mt-2 text-red-500 text-sm">
          Скасувати
        </button>
      </div>
    </div>
  );
}
