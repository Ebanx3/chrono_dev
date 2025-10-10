import { createTransport } from "nodemailer";
import { env_variables } from "../config/environment";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: env_variables.EMAIL_USER,
    pass: env_variables.EMAIL_PASSWORD,
  },
});

export const sendVerificationCodeToEmail = async ({
  to,
  code,
}: {
  to: string;
  code: string;
}) => {
  const siteToRedirect = `${env_variables.FRONTEND}/verificar/${code}`;

  transporter.sendMail({
    from: `MyStore <${env_variables.EMAIL_USER}>`,
    to,
    subject: "Verifica tu corre electronico (No Responder)",
    html: `<p>Gracias por registrarte en My Store App.<p/>
          <p>Para completar el proceso debes hacer click en el siguiente botón.<p/>
          <a href="${siteToRedirect}" style="display: inline-block;padding: 10px 20px;font-size: 16px;color: white;background-color: #007bff;text-decoration: none;border-radius: 5px" >Verificar Email<a/>
          <p>O copia y pega el siguiente enlace en tu navegador:<br>${siteToRedirect}<p/>`,
  });
};
