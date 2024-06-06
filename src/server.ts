import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import { getRPS } from "./routes/getRPS";
import path from "path";

const app = fastify();

app.register(fastifyCors, {
  origin: '*',
});

// Registrar a rota getRPS com prefixo '/api'
app.register(getRPS, { prefix: '/api' });

// Verificar o caminho absoluto para a pasta de imagens
const imagesPath = path.join(__dirname, '../public/img');
console.log(`Serving images from ${imagesPath}`);

// Configurar a pasta pública para servir arquivos estáticos
app.register(fastifyStatic, {
  root: imagesPath,
  prefix: '/api/images/', // Este é o prefixo que será adicionado à URL
});

// Iniciar o servidor
app.listen({ port: 3333 }).then(() => {
  console.log('Server is running on port 3333');
});
