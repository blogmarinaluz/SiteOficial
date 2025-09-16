import { NextResponse } from "next/server";

let subscribers: { name: string; email: string }[] = [];

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }

    subscribers.push({ name, email });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ subscribers });
}
