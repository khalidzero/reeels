import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY') || '0fcffbe5d7msh537fd85c78b692fp1b4099jsnd561354f3ac7';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || !url.includes('facebook.com')) {
      return new Response(
        JSON.stringify({ error: 'URL inválida. Por favor, proporciona un enlace válido de Facebook.' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const response = await fetch('https://downwee-video-downloader.p.rapidapi.com/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'downwee-video-downloader.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`RapidAPI error: ${response.status} ${response.statusText}`);
      console.error('Response body:', errorText);
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Error de autenticación con el servicio');
      } else if (response.status === 429) {
        throw new Error('Límite de solicitudes excedido. Por favor, intente más tarde');
      } else {
        throw new Error('Error en el servicio de descarga. Por favor, intente más tarde');
      }
    }

    const data = await response.json();

    if (!data.videoUrl) {
      console.error('Invalid API response:', data);
      throw new Error('Formato de respuesta inválido del servicio');
    }

    return new Response(
      JSON.stringify({ url: data.videoUrl, title: data.title }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error al procesar la solicitud';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});