import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		if (!email || typeof email !== "string") {
			return NextResponse.json(
				{ error: "El email es obligatorio." },
				{ status: 400 },
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "El formato del email no es válido." },
				{ status: 400 },
			);
		}

		const supabase = await createClient();
		const cleanEmail = email.toLowerCase().trim();

		const { error } = await supabase
			.from("newsletter_subscribers")
			.insert({ email: cleanEmail });

		if (error && error.code !== "23505") {
			console.error("Newsletter insert error:", error);
			return NextResponse.json(
				{ error: "Ha ocurrido un error. Inténtalo de nuevo." },
				{ status: 500 },
			);
		}

		if (!error) {
			await resend.emails.send({
				from: "Patternly <hola@patternly.dev>",
				to: cleanEmail,
				subject: "¡Bienvenida a Patternly! 🧶",
				html: welcomeEmailHtml(cleanEmail),
			});
		}

		return NextResponse.json({ ok: true }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: "Ha ocurrido un error. Inténtalo de nuevo." },
			{ status: 500 },
		);
	}
}

function welcomeEmailHtml(email: string): string {
	return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenida a Patternly</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF8F8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:22px;font-weight:600;color:#E03020;font-style:italic;font-family:Georgia,serif;">
                Patternly
              </span>
            </td>
          </tr>

          <tr>
            <td style="background-color:#FFFFFF;border-radius:16px;border:1px solid #EDE5E3;padding:40px 40px 32px;">
              <p style="margin:0 0 16px 0;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#E03020;">
                ✦ Newsletter
              </p>
              <h1 style="margin:0 0 12px 0;font-size:28px;font-weight:300;color:#1A0A08;font-family:Georgia,serif;line-height:1.2;">
                ¡Ya eres parte de Patternly!
              </h1>
              <p style="margin:0 0 16px 0;font-size:15px;font-weight:300;color:#664438;line-height:1.7;">
                Hola 👋
              </p>
              <p style="margin:0 0 16px 0;font-size:15px;font-weight:300;color:#664438;line-height:1.7;">
                A partir de ahora recibirás los mejores patrones de la comunidad, tutoriales y novedades de crochet. Sin spam, solo lo que de verdad merece la pena.
              </p>
              <p style="margin:0 0 24px 0;font-size:15px;font-weight:300;color:#664438;line-height:1.7;">
                Mientras tanto, ¿por qué no echas un vistazo a los patrones que ya hay en la comunidad?
              </p>
              <div style="height:1px;background-color:#EDE5E3;margin-bottom:24px;"></div>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://patternly.dev/comunidad"
                      style="display:inline-block;background-color:#E03020;color:#FFFFFF;text-decoration:none;padding:13px 36px;border-radius:8px;font-size:15px;font-weight:500;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                      Ver patrones de la comunidad
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#AA8880;line-height:1.6;">
                Recibiste este correo porque te suscribiste con ${email}.<br>
                Si no fuiste tú, puedes ignorarlo.
              </p>
              <p style="margin:8px 0 0 0;font-size:11px;color:#AA8880;">
                © 2026 Patternly · Hecho con amor y lana
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
