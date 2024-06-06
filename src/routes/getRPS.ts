import { FastifyInstance } from "fastify";
import { ImageGpt } from "../core/imageRecognition";
import { searchInvoiceRPS } from "../core/searchInvoice";

interface ReqParams {
    invoice: string;
}

export async function getRPS(app: FastifyInstance) {
    app.get('/rps', async (req, res) => {
        const { invoice } = req.query as ReqParams;

        // Obter os resultados de searchInvoiceRPS e ImageGpt simultaneamente
        const [completeRPS, captcha] = await Promise.all([
            searchInvoiceRPS(invoice),
            ImageGpt()
        ]);

        if (completeRPS.isRight() && captcha.isRight()) {
            // Se ambos estiverem corretos, prosseguir com o envio dos dados
            const completeRPSvalues = completeRPS.value;
            const captchaValue = captcha.value;

            res.send({ ...completeRPSvalues, captcha: captchaValue });
        }

        // Verificar se houve erro em algum dos resultados
        if (completeRPS.isLeft()) {
            return res.status(400).send(completeRPS.value);
        }

        if (captcha.isLeft()) {
            return res.status(400).send(captcha.value);
        }


    });
}
