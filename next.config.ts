import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  // для тестов
  allowedDevOrigins: ["*.ru.tuna.am", "*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.io", "*.ngrok.app", "*.trycloudflare.com"],
};

export default nextConfig;
