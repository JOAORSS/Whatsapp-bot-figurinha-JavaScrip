import qrcode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';
import whatsappWeb from 'whatsapp-web.js';
const { LocalAuth, MessageMedia } = whatsappWeb;

let client;
let isReady = false;
const groupId = '120363420574836136@g.us';
const groupId2 = '120363024588069716@g.us';
let replyed = false;

export async function startBot(controller) {
  if (!client) {
    client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    client.on('qr', (qr) => {
      console.log('🔐 Escaneie o QR code abaixo:');
      qrcode.generate(qr, { small: true });
    });

    client.on('authenticated', () => {
      console.log('✅ Cliente autenticado!');
    });

    client.on('ready', () => {
      isReady = true;
      console.log('✅ Cliente está pronto!');
    });

    client.initialize();
  }

  leMensagem();


  if (controller === "closeBot") stopBot();
  if (controller === "listaGrupos") listaGrupos();
}


async function listaGrupos() {
  const chats = await client.getChats();
  const grupos = chats.filter(chat => chat.isGroup);
  grupos.forEach(group => {
    console.log(`Grupo: ${group.name} → ID: ${group.id._serialized}`);
  });
}


function leMensagem() {
  client.on('message_create', async msg => {

    if (replyed) {
      setTimeout(() => {
        replyed = false;
      }, 5000);
    }

    if (msg.from == groupId2 && msg.from == "555198384327@u.us") {
      console.log(`📥 Mensagem recebida: ${msg.body}`);
    }

    
    if (replyed) return;
    if (msg.from == groupId2) {
      
      replyed = true;

      if (msg.hasMedia) {
        const media = await msg.downloadMedia();

        if (media) {
          const extensao = media.mimetype.split('/')[1];
          const nomeArquivo = `imagem_${Date.now()}.${extensao}`;

          console.log(`🖼️ Imagem salva como: ${nomeArquivo}`);

          const sticker = new MessageMedia(media.mimetype, media.data, nomeArquivo);
          await msg.reply(sticker, undefined, { sendMediaAsSticker: true });
        }
      }
    } else return;
  });
}

export async function stopBot() {
  if (client && isReady) {
    await client.destroy();
    client = null;
    isReady = false;
    console.log('🛑 Bot desligado!');
  }
}