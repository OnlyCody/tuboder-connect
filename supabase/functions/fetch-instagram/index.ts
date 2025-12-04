import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { instagram_url } = await req.json();
    
    if (!instagram_url) {
      return new Response(
        JSON.stringify({ error: 'Instagram URL gereklidir' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching Instagram data for:', instagram_url);

    // Instagram oEmbed API kullanarak post bilgilerini al
    const oembedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(instagram_url)}`;
    const oembedResponse = await fetch(oembedUrl);
    
    if (!oembedResponse.ok) {
      console.error('oEmbed error:', oembedResponse.status);
      return new Response(
        JSON.stringify({ error: 'Instagram postu bulunamadı veya erişilemiyor' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const oembedData = await oembedResponse.json();
    console.log('oEmbed data:', oembedData);

    // Açıklamayı HTML'den çıkar
    let description = '';
    if (oembedData.title) {
      description = oembedData.title;
    }

    // Resim URL'sini al
    const imageUrl = oembedData.thumbnail_url || '';

    // Tarih bilgisi oEmbed'de yok, bugünün tarihini kullan
    const eventDate = new Date().toISOString().split('T')[0];

    // Eğer açıklama varsa, Lovable AI ile 3 dile çevir
    let translations = {
      title_tr: 'Instagram Etkinliği',
      title_en: 'Instagram Event',
      title_bs: 'Instagram Događaj',
      description_tr: description || 'Instagram paylaşımı',
      description_en: description || 'Instagram post',
      description_bs: description || 'Instagram objava',
    };

    if (description && description.length > 5) {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      
      if (LOVABLE_API_KEY) {
        console.log('Translating with AI...');
        
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `Sen profesyonel bir çevirmensin. Verilen Instagram post açıklamasını analiz et ve şunları yap:
1. Açıklamadan etkinlik başlığı çıkar (kısa, öz)
2. Açıklamayı 3 dile çevir: Türkçe (TR), İngilizce (EN), Boşnakça (BS)
3. Başlığı da 3 dile çevir

JSON formatında yanıt ver:
{
  "title_tr": "Türkçe başlık",
  "title_en": "English title", 
  "title_bs": "Bosanski naslov",
  "description_tr": "Türkçe açıklama",
  "description_en": "English description",
  "description_bs": "Bosanski opis"
}`
              },
              {
                role: "user",
                content: `Bu Instagram paylaşımının açıklamasını çevir ve başlık oluştur:\n\n"${description}"`
              }
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const content = aiData.choices?.[0]?.message?.content;
          
          if (content) {
            try {
              // JSON bloğunu çıkar
              const jsonMatch = content.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                translations = {
                  title_tr: parsed.title_tr || translations.title_tr,
                  title_en: parsed.title_en || translations.title_en,
                  title_bs: parsed.title_bs || translations.title_bs,
                  description_tr: parsed.description_tr || translations.description_tr,
                  description_en: parsed.description_en || translations.description_en,
                  description_bs: parsed.description_bs || translations.description_bs,
                };
                console.log('Translations:', translations);
              }
            } catch (parseError) {
              console.error('JSON parse error:', parseError);
            }
          }
        } else {
          console.error('AI translation error:', aiResponse.status);
        }
      }
    }

    const result = {
      ...translations,
      image_url: imageUrl,
      event_date: eventDate,
      instagram_url: instagram_url,
    };

    console.log('Final result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
