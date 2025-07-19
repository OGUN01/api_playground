const API_KEY = 'sk-J9vDDHyPZfXCCf9CLNNMpnDdayVDnEDQ7AQ44siKoIu3PsaS';
const API_URL = 'https://fast.typegpt.net/v1/images/generations';

export async function generateImage(prompt: string): Promise<Blob> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    
    // Fetch the image from the URL
    const imageResponse = await fetch(data.data[0].url);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch generated image');
    }
    
    return await imageResponse.blob();
  } catch (error: any) {
    console.error('Error generating image:', error);
    throw new Error(error.message || 'Failed to generate image');
  }
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to data URL'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}