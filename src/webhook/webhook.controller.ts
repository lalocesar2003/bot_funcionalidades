import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
// import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { Request, Response } from 'express';

const { GRAPH_API_TOKEN, WEBHOOK_VERIFY_TOKEN } = process.env;

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async create(@Req() req: Request, @Res() res: Response) {
    // return this.webhookService.create(createWebhookDto);
    // log incoming messages
    console.log('Incoming webhook message:', JSON.stringify(req.body, null, 2));
    // console.log('Incoming webhook message:', req.body);

    // check if the webhook request contains a message
    // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

    // check if the incoming message contains text
    // if (message?.type === 'text') {
    //   // extract the business number to send the reply from it
    //   const business_phone_number_id =
    //     req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id; //Número del bot

    //   console.log('business_phone_number_id', business_phone_number_id);

    //   // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
    //   // Enviar mensaje de respuesta
    //   await fetch(
    //     `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         Authorization: `Bearer ${GRAPH_API_TOKEN}`,
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         messaging_product: 'whatsapp',
    //         to: message.from,
    //         text: { body: 'Echo: ' + message.text.body },
    //         // context: {
    //         //   message_id: message.id, // muestra el mensaje como una respuesta al mensaje original del usuario
    //         // },
    //       }),
    //     },
    //   ).catch((e) => console.log(JSON.stringify(e, null, 2)));

    //   // Marcar mensaje entrante como leído
    //   await fetch(
    //     `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         Authorization: `Bearer ${GRAPH_API_TOKEN}`,
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         messaging_product: 'whatsapp',
    //         status: 'read',
    //         message_id: message.id,
    //       }),
    //     },
    //   ).catch((e) => console.log(JSON.stringify(e, null, 2)));
    // }

    // paso 1
    //////////////////////////////////

    // Saludo y lista
    if (message?.type === 'text') {
      // extract the business number to send the reply from it
      const business_phone_number_id =
        req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id; //Número del bot

      // console.log('business_phone_number_id', business_phone_number_id);

      // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
      // Enviar mensaje de respuesta
      await fetch(
        `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: message.from,
            // context: {
            //   message_id: message.id, // muestra el mensaje como una respuesta al mensaje original del usuario
            // },
            recipient_type: 'individual',
            type: 'interactive',
            interactive: {
              type: 'list',
              header: {
                type: 'text',
                text: '✨ ¡Bienvenido a DevHouse! ✨ bot 2',
              },
              body: {
                text: 'Selecciona cómo podemos ayudarte hoy',
              },
              footer: {
                text: '💬 Estamos aquí para ti',
              },
              action: {
                sections: [
                  {
                    title: '🔎 Conócenos más',
                    rows: [
                      {
                        id: 'visitanos',
                        title: '🌍 Visítanos',
                        description: '📍 Av Sánchez Cerro 738, Piura',
                      },
                    ],
                  },
                  {
                    title: '📅 ¡Reserva Ahora!',
                    rows: [
                      {
                        id: 'agenda_cita',
                        title: '🗓️ Agenda una Cita',
                        description: '¡Asegura tu lugar!',
                      },
                    ],
                  },
                  {
                    title: 'Descubra más', // es suoer raro, a la tercera de la lista se bugea o no se que le pasa por agregar textos un poco mas largos o emnojis
                    rows: [
                      {
                        id: 'nuestros_servicios',
                        title: 'Nuestros Servicios',
                        description: 'Explore más de nuestros servicios',
                      },
                    ],
                  },
                ],
                button: 'Elija una opción',
              },
            },
          }),
        },
      ).catch((e) => console.log(JSON.stringify(e, null, 2)));

      // Marcar mensaje entrante como leído
      await fetch(
        `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            status: 'read',
            message_id: message.id,
          }),
        },
      ).catch((e) => console.log(JSON.stringify(e, null, 2)));
    }

    // paso 2
    //////////////////////////////////

    // Visítanos
    if (
      message?.type === 'interactive' &&
      message?.interactive?.list_reply?.id === 'visitanos'
    ) {
      // console.log('ubicacionn');

      const business_phone_number_id =
        req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id; //Número del bot

      // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
      // Enviar mensaje de respuesta
      await fetch(
        `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: message.from,
            // context: {
            //   message_id: message.id, // muestra el mensaje como una respuesta al mensaje original del usuario
            // },

            recipient_type: 'individual',
            type: 'location',
            location: {
              latitude: '-5.1921398',
              longitude: '-80.6282183',
              name: 'DevHouse Piura',
              address: 'Av. Sánchez Cerro. 738, Piura',
            },
          }),
        },
      ).catch((e) => console.log(JSON.stringify(e, null, 2)));

      // Marcar mensaje entrante como leído
      await fetch(
        `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            status: 'read',
            message_id: message.id,
          }),
        },
      ).catch((e) => console.log(JSON.stringify(e, null, 2)));
    }
    // Agenda una cita para resolver dudas
    if (
      message?.type === 'interactive' &&
      message?.interactive?.list_reply?.id.startsWith('agenda_cita')
    ) {
      const business_phone_number_id =
        req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id; //Número del bot

      // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
      // Enviar mensaje de respuesta
      await fetch(
        `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: message.from,
            type: 'interactive',
            interactive: {
              type: 'cta_url',

              /* Header optional */
              header: {
                type: 'text',
                text: 'Separa una cita para resolver dudas',
              },

              /* Body optional */
              body: {
                text: 'Te ayudaremos en todo el proceso de solución',
              },

              /* Footer optional */
              footer: {
                text: 'Agenda tu cita en Google Calendar',
              },
              action: {
                name: 'cta_url',
                parameters: {
                  display_text: 'Agendar',
                  url: 'https://calendar.app.google/9cVniLp8goXbDxmR7',
                },
              },
            },
          }),
        },
      ).catch((e) => console.log(JSON.stringify(e, null, 2)));

      // Marcar mensaje entrante como leído
      await fetch(
        `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            status: 'read',
            message_id: message.id,
          }),
        },
      ).catch((e) => console.log(JSON.stringify(e, null, 2)));
    }
    // Nuestros servicios

    // if (2 === 2) {
    if (
      message?.type === 'interactive' &&
      message?.interactive?.list_reply?.id === 'nuestros_servicios'
    ) {
      const business_phone_number_id =
        req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id; //Número del bot

      console.log('hehe servicios');

      // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
      // Enviar mensaje de respuesta
      await fetch(
        `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: message.from,
            type: 'interactive',
            interactive: {
              type: 'list',
              header: {
                type: 'text',
                text: 'Principales servicios',
              },
              body: {
                text: 'Explora y elije el que mejor se adecue a tu negocio',
              },
              footer: {
                text: 'Mira nuestrar opciones destacadass',
              },
              action: {
                sections: [
                  {
                    title: 'Apps',
                    rows: [
                      {
                        id: 'agenda_cita_1',
                        title: 'Desarrollo de Apps',
                        description: 'Prefesionales, optimizdas y adaptables',
                      },
                      // {
                      //   id: 'agenda_cita',
                      //   title: 'Paginas Web',
                      //   description: 'Prefesionales, optimizdas y adaptables',
                      // },
                      // {
                      //   id: 'agenda_cita',
                      //   title: 'Sistemas a medida',
                      //   description: 'Prefesionales, optimizdas y adaptables',
                      // },
                      /* Additional rows would go here*/
                    ],
                  },
                  {
                    title: 'Paginas Web',
                    rows: [
                      {
                        id: 'agenda_cita_2', //si se repite no funciona
                        title: 'Desarrollo de Apps',
                        description: 'Prefesionales, optimizdas y adaptables',
                      },
                    ],
                  },
                  {
                    title: 'Sistemas',
                    rows: [
                      {
                        id: 'agenda_cita_3',
                        title: 'Sistemas a medida',
                        description: 'Prefesionales, optimizdas y adaptables',
                      },
                    ],
                  },
                  /* Additional sections would go here */
                ],
                button: 'Ver servicios',
              },
            },
          }),
        },
      ).catch((e) => console.log(JSON.stringify(e, null, 2)));

      // Marcar mensaje entrante como leído
      await fetch(
        `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            status: 'read',
            message_id: message.id,
          }),
        },
      ).catch((e) => console.log(JSON.stringify(e, null, 2)));
    }
    // }
    res.sendStatus(200);
  }

  @Get()
  findAll(@Req() req: Request, @Res() res: Response) {
    // return this.webhookService.findAll();
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // check the mode and token sent are correct
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      // respond with 200 OK and challenge token from the request
      res.status(200).send(challenge);
      console.log('Webhook verified successfully!');
    } else {
      // respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.webhookService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
    return this.webhookService.update(+id, updateWebhookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.webhookService.remove(+id);
  }
}
