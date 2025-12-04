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

    // Instagram sayfasını doğrudan çek
    const pageResponse = await fetch(instagram_url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!pageResponse.ok) {
      console.error('Page fetch error:', pageResponse.status);
      return new Response(
        JSON.stringify({ error: 'Instagram sayfası yüklenemedi' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = await pageResponse.text();
    console.log('HTML length:', html.length);

    // Meta tag'lerden bilgi çıkar
    let description = '';
    let imageUrl = '';
    let title = '';

    // og:description meta tag'ini bul
    const descriptionMatch = html.match(/<meta\s+(?:property="og:description"|name="description")\s+content="([^"]*)"[^>]*>/i) ||
                             html.match(/<meta\s+content="([^"]*)"\s+(?:property="og:description"|name="description")[^>]*>/i);
    if (descriptionMatch) {
      description = descriptionMatch[1]
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#x27;/g, "'")
        .replace(/&nbsp;/g, ' ');
      console.log('Found description:', description.substring(0, 100));
    }

    // og:image meta tag'ini bul
    const imageMatch = html.match(/<meta\s+(?:property="og:image")\s+content="([^"]*)"[^>]*>/i) ||
                       html.match(/<meta\s+content="([^"]*)"\s+(?:property="og:image")[^>]*>/i);
    if (imageMatch) {
      imageUrl = imageMatch[1].replace(/&amp;/g, '&');
      console.log('Found image URL:', imageUrl.substring(0, 100));
    }

    // og:title meta tag'ini bul
    const titleMatch = html.match(/<meta\s+(?:property="og:title")\s+content="([^"]*)"[^>]*>/i) ||
                       html.match(/<meta\s+content="([^"]*)"\s+(?:property="og:title")[^>]*>/i);
    if (titleMatch) {
      title = titleMatch[1]
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&');
      console.log('Found title:', title);
    }

    // Tarih bilgisi
    const eventDate = new Date().toISOString().split('T')[0];

    // Varsayılan çeviriler
    let translations = {
      title_tr: title || 'Instagram Etkinliği',
      title_en: title || 'Instagram Event',
      title_bs: title || 'Instagram Događaj',
      description_tr: description || 'Instagram paylaşımı',
      description_en: description || 'Instagram post',
      description_bs: description || 'Instagram objava',
    };

    // Açıklama varsa AI ile çevir
    if (description && description.length > 10) {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      
      if (LOVABLE_API_KEY) {
        console.log('Translating with AI...');
        
        try {
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
1. Açıklamadan etkinlik başlığı çıkar (kısa, öz - maksimum 10 kelime)
2. Açıklamayı 3 dile çevir: Türkçe (TR), İngilizce (EN), Boşnakça (BS)
3. Başlığı da 3 dile çevir

SADECE JSON formatında yanıt ver, başka bir şey yazma:
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
                  content: `Bu Instagram paylaşımının açıklamasını çevir ve başlık oluştur:\n\n"${description.substring(0, 1000)}"`
                }
              ],
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            const content = aiData.choices?.[0]?.message?.content;
            console.log('AI response:', content?.substring(0, 200));
            
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
                  console.log('Translations applied successfully');
                }
              } catch (parseError) {
                console.error('JSON parse error:', parseError);
              }
            }
          } else {
            const errorText = await aiResponse.text();
            console.error('AI translation error:', aiResponse.status, errorText);
          }
        } catch (aiError) {
          console.error('AI request error:', aiError);
        }
      }
    }

    const result = {
      ...translations,
      image_url: imageUrl,
      event_date: eventDate,
      instagram_url: instagram_url,
    };

    console.log('Final result:', JSON.stringify(result).substring(0, 300));

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
